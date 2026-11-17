import { expect, test } from '@playwright/test';

test('moves between home, leaderboard and login with in-app and browser back', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Inicio/);

  await page.getByRole('button', { name: 'Tabla de Líderes' }).click();
  await expect(page).toHaveURL(/\/leaderboard$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Tabla de Líderes' })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);

  await page.getByRole('button', { name: 'Tabla de Líderes' }).click();
  await page.getByRole('button', { name: /Volver/ }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.getByRole('button', { name: 'Iniciar sesión' }).first().click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole('button', { name: 'Crear cuenta →' }).click();
  await expect(page).toHaveURL(/\/register$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/login$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('leaderboard shows the empty state or entries without errors', async ({ page }) => {
  const response = page.waitForResponse((r) => r.url().includes('/api/leaderboard'));
  await page.goto('/leaderboard');
  expect((await response).ok()).toBe(true);
  await expect(page).toHaveTitle(/Ranking/);
  await page
    .getByRole('button', { name: /^Difícil/ })
    .first()
    .click();
  await expect(page.getByRole('heading', { level: 1, name: 'Tabla de Líderes' })).toBeVisible();
});
