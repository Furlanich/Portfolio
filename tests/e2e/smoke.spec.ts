import { expect, test } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { appPathname, appUrl, stableRoutes } from './support/paths';

const routeCases = [
  ['Spanish homepage', stableRoutes.home.es, 'es-AR'],
  ['English homepage', stableRoutes.home.en, 'en'],
  ['Spanish Services', stableRoutes.services.es, 'es-AR'],
  ['English Services', stableRoutes.services.en, 'en'],
  ['Spanish Projects', stableRoutes.projects.es, 'es-AR'],
  ['English Projects', stableRoutes.projects.en, 'en'],
  ['Spanish Founder', stableRoutes.founder.es, 'es-AR'],
  ['English Founder', stableRoutes.founder.en, 'en'],
] as const;

for (const [name, route, language] of routeCases) {
  test(`${name} loads with its document language and one visible H1`, async ({ page }) => {
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    const response = await page.goto(appUrl(route));

    expect(response?.ok()).toBe(true);
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('main h1:visible')).toHaveCount(1);
    assertNoBrowserErrors();
  });
}

test('language switching preserves equivalent homepage and Services context', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.home.es));
  await page.locator('a[hreflang="en"]').click();
  await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.home.en));

  await page.goto(appUrl(stableRoutes.services.en));
  await page.locator('a[hreflang="es-AR"]').click();
  await expect(page).toHaveURL((url) => url.pathname === appPathname(stableRoutes.services.es));
});

test('visible Spanish primary-navigation destinations resolve without browser errors', async ({ page }) => {
  const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
  await page.goto(appUrl(stableRoutes.home.es));
  const navigation = page.getByRole('navigation', { name: 'Navegación principal' });
  await expect(navigation).toBeVisible();

  const hrefs = await navigation.getByRole('link').evaluateAll((links) =>
    [...new Set(links.map((link) => (link as HTMLAnchorElement).href))],
  );
  expect(hrefs.length).toBeGreaterThanOrEqual(5);

  for (const href of hrefs) {
    const response = await page.goto(href);
    expect(response?.ok(), href).toBe(true);
    await expect(page.locator('main')).toHaveCount(1);
  }
  assertNoBrowserErrors();
});
