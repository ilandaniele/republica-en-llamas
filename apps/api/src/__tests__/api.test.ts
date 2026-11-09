import { beforeEach, describe, expect, it } from 'vitest';
import { drawNextCard, endTurn, initGame, resolveTurn } from '@republica/game-engine';
import type { TurnDecision } from '@republica/game-engine';
import worker from '../index.js';
import type { Auth } from '../auth.js';
import type { RouteContext } from '../context.js';
import type { Env } from '../env.js';
import { errorResponse } from '../http.js';
import { leaderboard } from '../routes/leaderboard.js';
import { getProfile, updateProfile, usernameAvailable } from '../routes/profile.js';
import { listRuns, startRun, submitRun } from '../routes/runs.js';
import { issueRunTicket, transferGuestTickets } from '../tickets.js';
import { createTestDb } from './d1.js';

const WEB_URL = 'https://game.test';

let db: D1Database;
let env: Env;

function stubAuth(user: { id: string; isAnonymous?: boolean } | null): Auth {
  const session = user ? { user: { id: user.id, isAnonymous: user.isAnonymous ?? false } } : null;
  return { api: { getSession: async () => session } } as unknown as Auth;
}

function jsonRequest(path: string, body: unknown, method = 'POST'): Request {
  return new Request(`${WEB_URL}${path}`, {
    method,
    headers: { 'content-type': 'application/json', origin: WEB_URL },
    body: JSON.stringify(body),
  });
}

function context(request: Request, user: { id: string; isAnonymous?: boolean } | null): RouteContext {
  return { env, request, url: new URL(request.url), auth: stubAuth(user) };
}

async function call(handler: (ctx: RouteContext) => Promise<Response>, ctx: RouteContext): Promise<Response> {
  try {
    return await handler(ctx);
  } catch (error) {
    return errorResponse(error);
  }
}

async function addUser(id: string, isAnonymous = false): Promise<void> {
  const now = new Date().toISOString();
  await db
    .prepare(
      `insert into "user" (id, name, email, emailVerified, createdAt, updatedAt, isAnonymous)
       values (?1, 'Test', ?2, 0, ?3, ?3, ?4)`,
    )
    .bind(id, `${id}@example.test`, now, isAnonymous ? 1 : 0)
    .run();
  if (!isAnonymous) await db.prepare('insert into profiles (id, username) values (?1, ?2)').bind(id, `jugador_${id}`).run();
}

async function grant(userId: string, entitlement: string): Promise<void> {
  await db
    .prepare('insert into user_entitlements (id, user_id, entitlement) values (?1, ?2, ?3)')
    .bind(crypto.randomUUID(), userId, entitlement)
    .run();
}

function finishedRun(seed: number) {
  let state = initGame('normal', seed, 'es', undefined, 'milei');
  const decisions: TurnDecision[] = [];
  while (!state.isGameOver && decisions.length < 200) {
    const card = drawNextCard(state);
    const decision: TurnDecision = card.isLaw
      ? { kind: 'congress', cardId: card.id, decisions: { actions: [], swingChoices: [] } }
      : { kind: 'choice', cardId: card.id, choiceIndex: 0 };
    state = endTurn(resolveTurn(state, card, decision).state);
    decisions.push(decision);
  }
  return { config: { seed, difficulty: 'normal' as const, presidentId: 'milei' }, decisions, state };
}

beforeEach(async () => {
  db = createTestDb();
  env = {
    DB: db,
    ASSETS: { fetch: async () => new Response('asset') } as unknown as Fetcher,
    BETTER_AUTH_SECRET: 'test-secret-with-enough-entropy-0123456789abcdef',
    WEB_URL,
  };
  await addUser('alice');
});

