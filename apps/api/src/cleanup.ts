import { RATE_LIMIT_WINDOW_MS } from './rateLimit.js';

const AUTH_RATE_LIMIT_RETENTION_MS = 3_600_000;

export async function cleanupStaleRows(db: D1Database, now = Date.now()): Promise<void> {
  const currentWindow = Math.floor(now / RATE_LIMIT_WINDOW_MS);
  await db.batch([
    db.prepare('delete from api_rate_limits where window_start < ?1').bind(currentWindow),
    db.prepare('delete from "rateLimit" where "lastRequest" < ?1').bind(now - AUTH_RATE_LIMIT_RETENTION_MS),
    db
      .prepare(
        `delete from "user" where "isAnonymous" = 1
         and not exists (select 1 from "session" where "userId" = "user"."id" and "expiresAt" > ?1)`,
      )
      .bind(new Date(now).toISOString()),
  ]);
}
