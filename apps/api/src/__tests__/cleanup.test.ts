import { beforeEach, describe, expect, it } from 'vitest';
import { cleanupStaleRows } from '../cleanup.js';
import { RATE_LIMIT_WINDOW_MS } from '../rateLimit.js';
import { createTestDb } from './d1.js';

const NOW = Date.parse('2026-11-17T12:00:00.000Z');
const HOUR_MS = 3_600_000;

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
    .bind(id, `${id}@example.test`, iso(NOW - 30 * 24 * HOUR_MS), isAnonymous ? 1 : 0)
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

async function ids(sql: string): Promise<string[]> {
  const { results } = await db.prepare(sql).all<{ id: string }>();
  return results.map((row) => row.id).sort();
}

beforeEach(() => {
  db = createTestDb();
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
    await db
      .prepare(
        `insert into run_tickets (id, user_id, seed, created_at) values ('t1', 'expired-guest', 1, ?1)`,
      )
      .bind(iso(NOW - HOUR_MS))
      .run();

    await cleanupStaleRows(db, NOW);

    expect(await ids('select id from "user"')).toEqual(['active-guest', 'member']);
    expect(await ids('select id from run_tickets')).toEqual([]);
    expect(await ids('select id from "session"')).toHaveLength(1);
  });
});
