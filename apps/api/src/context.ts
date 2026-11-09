import type { Auth, SessionUser } from './auth.js';
import { sessionUser } from './auth.js';
import type { Env } from './env.js';
import { RequestError } from './http.js';

export interface RouteContext {
  env: Env;
  request: Request;
  url: URL;
  auth: Auth;
}

export async function requireUser(ctx: RouteContext): Promise<SessionUser> {
  const user = await sessionUser(ctx.auth, ctx.request);
  if (!user) throw new RequestError(401, 'Unauthorized');
  return user;
}

export async function requireAccount(ctx: RouteContext, message = 'Unauthorized'): Promise<SessionUser> {
  const user = await requireUser(ctx);
  if (user.isAnonymous) throw new RequestError(403, message);
  return user;
}

export async function userEntitlements(db: D1Database, userId: string): Promise<string[]> {
  const { results } = await db
    .prepare('select entitlement from user_entitlements where user_id = ?1')
    .bind(userId)
    .all<{ entitlement: string }>();
  return results.map((row) => row.entitlement);
}
