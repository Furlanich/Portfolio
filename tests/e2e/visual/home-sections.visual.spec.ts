import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from '../support/paths';

// PLAN-SKY-CHART-HOME-REDESIGN-V2 Task 11 (L-07): reduced-motion visual baselines for the seven
// Home sections after the instrument (Problems, Services, Position fix, Proof, Process, Founder,
// Dawn CTA), at 1440, 768 and 390 in both locales. The hero and the four chapters are covered by
// `immersive-home-static.visual.spec.ts` (`[data-instrument]`).
//
// The project runs with `reducedMotion: 'reduce'`, so no canvas exists and every capture shows the
// static composition: the D-23 poster ground under the (receded, N13) scrim. Canvas pixels are
// never compared.
//
// The sticky App Bar is hidden for these captures. An element screenshot of a section taller than
// the viewport is taken in tiles, and the bar would land at a different offset inside each tile;
// the bar has its own baselines (studio, founder and services-projects) and its own assertions
// (`app-bar.spec.ts`).
//
// The fixed D-23 poster is hidden too (the D-02 ground gradient stays). These sections are
// transparent, so each capture would otherwise contain whichever slice of the viewport-fixed
// poster sits behind it, and any height change above a section would re-baseline every section
// below it. The poster has its own coverage in `immersive-home-static.visual.spec.ts`.

const locales = [
  { name: 'spanish', route: stableRoutes.home.es, processId: 'proceso' },
  { name: 'english', route: stableRoutes.home.en, processId: 'process' },
] as const;

const viewports = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
] as const;

const sections = ['problems', 'services', 'impact', 'proof', 'process', 'founder', 'cta'] as const;

for (const locale of locales) {
  for (const viewport of viewports) {
    test.describe(`${locale.name} Home sections at ${viewport.width}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(appUrl(locale.route));
        await page.locator('nextjs-portal').evaluateAll((portals) => portals.forEach((portal) => portal.remove()));
        await page.addStyleTag({ content: 'header[data-app-bar] { visibility: hidden !important; } [data-environment-poster] { display: none !important; }' });
        await page.evaluate(() => document.fonts.ready);
        // The Position fix toggle upgrades after hydration; capture only once it has.
        await page.locator('#impact [role="group"] button').first().waitFor();
      });

      for (const section of sections) {
        test(`${section} visual baseline`, async ({ page }) => {
          const id = section === 'process' ? locale.processId : section;
          await expect(page.locator(`main section#${id}`)).toHaveScreenshot(`home-${section}-${locale.name}-${viewport.width}.png`, {
            animations: 'disabled',
          });
        });
      }
    });
  }
}
