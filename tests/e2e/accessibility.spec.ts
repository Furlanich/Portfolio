import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

const representativeRoutes = [
  ['Spanish homepage', stableRoutes.home.es],
  ['English homepage', stableRoutes.home.en],
  ['Spanish Services', stableRoutes.services.es],
  ['Spanish Projects', stableRoutes.projects.es],
  ['English Projects', stableRoutes.projects.en],
  ['Spanish Studio', stableRoutes.studio.es],
  ['English Studio', stableRoutes.studio.en],
  ['Spanish Founder', stableRoutes.founder.es],
  ['English Founder', stableRoutes.founder.en],
  ['Spanish GRS detail', '/proyectos/general-reservation-system/'],
  ['English MPC detail', '/en/work/mpc-administracion/'],
  ['Spanish Privacy', stableRoutes.privacy.es],
  ['English Privacy', stableRoutes.privacy.en],
  ['Spanish Contact', stableRoutes.contact.es],
  ['English Contact', stableRoutes.contact.en],
] as const;

for (const [name, route] of representativeRoutes) {
  test(`${name} has no automatically detectable critical or serious axe violations`, async ({ page }) => {
    await page.goto(appUrl(route));
    await expect(page.locator('html')).toHaveAttribute('lang', name.startsWith('English') ? 'en' : 'es-AR');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const blockingViolations = results.violations.filter(
      ({ impact }) => impact === 'critical' || impact === 'serious',
    );

    expect(blockingViolations).toEqual([]);
    await expect(page.locator('main h1:visible')).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: /Navegación principal|Primary navigation/ })).toBeVisible();
    await expect(page.getByRole('banner').locator('a[hreflang]')).toBeVisible();
  });
}

test('homepage focus progresses through the brand, language switch, and primary navigation', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.home.es));

  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('banner').getByRole('link', { name: 'FURLANICH' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('banner').getByRole('link', { name: 'Ver sitio en inglés' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Servicios' })).toBeFocused();
});
