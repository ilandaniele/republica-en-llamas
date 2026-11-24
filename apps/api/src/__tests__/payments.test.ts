import Stripe from 'stripe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Auth } from '../auth.js';
import type { RouteContext } from '../context.js';
import type { Env } from '../env.js';
import { errorResponse } from '../http.js';
import { PRICE_BY_ENTITLEMENT } from '../policy.js';
import { createCheckout, stripeWebhook } from '../routes/payments.js';
import { createTestDb } from './d1.js';

const WEB_URL = 'https://game.test';
const WEBHOOK_SECRET = 'whsec_test_secret';
const stripe = new Stripe('sk_test_dummy');

let db: D1Database;
let env: Env;
let linePrice: string;

function context(request: Request, userId: string | null = null): RouteContext {
  const session = userId ? { user: { id: userId, isAnonymous: false } } : null;
  const auth = { api: { getSession: async () => session } } as unknown as Auth;
  return { env, request, url: new URL(request.url), auth };
}

async function call(handler: (ctx: RouteContext) => Promise<Response>, ctx: RouteContext): Promise<Response> {
  try {
    return await handler(ctx);
  } catch (error) {
    return errorResponse(error);
  }
}

async function addUser(id: string): Promise<void> {
  const now = new Date().toISOString();
  await db
    .prepare(
      `insert into "user" (id, name, email, emailVerified, createdAt, updatedAt, isAnonymous)
       values (?1, 'Test', ?2, 0, ?3, ?3, 0)`,
    )
    .bind(id, `${id}@example.test`, now)
    .run();
}

async function grant(userId: string, entitlement: string, sessionId: string | null = null): Promise<void> {
  await db
    .prepare(
      'insert into user_entitlements (id, user_id, entitlement, stripe_session_id) values (?1, ?2, ?3, ?4)',
    )
    .bind(crypto.randomUUID(), userId, entitlement, sessionId)
    .run();
}

async function grantedSession(userId: string, entitlement: string): Promise<string | null | undefined> {
  const row = await db
    .prepare('select stripe_session_id from user_entitlements where user_id = ?1 and entitlement = ?2')
    .bind(userId, entitlement)
    .first<{ stripe_session_id: string | null }>();
  return row?.stripe_session_id;
}

interface PaidSession {
  id: string;
  userId: string;
  entitlement: string;
}

async function webhookRequest(session: PaidSession, secret = WEBHOOK_SECRET): Promise<Request> {
  return signedEventRequest(
    'checkout.session.completed',
    {
      id: session.id,
      object: 'checkout.session',
      payment_status: 'paid',
      metadata: { userId: session.userId, entitlement: session.entitlement },
    },
    secret,
  );
}

async function signedEventRequest(
  type: string,
  object: Record<string, unknown>,
  secret = WEBHOOK_SECRET,
): Promise<Request> {
  const payload = JSON.stringify({ id: 'evt_test', object: 'event', type, data: { object } });
  const signature = await stripe.webhooks.generateTestHeaderStringAsync({
    payload,
    secret,
    cryptoProvider: Stripe.createSubtleCryptoProvider(),
  });
  return new Request(`${WEB_URL}/api/stripe-webhook`, {
    method: 'POST',
    headers: { 'stripe-signature': signature, 'content-type': 'application/json' },
    body: payload,
  });
}

function checkoutRequest(entitlement: string): Request {
  return new Request(`${WEB_URL}/api/create-checkout`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: WEB_URL },
    body: JSON.stringify({ entitlement }),
  });
}

const notGrantedLog = (fields: Record<string, string>) =>
  expect(console.error).toHaveBeenCalledWith(
    'stripe-webhook: paid session not granted',
    expect.objectContaining(fields),
  );

beforeEach(async () => {
  db = createTestDb();
  env = {
    DB: db,
    ASSETS: { fetch: async () => new Response('asset') } as unknown as Fetcher,
    BETTER_AUTH_SECRET: 'test-secret-with-enough-entropy-0123456789abcdef',
    WEB_URL,
    STRIPE_SECRET_KEY: 'sk_test_dummy',
    STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET,
  };
  linePrice = PRICE_BY_ENTITLEMENT['presidents_pack']!;
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json({
        object: 'list',
        has_more: false,
        data: [{ object: 'item', price: { id: linePrice } }],
      }),
    ),
  );
  vi.spyOn(console, 'error').mockImplementation(() => {});
  await addUser('alice');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('create-checkout', () => {
  it('refuses with 409 when the user already owns the entitlement', async () => {
    await grant('alice', 'presidents_pack');
    const response = await call(createCheckout, context(checkoutRequest('presidents_pack'), 'alice'));
    expect(response.status).toBe(409);
  });

  it('refuses with 409 when the user owns full_access', async () => {
    await grant('alice', 'full_access');
    const response = await call(createCheckout, context(checkoutRequest('mode_historical'), 'alice'));
    expect(response.status).toBe(409);
  });

  it.each(['__proto__', 'constructor', 'toString'])(
    'rejects inherited key %s as an entitlement',
    async (key) => {
      const response = await call(createCheckout, context(checkoutRequest(key), 'alice'));
      expect(response.status).toBe(400);
    },
  );
});

