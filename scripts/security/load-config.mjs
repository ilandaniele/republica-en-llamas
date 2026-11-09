import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative, isAbsolute } from 'node:path';

export const PROFILE_NAMES = ['smoke', 'load', 'peak', 'stress', 'spike', 'soak'];

export function profileFor(name, full = false) {
  if (!PROFILE_NAMES.includes(name)) throw new Error(`Unknown load profile: ${name}`);
  const second = full ? 30 : 1;
  const stage = (duration, target) => ({ duration: `${duration * second}s`, target });
  const stages = {
    smoke: [stage(full ? 1 : 2, 1)],
    load: [stage(1, 4), stage(3, 4), stage(1, 0)],
    peak: [stage(1, 2), stage(1, 12), stage(2, 12), stage(2, 2)],
    spike: [stage(1, 1), stage(1, 24), stage(1, 24), stage(1, 1), stage(1, 1)],
    stress: [stage(1, 4), stage(1, 12), stage(1, 24), stage(2, 24), stage(1, 0)],
    soak: [stage(full ? 240 : 8, 4)],
  }[name];
  return {
    name,
    mode: full ? 'extended' : 'local-short',
    stages,
    durationSeconds: stages.reduce((sum, item) => sum + Number.parseInt(item.duration), 0),
    maxVus: Math.max(...stages.map((item) => item.target)),
    p95: name === 'stress' ? 1500 : 500,
    p99: name === 'stress' ? 3000 : 1500,
    failureRate: 0.01,
    thinkSeconds: full ? 1 : 0.2,
  };
}

export function insideRoot(root, file) {
  const path = relative(root, file);
  return (
    path !== '..' && !path.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) && !isAbsolute(path)
  );
}

export async function discoverTargets(root) {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');
  if (!html.includes('id="root"')) throw new Error('Build HTML does not contain the game root');
  const urls = [...html.matchAll(/(?:src|href)="(\/[^"?#]+)"/g)].map((match) => match[1]);
  const illustrations = (await readdir(resolve(root, 'illustrations')))
    .filter((name) => name.endsWith('.webp'))
    .sort()
    .slice(0, 2)
    .map((name) => `/illustrations/${name}`);
  const targets = [...new Set([...urls, ...illustrations])];
  if (!targets.some((url) => url.startsWith('/assets/') && url.endsWith('.js')))
    throw new Error('Build has no JavaScript entry asset');
  for (const url of targets) {
    const file = resolve(root, `.${url}`);
    if (!insideRoot(root, file) || !(await stat(file)).isFile())
      throw new Error(`Missing build target: ${url}`);
  }
  return targets;
}
