import { expect, test } from '@playwright/test';
import { fillRegisterForm, newAccount } from './support/accounts.js';
import { playUntilGameOver, startGuestRun } from './support/game.js';

test('guest plays a full run, signs up from the result screen and saves the score', async ({
  browser,
  page,
}) => {
  test.setTimeout(600_000);
  const account = newAccount();

  await startGuestRun(page);
  await playUntilGameOver(page);

  await expect(page).toHaveTitle(/Fin de la partida/);
  await expect(page.getByRole('button', { name: /Una más/i })).toBeVisible();
  await page.getByRole('button', { name: /Iniciá sesión para guardar/i }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByRole('button', { name: 'Crear cuenta →' }).click();
  await expect(page).toHaveURL(/\/register$/);
  await fillRegisterForm(page, account);
  await expect(page).toHaveURL(/\/gameover$/);

  const submit = page.waitForResponse((r) => r.url().endsWith('/api/submit-run'));
  await page.getByRole('button', { name: /💾 Guardar/i }).click();
  const response = await submit;
  expect(response.ok(), `submit-run status ${response.status()}`).toBe(true);
  await expect(page.getByRole('button', { name: /Guardado/i })).toBeVisible();

  const leaderboard = await page.request.get('/api/leaderboard');
  expect(leaderboard.ok()).toBe(true);
  expect(await leaderboard.text()).toContain(account.username);

  const freshContext = await browser.newContext();
  const viewer = await freshContext.newPage();
  await viewer.goto('/leaderboard');
  await expect(viewer.getByText(account.username)).toBeVisible();
  await freshContext.close();
});
