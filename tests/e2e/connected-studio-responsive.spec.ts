import { chromium, expect, test, type Browser, type Page } from '@playwright/test';
import {
  closeContext,
  enableLiveForTest,
  expectLive,
  expectStatic,
  gotoConnected,
  holdPageLoad,
  observeEnhancementShifts,
  pauseLabels,
  pauseSlot,
  type ConnectedLocale,
} from './support/connected-studio';
import { setConnectedTestHook } from './support/connected-studio-test-hooks';
import { appUrl, stableRoutes } from './support/paths';
import type { ConnectedRoute } from '../../lib/connected-studio/types';

// PLAN-SPF-V1 Task 7: the connected routes across the visual matrix with the scene absent and
// present. The static cases run in every registered project; the live cases run once, on desktop
// Chromium, in their own SwiftShader browser, because they prove layout and reflow, not hardware
// behavior (Task 9). Widths: 320, 390, 768, 1024 and 1440 CSS px, plus a 200% zoom equivalent.

const pages: readonly { route: ConnectedRoute; locale: ConnectedLocale }[] = [
  { route: 'services', locale: 'es' },
  { route: 'services', locale: 'en' },
  { route: 'projects', locale: 'es' },
  { route: 'projects', locale: 'en' },
];

const widths = [320, 390, 768, 1024, 1440] as const;
const heightFor = (width: number) => (width >= 1024 ? 900 : width >= 768 ? 1024 : 844);

const horizontalOverflow = (page: Page) =>
  page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));

test.describe('static background, every registered project', () => {
  for (const { route, locale } of pages) {
    test(`${route} ${locale} keeps the Pause slot reserved, empty and inside the page width`, async ({ page }) => {
      // These cases prove the static page in every engine. Since Tasks 18 and 25 both tiers are live under the shipped policy,
      // and Firefox and WebKit on a Linux runner do not reveal a software renderer, so a mobile WebKit page would go live; the
      // policy is closed through the test hook, as the static media cases do (connected-studio-static.spec.ts).
      await setConnectedTestHook(page, { livePolicy: { wide: false, compact: false } });
      await gotoConnected(page, route, locale);
      await expectStatic(page, route);
      const slot = await pauseSlot(page, route).boundingBox();
      expect(slot?.height ?? 0, 'the slot keeps room for a 44px control').toBeGreaterThanOrEqual(44);
      expect(await horizontalOverflow(page)).toBe(0);
    });
  }
});

test.describe('live background (controlled test evidence on SwiftShader)', () => {
  test.describe.configure({ timeout: 90_000 });

  async function withLiveBrowser(testInfo: { project: { name: string } }, body: (browser: Browser) => Promise<void>) {
    test.skip(testInfo.project.name !== 'wide-chromium', 'The live reflow checks run once, on desktop Chromium');
    const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    try {
      await body(browser);
    } finally {
      await browser.close();
    }
  }

  for (const width of widths) {
    test(`at ${width}px the scene adds no overflow, no shift and a 44px Pause control clear of the text`, async ({}, testInfo) => {
      await withLiveBrowser(testInfo, async (browser) => {
        const context = await browser.newContext({ viewport: { width, height: heightFor(width) } });
        const page = await context.newPage();
        const shifts = await observeEnhancementShifts(page);
        await enableLiveForTest(page);
        for (const { route, locale } of pages) {
          await gotoConnected(page, route, locale);
          await expectLive(page);
          const pause = pauseSlot(page, route).getByRole('button', { name: pauseLabels[locale].pause });
          await expect(pause).toBeVisible();
          const control = (await pause.boundingBox())!;
          expect(control.width, `${route} ${locale} Pause width`).toBeGreaterThanOrEqual(44);
          expect(control.height, `${route} ${locale} Pause height`).toBeGreaterThanOrEqual(44);
          expect(control.x + control.width, 'Pause stays inside the viewport').toBeLessThanOrEqual(width + 0.5);

          // It sits in its reserved slot, never over body copy.
          const overText = await page.evaluate(
            ({ routeName }) => {
              const slot = document.getElementById(`connected-pause-${routeName}`)!;
              const button = slot.querySelector('button')!.getBoundingClientRect();
              const mask = slot.closest('[data-connected-reading-mask]')!;
              return Array.from(mask.querySelectorAll('h1, p, a, li')).some((element) => {
                if (slot.contains(element)) return false;
                const rect = element.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0 && button.left < rect.right - 0.5 && rect.left < button.right - 0.5 && button.top < rect.bottom - 0.5 && rect.top < button.bottom - 0.5;
              });
            },
            { routeName: route },
          );
          expect(overText, `${route} ${locale} Pause overlaps no text`).toBe(false);
          expect(await horizontalOverflow(page), `${route} ${locale} horizontal overflow with the scene live`).toBe(0);
          await page.waitForTimeout(1_200);
          await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
          await page.waitForTimeout(600);
        }
        expect(await shifts.shiftsAfterActivation(), 'layout shift caused by the enhancement').toBe(0);
        await closeContext(context);
      });
    });
  }

  test('the introduction does not move when the enhancement activates', async ({}, testInfo) => {
    await withLiveBrowser(testInfo, async (browser) => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      const hold = await holdPageLoad(page);
      await enableLiveForTest(page);
      await page.goto(appUrl(stableRoutes.services.es), { waitUntil: 'domcontentloaded' });
      await expect(pauseSlot(page, 'services')).toBeAttached();
      const geometry = () =>
        page.evaluate(() => {
          const rect = (selector: string) => {
            const { x, y, width, height } = document.querySelector(selector)!.getBoundingClientRect();
            return { x, y, width, height };
          };
          return { heading: rect('main h1'), slot: rect('#connected-pause-services'), mask: rect('[data-connected-reading-mask]') };
        });
      const before = await geometry();
      hold.release();
      await expectLive(page);
      expect(await geometry(), 'headings, actions and the reserved slot keep their place').toEqual(before);
      await closeContext(context);
    });
  });

  test('at 200% zoom the scene stays behind a reflowed page with no horizontal overflow', async ({}, testInfo) => {
    await withLiveBrowser(testInfo, async (browser) => {
      // 200% zoom of a 1440x900 window is a 720x450 CSS viewport.
      const context = await browser.newContext({ viewport: { width: 720, height: 450 } });
      const page = await context.newPage();
      await enableLiveForTest(page);
      for (const { route, locale } of pages) {
        await gotoConnected(page, route, locale);
        await expectLive(page);
        expect(await horizontalOverflow(page), `${route} ${locale}`).toBe(0);
        await expect(page.locator('main h1:visible')).toHaveCount(1);
      }
      await closeContext(context);
    });
  });
});
