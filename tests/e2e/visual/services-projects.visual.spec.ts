import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

// Snapshot names keep the Task 3 convention for the Spanish pages (`<page>-<viewport>`). PLAN-SPF-V1
// Task 6 adds the English Services captures as `services-english-<viewport>`; the Projects cases
// belong to Task 3 and stay Spanish-only.
const pages = [
  { name: 'services', label: 'Spanish', route: stableRoutes.services.es },
  { name: 'services-english', label: 'English', route: stableRoutes.services.en },
  { name: 'projects', label: 'Spanish', route: stableRoutes.projects.es },
] as const;

const viewports = [
  { name: 'wide', width: 1440, height: 900 },
  { name: 'compact', width: 390, height: 844 },
] as const;

for (const { name, label, route } of pages) {
  for (const viewport of viewports) {
    test(`${label} ${name.replace('-english', '')} ${viewport.name} visual baseline`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(appUrl(route));
      await page.evaluate(() => document.fonts.ready);
      await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
      // PLAN-SPF-V1 Task 3: the connected ground is viewport-fixed, so a tall element capture would contain
      // whichever slice sits behind each plate. Hiding the layer leaves the same Abyss html background and
      // makes the plates the whole subject; the Ground has its own assertions. A no-op where no ground exists.
      await page.addStyleTag({ content: '[data-connected-ground]{display:none !important}' });
      // Stabilize the one neighboring pixel included when main ends on a fractional CSS pixel.
      // The Footer's own visual spec captures its real Azure surface without this separator.
      await page.addStyleTag({ content: 'footer[data-site-footer] { border-top: 1px solid #D3D4D2 !important; }' });
      await expect(page.locator('main')).toHaveScreenshot(`${name}-${viewport.name}.png`, { animations: 'disabled' });
    });
  }
}
