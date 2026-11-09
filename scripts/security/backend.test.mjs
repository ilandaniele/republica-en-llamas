import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import * as policyModule from '../../supabase/functions/_shared/requestPolicy.ts';
import * as engineModule from '../../packages/game-engine/src/index.ts';
const { bearerToken, isAllowedOrigin, readJsonBody, readLimitedText, canUseRunModes } =
  policyModule.default ?? policyModule;

const USER = '11111111-1111-4111-8111-111111111111';
const TICKET = '22222222-2222-4222-8222-222222222222';
const TOKEN = 'header.payload.signature';
const routes = ['start-run', 'claim-run-ticket', 'create-checkout', 'submit-run'];
const codeCache = new Map();
const engine = engineModule.default ?? engineModule;

async function loadEndpoint(name, options = {}) {
  if (!codeCache.has(name)) {
    const compiled = await build({
      entryPoints: [`supabase/functions/${name}/index.ts`],
      bundle: true,
      platform: 'node',
      format: 'iife',
      write: false,
      plugins: [
        {
          name: 'local-security-fakes',
          setup(plugin) {
            plugin.onResolve({ filter: /^https:\/\// }, (args) => ({ path: args.path, namespace: 'fake' }));
            plugin.onLoad({ filter: /.*/, namespace: 'fake' }, (args) => ({
              contents: args.path.includes('/stripe@')
                ? 'export default class Stripe { constructor() { return globalThis.__backendMocks.stripe; } }'
                : 'export const createClient = () => globalThis.__backendMocks.client;',
            }));
          },
        },
      ],
    });
    codeCache.set(name, compiled.outputFiles[0].text);
  }
  const calls = [];
  const env = new Map([
    ['WEB_URL', 'https://game.example'],
    ['STRIPE_SECRET_KEY', 'fake-test-secret'],
    ['STRIPE_WEBHOOK_SECRET', 'fake-test-signing-secret'],
    ...Object.entries(options.env ?? {}),
  ]);
  const client = {
    auth: {
      getUser: async (token) => ({
        data: {
          user:
            token === TOKEN
              ? { id: USER, is_anonymous: options.anonymous ?? false }
              : token === 'guest.payload.signature'
                ? { id: USER, is_anonymous: true }
                : null,
        },
      }),
    },
    rpc: async (name, args) => {
      calls.push({ name, args });
      if (name === 'consume_api_rate_limit')
        return { data: options.rateAllowed ?? true, error: options.rateError ?? null };
      if (name === 'issue_run_ticket') return { data: [{ id: TICKET, seed: 42 }], error: null };
      if (name === 'claim_run_ticket') return { data: true, error: null };
      if (name === 'save_validated_run')
        return { data: { id: TICKET, score: args.p_state.score }, error: null };
      throw new Error(`Unmocked RPC: ${name}`);
    },
    from: (table) => {
      const filters = {};
      const query = {
        select: () => query,
        eq: (column, value) => {
          filters[column] = value;
          return query;
        },
        maybeSingle: async () => ({ data: options.ticketValid === false ? null : { seed: 42 }, error: null }),
        upsert: async (value) => {
          calls.push({ name: 'upsert', args: value });
          return { error: null };
        },
        then: (resolve, reject) =>
          Promise.resolve({ data: options.purchases ?? [], error: null }).then(resolve, reject),
      };
      calls.push({ name: 'from', table, filters });
      return query;
    },
  };
  const stripe = {
    checkout: {
      sessions: {
        create: async (args) => {
          calls.push({ name: 'checkout', args });
          return { url: 'https://checkout.stripe.com/test' };
        },
      },
    },
    webhooks: {
      constructEventAsync: async (_body, signature) => {
        if (signature !== 'test-valid-signature') throw new Error('Invalid signature');
        return options.event ?? { type: 'unhandled.event' };
      },
    },
  };
  globalThis.__backendMocks = { client, stripe };
  let handler;
  const deno = {
    env: { get: (key) => env.get(key) },
    serve: (callback) => {
      handler = callback;
    },
  };
  new Function('Deno', codeCache.get(name))(deno);
  return { handler, calls };
}

function request(body, headers = {}) {
  return new Request('https://api.example/functions/v1/test', {
    method: 'POST',
    headers: { authorization: `Bearer ${TOKEN}`, 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}
afterEach(() => {
  delete globalThis.__backendMocks;
});

test('origin allowlist rejects suffix tricks, null and development origins unless configured', () => {
  const allowed = ['https://game.example'];
  assert.equal(isAllowedOrigin(null, allowed), true);
  assert.equal(isAllowedOrigin('https://game.example', allowed), true);
  for (const origin of ['null', 'https://game.example.evil.test', 'http://localhost:5174'])
    assert.equal(isAllowedOrigin(origin, allowed), false);
});

test('bearer credentials must be bounded JWTs; cookies alone cannot authenticate', () => {
  assert.equal(bearerToken(`Bearer ${TOKEN}`), TOKEN);
  for (const value of [null, '', TOKEN, `Basic ${TOKEN}`, 'Bearer undefined', `Bearer ${'a'.repeat(9000)}`])
    assert.equal(bearerToken(value), null);
});

test('streaming body limit counts actual bytes, not declared length', async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('abcdefgh'));
      controller.enqueue(new TextEncoder().encode('ijklmnop'));
      controller.close();
    },
  });
  const req = new Request('http://localhost', { method: 'POST', body: stream, duplex: 'half' });
  await assert.rejects(readLimitedText(req, 12), (error) => error.status === 413);
  await assert.rejects(
    readJsonBody(request({}, { 'content-type': 'text/plain' }), 100),
    (error) => error.status === 415,
  );
  await assert.rejects(
    readJsonBody(
      new Request('http://localhost', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{',
      }),
      100,
    ),
    (error) => error.status === 400,
  );
});

