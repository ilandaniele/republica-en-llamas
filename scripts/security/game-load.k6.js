import http from 'k6/http';
import { check, sleep, fail } from 'k6';
import exec from 'k6/execution';
import { Counter, Trend } from 'k6/metrics';
import { summarize } from './k6-summary.js';

const manifest = JSON.parse(open(__ENV.LOAD_MANIFEST));
if (!/^http:\/\/127\.0\.0\.1:\d+$/.test(manifest.baseUrl))
  throw new Error('Load tests only permit a runner-owned IPv4 loopback server');
if (!Array.isArray(manifest.targets) || manifest.targets.length === 0)
  throw new Error('Missing discovered build targets');
for (const path of manifest.targets)
  if (!/^\/(assets|fonts|illustrations)\/[a-zA-Z0-9_./-]+$/.test(path) && path !== '/favicon.svg')
    throw new Error(`Unexpected target path: ${path}`);

const profile = manifest.profile;
const isBurst = profile.name === 'peak' || profile.name === 'spike';
const recovery = new Trend('peak_recovery_ms', true);
const recoverySamples = new Counter('peak_recovery_samples');
const earlySoak = new Trend('soak_early_ms', true);
const lateSoak = new Trend('soak_late_ms', true);
const lateSoakSamples = new Counter('soak_late_samples');
const stressStages = new Trend('stress_stage_ms', true);
const stressSamples = new Counter('stress_stage_samples');

export const options = {
  scenarios: {
    game: {
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
    checks: ['rate==1'],
    http_reqs: ['count>0'],
    ...(isBurst ? { peak_recovery_ms: ['p(95)<500'], peak_recovery_samples: ['count>0'] } : {}),
    ...(profile.name === 'soak' ? { soak_late_ms: ['p(95)<500'], soak_late_samples: ['count>0'] } : {}),
    ...(profile.name === 'stress'
      ? Object.fromEntries(
          profile.stages.flatMap((item, stage) =>
            item.target > 0
              ? [
                  [`stress_stage_ms{stage:${stage}}`, ['p(95)<1500']],
                  [`stress_stage_samples{stage:${stage}}`, ['count>0']],
                ]
              : [],
          ),
        )
      : {}),
  },
  summaryTrendStats: ['min', 'med', 'avg', 'max', 'p(95)', 'p(99)'],
  maxRedirects: 0,
  setupTimeout: '10s',
  discardResponseBodies: true,
};

function get(path, body = false) {
  return http.get(`${manifest.baseUrl}${path}`, {
    redirects: 0,
    timeout: '3s',
    responseType: body ? 'text' : 'none',
    tags: {
      resource: path.startsWith('/illustrations/') ? 'illustration' : path === '/' ? 'html' : 'build-asset',
    },
  });
}

export function setup() {
  const root = get('/', true);
  if (root.status !== 200 || !root.body.includes('id="root"')) fail('Game build root is unavailable');
  for (const target of manifest.targets) {
    const response = http.head(`${manifest.baseUrl}${target}`, { redirects: 0, timeout: '3s' });
    if (response.status !== 200 || Number(response.headers['Content-Length']) <= 0)
      fail(`Discovered asset unavailable: ${target}`);
  }
}

export default function () {
  if (__ITER === 0) {
    const root = get('/', true);
    check(root, {
      'game HTML, not an error or login page': (response) =>
        response.status === 200 && response.body.includes('id="root"'),
    });
  }
  const path = manifest.targets[(__VU + __ITER) % manifest.targets.length];
  const response = get(path);
  check(response, {
    'real asset returns 200': (item) => item.status === 200,
    'asset has nonempty content': (item) => Number(item.headers['Content-Length']) > 0,
    'asset is not SPA fallback HTML': (item) => !String(item.headers['Content-Type']).includes('text/html'),
  });
  const elapsed = (Date.now() - exec.scenario.startTime) / 1000;
  if (isBurst && elapsed >= profile.durationSeconds * 0.67) {
    recovery.add(response.timings.duration);
    recoverySamples.add(1);
  }
  if (profile.name === 'soak') {
    (elapsed < profile.durationSeconds / 2 ? earlySoak : lateSoak).add(response.timings.duration);
    if (elapsed >= profile.durationSeconds / 2) lateSoakSamples.add(1);
  }
  if (profile.name === 'stress') {
    let passed = 0;
    const stage = profile.stages.findIndex((item) => {
      passed += Number.parseInt(item.duration);
      return elapsed < passed;
    });
    stressStages.add(response.timings.duration, { stage: String(stage) });
    stressSamples.add(1, { stage: String(stage) });
  }
  sleep(profile.thinkSeconds);
}

export function handleSummary(data) {
  return summarize(data, {
    name: profile.name,
    profile,
    scope:
      'Read-only build files served by a local Node server, not nginx, browser execution, the Cloudflare Worker or D1 capacity',
    target: manifest.baseUrl,
    details: { targets: manifest.targets },
  });
}
