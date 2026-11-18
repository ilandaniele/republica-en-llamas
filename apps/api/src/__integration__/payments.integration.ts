import { createExecutionContext, env, waitOnExecutionContext } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import worker from '../index.js';
import { ApiClient, signUp, uniqueIp, WEB_URL } from './client.js';

const WEBHOOK_SECRET = 'whsec_integration_only';

async function stripeSignature(payload: string, secret: string): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000);
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}.${payload}`));
  const hex = Array.from(new Uint8Array(mac), (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `t=${timestamp},v1=${hex}`;
}

async function webhookWithStripeConfigured(payload: string, signature: string): Promise<Response> {
  const configured = {
    ...env,
    STRIPE_SECRET_KEY: 'sk_test_integration_only',
    STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET,
  };
  const ctx = createExecutionContext();
  const request = new Request(`${WEB_URL}/api/stripe-webhook`, {
    method: 'POST',
    headers: {
      'stripe-signature': signature,
      'content-type': 'application/json',
      'CF-Connecting-IP': uniqueIp(),
    },
    body: payload,
  });
  const response = await worker.fetch(request, configured, ctx);
  await waitOnExecutionContext(ctx);
  return response;
}

describe('create-checkout', () => {
  it('requires an account', async () => {
    const response = await new ApiClient().request('/api/create-checkout', {
      body: { entitlement: 'remove_ads' },
    });
    expect(response.status).toBe(401);
  });

  it('fails safely with 503 when Stripe is not configured', async () => {
    const client = await signUp();
    const response = await client.request('/api/create-checkout', { body: { entitlement: 'remove_ads' } });
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'Checkout unavailable' });
  });

  it('rejects unknown entitlements', async () => {
    const client = await signUp();
    const response = await client.request('/api/create-checkout', { body: { entitlement: 'free_money' } });
    expect(response.status).toBe(400);
  });
});

describe('stripe-webhook', () => {
  const payload = JSON.stringify({
    id: 'evt_test',
    object: 'event',
    type: 'customer.created',
    data: { object: {} },
  });

  it('rejects requests without a signature', async () => {
    const response = await new ApiClient().request('/api/stripe-webhook', { rawBody: payload });
    expect(response.status).toBe(400);
  });

  it('answers 503 when the webhook secret is not configured', async () => {
    const response = await new ApiClient().request('/api/stripe-webhook', {
      rawBody: payload,
      headers: { 'stripe-signature': 't=1,v1=abc' },
    });
    expect(response.status).toBe(503);
  });

  it('rejects a bad signature without calling Stripe', async () => {
    const response = await webhookWithStripeConfigured(
      payload,
      await stripeSignature(payload, 'whsec_wrong'),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid signature' });
  });

  it('accepts a correctly signed event that needs no grant', async () => {
    const response = await webhookWithStripeConfigured(
      payload,
      await stripeSignature(payload, WEBHOOK_SECRET),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true });
  });
});
