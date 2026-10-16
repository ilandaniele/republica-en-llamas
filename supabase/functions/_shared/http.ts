import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno';

export const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
export const WEB_URL = Deno.env.get('WEB_URL') ?? 'https://republica-en-llamas.fly.dev';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

export function corsHeaders(req: Request) {
  const origin = req.headers.get('Origin') ?? '';
  const allowed = origin === WEB_URL || origin.startsWith('http://localhost:');
  return {
    'Access-Control-Allow-Origin': allowed ? origin : WEB_URL,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

export async function userFromToken(token: string): Promise<AuthenticatedUser | null> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data } = await supabase.auth.getUser(token);
  if (!data.user) return null;
  return { id: data.user.id, isAnonymous: data.user.is_anonymous ?? false };
}

export function authenticatedUser(req: Request): Promise<AuthenticatedUser | null> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  return userFromToken(token);
}

export async function authenticatedUserId(req: Request): Promise<string | null> {
  return (await authenticatedUser(req))?.id ?? null;
}

export function adminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}
