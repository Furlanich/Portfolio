import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

const representativeRoutes = [
  ['Spanish homepage', stableRoutes.home.es],
  ['English homepage', stableRoutes.home.en],
  ['Spanish Services', stableRoutes.services.es],
  ['Spanish Projects', stableRoutes.projects.es],
  ['Spanish Founder', stableRoutes.founder.es],
] as const;

for (const [name, route] of representativeRoutes) {
  test(`${name} has no automatically detectable critical or serious axe violations`, async ({ page }) => {
    await page.goto(appUrl(route));
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const blockingViolations = results.violations.filter(
      ({ impact }) => impact === 'critical' || impact === 'serious',
    );

    expect(blockingViolations).toEqual([]);
    await expect(page.locator('main h1:visible')).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: /Navegación principal|Primary navigation/ })).toBeVisible();
    await expect(page.locator('a[hreflang]')).toBeVisible();
  });
}

test('homepage focus progresses through the brand, language switch, and primary navigation', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.home.es));

  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('banner').getByRole('link', { name: 'FURLANICH' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Ver sitio en inglés' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Servicios' })).toBeFocused();
});
