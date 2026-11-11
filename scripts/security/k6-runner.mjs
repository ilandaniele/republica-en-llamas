import { spawn } from 'node:child_process';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export async function runK6Profile({ script, root, output, reportName, manifestData, profile, onChild }) {
  const manifest = resolve(output, `${reportName}-manifest.json`);
  await writeFile(manifest, JSON.stringify(manifestData, null, 2));
  await rm(resolve(output, `${reportName}.json`), { force: true });
  await rm(resolve(output, `${reportName}.html`), { force: true });
  console.log(
    `Running ${reportName}, ${profile.mode}, max ${profile.maxVus} VUs, ${profile.durationSeconds}s, loopback only.`,
  );
  const code = await new Promise((accept, reject) => {
    const child = spawn(
      process.env.K6_BINARY || 'k6',
      ['run', '--quiet', '--address=127.0.0.1:0', resolve(root, script)],
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
    onChild(child);
    const timeout = setTimeout(
      () => {
        child.kill();
        reject(new Error(`k6 ${reportName} exceeded its execution deadline`));
      },
      (profile.durationSeconds + 30) * 1000,
    );
    child.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once('exit', (exitCode, signal) => {
      clearTimeout(timeout);
      if (signal) reject(new Error(`k6 ${reportName} interrupted (${signal})`));
      else accept(exitCode);
    });
  });
  if (code !== 0) throw new Error(`k6 ${reportName} failed with exit code ${code}`);
  return JSON.parse(await readFile(resolve(output, `${reportName}.json`), 'utf8'));
}