test('mode access cannot be upgraded using only client configuration', () => {
  assert.equal(canUseRunModes({ crisisExpress: true }, []), false);
  assert.equal(canUseRunModes({ scenarioId: 'convertibilidad' }, ['mode_crisis_express']), false);
  assert.equal(canUseRunModes({ crisisExpress: true }, ['mode_crisis_express']), true);
  assert.equal(canUseRunModes({ crisisExpress: true, scenarioId: 'convertibilidad' }, ['full_access']), true);
});

test('slow incomplete bodies hit a deadline and cancel the stream', async () => {
  let cancelled = false;
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array([1]));
    },
    cancel() {
      cancelled = true;
    },
  });
  const req = new Request('http://localhost', { method: 'POST', body, duplex: 'half' });
  await assert.rejects(readLimitedText(req, 1024, 20), (error) => error.status === 408);
  assert.equal(cancelled, true);
});

for (const route of routes) {
  test(`${route}: blocks cross-site origin before authentication or database work`, async () => {
    const { handler, calls } = await loadEndpoint(route);
    const response = await handler(request({}, { origin: 'https://evil.example' }));
    assert.equal(response.status, 403);
    assert.equal(response.headers.has('access-control-allow-origin'), false);
    assert.equal(calls.length, 0);
  });
  test(`${route}: rejects GET, missing auth and oversized declared bodies`, async () => {
    const { handler } = await loadEndpoint(route);
    assert.equal((await handler(new Request('https://api.example'))).status, 405);
    assert.equal((await handler(request({}, { authorization: '' }))).status, 401);
    assert.equal((await handler(request({}, { 'content-length': '999999' }))).status, 413);
  });
  test(`${route}: preflight is explicit and credentials are not cached`, async () => {
    const { handler, calls } = await loadEndpoint(route);
    const response = await handler(
      new Request('https://api.example', { method: 'OPTIONS', headers: { origin: 'https://game.example' } }),
    );
    assert.equal(response.status, 204);
    assert.equal(response.headers.get('access-control-allow-origin'), 'https://game.example');
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(calls.length, 0);
  });
  test(`${route}: distributed user rate limit rejects before costly work`, async () => {
    const { handler } = await loadEndpoint(route, { rateAllowed: false });
    const response = await handler(request({}));
    assert.equal(response.status, 429);
    assert.equal(response.headers.get('retry-after'), '60');
  });
}

test('rate limiter errors fail closed without disclosing internal details', async () => {
  const { handler } = await loadEndpoint('start-run', { rateError: { message: 'postgres secret internal' } });
  const response = await handler(request({}));
  assert.equal(response.status, 503);
  assert.equal((await response.text()).includes('postgres secret'), false);
});

test('IP limit accepts only explicitly configured sanitized proxy header', async () => {
  const { handler, calls } = await loadEndpoint('start-run', {
    env: { TRUSTED_CLIENT_IP_HEADER: 'x-trusted-client-ip' },
  });
  assert.equal((await handler(request({}))).status, 503);
  assert.equal((await handler(request({}, { 'x-trusted-client-ip': '127.0.0.1, 203.0.113.1' }))).status, 503);
  assert.equal((await handler(request({}, { 'x-trusted-client-ip': '203.0.113.1' }))).status, 200);
  const ipKey = calls.find((call) => call.name === 'consume_api_rate_limit').args.p_key;
  assert.match(ipKey, /^start-run:ip:[0-9a-f]{64}$/);
  assert.equal(ipKey.includes('203.0.113.1'), false);
});

