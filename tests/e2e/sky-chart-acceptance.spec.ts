import { devices, expect, test, type Page } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { appPathname, appUrl, normalizeBasePath } from './support/paths';
import {
  CHAPTERS,
  HOME,
  LOCALES,
  VIEWPORTS,
  allowSoftwareRenderer,
  centreChapter,
  countBackdropSurfaces,
  debugHook,
  expectActive,
  expectIdleAfterSettle,
  expectStaticComposition,
  expectedLabelCount,
  gotoHome,
  instrumentMode,
  layoutShiftReport,
  newEnhancedPage,
  observeLayoutShifts,
  recedeValue,
  renderedChapter,
  scrollInstant,
  scrollToSectionTop,
  seriousAxeViolations,
  type Viewport,
} from './support/sky-chart';

// PLAN-SKY-CHART-HOME-REDESIGN-V2 Task 11 / PR 11: the integrated acceptance matrix for Home.
//
// Every journey below runs in both locales. Where a step depends on width it runs at the five
// plan widths (1440, 1024, 768, 390, 320). The spec runs in `immersive-chromium` (SwiftShader), so
// every test that expects the runtime sets the explicit test-only software-renderer override
// (amended ADR 2026-09-28); the software-gate tests exercise the un-overridden behaviour.
//
// Polling, never fixed waits: SwiftShader frames take ~100-180 ms and the T-06 camera eases over
// dozens of frames, so every eased value is polled.

// Playwright's page-video recorder plus SwiftShader compositing the canvas can hang a full-page
// navigation ("until load" never fires) when two such pages navigate at once: reproduced on Windows
// with the config's `video: 'retain-on-failure'`, gone with video off, and serial runs are
// unaffected. `use({ video })` must be top-level, so the whole file records screenshots and traces
// (on first retry) but no video.
test.use({ video: 'off' });

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? '');
/** Poll budget for eased values and runtime state: SwiftShader frames are 100-180 ms, and two workers share the CPU. */
const EASE = { timeout: 20_000 } as const;
const label = (viewport: Viewport) => `${viewport.width}px`;

async function overflowsHorizontally(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
}

/**
 * D-11 + plan Deviations ("Hero top versus header top"): the hero is pulled up under the App Bar
 * by `--app-bar-height`, so at scrollY 0 its top edge and the header's top edge coincide.
 */
async function heroAndHeaderTops(page: Page) {
  return page.evaluate(() => {
    const hero = document.querySelector('section[aria-labelledby="home-heading"]')!.getBoundingClientRect();
    const header = document.querySelector('header[data-app-bar]')!.getBoundingClientRect();
    return { heroTop: hero.top, headerTop: header.top, headerHeight: header.height, scrollY: window.scrollY };
  });
}

async function expectHeroAlignedWithHeader(page: Page) {
  await scrollInstant(page, 0);
  const { heroTop, headerTop, scrollY } = await heroAndHeaderTops(page);
  expect(scrollY).toBe(0);
  expect(Math.abs(heroTop - headerTop), `|heroTop ${heroTop} - headerTop ${headerTop}|`).toBeLessThanOrEqual(1);
}

/** Scrim opacity while the chapter span recedes (D-24): 1 - 0.84k. Polled: the runtime animates it. */
async function scrimOpacity(page: Page) {
  return page.locator('[data-environment-scrim]').evaluate((element) => Number(getComputedStyle(element).opacity));
}

// ---------------------------------------------------------------------------------------------
// Hero top versus header top (both static and enhanced, every width, both locales).
// ---------------------------------------------------------------------------------------------
test.describe('hero top versus header top', () => {
  for (const locale of LOCALES) {
    for (const viewport of VIEWPORTS) {
      test(`${locale} at ${label(viewport)}: |heroTop - headerTop| <= 1 with the enhancement active`, async ({ page }) => {
        await allowSoftwareRenderer(page);
        await page.setViewportSize(viewport);
        await gotoHome(page, locale);
        await expectActive(page);
        await expectHeroAlignedWithHeader(page);
      });
    }

    test(`${locale}: |heroTop - headerTop| <= 1 without JavaScript at 1440 and 390`, async ({ browser }) => {
      for (const viewport of [VIEWPORTS[0], VIEWPORTS[3]]) {
        const context = await browser.newContext({ javaScriptEnabled: false, viewport });
        const page = await context.newPage();
        await page.goto(appUrl(HOME[locale].route));
        const { heroTop, headerTop } = await heroAndHeaderTops(page);
        expect(Math.abs(heroTop - headerTop), `${locale} no-JS ${viewport.width}: |heroTop ${heroTop} - headerTop ${headerTop}|`).toBeLessThanOrEqual(1);
        await context.close();
      }
    });
  }
});

