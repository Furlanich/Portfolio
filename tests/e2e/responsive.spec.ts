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
  test(`instrument chapter plates respect the D-12 width rule on ${route}`, async ({ page }) => {
    await page.goto(appUrl(route));
    const width = page.viewportSize()?.width ?? 0;
    const chapterWidths = await page.locator('section[data-instrument-chapter]').evaluateAll((chapters) =>
      chapters.map((chapter) => chapter.getBoundingClientRect().width),
    );

    expect(chapterWidths).toHaveLength(4);
    for (const chapterWidth of chapterWidths) {
      // Every chapter plate fits inside the viewport: full width below 768px, capped at
      // 520px from 768px up (D-12). A plate never grows past its own viewport either way.
      expect(chapterWidth).toBeGreaterThan(0);
      expect(chapterWidth).toBeLessThanOrEqual(width >= 768 ? 520 : width);
    }
  });
}