test('checkout rejects prototype names and anonymous accounts; uses server price', async () => {
  let loaded = await loadEndpoint('create-checkout');
  for (const entitlement of ['__proto__', 'constructor', {}, null])
    assert.equal((await loaded.handler(request({ entitlement }))).status, 400);
  assert.equal((await loaded.handler(request({ entitlement: 'presidents_pack', price: 0 }))).status, 200);
  const checkout = loaded.calls.find((call) => call.name === 'checkout');
  assert.equal(checkout.args.line_items[0].quantity, 1);
  assert.match(checkout.args.line_items[0].price, /^price_/);
  loaded = await loadEndpoint('create-checkout', { anonymous: true });
  assert.equal((await loaded.handler(request({ entitlement: 'presidents_pack' }))).status, 401);
});

test('submit-run denies unpurchased Express and historical modes before replay', async () => {
  const { handler, calls } = await loadEndpoint('submit-run');
  for (const extra of [{ crisisExpress: true }, { scenarioId: 'convertibilidad' }]) {
    const response = await handler(
      request({ ticketId: TICKET, config: { difficulty: 'normal', seed: 42, ...extra }, decisions: [] }),
    );
    assert.equal(response.status, 403);
  }
  assert.equal(
    calls.some((call) => call.name === 'save_validated_run'),
    false,
  );
});

test('submit-run does not accept another owner ticket or guest score', async () => {
  let loaded = await loadEndpoint('submit-run', { ticketValid: false });
  const body = { ticketId: TICKET, config: { difficulty: 'normal', seed: 42 }, decisions: [] };
  assert.equal((await loaded.handler(request(body))).status, 403);
  const ticketQuery = loaded.calls.find((call) => call.table === 'run_tickets');
  assert.equal(ticketQuery.filters.user_id, USER);
  assert.equal(ticketQuery.filters.id, TICKET);
  loaded = await loadEndpoint('submit-run', { anonymous: true });
  assert.equal((await loaded.handler(request(body))).status, 403);
});

test('submit-run replays a complete game and saves only the server-computed state atomically', async () => {
  const config = { seed: 42, difficulty: 'normal', presidentId: 'milei' };
  let state = engine.initGame('normal', 42, 'es', undefined, 'milei');
  const decisions = [];
  while (!state.isGameOver && decisions.length < 200) {
    const card = engine.drawNextCard(state);
    const decision = card.isLaw
      ? { kind: 'congress', cardId: card.id, decisions: { actions: [], swingChoices: [] } }
      : { kind: 'choice', cardId: card.id, choiceIndex: 0 };
    state = engine.endTurn(engine.resolveTurn(state, card, decision).state);
    decisions.push(decision);
  }
  assert.equal(state.isGameOver, true);
  const { handler, calls } = await loadEndpoint('submit-run');
  const response = await handler(
    request({ ticketId: TICKET, config, decisions, score: 999999999, final_state: { score: 999999999 } }),
  );
  assert.equal(response.status, 200);
  const saved = calls.find((call) => call.name === 'save_validated_run');
  assert.deepEqual(saved.args.p_state, state);
  assert.equal((await response.json()).score, state.score);
  assert.equal(
    calls.some((call) => call.table === 'game_runs' || call.table === 'run_events'),
    false,
  );
});

test('webhook rejects missing/invalid signatures and oversized payloads', async () => {
  const { handler, calls } = await loadEndpoint('stripe-webhook');
  assert.equal((await handler(new Request('https://api.example'))).status, 405);
  assert.equal((await handler(request({}))).status, 400);
  assert.equal((await handler(request({}, { 'stripe-signature': 'fake' }))).status, 400);
  assert.equal(
    (await handler(request({}, { 'stripe-signature': 'test-valid-signature', 'content-length': '999999' })))
      .status,
    413,
  );
  assert.equal(
    calls.some((call) => call.name === 'upsert'),
    false,
  );
});

test('signed webhook cannot grant unpaid or unknown entitlements', async () => {
  for (const [payment_status, entitlement] of [
    ['unpaid', 'full_access'],
    ['paid', '__proto__'],
  ]) {
    const { handler, calls } = await loadEndpoint('stripe-webhook', {
      event: {
        type: 'checkout.session.completed',
        data: { object: { payment_status, metadata: { userId: USER, entitlement } } },
      },
    });
    assert.equal((await handler(request({}, { 'stripe-signature': 'test-valid-signature' }))).status, 200);
    assert.equal(
      calls.some((call) => call.name === 'upsert'),
      false,
    );
  }
});

test('security RPCs are service-role only with RLS and one transaction for run/events', async () => {
  const migration = await readFile('supabase/migrations/010_api_security.sql', 'utf8');
  assert.match(migration, /api_rate_limits enable row level security/);
  assert.match(
    migration,
    /revoke all on function public\.consume_api_rate_limit[\s\S]+from public, anon, authenticated/,
  );
  assert.match(migration, /grant execute on function public\.save_validated_run[\s\S]+to service_role/);
  assert.match(migration, /for update/);
  assert.match(migration, /insert into public\.game_runs[\s\S]+insert into public\.run_events/);
});