// ---------------------------------------------------------------------------------------------
// The matrix: forward and reverse traversal, recede round trip, budgets and layout shift, at
// every width in both locales.
// ---------------------------------------------------------------------------------------------
test.describe('journey matrix', () => {
  for (const locale of LOCALES) {
    for (const viewport of VIEWPORTS) {
      test(`${locale} at ${label(viewport)}: activates, traverses forward and back, recedes and returns`, async ({ page }) => {
        test.slow();
        const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
        await allowSoftwareRenderer(page);
        await observeLayoutShifts(page);
        await page.setViewportSize(viewport);
        await gotoHome(page, locale);
        await expectActive(page);

        // Activation: tier visibility by width, labels in the locale's own words, budgets.
        await expect.poll(async () => (await debugHook(page))?.labelCount, EASE).toBe(expectedLabelCount(viewport.width));
        const hook = await debugHook(page);
        expect(hook?.labels).toContain(locale === 'es' ? 'Entender' : 'Understand');
        expect(hook?.drawCalls, 'draw calls per frame').toBeLessThanOrEqual(28);
        expect(hook?.labelTextureSizes.length, 'label textures').toBeLessThanOrEqual(20);
        for (const [width, height] of hook?.labelTextureSizes ?? []) {
          expect(width).toBeLessThanOrEqual(1024);
          expect(height).toBeLessThanOrEqual(64);
        }
        expect(await overflowsHorizontally(page), 'no horizontal overflow').toBe(false);

        // Forward through the four chapters, then in reverse: the sweep is reversible.
        for (const chapter of [...CHAPTERS, ...[...CHAPTERS].reverse()]) {
          await centreChapter(page, chapter);
          await expect.poll(() => renderedChapter(page), { ...EASE }).toBe(chapter);
        }

        // Recede round trip (D-24): fully receded at Services, and fully back in the chapters.
        await scrollToSectionTop(page, 'services');
        await expect.poll(() => recedeValue(page), EASE).toBe('1');
        await expect.poll(() => page.locator('canvas[data-sky-chart-canvas]').evaluate((element) => Number(getComputedStyle(element).opacity)), EASE).toBeLessThan(0.2);
        await expect.poll(() => scrimOpacity(page), EASE).toBeLessThan(0.2);
        await expect(page.locator('[data-pause-motion-pill]')).toBeHidden();
        await centreChapter(page, 'coordination');
        await expect.poll(() => recedeValue(page), EASE).not.toBe('1');
        await expect.poll(() => renderedChapter(page), EASE).toBe('coordination');
        await expect.poll(() => page.locator('canvas[data-sky-chart-canvas]').evaluate((element) => Number(getComputedStyle(element).opacity)), EASE).toBeGreaterThan(0.5);
        await expect(page.locator('[data-pause-motion-pill]')).toBeVisible();

        // Back to the very top: the hero is in front again and the pill leaves.
        await scrollInstant(page, 0);
        await expect.poll(() => renderedChapter(page), EASE).toBe('recognition');
        await expect.poll(() => recedeValue(page), EASE).toBe('0');
        await expect(page.locator('[data-pause-motion-pill]')).toBeHidden();

        // Layout shift from the enhancement is exactly 0 (the font-swap shift before import is not it).
        const shifts = await layoutShiftReport(page);
        expect(shifts.fromEnhancement, `layout shifts attributed to the enhancement: ${JSON.stringify(shifts.entries)}`).toBe(0);
        assertNoBrowserErrors();
      });
    }
  }
});

// ---------------------------------------------------------------------------------------------
// Backdrop-filter budget (D-08; section 14: "<=3 per viewport, App Bar excluded", measured by an
// "E2E DOM scan at each section"), with the enhancement on.
//
//   - The GATE (the per-section gate, owner decision E1, 2026-10-04: D-08 is reworded to it) scans
//     each section aligned under the App Bar and centred, at every width, and allows at most 3.
//   - The SWEEP is INFORMATIONAL, a regression guard and not a gate. It scans every half-viewport of
//     scroll; between two sections the viewport straddles both (Problems' three sheets plus Services'
//     plates, or Services' plates plus Position fix's two sheets), so a few hundred pixels of scroll
//     can reach 4-5 surfaces. The sweep is capped at 5 only so that count cannot grow unnoticed; it
//     says nothing about D-08.
// ---------------------------------------------------------------------------------------------
const TRANSIENT_BACKDROP_CEILING = 5;

test.describe('backdrop-filter budget', () => {
  for (const locale of LOCALES) {
    for (const viewport of VIEWPORTS) {
      test(`${locale} at ${label(viewport)}: at most three backdrop-filter surfaces at each section`, async ({ page }) => {
        await allowSoftwareRenderer(page);
        await page.setViewportSize(viewport);
        await gotoHome(page, locale);
        await expectActive(page);
        let seen = 0;
        for (const id of ['problems', 'services', 'impact', 'proof', HOME[locale].processId, 'founder', 'cta']) {
          await scrollToSectionTop(page, id);
          const aligned = await countBackdropSurfaces(page);
          await page.evaluate((target) => {
            const rect = document.getElementById(target)!.getBoundingClientRect();
            window.scrollBy({ top: rect.top + rect.height / 2 - window.innerHeight / 2, behavior: 'instant' });
          }, id);
          const centred = await countBackdropSurfaces(page);
          expect(aligned, `#${id} aligned under the App Bar`).toBeLessThanOrEqual(3);
          expect(centred, `#${id} centred`).toBeLessThanOrEqual(3);
          seen = Math.max(seen, aligned, centred);
        }
        expect(seen, 'the scan actually sees the surfaces').toBeGreaterThan(0);
      });

      test(`${locale} at ${label(viewport)}: informational sweep: the transient count between sections stays within the regression cap of 5`, async ({ page }, testInfo) => {
        await allowSoftwareRenderer(page);
        await page.setViewportSize(viewport);
        await gotoHome(page, locale);
        await expectActive(page);
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        const step = Math.floor(viewport.height / 2);
        let worst = 0;
        let worstAt = 0;
        for (let y = 0; y < height; y += step) {
          await scrollInstant(page, y);
          const count = await countBackdropSurfaces(page);
          if (count > worst) {
            worst = count;
            worstAt = y;
          }
        }
        testInfo.annotations.push({ type: 'backdrop-sweep-worst', description: `${worst} surfaces at scrollY ${worstAt}` });
        expect(worst, `worst sweep count ${worst} at scrollY ${worstAt}`).toBeLessThanOrEqual(TRANSIENT_BACKDROP_CEILING);
      });
    }
  }
});

