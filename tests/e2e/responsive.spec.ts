import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

test('the homepage reflows without horizontal document overflow', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.home.es));
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});

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
