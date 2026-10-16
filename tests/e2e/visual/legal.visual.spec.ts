import { expect, test, type Page } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

async function hideDevelopmentIndicator(page: Page) {
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
}

test('Spanish Privacy wide reading surface', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl(stableRoutes.privacy.es));
  await hideDevelopmentIndicator(page);
  await expect(page.locator('main')).toHaveScreenshot('privacy-es-wide.png');
});

test('Spanish Privacy compact reading surface', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(appUrl(stableRoutes.privacy.es));
  await hideDevelopmentIndicator(page);
  await expect(page.locator('main')).toHaveScreenshot('privacy-es-compact.png');
});

test('English Privacy wide reading surface', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(appUrl(stableRoutes.privacy.en));
  await hideDevelopmentIndicator(page);
  await expect(page.locator('main')).toHaveScreenshot('privacy-en-wide.png');
});

test('English Privacy compact reading surface', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(appUrl(stableRoutes.privacy.en));
  await hideDevelopmentIndicator(page);
  await expect(page.locator('main')).toHaveScreenshot('privacy-en-compact.png');
});
