import { requireAccount, requireUser, userEntitlements } from '../context.js';
import type { RouteContext } from '../context.js';
import { isRecord, json, readJsonBody, RequestError } from '../http.js';

const MAX_USERNAME_LENGTH = 64;

function validUsername(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const name = value.trim();
  return name.length >= 1 && name.length <= MAX_USERNAME_LENGTH ? name : null;
}

export async function usernameAvailable(ctx: RouteContext): Promise<Response> {
  const name = validUsername(ctx.url.searchParams.get('name'));
  if (!name) return json({ available: false });
  const taken = await ctx.env.DB.prepare('select 1 from profiles where username = ?1').bind(name).first();
  return json({ available: !taken });
}

export async function getProfile(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  const row = await ctx.env.DB.prepare('select username from profiles where id = ?1')
    .bind(user.id)
    .first<{ username: string }>();
  return json({ username: row?.username ?? null });
}

export async function updateProfile(ctx: RouteContext): Promise<Response> {
  const user = await requireAccount(ctx);
  const body = await readJsonBody(ctx.request, 4096);
  const username = validUsername(isRecord(body) ? body.username : null);
  if (!username) throw new RequestError(400, 'Invalid username');
  try {
    await ctx.env.DB.prepare(
      `insert into profiles (id, username) values (?1, ?2)
       on conflict(id) do update set username = excluded.username,
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`,
    )
      .bind(user.id, username)
      .run();
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE')) throw new RequestError(409, 'Username taken');
    throw error;
  }
  return json({ username });
}

export async function getEntitlements(ctx: RouteContext): Promise<Response> {
  const user = await requireUser(ctx);
  return json({ entitlements: await userEntitlements(ctx.env.DB, user.id) });
}
