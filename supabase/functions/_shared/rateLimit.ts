import { adminClient } from './http.ts';
import { RequestError } from './requestPolicy.ts';

export type RateScope = 'start-run' | 'submit-run' | 'create-checkout' | 'claim-run-ticket';
const USER_LIMIT: Record<RateScope, number> = {
  'start-run': 10,
  'submit-run': 15,
  'create-checkout': 5,
  'claim-run-ticket': 10,
};

async function consume(key: string, limit: number): Promise<void> {
  const { data, error } = await adminClient().rpc('consume_api_rate_limit', {
    p_key: key,
    p_limit: limit,
    p_window_seconds: 60,
  });
  if (error) throw new RequestError(503, 'Rate limiter unavailable');
  if (data !== true) throw new RequestError(429, 'Too many requests');
}

export async function enforceUserRateLimit(userId: string, scope: RateScope): Promise<void> {
  await consume(`${scope}:user:${userId}`, USER_LIMIT[scope]);
}

export async function enforceIpRateLimit(req: Request, scope: RateScope): Promise<void> {
  const header = Deno.env.get('TRUSTED_CLIENT_IP_HEADER');
  if (!header) return;
  const clientIp = req.headers.get(header);
  if (!clientIp || clientIp.length > 128 || clientIp.includes(','))
    throw new RequestError(503, 'Client address unavailable');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(clientIp));
  const key = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  await consume(`${scope}:ip:${key}`, 120);
}
