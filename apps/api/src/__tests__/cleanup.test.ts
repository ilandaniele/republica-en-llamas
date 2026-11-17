import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CLEANUP_BATCH_SIZE, cleanupStaleRows } from '../cleanup.js';
import type { Env } from '../env.js';
import worker from '../index.js';
import { RATE_LIMIT_WINDOW_MS } from '../rateLimit.js';
import { createTestDb } from './d1.js';

const NOW = Date.parse('2026-11-17T12:00:00.000Z');
const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;
const WEB_URL = 'https://game.test';

let db: D1Database;

function iso(ms: number): string {
  return new Date(ms).toISOString();
}

async function addUser(id: string, isAnonymous: boolean): Promise<void> {
  await db
    .prepare(
      `insert into "user" (id, name, email, emailVerified, createdAt, updatedAt, isAnonymous)
       values (?1, 'Test', ?2, 0, ?3, ?3, ?4)`,
    )
    .bind(id, `${id}@example.test`, iso(NOW - 30 * DAY_MS), isAnonymous ? 1 : 0)
    .run();
}

async function addSession(userId: string, expiresAt: number): Promise<void> {
  await db
    .prepare(
      `insert into "session" (id, expiresAt, token, createdAt, updatedAt, userId)
       values (?1, ?2, ?1, ?3, ?3, ?4)`,
    )
    .bind(crypto.randomUUID(), iso(expiresAt), iso(NOW - HOUR_MS), userId)
    .run();
}

async function addTicket(id: string, userId: string, createdAt: number): Promise<void> {
  await db
    .prepare(`insert into run_tickets (id, user_id, seed, created_at) values (?1, ?2, 1, ?3)`)
    .bind(id, userId, iso(createdAt))
    .run();
}

async function ids(sql: string): Promise<string[]> {
  const { results } = await db.prepare(sql).all<{ id: string }>();
  return results.map((row) => row.id).sort();
}