// ---------------------------------------------------------------------------------------------
// Keyboard (plan section 13 + N12): App Bar, hero actions, Problems action, Services action,
// Position fix toggle buttons, Proof action, Process action, Founder action, CTA actions. The
// Pause control sits after the chapters and before Problems, and only exists to Tab while shown.
// ---------------------------------------------------------------------------------------------
type FocusStop = {
  region: string;
  tag: string;
  name: string;
  top: number;
  surfaceBottom: number;
  outlineStyle: string;
  outlineWidth: string;
  pressed: string | null;
};

async function tabThrough(page: Page, maxStops = 90): Promise<FocusStop[]> {
  const stops: FocusStop[] = [];
  for (let index = 0; index < maxStops; index += 1) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate((): FocusStop | null => {
      const element = document.activeElement as HTMLElement | null;
      if (!element || element === document.body) return null;
      const region = element.closest('[data-app-bar]')
        ? 'app-bar'
        : element.closest('[data-pause-motion-pill]')
          ? 'pause'
          : element.closest('footer')
            ? 'footer'
            : element.closest('section[aria-labelledby="home-heading"]')
              ? 'hero'
              : ((element.closest('main section[id]') as HTMLElement | null)?.id ?? 'other');
      const rect = element.getBoundingClientRect();
      const surface = document.querySelector('[data-app-bar-surface]')!.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        region,
        tag: element.tagName.toLowerCase(),
        name: (element.getAttribute('aria-label') ?? element.textContent ?? '').trim().slice(0, 48),
        top: rect.top,
        surfaceBottom: surface.bottom,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        pressed: element.getAttribute('aria-pressed'),
      };
    });
    if (!stop) break;
    stops.push(stop);
    if (stop.region === 'footer') break;
  }
  return stops;
}

test.describe('keyboard', () => {
  for (const locale of LOCALES) {
    for (const viewport of [VIEWPORTS[0], VIEWPORTS[3]]) {
      test(`${locale} at ${label(viewport)}: Tab order follows section 13 and never lands under the App Bar`, async ({ page }) => {
        test.slow();
        await allowSoftwareRenderer(page);
        await page.setViewportSize(viewport);
        await gotoHome(page, locale);
        await expectActive(page);
        // PositionFixToggle renders its buttons after hydration (progressive enhancement).
        await page.locator('#impact [role="group"] button').first().waitFor();

        const stops = await tabThrough(page);
        const regions = stops.map((stop) => stop.region);
        const collapsed = regions.filter((region, index) => region !== regions[index - 1]);
        // Pause is hidden at scrollY 0 and again once receded, so a top-to-bottom Tab never stops on it.
        expect(collapsed).toEqual(['app-bar', 'hero', 'problems', 'services', 'impact', 'proof', HOME[locale].processId, 'founder', 'cta', 'footer']);

        // The two Position fix toggle buttons are consecutive stops, with aria-pressed state.
        const toggles = stops.filter((stop) => stop.region === 'impact');
        expect(toggles.map((stop) => stop.tag)).toEqual(['button', 'button']);
        expect(toggles.map((stop) => stop.pressed)).toEqual(['true', 'false']);

        for (const stop of stops) {
          expect(stop.outlineStyle, `focus indicator on "${stop.name}"`).not.toBe('none');
          expect(Number.parseFloat(stop.outlineWidth), `focus ring width on "${stop.name}"`).toBeGreaterThanOrEqual(2);
          if (stop.region !== 'app-bar') {
            expect(stop.top, `"${stop.name}" must clear the sticky App Bar`).toBeGreaterThanOrEqual(stop.surfaceBottom - 1);
          }
        }
      });
    }

    test(`${locale}: Pause sits right after the chapters and before the Problems action`, async ({ page }) => {
      test.slow();
      await allowSoftwareRenderer(page);
      await page.setViewportSize(VIEWPORTS[0]);
      await gotoHome(page, locale);
      await expectActive(page);

      await centreChapter(page, 'fragmentation');
      await expect(page.locator('[data-pause-motion-pill]')).toBeVisible({ timeout: 10_000 });
      // Focus the hero's last action without scrolling (a visitor tabbing from where they are).
      await page
        .locator('section[aria-labelledby="home-heading"]')
        .getByRole('link')
        .last()
        .evaluate((element) => (element as HTMLElement).focus({ preventScroll: true }));
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: HOME[locale].pause })).toBeFocused();
      // Document order pins the reverse direction without moving focus (Shift+Tab would scroll the
      // hero back into view, which hides the pill again): hero < last chapter < Pause < Problems.
      const order = await page.evaluate(() => {
        const follows = (a: Element, b: Element) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
        const chapters = document.querySelectorAll('section[data-instrument-chapter]');
        const pause = document.querySelector('[data-pause-motion-pill]')!;
        return {
          afterChapters: follows(chapters[chapters.length - 1], pause),
          beforeProblems: follows(pause, document.getElementById('problems')!),
        };
      });
      expect(order).toEqual({ afterChapters: true, beforeProblems: true });
      // Forward: the very next stop is the Problems action.
      await page.keyboard.press('Tab');
      const next = await page.evaluate(() => (document.activeElement as HTMLElement).closest('section[id]')?.id ?? null);
      expect(next).toBe('problems');
    });
  }
});

