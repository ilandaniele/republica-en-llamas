import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { insideRoot, profileFor } from './load-config.mjs';

const binary = process.env.K6_BINARY || 'k6';
const available = spawnSync(binary, ['version'], { windowsHide: true }).status === 0;
const script = resolve(dirname(fileURLToPath(import.meta.url)), 'game-load.k6.js');
let folder;
before(async () => {
  folder = await mkdtemp(resolve(tmpdir(), 'republica-k6-'));
});
after(async () => {
  assert.equal(insideRoot(resolve(tmpdir()), folder), true);
  assert.match(folder, /republica-k6-[^\\/]+$/);
  await rm(folder, { recursive: true, force: true });
});

async function run(manifest) {
  const file = resolve(folder, 'manifest.json');
  await writeFile(file, JSON.stringify(manifest));
  return new Promise((accept, reject) => {
    const child = spawn(binary, ['run', '--quiet', '--address=127.0.0.1:0', script], {
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
