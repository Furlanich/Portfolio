import { expect, test, type Page } from '@playwright/test';
import { appPathname, appUrl, stableRoutes } from './support/paths';

test.describe.configure({ timeout: 60_000 });

const cases = [
  { route: stableRoutes.contact.es, heading: 'Contanos qué necesitás resolver.', notice: 'Demostración interactiva', submit: 'Simular envío', submitting: 'Simulando…', success: 'Demostración completada.', failure: 'La simulación no pudo completarse.', retry: 'Intentar nuevamente', language: 'es-AR' },
  { route: stableRoutes.contact.en, heading: 'Tell us what you need to solve.', notice: 'Interactive demonstration', submit: 'Simulate submission', submitting: 'Simulating…', success: 'Demonstration complete.', failure: 'The simulation could not be completed.', retry: 'Try again', language: 'en' },
] as const;

async function fillInquiry(page: Page, email = 'success@example.invalid') {
  await expect(page.locator('form[data-contact-hydrated="true"]')).toBeVisible();
  await page.getByLabel(/^(Nombre|Name)/).fill('Ada Lovelace');
  await page.getByLabel(/^(Correo electrónico|Email)/).fill(email);
  await page.getByLabel(/^(Empresa|Company)/).fill('Analytical Engines');
  await page.getByLabel(/^(¿Qué necesitás resolver\?|What do you need to solve\?)/).fill('Please help us scope a product idea.');
}

async function gotoContact(page: Page, route: string, language: string) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.goto(appUrl(route));
    try {
      await expect(page.locator('html')).toHaveAttribute('lang', language, { timeout: 10_000 });
      return;
    } catch (error) {
      lastError = error;
      await page.reload();
    }
  }
  throw lastError;
}

for (const pageCase of cases) {
  test(pageCase.language + ' Contact renders the local-only demonstration and ordered fallbacks', async ({ page }) => {
    await gotoContact(page, pageCase.route, pageCase.language);
    await expect(page.locator('main h1')).toHaveText(pageCase.heading);
    await expect(page.getByRole('heading', { name: pageCase.notice })).toBeVisible();
    await expect(page.getByRole('main').locator('a[href^="https://wa.me"], a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(3);
    await expect(page.getByRole('main').getByRole('link', { name: /Privacy Policy|Política de privacidad/ })).toHaveAttribute(
      'href',
      appPathname(pageCase.language === 'en' ? '/en/privacy/' : '/privacidad/'),
    );
    await expect(page.getByRole('link', { name: /Samuel/ }).last()).toBeVisible();
  });

  test(pageCase.language + ' Contact validates every applicable field and focuses the first invalid control', async ({ page }) => {
    await gotoContact(page, pageCase.route, pageCase.language);
    await page.getByRole('button', { name: pageCase.submit }).click();
    await expect(page.getByText(pageCase.language === 'en' ? 'Enter your name.' : 'Ingresá tu nombre.')).toBeVisible();
    await expect(page.getByText(pageCase.language === 'en' ? 'Enter your email address.' : 'Ingresá tu correo electrónico.')).toBeVisible();
    await expect(page.locator('#contact-message-error')).toHaveText(pageCase.language === 'en' ? 'Tell us what you need to solve.' : 'Contanos qué necesitás resolver.');
    await expect(page.getByLabel(/^(Nombre|Name)/)).toBeFocused();
    await expect(page.getByLabel(/^(Nombre|Name)/)).toHaveAttribute('aria-invalid', 'true');
  });

  test(pageCase.language + ' Contact simulates success, blocks duplicates, resets values, and sends no request', async ({ page }) => {
    await gotoContact(page, pageCase.route, pageCase.language);
    const requests: string[] = [];
    page.on('request', (request) => {
      if (['xhr', 'fetch', 'beacon'].includes(request.resourceType())) requests.push(request.url());
    });
    await fillInquiry(page);
    const button = page.getByRole('button', { name: pageCase.submit });
    await button.evaluate((element) => {
      (element as HTMLButtonElement).click();
      (element as HTMLButtonElement).click();
    });
    await expect(page.getByRole('status')).toContainText(pageCase.success);
    await expect(page.getByLabel(/^(Nombre|Name)/)).toHaveValue('');
    await expect(page.getByLabel(/^(Correo electrónico|Email)/)).toHaveValue('');
    await expect(page.getByLabel(/^(Empresa|Company)/)).toHaveValue('');
    await expect(page.getByLabel(/^(¿Qué necesitás resolver\?|What do you need to solve\?)/)).toHaveValue('');
    expect(requests).toEqual([]);
  });

  test(pageCase.language + ' Contact preserves values through failure and retry', async ({ page }) => {
    await gotoContact(page, pageCase.route, pageCase.language);
    await fillInquiry(page, 'failure@example.invalid');
    await page.getByRole('button', { name: pageCase.submit }).click();
    await expect(page.getByRole('main').getByRole('alert')).toContainText(pageCase.failure);
    await expect(page.getByLabel(/^(Nombre|Name)/)).toHaveValue('Ada Lovelace');
    await expect(page.getByLabel(/^(Correo electrónico|Email)/)).toHaveValue('failure@example.invalid');
    await expect(page.getByRole('main').getByRole('alert')).toBeFocused();
    await expect(page.getByRole('button', { name: pageCase.retry })).toBeVisible();
    await page.getByLabel(/^(Correo electrónico|Email)/).fill('success@example.invalid');
    await page.getByRole('button', { name: pageCase.retry }).click();
    await expect(page.getByRole('status')).toContainText(pageCase.success);
  });
}

test('Contact remains readable with JavaScript disabled and does not show a false success state', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(appUrl(stableRoutes.contact.en));
  await expect(page.locator('main h1')).toHaveText('Tell us what you need to solve.');
  await expect(page.getByRole('heading', { name: 'Interactive demonstration' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: 'Write on WhatsApp' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: 'Send an email' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: 'Call' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveCount(0);
  await context.close();
});
