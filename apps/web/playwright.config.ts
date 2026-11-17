import { defineConfig, devices } from '@playwright/test';

const PORT = process.env['E2E_PORT'] ?? '8788';
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 1 : 0,
  workers: 2,
  reporter: [['list'], ['html', { outputFolder: './playwright-report', open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    locale: 'es-AR',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'msedge' } },
  ],
  webServer: {
    command: 'node e2e/server.ts',
    url: `${BASE_URL}/api/health`,
    reuseExistingServer: !process.env['CI'],
    timeout: 240_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
