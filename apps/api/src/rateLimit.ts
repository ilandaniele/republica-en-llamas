import { isD1Error, RequestError, sha256Hex } from './http.js';

export const RATE_LIMIT_WINDOW_MS = 60_000;
const IP_LIMIT = 120;

export const USER_LIMITS = {
  'start-run': 10,
  'submit-run': 15,
  'create-checkout': 5,
  'update-profile': 5,
} as const;

export type LimitedAction = keyof typeof USER_LIMITS;

async function consume(db: D1Database, bucketKey: string, limit: number): Promise<void> {
  const now = Date.now();
  const windowStart = Math.floor(now / RATE_LIMIT_WINDOW_MS);
  const row = await db
    .prepare(
      `insert into api_rate_limits (bucket_key, window_start, request_count) values (?1, ?2, 1)
       on conflict(bucket_key) do update set
         request_count = case when window_start = excluded.window_start then request_count + 1 else 1 end,
         window_start = excluded.window_start
       where window_start <> excluded.window_start or request_count <= ?3
       returning request_count`,
    )
    .bind(bucketKey, windowStart, limit)
    .first<{ request_count: number }>();
  if (!row || row.request_count > limit) {
    const retryAfter = Math.ceil(((windowStart + 1) * RATE_LIMIT_WINDOW_MS - now) / 1000);
    throw new RequestError(429, 'Too many requests', retryAfter);
  }
}

export async function enforceIpRateLimit(db: D1Database, request: Request, action: string): Promise<void> {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  try {
    await consume(db, `ip:${action}:${await sha256Hex(ip)}`, IP_LIMIT);
  } catch (error) {
    if (request.method !== 'GET' || !isD1Error(error)) throw error;
    console.error({ event: 'rate_limit_unavailable', action, message: (error as Error).message });
  }
}

export function enforceUserRateLimit(db: D1Database, userId: string, action: LimitedAction): Promise<void> {
  return consume(db, `user:${action}:${userId}`, USER_LIMITS[action]);
}
