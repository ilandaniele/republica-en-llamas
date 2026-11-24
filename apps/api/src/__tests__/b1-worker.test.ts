import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import worker from '../index.js';
import type { Env } from '../env.js';
import { errorResponse, RequestError } from '../http.js';
import { createTestDb } from './d1.js';

const WEB_URL = 'https://game.test';
const IP = '198.51.100.7';

let env: Env;
let statements: string[];

function trackedDb(): D1Database {
  const db = createTestDb();
  return new Proxy(db, {
    get(target, property) {
      if (property !== 'prepare') return Reflect.get(target, property);
      return (sql: string) => {
        statements.push(sql);
        return target.prepare(sql);
      };
    },
  });
}

function fetchApi(path: string, init: RequestInit = {}, ctx?: ExecutionContext): Promise<Response> {
  const headers = new Headers(init.headers);
  if (!headers.has('CF-Connecting-IP')) headers.set('CF-Connecting-IP', IP);
  return worker.fetch(new Request(`${WEB_URL}${path}`, { ...init, headers }), env, ctx);
}

function post(path: string, body?: unknown, headers: Record<string, string> = {}): Promise<Response> {
  return fetchApi(path, {
    method: 'POST',
    headers: { origin: WEB_URL, 'content-type': 'application/json', ...headers },
    body: body === undefined ? null : JSON.stringify(body),
  });
}

async function signUp(email: string): Promise<string> {
  const response = await post('/api/auth/sign-up/email', {
    email,
    password: 'correct-horse-battery',
    name: email,
  });
  expect(response.status).toBe(200);
  return response.headers.get('set-cookie')?.split(';')[0] ?? '';
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  statements = [];
  env = {
    DB: trackedDb(),
    ASSETS: { fetch: async () => new Response('asset') } as unknown as Fetcher,
    BETTER_AUTH_SECRET: 'test-secret-with-enough-entropy-0123456789abcdef',
    WEB_URL,
  };
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('auth instance', () => {
  it('runs the Better Auth schema check once per isolate', async () => {
    await fetchApi('/api/auth/get-session');
    await flush();
    const afterFirst = statements.filter((sql) => sql.includes('sqlite_master')).length;
    expect(afterFirst).toBeGreaterThan(0);
    await fetchApi('/api/auth/get-session');
    await flush();
    expect(statements.filter((sql) => sql.includes('sqlite_master')).length).toBe(afterFirst);
  });

  it('does not build Better Auth for public routes', async () => {
    env.BETTER_AUTH_SECRET = '';
    expect((await fetchApi('/api/leaderboard')).status).toBe(200);
    await flush();
    expect(statements.some((sql) => sql.includes('sqlite_master'))).toBe(false);
  });
});

describe('ip limiter', () => {
  const rateRow = () =>
    env.DB.prepare('select request_count from api_rate_limits where bucket_key like ?1')
      .bind('ip:/api/leaderboard:%')
      .first<{ request_count: number }>();

  it('stops writing once a bucket is over the limit and sends the window reset', async () => {
    for (let i = 0; i < 125; i++) await fetchApi('/api/leaderboard');
    expect((await rateRow())?.request_count).toBe(121);
    const limited = await fetchApi('/api/leaderboard');
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get('Retry-After'))).toBeLessThanOrEqual(60);
  });

  it('fails open on GET and closed on writes when D1 errors', async () => {
    const db = env.DB;
    env.DB = new Proxy(db, {
      get(target, property) {
        if (property !== 'prepare') return Reflect.get(target, property);
        return (sql: string) => {
          if (sql.includes('api_rate_limits')) throw new Error('D1_ERROR: quota exceeded');
          return target.prepare(sql);
        };
      },
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await fetchApi('/api/leaderboard')).status).toBe(200);
    expect((await post('/api/start-run', {})).status).toBe(503);
  });

  it('rate limits auth paths under one bucket, session checks apart, and rejects long paths', async () => {
    expect((await fetchApi(`/api/auth/${'x'.repeat(200)}`)).status).toBe(404);
    for (let i = 0; i < 120; i++) await fetchApi(`/api/auth/probe-${i}`);
    expect((await fetchApi('/api/auth/probe-last')).status).toBe(429);
    expect((await fetchApi('/api/auth/get-session')).status).not.toBe(429);
    for (let i = 0; i < 119; i++) await fetchApi('/api/auth/get-session');
    expect((await fetchApi('/api/auth/get-session')).status).toBe(429);
    const { n } = (await env.DB.prepare(
      "select count(*) as n from api_rate_limits where bucket_key like 'ip:auth:%'",
    ).first<{ n: number }>())!;
    expect(n).toBe(1);
  });

  it.each(['/api/profile', '/api/runs', '/api/entitlements'])('rate limits GET %s per IP', async (path) => {
    for (let i = 0; i < 120; i++) await fetchApi(path);
    expect((await fetchApi(path)).status).toBe(429);
  });
});

describe('private routes', () => {
  it.each([
    ['POST', '/api/start-run'],
    ['POST', '/api/submit-run'],
    ['POST', '/api/create-checkout'],
    ['GET', '/api/profile'],
    ['PATCH', '/api/profile'],
    ['GET', '/api/runs'],
    ['GET', '/api/entitlements'],
  ])('%s %s answers 401 without a session', async (method, path) => {
    const response = await fetchApi(path, {
      method,
      headers: { origin: WEB_URL, 'content-type': 'application/json' },
      body: method === 'GET' ? null : '{}',
    });
    expect(response.status).toBe(401);
  });
});

