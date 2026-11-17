import { executionContext, getAuth } from './auth.js';
import { cleanupStaleRows } from './cleanup.js';
import type { RouteContext } from './context.js';
import type { Env } from './env.js';
import {
  allowedOrigins,
  assertAllowedOrigin,
  checkContentLength,
  errorResponse,
  json,
  withLimitedBody,
  withSecurityHeaders,
} from './http.js';
import { enforceIpRateLimit } from './rateLimit.js';
import { leaderboard } from './routes/leaderboard.js';
import { createCheckout, stripeWebhook } from './routes/payments.js';
import { getEntitlements, getProfile, updateProfile, usernameAvailable } from './routes/profile.js';
import { listRuns, startRun, submitRun } from './routes/runs.js';

interface Route {
  handler: (ctx: RouteContext) => Promise<Response>;
  maxBytes?: number;
  ipLimited?: boolean;
}

const DEFAULT_MAX_BYTES = 4096;

const ROUTES: Record<string, Route> = {
  'POST /api/start-run': { handler: startRun, ipLimited: true },
  'POST /api/submit-run': { handler: submitRun, maxBytes: 262_144, ipLimited: true },
  'POST /api/create-checkout': { handler: createCheckout, ipLimited: true },
  'POST /api/stripe-webhook': { handler: stripeWebhook, maxBytes: 262_144 },
  'GET /api/leaderboard': { handler: leaderboard, ipLimited: true },
  'GET /api/username-available': { handler: usernameAvailable, ipLimited: true },
  'GET /api/profile': { handler: getProfile, ipLimited: true },
  'PATCH /api/profile': { handler: updateProfile, ipLimited: true },
  'GET /api/runs': { handler: listRuns, ipLimited: true },
  'GET /api/entitlements': { handler: getEntitlements, ipLimited: true },
  'GET /api/health': { handler: health },
};

const MAX_AUTH_PATH_LENGTH = 64;

async function health(ctx: RouteContext): Promise<Response> {
  await ctx.env.DB.prepare('select 1').first();
  return json({ ok: true });
}

function assertAllowedWriteOrigin(request: Request, env: Env): void {
  if (request.method !== 'GET')
    assertAllowedOrigin(request, allowedOrigins(env.WEB_URL, env.ALLOWED_ORIGINS));
}

async function handleAuth(request: Request, env: Env, url: URL): Promise<Response> {
  if (url.pathname.length > MAX_AUTH_PATH_LENGTH) return json({ error: 'Not found' }, 404);
  assertAllowedWriteOrigin(request, env);
  await enforceIpRateLimit(env.DB, request, 'auth');
  const auth = getAuth(env);
  return withSecurityHeaders(await auth.handler(await withLimitedBody(request, DEFAULT_MAX_BYTES)));
}

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  try {
    if (url.pathname.startsWith('/api/auth/')) return await handleAuth(request, env, url);

    const route = ROUTES[`${request.method} ${url.pathname}`];
    if (!route) return json({ error: 'Not found' }, 404);
    if (request.method !== 'GET') {
      assertAllowedWriteOrigin(request, env);
      checkContentLength(request, route.maxBytes ?? DEFAULT_MAX_BYTES);
    }
    if (route.ipLimited) await enforceIpRateLimit(env.DB, request, url.pathname);
    return await route.handler({
      env,
      request,
      url,
      get auth() {
        return getAuth(env);
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

async function serveHashedAsset(request: Request, env: Env): Promise<Response> {
  const response = await env.ASSETS.fetch(request);
  const isSpaShell = response.headers.get('Content-Type')?.startsWith('text/html') ?? false;
  return isSpaShell ? withSecurityHeaders(new Response('Not found', { status: 404 })) : response;
}

export default {
  async fetch(request: Request, env: Env, ctx?: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/'))
      return executionContext.run(ctx, () => handleApi(request, env, url));
    if (url.pathname.startsWith('/assets/')) return serveHashedAsset(request, env);
    return env.ASSETS.fetch(request);
  },
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(cleanupStaleRows(env.DB));
  },
} satisfies ExportedHandler<Env>;
