import { randomUUID } from 'node:crypto';
import { expect, type Page } from '@playwright/test';

export interface TestAccount {
  username: string;
  email: string;
  password: string;
}

export function newAccount(): TestAccount {
  const id = randomUUID().replace(/-/g, '').slice(0, 10);
  return { username: `e2e_${id}`, email: `e2e_${id}@example.test`, password: `pw-${randomUUID()}` };
}

export async function fillRegisterForm(page: Page, account: TestAccount) {
  await page.getByPlaceholder(/^Nombre de usuario/).fill(account.username);
  await page.getByPlaceholder('Email').fill(account.email);
  await page.getByPlaceholder(/^Contraseña/).fill(account.password);
  await submitPastRateLimit(page, 'Registrarse y jugar', '/api/auth/sign-up/email');
}

export async function logIn(page: Page, account: TestAccount) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(account.email);
  await page.getByLabel('Contraseña').fill(account.password);
  await submitPastRateLimit(page, 'Entrar y jugar', '/api/auth/sign-in/email');
  await expect(page).not.toHaveURL(/\/login$/);
}

const MAX_RATE_LIMITED_ATTEMPTS = 4;

async function submitPastRateLimit(page: Page, buttonName: string, endpoint: string) {
  for (let attempt = 1; attempt <= MAX_RATE_LIMITED_ATTEMPTS; attempt++) {
    const response = page.waitForResponse((r) => r.url().endsWith(endpoint));
    await page.getByRole('button', { name: buttonName }).click();
    const { status, headers } = await response.then((r) => ({ status: r.status(), headers: r.headers() }));
    if (status !== 429) return;
    await page.waitForTimeout(Number(headers['x-retry-after'] ?? headers['retry-after'] ?? 10) * 1_000);
  }
  throw new Error(`${endpoint} stayed rate limited after ${MAX_RATE_LIMITED_ATTEMPTS} attempts`);
}
