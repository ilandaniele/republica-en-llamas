import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiProfileFor, insideRoot, profileFor } from './load-config.mjs';

const binary = process.env.K6_BINARY || 'k6';
const available = spawnSync(binary, ['version'], { windowsHide: true }).status === 0;
const scripts = dirname(fileURLToPath(import.meta.url));
const script = resolve(scripts, 'game-load.k6.js');
const apiScript = resolve(scripts, 'api-load.k6.js');
let folder;
before(async () => {
  folder = await mkdtemp(resolve(tmpdir(), 'republica-k6-'));
});
after(async () => {
  assert.equal(insideRoot(resolve(tmpdir()), folder), true);
  assert.match(folder, /republica-k6-[^\\/]+$/);
  await rm(folder, { recursive: true, force: true });
});

async function run(manifest, target = script) {
  const file = resolve(folder, 'manifest.json');
  await writeFile(file, JSON.stringify(manifest));
  return new Promise((accept, reject) => {
    const child = spawn(binary, ['run', '--quiet', '--address=127.0.0.1:0', target], {
      windowsHide: true,
      stdio: 'ignore',
      env: {
        ...process.env,
        K6_NO_USAGE_REPORT: 'true',
        LOAD_MANIFEST: file,
        LOAD_OUTPUT: folder.replaceAll('\\', '/'),
      },
    });
    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error('k6 guard test exceeded 10s'));
    }, 10000);
    child.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once('exit', (code) => {
      clearTimeout(timeout);
      accept(code);
    });
  });
}

test(
  'k6 refuses a non-loopback target before issuing requests',
  { skip: !available && 'k6 not installed' },
  async () => {
    assert.notEqual(
      await run({
        baseUrl: 'https://example.invalid',
        targets: ['/assets/main.js'],
        profile: profileFor('smoke'),
      }),
      0,
    );
  },
);

test('k6 refuses invented API endpoints', { skip: !available && 'k6 not installed' }, async () => {
  assert.notEqual(
    await run({ baseUrl: 'http://127.0.0.1:1', targets: ['/api/products'], profile: profileFor('smoke') }),
    0,
  );
});

test(
  'a successful HTML fallback for an asset produces a failed k6 run and report',
  { skip: !available && 'k6 not installed' },
  async () => {
    const server = createServer((_request, response) => {
      const html = '<div id="root">fallback</div>';
      response.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': Buffer.byteLength(html) });
      response.end(html);
    });
    await new Promise((accept) => server.listen(0, '127.0.0.1', accept));
    try {
      const profile = { ...profileFor('smoke'), durationSeconds: 1, stages: [{ duration: '1s', target: 1 }] };
      const code = await run({
        baseUrl: `http://127.0.0.1:${server.address().port}`,
        targets: ['/assets/main.js'],
        profile,
      });
      assert.equal(code, 99);
      const report = JSON.parse(await readFile(resolve(folder, 'smoke.json'), 'utf8'));
      assert.equal(report.passed, false);
      assert.ok(report.thresholds.some((threshold) => threshold.name === 'checks' && !threshold.ok));
    } finally {
      server.closeAllConnections();
      await new Promise((accept) => server.close(accept));
    }
  },
);

async function withApiServer(handler, body) {
  const server = createServer(handler);
  await new Promise((accept) => server.listen(0, '127.0.0.1', accept));
  try {
    await body(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.closeAllConnections();
    await new Promise((accept) => server.close(accept));
  }
}

function reply(response, status, body = {}, headers = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  response.end(JSON.stringify(body));
}

const apiSmoke = () => ({
  ...apiProfileFor('smoke'),
  durationSeconds: 1,
  stages: [{ duration: '1s', target: 1 }],
});

test(
  'api k6 refuses non-loopback targets before issuing requests',
  { skip: !available && 'k6 not installed' },
  async () => {
    for (const baseUrl of [
      'https://example.invalid',
      'http://example.com:8787',
      'http://localhost.example.com:8787',
      'https://localhost:8787',
    ])
      assert.notEqual(await run({ baseUrl, profile: apiSmoke() }, apiScript), 0, baseUrl);
  },
);

test(
  'api k6 treats 429 from rate limiting as expected, not as a failure',
  { skip: !available && 'k6 not installed' },
  async () => {
    await withApiServer(
      (request, response) => {
        if (request.url.startsWith('/api/leaderboard')) return reply(response, 200, []);
        if (request.url === '/api/auth/sign-in/anonymous') return reply(response, 200, { token: 'guest' });
        return reply(response, 429, { error: 'Too many requests' }, { 'Retry-After': '60' });
      },
      async (baseUrl) => {
        assert.equal(await run({ baseUrl, profile: apiSmoke() }, apiScript), 0);
        const report = JSON.parse(await readFile(resolve(folder, 'api-smoke.json'), 'utf8'));
        assert.equal(report.passed, true);
        assert.ok(report.k6.metrics.api_rate_limited.values.rate > 0);
        assert.equal(report.k6.metrics.api_server_errors.values.rate, 0);
      },
    );
  },
);

test(
  'api k6 fails the run when the Worker answers 5xx',
  { skip: !available && 'k6 not installed' },
  async () => {
    let served = 0;
    await withApiServer(
      (_request, response) =>
        reply(response, served++ === 0 ? 200 : 503, served === 1 ? [] : { error: 'Service unavailable' }),
      async (baseUrl) => {
        assert.equal(await run({ baseUrl, profile: apiSmoke() }, apiScript), 99);
        const report = JSON.parse(await readFile(resolve(folder, 'api-smoke.json'), 'utf8'));
        assert.equal(report.passed, false);
        assert.ok(
          report.thresholds.some((threshold) => threshold.name === 'api_server_errors' && !threshold.ok),
        );
      },
    );
  },
);
