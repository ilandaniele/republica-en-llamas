import { expect, test, type Page } from '@playwright/test';

const ROUTES = [
  { path: '/', title: /Inicio/ },
  { path: '/leaderboard', title: /Ranking/ },
  { path: '/login', title: /Iniciar sesión/ },
  { path: '/register', title: /Registro/ },
];

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function unnamedButtons(page: Page): Promise<string[]> {
  const buttons = await page.getByRole('button').all();
  const unnamed: string[] = [];
  for (const button of buttons) {
    if (!(await button.isVisible())) continue;
    const name = (await button.getAttribute('aria-label')) ?? (await button.textContent()) ?? '';
    if (!/[\p{L}\p{N}]/u.test(name)) unnamed.push(await button.evaluate((el) => el.outerHTML.slice(0, 120)));
  }
  return unnamed;
}

test('home loads without console errors', async ({ page }) => {
  const errors = collectConsoleErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Jugar como invitado' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  expect(errors).toEqual([]);
});

for (const route of ROUTES) {
  test(`a11y smoke ${route.path}: title, heading and named buttons`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page).toHaveTitle(route.title);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    expect(await unnamedButtons(page)).toEqual([]);
  });

  test(`a11y smoke ${route.path}: main landmark`, async ({ page }) => {
    test.fail(true, 'Known bug: route renders no <main> landmark');
    await page.goto(route.path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.getByRole('main').count()).toBe(1);
  });
}
