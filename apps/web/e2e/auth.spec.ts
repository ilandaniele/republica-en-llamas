import { expect, test } from '@playwright/test';
import { fillRegisterForm, logIn, newAccount } from './support/accounts.js';

test('registers, logs out, logs back in and renames the profile', async ({ page }) => {
  const account = newAccount();
  const renamed = `${account.username}_x`.slice(0, 20);

  await page.goto('/register');
  await expect(page).toHaveTitle(/Registro/);
  await fillRegisterForm(page, account);
  await expect(page).toHaveURL(/\/president$/);

  await page.goto('/');
  const accountMenu = page.locator('.account-menu');
  await accountMenu.getByRole('button', { name: new RegExp(account.username) }).click();
  await accountMenu.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(page.getByRole('button', { name: 'Iniciar sesión' }).first()).toBeVisible();

  await logIn(page, account);
  await page.goto('/');
  await accountMenu.getByRole('button', { name: new RegExp(account.username) }).click();
  await accountMenu.getByRole('button', { name: /Mi Perfil/ }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByRole('heading', { name: account.username })).toBeVisible();

  await page.getByRole('button', { name: 'Editar nombre de usuario' }).click();
  await page.getByRole('textbox', { name: 'Nombre de usuario' }).fill(renamed);
  const update = page.waitForResponse(
    (r) => r.request().method() !== 'GET' && /profile|username/.test(r.url()),
  );
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  expect((await update).ok()).toBe(true);
  await expect(page.getByRole('heading', { name: renamed })).toBeVisible();
});

test('rejects a wrong password', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(newAccount().email);
  await page.getByLabel('Contraseña').fill('wrong-password-123');
  await page.getByRole('button', { name: 'Entrar y jugar' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});