// ---------------------------------------------------------------------------------------------
// Resize, orientation, rotation during Connect, and the multi-viewport journey (N6).
// ---------------------------------------------------------------------------------------------
async function expectCanvasMatchesViewport(page: Page) {
  await expect
    .poll(
      async () => {
        const hook = await debugHook(page);
        const size = await page.locator('canvas[data-sky-chart-canvas]').evaluate((canvas: HTMLCanvasElement) => ({
          width: canvas.width,
          height: canvas.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        }));
        const ratio = hook?.pixelRatio ?? 1;
        return Math.abs(size.width - size.viewportWidth * ratio) <= 2 && Math.abs(size.height - size.viewportHeight * ratio) <= 2;
      },
      { timeout: 15_000, message: 'the canvas buffer follows the viewport after a resize' },
    )
    .toBe(true);
}

test.describe('resize and orientation', () => {
  for (const locale of LOCALES) {
    test(`${locale}: resizing across widths and rotating keeps one canvas, the chapter and the label tiers`, async ({ page }) => {
      test.slow();
      const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
      await allowSoftwareRenderer(page);
      await observeLayoutShifts(page);
      await page.setViewportSize(VIEWPORTS[0]);
      await gotoHome(page, locale);
      await expectActive(page);
      const disposeBefore = (await debugHook(page))?.disposeCount ?? -1;

      const steps = [
        { width: 390, height: 844 },
        { width: 844, height: 390 }, // landscape phone
        { width: 1024, height: 768 },
        { width: 768, height: 1024 },
        { width: 320, height: 800 },
        { width: 1440, height: 900 },
      ];
      for (const step of steps) {
        await page.setViewportSize(step);
        await centreChapter(page, 'connection');
        await expect.poll(() => renderedChapter(page), { ...EASE }).toBe('connection');
        await expect.poll(async () => (await debugHook(page))?.labelCount, EASE).toBe(expectedLabelCount(step.width));
        await expect(page.locator('canvas')).toHaveCount(1);
        await expectCanvasMatchesViewport(page);
        expect(await overflowsHorizontally(page), `no horizontal overflow at ${step.width}`).toBe(false);
      }
      // A resize re-measures; it never tears the scene down and recreates it.
      expect((await debugHook(page))?.disposeCount).toBe(disposeBefore);
      // Resizing the viewport reflows the page itself, and those shifts land after the runtime import;
      // only a shift whose source is the canvas, scrim or Pause pill can be the enhancement's.
      expect((await layoutShiftReport(page)).fromEnhancementSources).toBe(0);
      assertNoBrowserErrors();
    });

    test(`${locale}: rotating a phone during Connect keeps Connect, its links and one canvas`, async ({ browser }) => {
      test.slow();
      const { context, page } = await newEnhancedPage(browser, { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } });
      const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
      try {
        await gotoHome(page, locale);
        await expectActive(page);
        await centreChapter(page, 'connection');
        await expect.poll(() => renderedChapter(page), { ...EASE }).toBe('connection');
        await expect.poll(async () => (await debugHook(page))?.frame?.linkFraction ?? 0, EASE).toBeGreaterThan(0);

        for (const orientation of [{ width: 844, height: 390 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
          await page.setViewportSize(orientation);
          await centreChapter(page, 'connection');
          await expect.poll(() => renderedChapter(page), { ...EASE }).toBe('connection');
          await expect.poll(async () => (await debugHook(page))?.frame?.linkFraction ?? 0, EASE).toBeGreaterThan(0);
          await expect(page.locator('canvas')).toHaveCount(1);
          await expectCanvasMatchesViewport(page);
        }
        assertNoBrowserErrors();
      } finally {
        await context.close();
      }
    });

    test(`${locale}: one page journeys forward and back through all five widths without recreating the scene`, async ({ page }) => {
      test.slow();
      const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
      await allowSoftwareRenderer(page);
      await page.setViewportSize(VIEWPORTS[0]);
      await gotoHome(page, locale);
      await expectActive(page);
      const disposeBefore = (await debugHook(page))?.disposeCount ?? -1;

      for (const viewport of [...VIEWPORTS, ...[...VIEWPORTS].reverse()]) {
        await page.setViewportSize(viewport);
        for (const chapter of [...CHAPTERS, ...[...CHAPTERS].reverse()]) {
          await centreChapter(page, chapter);
          await expect.poll(() => renderedChapter(page), { ...EASE, message: `${chapter} at ${viewport.width}` }).toBe(chapter);
        }
        await expect(page.locator('canvas')).toHaveCount(1);
        expect(await instrumentMode(page)).toBe('webgl');
      }
      expect((await debugHook(page))?.disposeCount).toBe(disposeBefore);
      assertNoBrowserErrors();
    });
  }
});

// ---------------------------------------------------------------------------------------------
// Canvas DPR caps (T-07), with a real high-density device profile.
// ---------------------------------------------------------------------------------------------
test.describe('canvas pixel ratio', () => {
  for (const viewport of VIEWPORTS) {
    test(`a 3x display is capped to the T-07 ratio at ${label(viewport)}`, async ({ browser }) => {
      test.slow();
      const { context, page } = await newEnhancedPage(browser, { viewport, deviceScaleFactor: 3 });
      try {
        await gotoHome(page, 'en');
        await expectActive(page);
        await expect.poll(async () => (await debugHook(page))?.drawCalls ?? 0, EASE).toBeGreaterThan(0);
        const ratio = (await debugHook(page))?.pixelRatio ?? 0;
        // 1.5 wide, 1.25 compact (or on a constrained device); never the raw 3x.
        expect(ratio).toBeLessThanOrEqual(viewport.width >= 1024 ? 1.5 : 1.25);
        expect(ratio).toBeGreaterThanOrEqual(1.25);
        await expectCanvasMatchesViewport(page);
      } finally {
        await context.close();
      }
    });
  }

  test('a constrained device (2 cores) is capped to 1.25 even at 1440', async ({ browser }) => {
    test.slow();
    const { context, page } = await newEnhancedPage(browser, { viewport: VIEWPORTS[0], deviceScaleFactor: 2 });
    try {
      await page.addInitScript(() => Object.defineProperty(navigator, 'hardwareConcurrency', { value: 2 }));
      await gotoHome(page, 'es');
      await expectActive(page);
      await expect.poll(async () => (await debugHook(page))?.drawCalls ?? 0, EASE).toBeGreaterThan(0);
      expect((await debugHook(page))?.pixelRatio).toBe(1.25);
    } finally {
      await context.close();
    }
  });
});

// ---------------------------------------------------------------------------------------------
// Idle rendering: zero frames after settle, at a wide and a compact width.
// ---------------------------------------------------------------------------------------------
test.describe('idle rendering', () => {
  for (const viewport of [VIEWPORTS[0], VIEWPORTS[3]]) {
    test(`zero frames once settled at ${label(viewport)}`, async ({ page }) => {
      test.slow();
      await allowSoftwareRenderer(page);
      await page.setViewportSize(viewport);
      await gotoHome(page, 'en');
      await expectActive(page);
      await centreChapter(page, 'connection');
      await expect.poll(() => renderedChapter(page), EASE).toBe('connection');
      await expectIdleAfterSettle(page);
    });
  }
});

// ---------------------------------------------------------------------------------------------
// 200% zoom. Zoom is simulated the way this suite always has: halving the
// CSS viewport (1440 -> 720). Content grows; nothing is clipped; nothing scrolls sideways.
// ---------------------------------------------------------------------------------------------
type Clipped = { tag: string; text: string; left: number; right: number };

async function clippedContent(page: Page): Promise<Clipped[]> {
  return page.evaluate(() => {
    const limit = window.innerWidth;
    const found: { tag: string; text: string; left: number; right: number }[] = [];
    for (const element of Array.from(document.querySelectorAll<HTMLElement>('main h1, main h2, main h3, main p, main a, main button, main li, main span'))) {
      if (element.closest('[aria-hidden="true"], [hidden]')) continue;
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (rect.left < -1 || rect.right > limit + 1) {
        found.push({ tag: element.tagName.toLowerCase(), text: (element.textContent ?? '').trim().slice(0, 40), left: Math.round(rect.left), right: Math.round(rect.right) });
      }
    }
    return found;
  });
}

test.describe('200% zoom', () => {
  for (const locale of LOCALES) {
    for (const viewport of [
      { width: 720, height: 450 }, // 1440 at 200%
      { width: 512, height: 384 }, // 1024 at 200%
      { width: 384, height: 512 }, // 768 at 200%
    ]) {
      test(`${locale} at ${viewport.width}x${viewport.height} (200% zoom): the hero grows, nothing clips, the runtime still activates`, async ({ page }) => {
        test.slow();
        const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
        await allowSoftwareRenderer(page);
        await page.setViewportSize(viewport);
        await gotoHome(page, locale);
        await expectActive(page);

        const hero = page.locator('section[aria-labelledby="home-heading"]');
        await expect(hero).toHaveCSS('overflow', 'visible');
        const heroHeight = await hero.evaluate((element) => element.getBoundingClientRect().height);
        expect(heroHeight, 'the hero exceeds 100svh at 200% zoom').toBeGreaterThan(viewport.height);
        expect(await overflowsHorizontally(page)).toBe(false);
        expect(await clippedContent(page), 'no visible text runs past the viewport edge').toEqual([]);

        // The sweep still works at this zoom.
        for (const chapter of [...CHAPTERS, ...[...CHAPTERS].reverse()]) {
          await centreChapter(page, chapter);
          await expect.poll(() => renderedChapter(page), { ...EASE }).toBe(chapter);
        }
        assertNoBrowserErrors();
      });
    }

  }
});

// ---------------------------------------------------------------------------------------------
// Static paths. Each keeps the complete composition with the D-23 poster, no canvas, no Pause
// pill and no console error; the D-24 scrim recede still applies with JavaScript (N13).
// ---------------------------------------------------------------------------------------------
async function expectStaticRecede(page: Page) {
  await scrollToSectionTop(page, 'services');
  await expect.poll(() => recedeValue(page), EASE).toBe('1');
  // N13: instant, no transition, so no settling is needed -- but poll anyway for slow machines.
  await expect.poll(() => scrimOpacity(page), EASE).toBeLessThan(0.2);
  await scrollInstant(page, 0);
  await expect.poll(() => recedeValue(page), EASE).toBe('0');
  await expect.poll(() => scrimOpacity(page), EASE).toBeGreaterThan(0.95);
}

test.describe('reduced motion', () => {
  for (const locale of LOCALES) {
    for (const viewport of VIEWPORTS) {
      test(`${locale} at ${label(viewport)}: static composition, no canvas, instant scrim recede`, async ({ browser }) => {
        const context = await browser.newContext({ reducedMotion: 'reduce', viewport });
        const page = await context.newPage();
        const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
        try {
          await allowSoftwareRenderer(page); // even with the override, reduced motion wins
          await gotoHome(page, locale);
          await expectStaticComposition(page);
          await expectHeroAlignedWithHeader(page);
          expect(await overflowsHorizontally(page)).toBe(false);
          await expectStaticRecede(page);
          assertNoBrowserErrors();
        } finally {
          await context.close();
        }
      });
    }
  }
});

test.describe('Save-Data', () => {
  for (const locale of LOCALES) {
    for (const viewport of [VIEWPORTS[0], VIEWPORTS[3]]) {
      test(`${locale} at ${label(viewport)}: keeps the static composition`, async ({ page }) => {
        const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
        await allowSoftwareRenderer(page);
        await page.addInitScript(() => {
          Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true });
        });
        await page.setViewportSize(viewport);
        await gotoHome(page, locale);
        await expectStaticComposition(page);
        await expectStaticRecede(page);
        assertNoBrowserErrors();
      });
    }
  }
});