describe('stripe-webhook', () => {
  const paid: PaidSession = { id: 'cs_test_1', userId: 'alice', entitlement: 'presidents_pack' };

  it('rejects a bad signature', async () => {
    const response = await call(stripeWebhook, context(await webhookRequest(paid, 'whsec_wrong')));
    expect(response.status).toBe(400);
    expect(await grantedSession('alice', 'presidents_pack')).toBeUndefined();
  });

  it('grants a paid session', async () => {
    const response = await call(stripeWebhook, context(await webhookRequest(paid)));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ granted: true });
    expect(await grantedSession('alice', 'presidents_pack')).toBe('cs_test_1');
  });

  it('acknowledges a replayed session without changing the grant', async () => {
    await call(stripeWebhook, context(await webhookRequest(paid)));
    const response = await call(stripeWebhook, context(await webhookRequest(paid)));
    expect(response.status).toBe(200);
    expect(await grantedSession('alice', 'presidents_pack')).toBe('cs_test_1');
    expect(console.error).not.toHaveBeenCalled();
  });

  it('keeps the original session id when another paid session targets an owned entitlement', async () => {
    await grant('alice', 'presidents_pack', 'cs_original');
    const response = await call(stripeWebhook, context(await webhookRequest(paid)));
    expect(response.status).toBe(200);
    expect(await grantedSession('alice', 'presidents_pack')).toBe('cs_original');
    notGrantedLog({ sessionId: 'cs_test_1', reason: 'already owned' });
  });

  it('logs and returns non-2xx for an unknown user so Stripe retries', async () => {
    const response = await call(stripeWebhook, context(await webhookRequest({ ...paid, userId: 'ghost' })));
    expect(response.status).toBe(500);
    notGrantedLog({ sessionId: 'cs_test_1', reason: 'unknown user' });
  });

  it('does not grant when the paid price does not match the entitlement', async () => {
    linePrice = PRICE_BY_ENTITLEMENT['remove_ads']!;
    const response = await call(
      stripeWebhook,
      context(await webhookRequest({ ...paid, entitlement: 'full_access' })),
    );
    expect(response.status).toBe(200);
    expect(await grantedSession('alice', 'full_access')).toBeUndefined();
    notGrantedLog({ sessionId: 'cs_test_1', reason: 'price mismatch' });
  });

  it('retries Stripe once, then answers non-2xx so Stripe redelivers', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('network down'));
    const response = await call(stripeWebhook, context(await webhookRequest(paid)));
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(response.status).toBe(500);
    notGrantedLog({ sessionId: 'cs_test_1', reason: 'grant failed' });
  });
});

describe('stripe-webhook refunds', () => {
  const refund = (refunded: boolean) =>
    signedEventRequest('charge.refunded', { id: 'ch_1', object: 'charge', payment_intent: 'pi_1', refunded });

  beforeEach(() => {
    vi.mocked(fetch).mockImplementation(async () =>
      Response.json({
        object: 'list',
        has_more: false,
        data: [{ id: 'cs_paid', object: 'checkout.session' }],
      }),
    );
  });

  it('revokes the entitlement bought in a fully refunded checkout', async () => {
    await grant('alice', 'presidents_pack', 'cs_paid');
    const response = await call(stripeWebhook, context(await refund(true)));
    expect(await response.json()).toMatchObject({ revoked: true });
    expect(await grantedSession('alice', 'presidents_pack')).toBeUndefined();
  });

  it('keeps the entitlement on a partial refund', async () => {
    await grant('alice', 'presidents_pack', 'cs_paid');
    const response = await call(stripeWebhook, context(await refund(false)));
    expect(await response.json()).toMatchObject({ revoked: false });
    expect(await grantedSession('alice', 'presidents_pack')).toBe('cs_paid');
  });

  it('keeps entitlements from other checkouts', async () => {
    await grant('alice', 'presidents_pack', 'cs_other');
    await call(stripeWebhook, context(await refund(true)));
    expect(await grantedSession('alice', 'presidents_pack')).toBe('cs_other');
  });
});
