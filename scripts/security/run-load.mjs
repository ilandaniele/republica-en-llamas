import { spawn } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROFILE_NAMES, discoverTargets, profileFor } from './load-config.mjs';
import { listenLocal } from './static-server.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const requested = process.argv.slice(2);
const extended = requested.includes('--extended');
const names = requested.filter((value) => value !== '--extended');
if (names.some((name) => !PROFILE_NAMES.includes(name))) {
  console.error(`Usage: node scripts/security/run-load.mjs [${PROFILE_NAMES.join('|')}] [--extended]`);
  process.exitCode = 1;
} else {
  const output = resolve(root, 'scripts/security/results');
  const distribution = resolve(root, 'apps/web/dist');
  let server;
  let memoryTimer;
  let child;
  let interrupted = false;
  const interrupt = () => {
    interrupted = true;
    child?.kill();
  };
  process.once('SIGINT', interrupt);
  process.once('SIGTERM', interrupt);
  try {
    const targets = await discoverTargets(distribution);
    await mkdir(output, { recursive: true });
    const started = await listenLocal(distribution);
    server = started.server;
    const samples = [];
    memoryTimer = setInterval(
      () => samples.push({ elapsedSeconds: process.uptime(), ...process.memoryUsage() }),
      250,
    );
    const selected = names.length ? names : PROFILE_NAMES;
    const summaries = [];
    for (const name of selected) {
      if (interrupted) throw new Error('Load run interrupted');
      const profile = profileFor(name, extended);
      const manifest = resolve(output, `${name}-manifest.json`);
      await writeFile(manifest, JSON.stringify({ baseUrl: started.baseUrl, targets, profile }, null, 2));
      await rm(resolve(output, `${name}.json`), { force: true });
      await rm(resolve(output, `${name}.html`), { force: true });
      console.log(
        `Running ${name}, ${profile.mode}, max ${profile.maxVus} VUs, ${profile.durationSeconds}s, loopback only.`,
      );
      const code = await new Promise((accept, reject) => {
        child = spawn(
          process.env.K6_BINARY || 'k6',
          ['run', '--quiet', '--address=127.0.0.1:0', resolve(root, 'scripts/security/game-load.k6.js')],
          {
            cwd: root,
            windowsHide: true,
            stdio: 'inherit',
            env: {
              ...process.env,
              K6_NO_USAGE_REPORT: 'true',
              LOAD_MANIFEST: manifest,
              LOAD_OUTPUT: output.replaceAll('\\', '/'),
            },
          },
        );
        const timeout = setTimeout(
          () => {
            child.kill();
            reject(new Error(`k6 ${name} exceeded its execution deadline`));
          },
          (profile.durationSeconds + 30) * 1000,
        );
        child.once('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
        child.once('exit', (exitCode, signal) => {
          clearTimeout(timeout);
          if (signal) reject(new Error(`k6 ${name} interrupted (${signal})`));
          else accept(exitCode);
        });
      });
      if (code !== 0) throw new Error(`k6 ${name} failed with exit code ${code}`);
      const summary = JSON.parse(await readFile(resolve(output, `${name}.json`), 'utf8'));
      if (
        summary.target !== started.baseUrl ||
        summary.profile.name !== name ||
        !summary.passed ||
        !(summary.k6.metrics.http_reqs.values.count > 0)
      )
        throw new Error(`k6 ${name} returned an empty or failing report`);
      summaries.push({
        name,
        passed: summary.passed,
        requests: summary.k6.metrics.http_reqs.values.count,
        p95Ms: summary.k6.metrics.http_req_duration.values['p(95)'],
      });
    }
    await writeFile(
      resolve(output, 'run-summary.json'),
      JSON.stringify(
        {
          scope: 'Local Node static server + built files; not browser, nginx or Supabase',
          profiles: summaries,
          serverMemory: {
            source: 'process.memoryUsage() of Node test static server and orchestrator only',
            samples,
            peakRssBytes: Math.max(...samples.map((sample) => sample.rss), 0),
          },
        },
        null,
        2,
      ),
    );
    console.log(`Load reports: ${output}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    process.removeListener('SIGINT', interrupt);
    process.removeListener('SIGTERM', interrupt);
    clearInterval(memoryTimer);
    if (child && child.exitCode === null) child.kill();
    if (server) {
      server.closeAllConnections();
      await new Promise((accept) => server.close(accept));
    }
  }
}