beforeEach(() => {
  db = createTestDb();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('cleanupStaleRows', () => {
  it('keeps only the current API rate limit window', async () => {
    const currentWindow = Math.floor(NOW / RATE_LIMIT_WINDOW_MS);
    await db
      .prepare(
        `insert into api_rate_limits (bucket_key, window_start, request_count)
         values ('old', ?1, 3), ('current', ?2, 3)`,
      )
      .bind(currentWindow - 1, currentWindow)
      .run();

    await cleanupStaleRows(db, NOW);

    expect(await ids('select bucket_key as id from api_rate_limits')).toEqual(['current']);
  });

  it('removes auth rate limit rows idle for over an hour', async () => {
    await db
      .prepare(
        `insert into "rateLimit" (id, key, count, lastRequest) values ('old', 'a', 1, ?1), ('recent', 'b', 1, ?2)`,
      )
      .bind(NOW - 2 * HOUR_MS, NOW - 60_000)
      .run();

    await cleanupStaleRows(db, NOW);

    expect(await ids('select id from "rateLimit"')).toEqual(['recent']);
  });

  it('deletes anonymous users without a live session and their tickets', async () => {
    await addUser('expired-guest', true);
    await addSession('expired-guest', NOW - HOUR_MS);
    await addUser('no-session-guest', true);
    await addUser('active-guest', true);
    await addSession('active-guest', NOW + HOUR_MS);
    await addUser('member', false);
    await addTicket('t1', 'expired-guest', NOW - HOUR_MS);

    await cleanupStaleRows(db, NOW);

    expect(await ids('select id from "user"')).toEqual(['active-guest', 'member']);
    expect(await ids('select id from run_tickets')).toEqual([]);
    expect(await ids('select id from "session"')).toHaveLength(1);
  });

  it('removes run tickets older than a day', async () => {
    await addUser('member', false);
    await addTicket('stale', 'member', NOW - DAY_MS - 1);
    await addTicket('fresh', 'member', NOW - HOUR_MS);

    await cleanupStaleRows(db, NOW);

    expect(await ids('select id from run_tickets')).toEqual(['fresh']);
  });

  it('removes expired sessions of registered users', async () => {
    await addUser('member', false);
    await addSession('member', NOW - HOUR_MS);
    await addSession('member', NOW + HOUR_MS);

    await cleanupStaleRows(db, NOW);

    const { results } = await db.prepare('select expiresAt from "session"').all<{ expiresAt: string }>();
    expect(results).toEqual([{ expiresAt: iso(NOW + HOUR_MS) }]);
  });

  it('removes expired verification rows', async () => {
    await db
      .prepare(
        `insert into "verification" (id, identifier, value, expiresAt, createdAt, updatedAt)
         values ('expired', 'a', 'x', ?1, ?3, ?3), ('valid', 'b', 'y', ?2, ?3, ?3)`,
      )
      .bind(iso(NOW - 60_000), iso(NOW + 60_000), iso(NOW - HOUR_MS))
      .run();

    await cleanupStaleRows(db, NOW);

    expect(await ids('select id from "verification"')).toEqual(['valid']);
  });

  it('deletes at most one batch per table and run', async () => {
    await addUser('member', false);
    const total = CLEANUP_BATCH_SIZE + 5;
    await db
      .prepare(
        `with recursive n(i) as (select 1 union all select i + 1 from n where i < ?1)
         insert into run_tickets (id, user_id, seed, created_at) select 'old-' || i, 'member', 1, ?2 from n`,
      )
      .bind(total, iso(NOW - 2 * DAY_MS))
      .run();

    await cleanupStaleRows(db, NOW);

    expect(await ids('select id from run_tickets')).toHaveLength(5);
  });

  it('keeps cleaning other tables when one delete fails', async () => {
    await addUser('member', false);
    await addTicket('stale', 'member', NOW - 2 * DAY_MS);
    await addUser('guest', true);
    const failingDb = new Proxy(db, {
      get(target, property) {
        if (property !== 'prepare') return Reflect.get(target, property);
        return (sql: string) => {
          if (sql.includes('from api_rate_limits')) throw new Error('D1 unavailable');
          return target.prepare(sql);
        };
      },
    });

    await cleanupStaleRows(failingDb, NOW);

    expect(await ids('select id from run_tickets')).toEqual([]);
    expect(await ids('select id from "user"')).toEqual(['member']);
    expect(console.error).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'cleanup_failed', table: 'api_rate_limits' }),
    );
  });
});

describe('scheduled cleanup with Better Auth guests', () => {
  const env = (): Env => ({
    DB: db,
    ASSETS: { fetch: async () => new Response('asset') } as unknown as Fetcher,
    BETTER_AUTH_SECRET: 'test-secret-with-enough-entropy-0123456789abcdef',
    WEB_URL,
  });

  async function signInGuest(workerEnv: Env): Promise<void> {
    const response = await worker.fetch(
      new Request(`${WEB_URL}/api/auth/sign-in/anonymous`, {
        method: 'POST',
        headers: { origin: WEB_URL, 'content-type': 'application/json', 'CF-Connecting-IP': '198.51.100.9' },
        body: '{}',
      }),
      workerEnv,
    );
    expect(response.status).toBe(200);
  }

  async function runScheduled(workerEnv: Env): Promise<void> {
    const pending: Promise<unknown>[] = [];
    const ctx = { waitUntil: (promise: Promise<unknown>) => pending.push(promise) } as unknown as ExecutionContext;
    await worker.scheduled({} as ScheduledController, workerEnv, ctx);
    await Promise.all(pending);
  }

  it('keeps a guest whose session is still live', async () => {
    const workerEnv = env();
    await signInGuest(workerEnv);

    await runScheduled(workerEnv);

    expect(await ids('select id from "user" where isAnonymous = 1')).toHaveLength(1);
  });

  it('purges a guest once the Better Auth session expires', async () => {
    const workerEnv = env();
    await signInGuest(workerEnv);
    vi.useFakeTimers({ now: Date.now() + 365 * DAY_MS, toFake: ['Date'] });

    try {
      await runScheduled(workerEnv);
    } finally {
      vi.useRealTimers();
    }

    expect(await ids('select id from "user"')).toEqual([]);
    expect(await ids('select id from "session"')).toEqual([]);
  });
});