describe('run tickets', () => {
  it('caps free accounts at three tickets per day and full access at thirty', async () => {
    for (let i = 0; i < 3; i++) expect(await issueRunTicket(db, 'alice')).not.toBeNull();
    expect(await issueRunTicket(db, 'alice')).toBeNull();

    await grant('alice', 'full_access');
    for (let i = 3; i < 30; i++) expect(await issueRunTicket(db, 'alice')).not.toBeNull();
    expect(await issueRunTicket(db, 'alice')).toBeNull();
  });

  it('start-run answers 429 once the daily cap is reached', async () => {
    for (let i = 0; i < 3; i++) expect((await call(startRun, context(jsonRequest('/api/start-run', {}), { id: 'alice' }))).status).toBe(200);
    const response = await call(startRun, context(jsonRequest('/api/start-run', {}), { id: 'alice' }));
    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('60');
  });

  it('transfers only fresh guest tickets up to the remaining cap', async () => {
    await addUser('guest', true);
    const old = new Date(Date.now() - 2 * 86_400_000).toISOString();
    await db.prepare('insert into run_tickets (id, user_id, seed, created_at) values (?1, ?2, 1, ?3)').bind('stale', 'guest', old).run();
    for (let i = 0; i < 3; i++) await issueRunTicket(db, 'guest');
    await issueRunTicket(db, 'alice');

    await transferGuestTickets(db, 'guest', 'alice');
    const owned = await db.prepare('select count(*) as n from run_tickets where user_id = ?1').bind('alice').first<{ n: number }>();
    const stale = await db.prepare('select user_id from run_tickets where id = ?1').bind('stale').first<{ user_id: string }>();
    expect(owned?.n).toBe(3);
    expect(stale?.user_id).toBe('guest');
  });
});

describe('submit-run', () => {
  async function submit(body: unknown, user: { id: string; isAnonymous?: boolean } = { id: 'alice' }) {
    return call(submitRun, context(jsonRequest('/api/submit-run', body), user));
  }

  async function ticketFor(seed: number): Promise<string> {
    const id = crypto.randomUUID();
    await db
      .prepare('insert into run_tickets (id, user_id, seed, created_at) values (?1, ?2, ?3, ?4)')
      .bind(id, 'alice', seed, new Date().toISOString())
      .run();
    return id;
  }

  it('rejects anonymous players and foreign tickets', async () => {
    const run = finishedRun(42);
    const ticketId = await ticketFor(42);
    expect((await submit({ ticketId, ...run }, { id: 'guest', isAnonymous: true })).status).toBe(403);
    await addUser('bob');
    expect((await submit({ ticketId, config: run.config, decisions: run.decisions }, { id: 'bob' })).status).toBe(403);
  });

  it('rejects a seed that differs from the ticket', async () => {
    const run = finishedRun(42);
    const ticketId = await ticketFor(7);
    expect((await submit({ ticketId, config: run.config, decisions: run.decisions })).status).toBe(403);
  });

  it('requires purchased access for premium modes', async () => {
    const run = finishedRun(42);
    const ticketId = await ticketFor(42);
    const response = await submit({ ticketId, config: { ...run.config, crisisExpress: true }, decisions: run.decisions });
    expect(response.status).toBe(403);
  });

  it('rejects unfinished runs', async () => {
    const run = finishedRun(42);
    const ticketId = await ticketFor(42);
    const response = await submit({ ticketId, config: run.config, decisions: run.decisions.slice(0, 2) });
    expect(response.status).toBe(422);
  });

  it('saves the server-computed score with events and deduplicates retries', async () => {
    const run = finishedRun(42);
    const ticketId = await ticketFor(42);
    const body = { ticketId, config: run.config, decisions: run.decisions, score: 999_999_999 };

    const first = await submit(body);
    expect(first.status).toBe(200);
    const saved = (await first.json()) as { id: string; score: number };
    expect(saved.score).toBe(run.state.score);

    const events = await db.prepare('select count(*) as n from run_events where run_id = ?1').bind(saved.id).first<{ n: number }>();
    expect(events?.n).toBe(run.state.history.length);

    const retry = await submit(body);
    expect(await retry.json()).toEqual({ id: saved.id, score: saved.score, duplicate: true });

    const history = (await (await call(listRuns, context(new Request(`${WEB_URL}/api/runs`), { id: 'alice' }))).json()) as {
      runs: { id: string; is_win: boolean; run_events: unknown[] }[];
      total: number;
    };
    expect(history.total).toBe(1);
    expect(history.runs[0]?.run_events.length).toBe(Math.min(10, run.state.history.length));

    const board = (await (await call(leaderboard, context(new Request(`${WEB_URL}/api/leaderboard`), null))).json()) as {
      username: string;
      score: number;
    }[];
    expect(board).toEqual([expect.objectContaining({ username: 'jugador_alice', score: run.state.score })]);
  });
});