test.describe('no JavaScript', () => {
  for (const locale of LOCALES) {
    for (const viewport of VIEWPORTS) {
      test(`${locale} at ${label(viewport)}: the complete document renders and fits`, async ({ browser }) => {
        const context = await browser.newContext({ javaScriptEnabled: false, viewport });
        const page = await context.newPage();
        try {
          await page.goto(appUrl(HOME[locale].route));
          await expect(page.locator('h1')).toHaveCount(1);
          await expect(page.locator('section[data-instrument-chapter]')).toHaveCount(4);
          await expect(page.getByRole('main').locator(':scope > section')).toHaveCount(7); // problems ... cta
          await expect(page.locator('canvas')).toHaveCount(0);
          await expect(page.locator('[data-pause-motion-pill]')).toHaveCount(0);
          // Both Position fix figures render stacked, and there is no toggle without JavaScript.
          await expect(page.locator('#impact svg')).toHaveCount(2);
          await expect(page.locator('#impact [role="group"]')).toHaveCount(0);
          const poster = await page.locator('[data-environment-poster]').evaluate((element) => getComputedStyle(element).backgroundImage);
          expect(poster).toMatch(/environment-(?:wide|compact)\.webp/);
          expect(await overflowsHorizontally(page)).toBe(false);
        } finally {
          await context.close();
        }
      });
    }
  }
});

