import { spawn, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const PORT = process.env['E2E_PORT'] ?? '8788';
const INSPECTOR_PORT = process.env['E2E_INSPECTOR_PORT'] ?? '9230';
const ROOT = resolve(import.meta.dirname, '../../..');
const API_DIR = join(ROOT, 'apps/api');
const DIST_INDEX = join(ROOT, 'apps/web/dist/index.html');
const PERSIST_DIR = resolve(process.env['E2E_PERSIST_DIR'] ?? join(tmpdir(), 'republica-e2e-d1'));
const DATABASE = 'republica-en-llamas';

function run(command: string, args: string[], cwd: string) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: true });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed`);
}

if (process.env['E2E_REBUILD'] === '1' || !existsSync(DIST_INDEX)) {
  run('npm', ['run', 'build', '--workspace=apps/web'], ROOT);
}

rmSync(PERSIST_DIR, { recursive: true, force: true });
run(
  'npx',
  ['wrangler', 'd1', 'migrations', 'apply', DATABASE, '--local', '--persist-to', `"${PERSIST_DIR}"`],
  API_DIR,
);

const server = spawn(
  'npx',
  [
    'wrangler',
    'dev',
    '--port',
    PORT,
    '--inspector-port',
    INSPECTOR_PORT,
    '--persist-to',
    `"${PERSIST_DIR}"`,
    '--var',
    `BETTER_AUTH_SECRET:${randomBytes(36).toString('base64url')}`,
    '--var',
    `WEB_URL:http://localhost:${PORT}`,
  ],
  { cwd: API_DIR, stdio: 'inherit', shell: true },
);

const stop = () => server.kill();
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
server.on('exit', (code) => process.exit(code ?? 0));
