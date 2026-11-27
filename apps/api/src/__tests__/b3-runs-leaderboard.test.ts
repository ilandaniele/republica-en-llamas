import { beforeEach, describe, expect, it } from 'vitest';
import {
  dailyChallengeDate,
  dailyChallengeSeed,
  drawNextCard,
  endTurn,
  initGame,
  MAX_RANKED_RUN_DECISIONS,
  resolveTurn,
} from '@republica/game-engine';
import type { RunConfig, TurnDecision } from '@republica/game-engine';
import type { Auth } from '../auth.js';
import type { RouteContext } from '../context.js';
import type { Env } from '../env.js';
import { errorResponse } from '../http.js';
import {
  DAILY_LEADERBOARD_SQL,
  LEADERBOARD_BY_DIFFICULTY_SQL,
  LEADERBOARD_SQL,
  leaderboard,
} from '../routes/leaderboard.js';
import { startRun, submitRun } from '../routes/runs.js';
import { createTestDb } from './d1.js';

const WEB_URL = 'https://game.test';
const DIFFICULTIES = ['easy', 'normal', 'hard', 'crisis'] as const;

let db: D1Database;
let env: Env;

function context(request: Request, userId: string | null): RouteContext {
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

function post(path: string, body: unknown): Request {
  return new Request(`${WEB_URL}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: WEB_URL },
    body: JSON.stringify(body),
  });
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
  await db.prepare('insert into profiles (id, username) values (?1, ?2)').bind(id, `jugador_${id}`).run();
}

async function grant(userId: string, entitlement: string): Promise<void> {
  await db
    .prepare('insert into user_entitlements (id, user_id, entitlement) values (?1, ?2, ?3)')
    .bind(crypto.randomUUID(), userId, entitlement)
    .run();
}

async function ticketFor(seed: number): Promise<string> {
  const id = crypto.randomUUID();
  await db
    .prepare('insert into run_tickets (id, user_id, seed, created_at) values (?1, ?2, ?3, ?4)')
    .bind(id, 'alice', seed, new Date().toISOString())
    .run();
  return id;
}

function finishedRun(config: RunConfig, choice = 0) {
  let state = initGame(
    config.difficulty,
    config.seed,
    'es',
    config.scenarioId ?? undefined,
    config.presidentId,
  );
  const decisions: TurnDecision[] = [];
  while (!state.isGameOver) {
    const card = drawNextCard(state);
    const decision: TurnDecision = card.isLaw
      ? { kind: 'congress', cardId: card.id, decisions: { actions: [], swingChoices: [] } }
      : { kind: 'choice', cardId: card.id, choiceIndex: Math.min(choice, card.choices.length - 1) };
    state = endTurn(resolveTurn(state, card, decision).state);
    decisions.push(decision);
  }
  return { config, decisions };
}

function submit(body: unknown): Promise<Response> {
  return call(submitRun, context(post('/api/submit-run', body), 'alice'));
}

async function insertRun(
  userId: string,
  difficulty: string,
  score: number,
  dailyDate: string | null = null,
): Promise<void> {
  await db
    .prepare(
      `insert into game_runs (id, user_id, difficulty, seed, score, decisions, decisions_hash, completed_at, daily_date)
       values (?1, ?2, ?3, ?4, ?5, '[]', ?1, ?6, ?7)`,
    )
    .bind(crypto.randomUUID(), userId, difficulty, score, score, new Date().toISOString(), dailyDate)
    .run();
}

function leaderboardRequest(query = ''): Promise<Response> {
  return call(leaderboard, context(new Request(`${WEB_URL}/api/leaderboard${query}`), null));
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

describe('leaderboard', () => {
  it('rejects unknown difficulties', async () => {
    expect((await leaderboardRequest('?difficulty=legendary')).status).toBe(400);
  });

  it('filters by difficulty, caps at 100 entries and caches publicly', async () => {
    for (let score = 0; score < 101; score++) await insertRun('alice', 'hard', score);
    await insertRun('alice', 'easy', 1_000);

    const all = await leaderboardRequest();
    expect(all.headers.get('Cache-Control')).toBe('no-cache');
    const allRows = (await all.json()) as { score: number; difficulty: string }[];
    expect(allRows).toHaveLength(100);
    expect(allRows[0]).toMatchObject({ score: 1_000, difficulty: 'easy' });

    const hard = (await (await leaderboardRequest('?difficulty=hard')).json()) as {
      score: number;
      difficulty: string;
    }[];
    expect(hard).toHaveLength(100);
    expect(hard.every((row) => row.difficulty === 'hard')).toBe(true);
    expect(hard[0]?.score).toBe(100);
  });

  it.each([
    [LEADERBOARD_SQL, [100], 'game_runs_score_idx'],
    [LEADERBOARD_BY_DIFFICULTY_SQL, [100, 'hard'], 'game_runs_difficulty_score_idx'],
  ])('walks the score index without sorting', async (sql, params, index) => {
    for (const [i, difficulty] of DIFFICULTIES.entries()) await insertRun('alice', difficulty, i);
    const { results } = await db
      .prepare(`explain query plan ${sql}`)
      .bind(...params)
      .all<{ detail: string }>();
    const plan = results.map((row) => row.detail).join('\n');
    expect(plan).toContain(index);
    expect(plan).not.toContain('TEMP B-TREE');
  });
});

describe('start-run', () => {
  it('rate limits per user before the daily cap', async () => {
    await grant('alice', 'full_access');
    for (let i = 0; i < 10; i++)
      expect((await call(startRun, context(post('/api/start-run', {}), 'alice'))).status).toBe(200);
    const limited = await call(startRun, context(post('/api/start-run', {}), 'alice'));
    expect(limited.status).toBe(429);
    expect(await limited.json()).toEqual({ error: 'Too many requests' });
  });
});

describe('submit-run', () => {
  const lockedScenario = { seed: 42, difficulty: 'normal', scenarioId: 'libertad_avanza_2023' } as const;

  it('keeps full_access scenarios locked for mode_historical owners', async () => {
    await grant('alice', 'mode_historical');
    const response = await submit({ ticketId: await ticketFor(42), ...finishedRun(lockedScenario) });
    expect(response.status).toBe(403);
  });

  it('accepts full_access scenarios for full_access owners', async () => {
    await grant('alice', 'full_access');
    const response = await submit({ ticketId: await ticketFor(42), ...finishedRun(lockedScenario) });
    expect(response.status).toBe(200);
  });

  it('accepts mode_historical scenarios for mode_historical owners', async () => {
    await grant('alice', 'mode_historical');
    const run = finishedRun({ seed: 42, difficulty: 'normal', scenarioId: 'hiperinflacion_1989' });
    expect((await submit({ ticketId: await ticketFor(42), ...run })).status).toBe(200);
  });

  it('answers 409 when a used ticket comes back with different decisions', async () => {
    const config = { seed: 42, difficulty: 'normal', presidentId: 'milei' } as const;
    const ticketId = await ticketFor(42);
    const first = finishedRun(config, 0);
    const second = finishedRun(config, 1);
    expect(second.decisions).not.toEqual(first.decisions);

    expect((await submit({ ticketId, ...first })).status).toBe(200);
    expect((await submit({ ticketId, ...second })).status).toBe(409);
  });

  it('stores normalized decisions so padding neither persists nor bypasses dedupe', async () => {
    const run = finishedRun({ seed: 42, difficulty: 'normal', presidentId: 'milei' });
    const ticketId = await ticketFor(42);
    const padded = run.decisions.map((decision) => ({ ...decision, padding: 'x'.repeat(200) }));

    const saved = (await (await submit({ ticketId, ...run, decisions: padded })).json()) as { id: string };
    const row = await db
      .prepare('select decisions from game_runs where id = ?1')
      .bind(saved.id)
      .first<{ decisions: string }>();
    expect(JSON.parse(row!.decisions)).toEqual(run.decisions);

    expect(await (await submit({ ticketId, ...run })).json()).toMatchObject({
      id: saved.id,
      duplicate: true,
    });
  });

  it('rejects runs longer than a ranked term', async () => {
    const run = finishedRun({ seed: 42, difficulty: 'normal', presidentId: 'milei' });
    const decisions = Array(MAX_RANKED_RUN_DECISIONS + 1).fill(run.decisions[0]);
    expect((await submit({ ticketId: await ticketFor(42), config: run.config, decisions })).status).toBe(400);
  });
});

describe('daily challenge', () => {
  const today = dailyChallengeDate();
  const dailyConfig = {
    seed: dailyChallengeSeed(today),
    difficulty: 'normal',
    presidentId: 'milei',
  } as const;

  async function dailyTicket(): Promise<{ ticketId: string; seed: number; dailyDate: string }> {
    const response = await call(startRun, context(post('/api/start-run?daily=1', {}), 'alice'));
    expect(response.status).toBe(200);
    return (await response.json()) as { ticketId: string; seed: number; dailyDate: string };
  }

  it('issues the shared seed of the UTC day', async () => {
    expect(await dailyTicket()).toMatchObject({ seed: dailyConfig.seed, dailyDate: today });
  });

  it('rejects daily runs that change the fixed rules', async () => {
    const { ticketId } = await dailyTicket();
    const response = await submit({ ticketId, ...finishedRun({ ...dailyConfig, difficulty: 'easy' }) });
    expect(response.status).toBe(422);
  });

  it('stores the day on accepted daily runs', async () => {
    const { ticketId } = await dailyTicket();
    const saved = (await (await submit({ ticketId, ...finishedRun(dailyConfig) })).json()) as { id: string };
    const row = await db
      .prepare('select daily_date from game_runs where id = ?1')
      .bind(saved.id)
      .first<{ daily_date: string }>();
    expect(row?.daily_date).toBe(today);
  });

  it('ranks only the best run per user for today', async () => {
    await addUser('bob');
    await insertRun('alice', 'normal', 300, today);
    await insertRun('alice', 'normal', 500, today);
    await insertRun('bob', 'normal', 400, today);
    await insertRun('bob', 'normal', 900, '2000-01-01');
    await insertRun('bob', 'normal', 1_000);

    const rows = (await (await leaderboardRequest('?daily=1')).json()) as {
      user_id: string;
      score: number;
    }[];
    expect(rows.map((row) => [row.user_id, row.score])).toEqual([
      ['alice', 500],
      ['bob', 400],
    ]);
  });

  it('reads daily runs through the daily index', async () => {
    const { results } = await db
      .prepare(`explain query plan ${DAILY_LEADERBOARD_SQL}`)
      .bind(100, today)
      .all<{ detail: string }>();
    expect(results.map((row) => row.detail).join('\n')).toContain('game_runs_daily_score_idx');
  });
});
