import { expect, test, type Page } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

// PLAN-SPF-V1 Task 4: the shared Azure Footer, wide (1440) and compact (390), Spanish, on the Services
// host. The Footer is an opaque Azure surface, so the captured element is the whole subject. The fixed
// App Bar overlaps a tall element capture at 390px, so it is hidden for the capture only.

async function captureFooter(page: Page, width: number, height: number, name: string) {
  await page.setViewportSize({ width, height });
  await page.goto(appUrl(stableRoutes.services.es));
  await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
  await page.addStyleTag({ content: 'header[data-app-bar] { display: none !important; }' });
  const footer = page.locator('footer[data-site-footer]');
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toHaveScreenshot(name, { animations: 'disabled' });
}

test('Footer wide visual baseline', async ({ page }) => {
  await captureFooter(page, 1440, 900, 'footer-wide.png');
});

test('Footer compact visual baseline', async ({ page }) => {
  await captureFooter(page, 390, 844, 'footer-compact.png');
});
