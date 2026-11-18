import { expect, type Page } from '@playwright/test';

const PROGRESS_BUTTONS = [
  /^Siguiente/i,
  /^Comenzar/i,
  /^Continuar ▶/i,
  /^Confirmar turno/i,
  /^Afrontar la Crisis/i,
  /Llamar a votar/i,
  /^Completar recuento/i,
  /^Continuar con el gobierno/i,
  /^Ver resultado completo/i,
  /^Responder en el debate/i,
  /^Confirmar el escrutinio/i,
  /^Aceptar el nuevo mandato/i,
  /^Reconocer el resultado/i,
  /Me niego/i,
];

const CHOICE_BUTTONS = 'button.pixel-choice-card:visible:not([disabled]), button.debate-option:visible';

export async function startGuestRun(page: Page, difficulty = 'Crisis') {
  await page.goto('/');
  await page.getByRole('button', { name: new RegExp(`^${difficulty}`) }).click();
  const startRun = page.waitForResponse((r) => r.url().endsWith('/api/start-run'));
  await page.getByRole('button', { name: 'Jugar como invitado' }).click();
  expect((await startRun).status()).toBe(200);
  await expect(page).toHaveURL(/\/president$/);
  await page.getByRole('button', { name: /Javier Milei/ }).click();
  await page.getByRole('button', { name: /^Asumir como Javier Milei/ }).click();
  await expect(page).toHaveURL(/\/game$/);
}

const ENABLED_BUTTONS = 'button:visible:not([disabled])';

async function nextProgressPattern(page: Page): Promise<RegExp | undefined> {
  const labels = await page
    .locator(ENABLED_BUTTONS)
    .evaluateAll((buttons) =>
      buttons.map((button) => (button.textContent ?? '').replace(/\s+/g, ' ').trim()),
    );
  return PROGRESS_BUTTONS.find((pattern) => labels.some((label) => pattern.test(label)));
}

async function takeNextAction(page: Page): Promise<boolean> {
  const pattern = await nextProgressPattern(page);
  const target = pattern
    ? page.locator(ENABLED_BUTTONS).filter({ hasText: pattern }).first()
    : page.locator(CHOICE_BUTTONS).first();
  if ((await target.count()) === 0) return false;
  await target.click({ timeout: 1_000 }).catch(() => undefined);
  return true;
}

export async function playUntilGameOver(page: Page, maxSteps = 3000) {
  for (let step = 0; step < maxSteps && page.url().endsWith('/game'); step++) {
    if (!(await takeNextAction(page))) await page.waitForTimeout(200);
  }
  await expect(page).toHaveURL(/\/gameover$/);
}
