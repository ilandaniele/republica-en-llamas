import { createAuth } from './auth.js';
import type { RouteContext } from './context.js';
import type { Env } from './env.js';
import { allowedOrigins, assertAllowedOrigin, checkContentLength, errorResponse, json } from './http.js';
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
  'GET /api/leaderboard': { handler: leaderboard },
  'GET /api/username-available': { handler: usernameAvailable },
  'GET /api/profile': { handler: getProfile },
  'PATCH /api/profile': { handler: updateProfile },
  'GET /api/runs': { handler: listRuns },
  'GET /api/entitlements': { handler: getEntitlements },
};

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  try {
    const auth = createAuth(env);
    if (url.pathname.startsWith('/api/auth/')) return await auth.handler(request);

    const route = ROUTES[`${request.method} ${url.pathname}`];
    if (!route) return json({ error: 'Not found' }, 404);
    if (request.method !== 'GET') {
      assertAllowedOrigin(request, allowedOrigins(env.WEB_URL, env.ALLOWED_ORIGINS));
      checkContentLength(request, route.maxBytes ?? DEFAULT_MAX_BYTES);
    }
    if (route.ipLimited) await enforceIpRateLimit(env.DB, request, url.pathname);
    return await route.handler({ env, request, url, auth });
  } catch (error) {
    return errorResponse(error);
  }
}

async function serveHashedAsset(request: Request, env: Env): Promise<Response> {
  const response = await env.ASSETS.fetch(request);
  const isSpaShell = response.headers.get('Content-Type')?.startsWith('text/html') ?? false;
  return isSpaShell ? new Response('Not found', { status: 404 }) : response;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) return handleApi(request, env, url);
    if (url.pathname.startsWith('/assets/')) return serveHashedAsset(request, env);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
