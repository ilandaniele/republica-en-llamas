import { RATE_LIMIT_WINDOW_MS } from './rateLimit.js';

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;
export const CLEANUP_BATCH_SIZE = 2000;

interface CleanupTask {
  table: string;
  sql: string;
  cutoff: (now: number) => string | number;
}

const iso = (ms: number) => new Date(ms).toISOString();

const TASKS: CleanupTask[] = [
  {
    table: 'api_rate_limits',
    sql: `delete from api_rate_limits where rowid in (
      select rowid from api_rate_limits where window_start < ?1 limit ?2)`,
    cutoff: (now) => Math.floor(now / RATE_LIMIT_WINDOW_MS),
  },
  {
    table: 'rateLimit',
    sql: `delete from "rateLimit" where rowid in (
      select rowid from "rateLimit" where "lastRequest" < ?1 limit ?2)`,
    cutoff: (now) => now - HOUR_MS,
  },
  {
    table: 'run_tickets',
    sql: `delete from run_tickets where rowid in (
      select rowid from run_tickets where created_at < ?1 limit ?2)`,
    cutoff: (now) => iso(now - DAY_MS),
  },
  {
    table: 'verification',
    sql: `delete from "verification" where rowid in (
      select rowid from "verification" where "expiresAt" < ?1 limit ?2)`,
    cutoff: (now) => iso(now),
  },
  {
    table: 'guest_user',
    sql: `delete from "user" where rowid in (
      select rowid from "user" where "isAnonymous" = 1
      and not exists (select 1 from "session" where "userId" = "user"."id" and "expiresAt" > ?1)
      limit ?2)`,
    cutoff: (now) => iso(now),
  },
  {
    table: 'session',
    sql: `delete from "session" where rowid in (
      select rowid from "session" where "expiresAt" < ?1 limit ?2)`,
    cutoff: (now) => iso(now),
  },
];

export async function cleanupStaleRows(db: D1Database, now = Date.now()): Promise<void> {
  for (const task of TASKS) {
    try {
      const result = await db.prepare(task.sql).bind(task.cutoff(now), CLEANUP_BATCH_SIZE).run();
      console.warn({ event: 'cleanup', table: task.table, deleted: result.meta.changes });
    } catch (error) {
      console.error({ event: 'cleanup_failed', table: task.table, message: String(error) });
    }
  }
}
