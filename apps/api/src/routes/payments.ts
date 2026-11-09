import Stripe from 'stripe';
import { requireAccount } from '../context.js';
import type { RouteContext } from '../context.js';
import type { Env } from '../env.js';
import { isRecord, json, readJsonBody, readLimitedText, RequestError } from '../http.js';
import { PRICE_BY_ENTITLEMENT } from '../policy.js';
import { enforceUserRateLimit } from '../rateLimit.js';

const WEBHOOK_MAX_BYTES = 262_144;

const GRANT_SQL = `insert into user_entitlements (id, user_id, entitlement, stripe_session_id, platform, purchased_at)
  select ?1, ?2, ?3, ?4, 'web', ?5 where exists (select 1 from "user" where id = ?2)
  on conflict(user_id, entitlement) do update set
    stripe_session_id = excluded.stripe_session_id, purchased_at = excluded.purchased_at`;

function stripeClient(env: Env): Stripe {
  if (!env.STRIPE_SECRET_KEY) throw new RequestError(503, 'Checkout unavailable');
  return new Stripe(env.STRIPE_SECRET_KEY, { httpClient: Stripe.createFetchHttpClient() });
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

async function grantEntitlement(db: D1Database, session: Stripe.Checkout.Session): Promise<Response> {
  const userId = session.metadata?.['userId'];
  const entitlement = session.metadata?.['entitlement'];
  if (
    session.payment_status !== 'paid' ||
    !userId ||
    !entitlement ||
    !Object.hasOwn(PRICE_BY_ENTITLEMENT, entitlement)
  ) {
    return json({ received: true, granted: false });
  }
  try {
    const result = await db
      .prepare(GRANT_SQL)
      .bind(crypto.randomUUID(), userId, entitlement, session.id, new Date().toISOString())
      .run();
    return json({ received: true, granted: result.meta.changes > 0 });
  } catch {
    console.error('grantEntitlement failed');
    return json({ error: 'Database error' }, 500);
  }
}

export async function stripeWebhook(ctx: RouteContext): Promise<Response> {
  const signature = ctx.request.headers.get('stripe-signature');
  if (!signature) throw new RequestError(400, 'Invalid signature');
  const rawBody = await readLimitedText(ctx.request, WEBHOOK_MAX_BYTES);
  if (!ctx.env.STRIPE_WEBHOOK_SECRET) throw new RequestError(503, 'Webhook unavailable');

  let event: Stripe.Event;
  try {
    event = await stripeClient(ctx.env).webhooks.constructEventAsync(
      rawBody,
      signature,
      ctx.env.STRIPE_WEBHOOK_SECRET,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (error) {
    if (error instanceof RequestError) throw error;
    throw new RequestError(400, 'Invalid signature');
  }
  if (event.type === 'checkout.session.completed') return grantEntitlement(ctx.env.DB, event.data.object);
  return json({ received: true });
}
