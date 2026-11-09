import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { PROFILE_NAMES, discoverTargets, insideRoot, profileFor } from './load-config.mjs';
import { listenLocal } from './static-server.mjs';

let root;
let server;
let baseUrl;
before(async () => {
  root = await mkdtemp(resolve(tmpdir(), 'republica-load-'));
  await mkdir(resolve(root, 'assets'));
  await mkdir(resolve(root, 'illustrations'));
  await writeFile(
    resolve(root, 'index.html'),
    '<div id="root"></div><script src="/assets/main.js"></script>',
  );
  await writeFile(resolve(root, 'assets/main.js'), 'console.log("test fixture");');
  await writeFile(resolve(root, 'illustrations/local.webp'), 'test image fixture');
  ({ server, baseUrl } = await listenLocal(root));
});
after(async () => {
  if (server) {
    server.closeAllConnections();
    await new Promise((accept) => server.close(accept));
  }
  if (root) {
    assert.equal(insideRoot(resolve(tmpdir()), root), true);
    assert.match(root, /republica-load-[^\\/]+$/);
    await rm(root, { recursive: true, force: true });
  }
});

test('discovers existing build assets instead of inventing API endpoints', async () => {
  assert.deepEqual(await discoverTargets(root), ['/assets/main.js', '/illustrations/local.webp']);
});

test('fails preflight when a referenced asset is missing', async () => {
  await writeFile(
    resolve(root, 'index.html'),
    '<div id="root"></div><script src="/assets/absent.js"></script>',
  );
  await assert.rejects(discoverTargets(root));
  await writeFile(
    resolve(root, 'index.html'),
    '<div id="root"></div><script src="/assets/main.js"></script>',
  );
});

test('keeps distinct profile workloads and bounded loopback load', () => {
  const profiles = PROFILE_NAMES.map((name) => profileFor(name));
  assert.equal(new Set(profiles.map((profile) => JSON.stringify(profile.stages))).size, profiles.length);
  assert.ok(profiles.every((profile) => profile.maxVus <= 24));
  assert.ok(profileFor('soak', true).durationSeconds > profileFor('stress', true).durationSeconds);
  assert.throws(() => profileFor('production'));
});

test('static fixture serves real content and rejects mutations', async () => {
  const response = await fetch(`${baseUrl}/assets/main.js`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /javascript/);
  assert.equal(await response.text(), 'console.log("test fixture");');
  assert.equal((await fetch(baseUrl, { method: 'POST', body: 'do not write' })).status, 405);
});

test('missing assets never receive a successful SPA HTML fallback', async () => {
  assert.equal((await fetch(`${baseUrl}/assets/missing.js`)).status, 404);
});

test('path containment rejects files outside build root', () => {
  assert.equal(insideRoot(root, resolve(root, '../secret')), false);
  assert.equal(insideRoot(root, resolve(root, 'assets/main.js')), true);
});