describe('profile', () => {
  it('reports availability and rejects taken usernames', async () => {
    await addUser('bob');
    const available = await call(usernameAvailable, context(new Request(`${WEB_URL}/api/username-available?name=jugador_bob`), null));
    expect(await available.json()).toEqual({ available: false });

    const taken = await call(updateProfile, context(jsonRequest('/api/profile', { username: 'jugador_bob' }, 'PATCH'), { id: 'alice' }));
    expect(taken.status).toBe(409);

    const renamed = await call(updateProfile, context(jsonRequest('/api/profile', { username: '  Alicia ' }, 'PATCH'), { id: 'alice' }));
    expect(await renamed.json()).toEqual({ username: 'Alicia' });
    const profile = await call(getProfile, context(new Request(`${WEB_URL}/api/profile`), { id: 'alice' }));
    expect(await profile.json()).toEqual({ username: 'Alicia' });
  });
});

describe('worker routing', () => {
  it('blocks foreign origins and unknown routes, and serves assets outside /api', async () => {
    const foreign = new Request(`${WEB_URL}/api/start-run`, { method: 'POST', headers: { origin: 'https://evil.test' } });
    expect((await worker.fetch(foreign, env)).status).toBe(403);
    expect((await worker.fetch(new Request(`${WEB_URL}/api/nope`), env)).status).toBe(404);
    expect(await (await worker.fetch(new Request(`${WEB_URL}/`), env)).text()).toBe('asset');
  });

  it('fails closed when the auth secret is missing', async () => {
    env.BETTER_AUTH_SECRET = '';
    expect((await worker.fetch(new Request(`${WEB_URL}/api/auth/get-session`), env)).status).toBe(503);
    expect((await worker.fetch(new Request(`${WEB_URL}/api/leaderboard`), env)).status).toBe(503);
  });

  it('answers 404 instead of the SPA shell for missing hashed assets', async () => {
    env.ASSETS = {
      fetch: async () => new Response('<!doctype html>', { headers: { 'Content-Type': 'text/html' } }),
    } as unknown as Fetcher;
    expect((await worker.fetch(new Request(`${WEB_URL}/assets/missing.js`), env)).status).toBe(404);
    expect((await worker.fetch(new Request(`${WEB_URL}/leaderboard`), env)).status).toBe(200);
  });

  it('rejects oversized bodies before reading them', async () => {
    const request = new Request(`${WEB_URL}/api/create-checkout`, {
      method: 'POST',
      headers: { origin: WEB_URL, 'content-type': 'application/json', 'content-length': '5000' },
      body: 'x'.repeat(5000),
    });
    expect((await worker.fetch(request, env)).status).toBe(413);
  });

  it('rejects unsigned stripe webhooks', async () => {
    const request = new Request(`${WEB_URL}/api/stripe-webhook`, { method: 'POST', body: '{}' });
    expect((await worker.fetch(request, env)).status).toBe(400);
  });

  it('links a guest to a new account, creating a neutral profile and moving tickets', async () => {
    const signIn = await worker.fetch(new Request(`${WEB_URL}/api/auth/sign-in/anonymous`, { method: 'POST', headers: { origin: WEB_URL } }), env);
    expect(signIn.status).toBe(200);
    const cookie = signIn.headers.get('set-cookie')?.split(';')[0] ?? '';
    const ticket = await worker.fetch(new Request(`${WEB_URL}/api/start-run`, { method: 'POST', headers: { origin: WEB_URL, cookie } }), env);
    const { ticketId } = (await ticket.json()) as { ticketId: string };

    const signUp = await worker.fetch(
      new Request(`${WEB_URL}/api/auth/sign-up/email`, {
        method: 'POST',
        headers: { origin: WEB_URL, cookie, 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'carla@example.test', password: 'correct-horse-battery', name: 'carla@example.test' }),
      }),
      env,
    );
    expect(signUp.status).toBe(200);
    const { user } = (await signUp.json()) as { user: { id: string } };

    const owner = await db.prepare('select user_id from run_tickets where id = ?1').bind(ticketId).first<{ user_id: string }>();
    expect(owner?.user_id).toBe(user.id);
    const profile = await db.prepare('select username from profiles where id = ?1').bind(user.id).first<{ username: string }>();
    expect(profile?.username).toMatch(/^jugador_[0-9a-f]{10}$/);
  });
});