test.describe('capability and failure paths return quietly to static', () => {
  for (const locale of LOCALES) {
    const viewport = locale === 'es' ? VIEWPORTS[0] : VIEWPORTS[3];

    test(`${locale}: missing WebGL`, async ({ page }) => {
      const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
      await allowSoftwareRenderer(page);
      await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
          if (type === 'webgl2' || type === 'webgl') return null;
          return (original as (...args: unknown[]) => unknown).call(this, type, ...rest);
        } as typeof HTMLCanvasElement.prototype.getContext;
      });
      await page.setViewportSize(viewport);
      await gotoHome(page, locale);
      await expectStaticComposition(page);
      await expectStaticRecede(page);
      assertNoBrowserErrors();
    });

    test(`${locale}: a renderer that fails after the capability probe`, async ({ page }) => {
      const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
      await allowSoftwareRenderer(page);
      await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        let probes = 0;
        HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
          if (type === 'webgl2' && ++probes > 1) return null;
          return (original as (...args: unknown[]) => unknown).call(this, type, ...rest);
        } as typeof HTMLCanvasElement.prototype.getContext;
      });
      await page.setViewportSize(viewport);
      await gotoHome(page, locale);
      await expectStaticComposition(page);
      await expectStaticRecede(page);
      assertNoBrowserErrors();
    });

    test(`${locale}: a failed runtime import`, async ({ page }) => {
      // Aborting the chunk makes the browser log its own network-level "Failed to load resource"
      // entry; that is the test's own setup. The assertion is that nothing escapes as an
      // uncaught exception and the static composition is intact.
      const uncaught: string[] = [];
      page.on('pageerror', (error) => uncaught.push(error.message));
      await allowSoftwareRenderer(page);
      await page.route('**/_next/static/chunks/**', async (route) => {
        try {
          const response = await route.fetch();
          const body = await response.text();
          if (body.includes('webglcontextlost')) return await route.abort();
          return await route.fulfill({ response, body });
        } catch {
          // A request still in flight when the page or test closes (dev HMR, prefetch) is
          // disposed by Playwright; the chunk under test has long since been decided.
          return route.abort().catch(() => undefined);
        }
      });
      await page.setViewportSize(viewport);
      await gotoHome(page, locale);
      await expectStaticComposition(page);
      await expectStaticRecede(page);
      expect(uncaught).toEqual([]);
    });

    test(`${locale}: forced context loss removes the canvas for the session`, async ({ page }) => {
      test.slow();
      const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
      await allowSoftwareRenderer(page);
      await page.setViewportSize(viewport);
      await gotoHome(page, locale);
      await expectActive(page);
      await page.locator('canvas[data-sky-chart-canvas]').evaluate((canvas: HTMLCanvasElement) => {
        canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
      });
      await expect.poll(() => instrumentMode(page), EASE).toBe('static');
      await expect(page.locator('canvas')).toHaveCount(0);
      await expect(page.locator('[data-pause-motion-pill]')).toHaveCount(0);
      await expectStaticRecede(page);

      // The session flag keeps the next load static too.
      await page.reload();
      await expectStaticComposition(page);
      assertNoBrowserErrors();
    });

    test(`${locale}: a software renderer without the override stays static`, async ({ page }) => {
      const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
      await page.setViewportSize(viewport);
      await gotoHome(page, locale);
      await expectStaticComposition(page);
      await expectStaticRecede(page);
      assertNoBrowserErrors();
    });
  }
});

