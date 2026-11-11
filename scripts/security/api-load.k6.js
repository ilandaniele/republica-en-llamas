import http from 'k6/http';
import { check, sleep, fail } from 'k6';
import { Rate } from 'k6/metrics';
import { summarize } from './k6-summary.js';

const manifest = JSON.parse(open(__ENV.LOAD_MANIFEST));
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(manifest.baseUrl))
  throw new Error('API load tests only permit http://localhost:<port> or http://127.0.0.1:<port>');

const profile = manifest.profile;
const LEADERBOARD_PATHS = ['', 'easy', 'normal', 'hard', 'crisis'].map((difficulty) =>
  difficulty ? `/api/leaderboard?difficulty=${difficulty}` : '/api/leaderboard',
);
const FLOW_EVERY = 5;
const rateLimited = new Rate('api_rate_limited');
const serverErrors = new Rate('api_server_errors');

http.setResponseCallback(http.expectedStatuses({ min: 200, max: 399 }, 429));

export const options = {
  scenarios: {
    api: {
      executor: 'ramping-vus',
      startVUs: profile.name === 'soak' ? 4 : 1,
      stages: profile.stages,
      gracefulRampDown: '2s',
      gracefulStop: '2s',
    },
  },
  thresholds: {
    http_req_failed: [`rate<${profile.failureRate}`],
    http_req_duration: [`p(95)<${profile.p95}`, `p(99)<${profile.p99}`],
    api_server_errors: [`rate<${profile.serverErrorRate}`],
    checks: ['rate==1'],
    http_reqs: ['count>0'],
  },
  summaryTrendStats: ['min', 'med', 'avg', 'max', 'p(95)', 'p(99)'],
  maxRedirects: 0,
  noCookiesReset: true,
  setupTimeout: '10s',
};

const headers = { Origin: manifest.baseUrl, 'Content-Type': 'application/json' };
let signedIn = false;

function request(method, path, endpoint, body = null) {
  const response = http.request(method, `${manifest.baseUrl}${path}`, body, {
    headers,
    redirects: 0,
    timeout: '3s',
    tags: { endpoint },
  });
  rateLimited.add(response.status === 429);
  serverErrors.add(response.status === 0 || response.status >= 500);
  return response;
}

export function setup() {
  const response = http.get(`${manifest.baseUrl}/api/leaderboard`, { headers, redirects: 0, timeout: '3s' });
  if (response.status !== 200) fail(`Worker API is unavailable at ${manifest.baseUrl} (${response.status})`);
}

function leaderboard() {
  const response = request(
    'GET',
    LEADERBOARD_PATHS[(__VU + __ITER) % LEADERBOARD_PATHS.length],
    'leaderboard',
  );
  check(response, {
    'leaderboard returns 200 or is rate limited': (item) => item.status === 200 || item.status === 429,
    'leaderboard returns a JSON array': (item) =>
      item.status === 429 ||
      (String(item.headers['Content-Type']).includes('application/json') &&
        String(item.body).startsWith('[')),
  });
}

function guestFlow() {
  if (!signedIn) {
    const response = request('POST', '/api/auth/sign-in/anonymous', 'sign-in', '{}');
    check(response, {
      'anonymous sign-in succeeds or is rate limited': (item) => item.status === 200 || item.status === 429,
    });
    signedIn = response.status === 200;
  }
  if (!signedIn) return;
  const response = request('POST', '/api/start-run', 'start-run', '{}');
  check(response, {
    'start-run issues a ticket or is rate limited': (item) =>
      item.status === 429 || (item.status === 200 && String(item.body).includes('"ticketId"')),
  });
}

export default function () {
  if (__ITER % FLOW_EVERY === 0) guestFlow();
  else leaderboard();
  sleep(profile.thinkSeconds);
}

export function handleSummary(data) {
  return summarize(data, {
    name: `api-${profile.name}`,
    profile,
    scope:
      'Worker API on a local wrangler dev server (miniflare D1): leaderboard reads plus guest sign-in and start-run; not production, remote D1 or Cloudflare edge limits',
    target: manifest.baseUrl,
  });
}