describe('auth hardening', () => {
  it('rejects a foreign Origin on cookieless auth writes', async () => {
    const response = await post('/api/auth/sign-in/anonymous', undefined, { origin: 'https://evil.test' });
    expect(response.status).toBe(403);
    const reset = await post(
      '/api/auth/request-password-reset',
      { email: 'nobody@example.test' },
      { origin: 'https://evil.test' },
    );
    expect(reset.status).toBe(403);
  });

  it('rejects cookie-authenticated writes without an Origin', async () => {
    const cookie = await signUp('erin@example.test');
    const response = await fetchApi('/api/start-run', {
      method: 'POST',
      headers: { cookie, 'content-type': 'application/json' },
      body: '{}',
    });
    expect(response.status).toBe(403);
    const signOut = await fetchApi('/api/auth/sign-out', { method: 'POST', headers: { cookie } });
    expect(signOut.status).toBe(403);
  });

  it('rejects a foreign redirectTo', async () => {
    const response = await post('/api/auth/request-password-reset', {
      email: 'nobody@example.test',
      redirectTo: 'https://evil.test/steal',
    });
    expect(response.status).toBe(403);
  });

  it('signs out without a request body', async () => {
    const cookie = await signUp('dana@example.test');
    const body = new ReadableStream({ start: (controller) => controller.close() });
    const response = await fetchApi('/api/auth/sign-out', {
      method: 'POST',
      headers: { origin: WEB_URL, cookie },
      body,
      duplex: 'half',
    } as RequestInit);
    expect(response.status).toBe(200);
    const session = await fetchApi('/api/auth/get-session', { headers: { cookie } });
    expect(await session.json()).toBeNull();
  });

  it('caps anonymous sign-ins per IP per hour', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const signIn = () => post('/api/auth/sign-in/anonymous');
    for (let i = 0; i < 10; i++) {
      vi.setSystemTime(Date.now() + 11_000);
      expect((await signIn()).status).toBe(200);
    }
    vi.setSystemTime(Date.now() + 11_000);
    expect((await signIn()).status).toBe(429);
  });

  it('sends reset emails in the background with a token valid for at most 30 minutes', async () => {
    await signUp('erin@example.test');
    let release = () => {};
    const send = vi.fn(() => new Promise<void>((resolve) => (release = resolve)));
    env.EMAIL = { send } as unknown as SendEmail;
    env.RESET_EMAIL_FROM = 'no-reply@game.test';
    const waitUntil = vi.fn();
    const ctx = { waitUntil, passThroughOnException: () => {} } as unknown as ExecutionContext;

    const response = await fetchApi(
      '/api/auth/request-password-reset',
      {
        method: 'POST',
        headers: { origin: WEB_URL, 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'erin@example.test' }),
      },
      ctx,
    );
    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
    expect(waitUntil).toHaveBeenCalledOnce();
    release();

    const row = await env.DB.prepare(
      "select expiresAt from verification where identifier like 'reset-password:%'",
    ).first<{
      expiresAt: string;
    }>();
    expect(new Date(row!.expiresAt).getTime() - Date.now()).toBeLessThanOrEqual(30 * 60_000);
  });
});

describe('response headers', () => {
  it('sends no-store and security headers on auth responses and Permissions-Policy on /api', async () => {
    const auth = await fetchApi('/api/auth/get-session');
    expect(auth.headers.get('cache-control')).toBe('no-store');
    expect(auth.headers.get('permissions-policy')).toContain('camera=()');
    expect((await fetchApi('/api/nope')).headers.get('permissions-policy')).toContain('camera=()');
  });

  it('sends security headers on a missing hashed asset', async () => {
    env.ASSETS = {
      fetch: async () => new Response('<!doctype html>', { headers: { 'Content-Type': 'text/html' } }),
    } as unknown as Fetcher;
    const response = await worker.fetch(new Request(`${WEB_URL}/assets/missing.js`), env);
    expect(response.status).toBe(404);
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('cache-control')).toBe('no-store');
  });
});

describe('health and errors', () => {
  it('answers the health check with a cheap query', async () => {
    const response = await fetchApi('/api/health');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it('answers 500 for bugs and 503 only for D1 errors, with structured logs', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(errorResponse(new TypeError('boom')).status).toBe(500);
    expect(errorResponse(new Error('D1_ERROR: too many requests')).status).toBe(503);
    expect(log).toHaveBeenCalledWith(expect.objectContaining({ name: 'TypeError', message: 'boom' }));
  });

  it('sends the seconds until UTC midnight on a daily-cap 429', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-17T23:59:00Z'));
    const response = errorResponse(new RequestError(429, 'Daily run limit reached'));
    expect(response.headers.get('Retry-After')).toBe('60');
    vi.setSystemTime(new Date('2026-11-17T12:00:00Z'));
    expect(errorResponse(new RequestError(429, 'Daily run limit reached')).headers.get('Retry-After')).toBe(
      String(12 * 3600),
    );
  });
});
