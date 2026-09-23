import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

for (const [locale, route] of [
  ['Spanish', stableRoutes.home.es],
  ['English', stableRoutes.home.en],
] as const) {
  test(`${locale} homepage reflows without horizontal document overflow`, async ({ page }) => {
    await page.goto(appUrl(route));
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}

test('the primary navigation matches the compact or wide interaction model', async ({ page }, testInfo) => {
  await page.goto(appUrl(stableRoutes.home.es));
  const width = page.viewportSize()?.width ?? 0;
  const navigation = page.getByRole('navigation', { name: 'Navegación principal' });
  const menu = page.locator('summary[aria-label="Abrir navegación principal"]');

  if (width >= 1024) {
    await expect(navigation).toBeVisible();
    await expect(menu).toBeHidden();
    return;
  }

  await expect(menu).toBeVisible();
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu.locator('xpath=ancestor::details')).toHaveAttribute('open', '');
  await expect(navigation).toBeVisible();

  if (testInfo.project.name === 'mobile-chromium') {
    await page.keyboard.press('Tab');
    await expect(navigation.getByRole('link', { name: 'Servicios' })).toBeFocused();
  }

  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu.locator('xpath=ancestor::details')).not.toHaveAttribute('open', '');
  await expect(navigation).toBeHidden();
});

for (const route of [stableRoutes.home.es, stableRoutes.home.en]) {
  test(`instrument posters never overlay chapter copy on ${route}`, async ({ page }) => {
    await page.goto(appUrl(route));
    const overlaps = await page.locator('section[data-instrument-chapter]').evaluateAll((chapters) =>
      chapters.flatMap((chapter) => {
        const artwork = chapter.querySelector('[data-instrument-artwork]');
        if (!artwork || getComputedStyle(artwork).display === 'none') return [];
        const art = artwork.getBoundingClientRect();
        return [...chapter.querySelectorAll('h2, p')]
          .map((copy) => copy.getBoundingClientRect())
          .filter((text) => text.width > 1 && !(text.right <= art.left || text.left >= art.right || text.bottom <= art.top || text.top >= art.bottom))
          .map(() => chapter.getAttribute('data-instrument-chapter'));
      }),
    );
    expect(overlaps).toEqual([]);
  });
}
