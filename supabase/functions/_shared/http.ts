import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.119.0?target=deno';
import { bearerToken, checkContentLength, isAllowedOrigin, RequestError } from './requestPolicy.ts';

export const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
export const WEB_URL = new URL(Deno.env.get('WEB_URL') ?? 'https://republica-en-llamas.fly.dev').origin;
const ALLOWED_ORIGINS = [
  WEB_URL,
  ...(Deno.env.get('ALLOWED_ORIGINS') ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

export function corsHeaders(req: Request) {
  const origin = req.headers.get('Origin');
  const allowed = origin !== null && isAllowedOrigin(origin, ALLOWED_ORIGINS);
  return {
    ...(allowed ? { 'Access-Control-Allow-Origin': origin } : {}),
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    Vary: 'Origin',
  };
}

export function jsonResponder(headers: Record<string, string>) {
  return (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
}

export interface AuthenticatedUser {
  id: string;
  isAnonymous: boolean;
}

export function requestGuard(
  req: Request,
  headers: Record<string, string>,
  maxBytes = 4096,
): Response | null {
  const json = jsonResponder(headers);
  if (!isAllowedOrigin(req.headers.get('origin'), ALLOWED_ORIGINS))
    return json({ error: 'Origin not allowed' }, 403);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST')
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...headers, 'Content-Type': 'application/json', Allow: 'POST, OPTIONS' },
    });
  try {
    checkContentLength(req, maxBytes);
  } catch (error) {
    if (error instanceof RequestError) return json({ error: error.message }, error.status);
    throw error;
  }
  return null;
}

export function requestErrorResponse(error: unknown, headers: Record<string, string>): Response {
  if (error instanceof RequestError) {
    const responseHeaders = error.status === 429 ? { ...headers, 'Retry-After': '60' } : headers;
    return jsonResponder(responseHeaders)({ error: error.message }, error.status);
  }
  console.error('Request failed unexpectedly');
  return jsonResponder(headers)({ error: 'Service unavailable' }, 503);
}

export async function userFromToken(token: string): Promise<AuthenticatedUser | null> {
  if (bearerToken(`Bearer ${token}`) === null) return null;
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;
    return { id: data.user.id, isAnonymous: data.user.is_anonymous ?? false };
  } catch {
    return null;
  }
}

export function authenticatedUser(req: Request): Promise<AuthenticatedUser | null> {
  const token = bearerToken(req.headers.get('Authorization'));
  if (!token) return Promise.resolve(null);
  return userFromToken(token);
}

export async function authenticatedUserId(req: Request): Promise<string | null> {
  return (await authenticatedUser(req))?.id ?? null;
}

export function adminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}
