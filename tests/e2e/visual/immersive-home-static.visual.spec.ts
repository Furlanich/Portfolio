import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

const locales = [
  { name: 'spanish', route: stableRoutes.home.es },
  { name: 'english', route: stableRoutes.home.en },
] as const;

const widths = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 800 },
] as const;

for (const locale of locales) {
  for (const viewport of widths) {
    test(`${locale.name} static instrument ${viewport.width} visual baseline`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(appUrl(locale.route));
      await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
      // Lazy posters below the fold must be decoded before a full-element capture.
      await page.locator('[data-instrument] img').evaluateAll(async (images) => {
        for (const image of images as HTMLImageElement[]) image.loading = 'eager';
        await Promise.all((images as HTMLImageElement[]).map((image) => image.decode().catch(() => undefined)));
      });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('[data-instrument]')).toHaveScreenshot(`instrument-${locale.name}-${viewport.width}.png`, {
        animations: 'disabled',
      });
    });
  }
}
