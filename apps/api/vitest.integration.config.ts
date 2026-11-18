import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-pool-workers';
import { defineConfig } from 'vitest/config';

// The pool bundles an older workerd than wrangler; it rejects wrangler.jsonc's newer compatibility_date.
const POOL_WORKERD_COMPATIBILITY_DATE = '2026-08-22';
const migrationsPath = fileURLToPath(new URL('./migrations', import.meta.url));

export default defineConfig(async () => ({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.jsonc' },
      miniflare: {
        compatibilityDate: POOL_WORKERD_COMPATIBILITY_DATE,
        bindings: {
          WEB_URL: 'https://game.test',
          BETTER_AUTH_SECRET: randomBytes(32).toString('hex'),
          TEST_MIGRATIONS: await readD1Migrations(migrationsPath),
        },
      },
    }),
  ],
  test: {
    include: ['src/__integration__/**/*.integration.ts'],
    setupFiles: ['src/__integration__/setup.ts'],
  },
}));
