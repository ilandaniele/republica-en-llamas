import {
  createExecutionContext,
  createScheduledController,
  env,
  waitOnExecutionContext,
} from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import worker from '../index.js';

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;
const iso = (ms: number) => new Date(ms).toISOString();

function insertUser(id: string, isAnonymous: boolean, now: number): D1PreparedStatement {
  return env.DB.prepare(
    `insert into "user" (id, name, email, emailVerified, createdAt, updatedAt, isAnonymous)
     values (?1, 'Cleanup', ?2, 0, ?3, ?3, ?4)`,
  ).bind(id, `${id}@example.test`, iso(now), isAnonymous ? 1 : 0);
}

function insertSession(userId: string, expiresAt: number, now: number): D1PreparedStatement {
  return env.DB.prepare(
    `insert into "session" (id, expiresAt, token, createdAt, updatedAt, userId) values (?1, ?2, ?1, ?3, ?3, ?4)`,
  ).bind(crypto.randomUUID(), iso(expiresAt), iso(now), userId);
}

function insertTicket(id: string, createdAt: number): D1PreparedStatement {
  return env.DB.prepare(
    `insert into run_tickets (id, user_id, seed, created_at) values (?1, 'stale-account', 1, ?2)`,
  ).bind(id, iso(createdAt));
}

async function seed(now: number): Promise<void> {
  await env.DB.batch([
    insertUser('stale-guest', true, now),
    insertSession('stale-guest', now - DAY_MS, now),
    insertUser('active-guest', true, now),
    insertSession('active-guest', now + DAY_MS, now),
    insertUser('stale-account', false, now),
    insertSession('stale-account', now - DAY_MS, now),
    insertTicket('old-ticket', now - 2 * DAY_MS),
    insertTicket('new-ticket', now),
    env.DB.prepare(
      `insert into api_rate_limits (bucket_key, window_start, request_count) values ('old', 1, 1), ('new', ?1, 1)`,
    ).bind(Math.floor(now / 60_000) + 1),
    env.DB.prepare(
      `insert into "verification" (id, identifier, value, expiresAt, createdAt, updatedAt)
       values ('expired', 'x', 'x', ?1, ?2, ?2), ('valid', 'y', 'y', ?3, ?2, ?2)`,
    ).bind(iso(now - 1000), iso(now), iso(now + DAY_MS)),
    env.DB.prepare(
      `insert into "rateLimit" (id, key, count, lastRequest) values ('old', 'old', 1, ?1), ('new', 'new', 1, ?2)`,
    ).bind(now - 2 * HOUR_MS, now),
  ]);
}

async function count(sql: string, ...params: unknown[]): Promise<number> {
  const row = await env.DB.prepare(sql)
    .bind(...params)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

describe('scheduled cleanup', () => {
  it('deletes stale rows on real D1 and keeps live ones', async () => {
    const now = Date.now();
    await seed(now);

    const ctx = createExecutionContext();
    await worker.scheduled(createScheduledController({ scheduledTime: now, cron: '0 4 * * *' }), env, ctx);
    await waitOnExecutionContext(ctx);

    const users = `select count(*) as n from "user" where id = ?1`;
    expect(await count(users, 'stale-guest')).toBe(0);
    expect(await count(users, 'active-guest')).toBe(1);
    expect(await count(users, 'stale-account')).toBe(1);
    expect(await count(`select count(*) as n from "session" where "expiresAt" < ?1`, iso(now))).toBe(0);
    expect(
      await count(`select count(*) as n from run_tickets where id in ('old-ticket', 'new-ticket')`),
    ).toBe(1);
    expect(await count(`select count(*) as n from api_rate_limits where bucket_key in ('old', 'new')`)).toBe(
      1,
    );
    expect(await count(`select count(*) as n from "verification" where id in ('expired', 'valid')`)).toBe(1);
    expect(await count(`select count(*) as n from "rateLimit" where id in ('old', 'new')`)).toBe(1);
  });
});
