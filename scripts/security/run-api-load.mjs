import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_API_URL, PROFILE_NAMES, apiProfileFor, assertLocalApiUrl } from './load-config.mjs';
import { runK6Profile } from './k6-runner.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const requested = process.argv.slice(2);
const extended = requested.includes('--extended');
const names = requested.filter((value) => value !== '--extended');
if (names.some((name) => !PROFILE_NAMES.includes(name))) {
  console.error(`Usage: node scripts/security/run-api-load.mjs [${PROFILE_NAMES.join('|')}] [--extended]`);
  process.exitCode = 1;
} else {
  const output = resolve(root, 'scripts/security/results');
  let child;
  let interrupted = false;
  const interrupt = () => {
    interrupted = true;
    child?.kill();
  };
  process.once('SIGINT', interrupt);
  process.once('SIGTERM', interrupt);
  try {
    const baseUrl = assertLocalApiUrl(process.env.API_LOAD_URL || DEFAULT_API_URL);
    await mkdir(output, { recursive: true });
    const summaries = [];
    for (const name of names.length ? names : PROFILE_NAMES) {
      if (interrupted) throw new Error('Load run interrupted');
      const profile = apiProfileFor(name, extended);
      const summary = await runK6Profile({
        script: 'scripts/security/api-load.k6.js',
        root,
        output,
        reportName: `api-${name}`,
        manifestData: { baseUrl, profile },
        profile,
        onChild: (spawned) => {
          child = spawned;
        },
      });
      if (
        summary.target !== baseUrl ||
        summary.profile.name !== name ||
        !summary.passed ||
        !(summary.k6.metrics.http_reqs.values.count > 0)
      )
        throw new Error(`k6 api-${name} returned an empty or failing report`);
      summaries.push({
        name,
        passed: summary.passed,
        requests: summary.k6.metrics.http_reqs.values.count,
        p95Ms: summary.k6.metrics.http_req_duration.values['p(95)'],
        rateLimited: summary.k6.metrics.api_rate_limited?.values.rate ?? 0,
        serverErrors: summary.k6.metrics.api_server_errors?.values.rate ?? 0,
      });
    }
    await writeFile(
      resolve(output, 'api-run-summary.json'),
      JSON.stringify(
        { scope: `Local Worker API at ${baseUrl}; not production or remote D1`, profiles: summaries },
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
    if (child && child.exitCode === null) child.kill();
  }
}