// ---------------------------------------------------------------------------------------------
// Reduced transparency (Chromium CDP emulation, as app-bar.spec.ts does). Playwright's
// emulateMedia has no reducedTransparency option.
// ---------------------------------------------------------------------------------------------
test.describe('reduced transparency', () => {
  for (const locale of LOCALES) {
    for (const viewport of [VIEWPORTS[0], VIEWPORTS[3]]) {
      test(`${locale} at ${label(viewport)}: plates and sheets turn opaque and lose their blur with the enhancement on`, async ({ page }) => {
        test.slow();
        await allowSoftwareRenderer(page);
        await page.setViewportSize(viewport);
        await gotoHome(page, locale);
        await expectActive(page);

        const plate = page.locator('#services article').first();
        const sheet = page.locator('#problems li').first();
        await plate.scrollIntoViewIfNeeded();
        const surface = (locator: typeof plate) => locator.evaluate((element) => ({ background: getComputedStyle(element).backgroundColor, backdrop: getComputedStyle(element).backdropFilter }));

        // Discriminating baseline: translucent with a blur before the preference applies.
        expect((await surface(plate)).backdrop).not.toBe('none');
        expect((await surface(sheet)).backdrop).not.toBe('none');

        const cdp = await page.context().newCDPSession(page);
        await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });

        await expect.poll(async () => (await surface(plate)).background, EASE).toBe('rgb(13, 36, 60)'); // #0D243C
        expect((await surface(plate)).backdrop).toBe('none');
        await sheet.scrollIntoViewIfNeeded();
        await expect.poll(async () => (await surface(sheet)).background, EASE).toBe('rgb(249, 246, 238)'); // #F9F6EE
        expect((await surface(sheet)).backdrop).toBe('none');
        // The enhancement itself is unaffected: the canvas keeps running behind opaque surfaces.
        expect(await instrumentMode(page)).toBe('webgl');
      });
    }
  }
});

// ---------------------------------------------------------------------------------------------
// Base paths: the same journey on the root and on `/Portfolio` (run this file with
// NEXT_PUBLIC_BASE_PATH=/Portfolio to exercise the prefixed build).
// ---------------------------------------------------------------------------------------------
test.describe('base path', () => {
  for (const locale of LOCALES) {
    test(`${locale}: every link, poster and chunk resolves under "${basePath || '/'}" and the runtime activates`, async ({ page }) => {
      test.slow();
      const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
      const failed: string[] = [];
      page.on('response', (response) => {
        if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
      });
      await allowSoftwareRenderer(page);
      await page.setViewportSize(VIEWPORTS[0]);
      await gotoHome(page, locale);
      await expectActive(page);
      await centreChapter(page, 'connection');
      await expect.poll(() => renderedChapter(page), EASE).toBe('connection');

      const hrefs = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLAnchorElement>('header a[href], main a[href], footer a[href]'))
          .map((anchor) => anchor.getAttribute('href') ?? '')
          .filter((href) => href.startsWith('/')),
      );
      expect(hrefs.length).toBeGreaterThan(5);
      for (const href of hrefs) {
        expect(href.startsWith(`${basePath}/`) || href === basePath, `internal link ${href} carries the base path`).toBe(true);
        expect(href.startsWith(`${basePath}${basePath}/`) && basePath !== '', `internal link ${href} has no doubled base path`).toBe(false);
      }

      const poster = await page.locator('[data-environment-poster]').evaluate((element) => {
        const style = getComputedStyle(element);
        return `${style.getPropertyValue('--environment-poster-wide')}|${style.getPropertyValue('--environment-poster-compact')}`;
      });
      expect(poster).toContain(`${basePath}/brand/sky-chart/environment-wide.webp`);
      expect(poster).toContain(`${basePath}/brand/sky-chart/environment-compact.webp`);

      // The language switch lands on the other locale's Home under the same base path.
      await Promise.all([
        page.waitForURL(`**${appPathname(HOME[locale].other)}`),
        page.getByRole('banner').getByRole('link', { name: HOME[locale].switchLabel }).click(),
      ]);
      await expectActive(page);

      expect(failed, 'no failed request').toEqual([]);
      assertNoBrowserErrors();
    });
  }
});

// ---------------------------------------------------------------------------------------------
// Accessibility: axe with the enhancement off (static) and on (webgl, playing and paused).
// ---------------------------------------------------------------------------------------------
test.describe('axe', () => {
  for (const locale of LOCALES) {
    for (const viewport of VIEWPORTS) {
      test(`${locale} at ${label(viewport)}: no serious or critical violations with the enhancement off`, async ({ browser }) => {
        const context = await browser.newContext({ reducedMotion: 'reduce', viewport });
        const page = await context.newPage();
        try {
          await gotoHome(page, locale);
          await expectStaticComposition(page, 500);
          expect(await seriousAxeViolations(page)).toEqual([]);
        } finally {
          await context.close();
        }
      });

      test(`${locale} at ${label(viewport)}: no serious or critical violations with the enhancement on, playing and paused`, async ({ page }) => {
        test.slow();
        await allowSoftwareRenderer(page);
        await page.setViewportSize(viewport);
        await gotoHome(page, locale);
        await expectActive(page);
        expect(await seriousAxeViolations(page), 'playing, at the top').toEqual([]);

        await centreChapter(page, 'connection');
        await expect(page.locator('[data-pause-motion-pill]')).toBeVisible({ timeout: 10_000 });
        expect(await seriousAxeViolations(page), 'playing, in a chapter').toEqual([]);
        await page.getByRole('button', { name: HOME[locale].pause }).click();
        await expect(page.getByRole('button', { name: HOME[locale].resume })).toHaveAttribute('aria-pressed', 'true');
        expect(await seriousAxeViolations(page), 'paused').toEqual([]);
      });
    }
  }
});

