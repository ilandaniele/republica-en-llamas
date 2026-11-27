import { beforeEach, describe, expect, it } from 'vitest';
import type { Auth } from '../auth.js';
import type { RouteContext } from '../context.js';
import type { Env } from '../env.js';
import { errorResponse } from '../http.js';
import { listAchievements, SCENARIO_RECORDS_SQL } from '../routes/achievements.js';
import { createTestDb } from './d1.js';

const WEB_URL = 'https://game.test';

let db: D1Database;
let env: Env;

interface Achievement {
  scenarioId: string;
  tier: string;
  bestScore: number;
}

function context(userId: string | null): RouteContext {
  const session = userId ? { user: { id: userId, isAnonymous: false } } : null;
  const auth = { api: { getSession: async () => session } } as unknown as Auth;
  const request = new Request(`${WEB_URL}/api/achievements`);
  return { env, request, url: new URL(request.url), auth };
}

async function achievementsFor(userId: string | null): Promise<Response> {
  try {
    return await listAchievements(context(userId));
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

async function insertRun(
  userId: string,
  scenarioId: string | null,
  score: number,
  isWin: boolean,
  completed = true,
): Promise<void> {
  await db
    .prepare(
      `insert into game_runs (id, user_id, difficulty, seed, score, is_win, scenario_id, decisions,
         decisions_hash, completed_at)
       values (?1, ?2, 'normal', ?3, ?3, ?4, ?5, '[]', ?1, ?6)`,
    )
    .bind(
      crypto.randomUUID(),
      userId,
      score,
      isWin ? 1 : 0,
      scenarioId,
      completed ? new Date().toISOString() : null,
    )
    .run();
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
  await addUser('bob');
});

describe('achievements', () => {
  it('requires a session', async () => {
    expect((await achievementsFor(null)).status).toBe(401);
  });

  it('derives scenario tiers from the session user runs only', async () => {
    await insertRun('alice', 'corralito_2001', 500, false);
    await insertRun('alice', 'corralito_2001', 800, false);
    await insertRun('alice', 'malvinas_1982', 3_000, true);
    await insertRun('alice', 'rodrigazo_1975', 9_000, true, false);
    await insertRun('alice', null, 9_000, true);
    await insertRun('bob', 'rodrigazo_1975', 7_000, true);

    const response = await achievementsFor('alice');
    expect(response.status).toBe(200);
    const { scenarios } = (await response.json()) as { scenarios: Achievement[] };
    const byId = new Map(scenarios.map((achievement) => [achievement.scenarioId, achievement]));
    expect(byId.get('corralito_2001')).toMatchObject({ tier: 'played', bestScore: 800 });
    expect(byId.get('malvinas_1982')).toMatchObject({ tier: 'won', bestScore: 3_000 });
    expect(byId.get('rodrigazo_1975')).toMatchObject({ tier: 'locked', bestScore: 0 });
  });

  it('reads runs through the user scenario index', async () => {
    const { results } = await db
      .prepare(`explain query plan ${SCENARIO_RECORDS_SQL}`)
      .bind('alice')
      .all<{ detail: string }>();
    expect(results.map((row) => row.detail).join('\n')).toContain('game_runs_user_scenario_idx');
  });
});
