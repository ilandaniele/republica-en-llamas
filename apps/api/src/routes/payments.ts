import Stripe from 'stripe';
import { requireAccount, userEntitlements } from '../context.js';
import type { RouteContext } from '../context.js';
import type { Env } from '../env.js';
import { isRecord, json, readJsonBody, readLimitedText, RequestError } from '../http.js';
import { PRICE_BY_ENTITLEMENT } from '../policy.js';
import { enforceUserRateLimit } from '../rateLimit.js';

const WEBHOOK_MAX_BYTES = 262_144;

const GRANT_SQL = `insert into user_entitlements (id, user_id, entitlement, stripe_session_id, platform, purchased_at)
  select ?1, ?2, ?3, ?4, 'web', ?5 where exists (select 1 from "user" where id = ?2)
  on conflict do nothing`;

const GRANT_STATE_SQL = `select exists (select 1 from "user" where id = ?1) as user_exists,
  (select stripe_session_id from user_entitlements where user_id = ?1 and entitlement = ?2) as owned_session_id`;

function stripeClient(env: Env): Stripe {
  if (!env.STRIPE_SECRET_KEY) throw new RequestError(503, 'Checkout unavailable');
  return new Stripe(env.STRIPE_SECRET_KEY, {
    httpClient: Stripe.createFetchHttpClient(),
    timeout: 10_000,
    maxNetworkRetries: 1,
  });
}

export async function createCheckout(ctx: RouteContext): Promise<Response> {
  const user = await requireAccount(ctx);
  await enforceUserRateLimit(ctx.env.DB, user.id, 'create-checkout');
  const body = await readJsonBody(ctx.request, 4096);
  const entitlement = isRecord(body) ? body.entitlement : null;
  const priceId =
    typeof entitlement === 'string' && Object.hasOwn(PRICE_BY_ENTITLEMENT, entitlement)
      ? PRICE_BY_ENTITLEMENT[entitlement]
      : undefined;
  if (typeof entitlement !== 'string' || !priceId) throw new RequestError(400, 'Unknown entitlement');

  const owned = await userEntitlements(ctx.env.DB, user.id);
  if (owned.includes(entitlement) || owned.includes('full_access'))
    throw new RequestError(409, 'Entitlement already owned');

  const webUrl = new URL(ctx.env.WEB_URL).origin;
  try {
    const session = await stripeClient(ctx.env).checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${webUrl}/?purchase_success=1&entitlement=${encodeURIComponent(entitlement)}`,
      cancel_url: `${webUrl}/?purchase_cancel=1`,
      metadata: { userId: user.id, entitlement },
    });
    return json({ url: session.url });
  } catch (error) {
    if (error instanceof RequestError) throw error;
    console.error('create-checkout failed');
    throw new RequestError(502, 'Checkout unavailable');
  }
}

async function paidForEntitlement(stripe: Stripe, sessionId: string, entitlement: string): Promise<boolean> {
  const { data } = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 2 });
  return data.length === 1 && data[0]?.price?.id === PRICE_BY_ENTITLEMENT[entitlement];
}

function notGranted(sessionId: string, reason: string, status: number): Response {
  console.error('stripe-webhook: paid session not granted', { sessionId, reason });
  return json({ received: true, granted: false }, status);
}

async function grantEntitlement(
  db: D1Database,
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<Response> {
  if (session.payment_status !== 'paid') return json({ received: true, granted: false });
  const userId = session.metadata?.['userId'];
  const entitlement = session.metadata?.['entitlement'];
  if (!userId || !entitlement || !Object.hasOwn(PRICE_BY_ENTITLEMENT, entitlement))
    return notGranted(session.id, 'invalid metadata', 200);

  try {
    if (!(await paidForEntitlement(stripe, session.id, entitlement)))
      return notGranted(session.id, 'price mismatch', 200);
    const result = await db
      .prepare(GRANT_SQL)
      .bind(crypto.randomUUID(), userId, entitlement, session.id, new Date().toISOString())
      .run();
    if (result.meta.changes > 0) return json({ received: true, granted: true });

    const state = await db
      .prepare(GRANT_STATE_SQL)
      .bind(userId, entitlement)
      .first<{ user_exists: number; owned_session_id: string | null }>();
    if (!state?.user_exists) return notGranted(session.id, 'unknown user', 500);
    if (state.owned_session_id !== session.id) return notGranted(session.id, 'already owned', 200);
    return json({ received: true, granted: false });
  } catch {
    return notGranted(session.id, 'grant failed', 500);
  }
}

export async function stripeWebhook(ctx: RouteContext): Promise<Response> {
  const signature = ctx.request.headers.get('stripe-signature');
  if (!signature) throw new RequestError(400, 'Invalid signature');
  const rawBody = await readLimitedText(ctx.request, WEBHOOK_MAX_BYTES);
  if (!ctx.env.STRIPE_WEBHOOK_SECRET) throw new RequestError(503, 'Webhook unavailable');

  const stripe = stripeClient(ctx.env);
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      ctx.env.STRIPE_WEBHOOK_SECRET,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch {
    throw new RequestError(400, 'Invalid signature');
  }
  if (event.type === 'checkout.session.completed')
    return grantEntitlement(ctx.env.DB, stripe, event.data.object);
  return json({ received: true });
}