// ---------------------------------------------------------------------------------------------
// Whole-page console cleanliness across a full traversal to the footer (both locales, both a wide
// and a compact width), separate from the per-journey checks above.
// ---------------------------------------------------------------------------------------------
test.describe('console', () => {
  for (const locale of LOCALES) {
    for (const viewport of [VIEWPORTS[0], VIEWPORTS[3]]) {
      test(`${locale} at ${label(viewport)}: scrolling the whole page produces no console or page errors`, async ({ page }) => {
        test.slow();
        const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
        await allowSoftwareRenderer(page);
        await page.setViewportSize(viewport);
        await gotoHome(page, locale);
        await expectActive(page);
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < height; y += Math.floor(viewport.height * 0.8)) {
          await scrollInstant(page, y);
          await page.waitForTimeout(50);
        }
        await scrollInstant(page, 0);
        assertNoBrowserErrors();
      });
    }
  }
});


// ---------------------------------------------------------------------------------------------
// Web-font swap (plan PR 11, owner decision E2, 2026-10-04). The font files are held back so the
// page paints in the fallback faces, then released; whatever moves when they arrive is the swap's
// layout shift. The enhancement is off here (no software-renderer override), so every shift is
// the page's own. `measure:home-vitals` judges the same effect on a throttled network.
// ---------------------------------------------------------------------------------------------
test.describe('web-font swap', () => {
  /** web-vitals "good" CLS. The throttled mobile lab profile measured 0.178 before the fallback fix. */
  const CLS_GOOD = 0.1;

  /** Holds every web-font request until the returned function is called. */
  async function holdWebFonts(page: Page) {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    await page.route(/\.woff2(\?.*)?$/, async (route) => {
      await gate;
      await route.continue().catch(() => undefined);
    });
    return release;
  }

  /** Text-box widths of every mono element in the App Bar and the hero (the readout, the coordinate line, the language switch). */
  async function monoTextWidths(page: Page) {
    return page.evaluate(() => {
      const roots = document.querySelectorAll('header[data-app-bar], section[aria-labelledby="home-heading"]');
      return [...roots].flatMap((root) =>
        [...root.querySelectorAll('.font-mono, [data-app-bar-readout]')].map((element) => {
          const range = document.createRange();
          range.selectNodeContents(element);
          return { text: (element.textContent ?? '').trim().slice(0, 28), width: range.getBoundingClientRect().width };
        }),
      );
    });
  }

  /** The web-font faces; the metric-adjusted `Fallback` faces are local() fonts and are always loaded. */
  const faceStatuses = (page: Page) =>
    page.evaluate(() =>
      [...document.fonts].filter((face) => !face.family.includes('Fallback')).map((face) => ({ family: face.family, status: face.status })),
    );

  for (const locale of LOCALES) {
    for (const viewport of VIEWPORTS) {
      test(`${locale} at ${label(viewport)}: the swap to the loaded fonts moves the mono text by <= 1px and the page by CLS < ${CLS_GOOD}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await observeLayoutShifts(page);
        const release = await holdWebFonts(page);
        // The held preload keeps the load event pending, so only the document is awaited.
        await page.goto(appUrl(HOME[locale].route), { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#home-heading')).toBeVisible();
        // The readout (>= 1024px) is revealed by hydration, which does not wait for fonts; measure after it.
        if (viewport.width >= 1024) await expect(page.locator('[data-app-bar-readout][data-home="true"]')).toBeVisible(EASE);
        const fallbackWidths = await monoTextWidths(page);
        expect((await faceStatuses(page)).filter((face) => face.status === 'loaded'), 'no web font loaded before the release').toHaveLength(0);

        release();
        await expect
          .poll(async () => {
            const faces = await faceStatuses(page);
            return ['instrumentSans', 'plexMono'].every((family) => faces.some((face) => face.family.includes(family) && face.status === 'loaded'));
          }, EASE)
          .toBe(true);
        await page.evaluate(() => document.fonts.ready.then(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))));

        const loadedWidths = await monoTextWidths(page);
        expect(loadedWidths.length, 'the mono elements measured before and after the swap match').toBe(fallbackWidths.length);
        expect(loadedWidths.length, 'the App Bar and hero have mono text').toBeGreaterThan(0);
        loadedWidths.forEach((loaded, index) => {
          expect(Math.abs(loaded.width - fallbackWidths[index].width), `"${loaded.text}" fallback ${fallbackWidths[index].width} vs loaded ${loaded.width}`).toBeLessThanOrEqual(1);
        });

        const report = await layoutShiftReport(page);
        expect(report.fromEnhancementSources, 'the enhancement is off, so no shift has a source in it').toBe(0);
        expect(report.total, `font-swap CLS ${report.total} from ${JSON.stringify(report.entries.map((entry) => entry.sources))}`).toBeLessThan(CLS_GOOD);
      });
    }
  }
});
