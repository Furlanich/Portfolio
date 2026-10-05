import AxeBuilder from '@axe-core/playwright';
import { expect, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { appUrl, stableRoutes } from './paths';

// Shared Sky Chart test helpers (PLAN-SKY-CHART-HOME-REDESIGN-V2 Task 11 REFACTOR). The runtime
// specs (`immersive-home*.spec.ts`) and the acceptance spec all read the same DOM contract and
// the same dev-only debug hook, so the types, the software-renderer override and the polling
// helpers live here once.

export type SkyChartDebugFrame = {
  yaw: number;
  pitch: number;
  groupOpacity: Record<string, number>;
  linkFraction: number;
  inputOpacity: number;
  visibleTiers: readonly number[];
  heroMask: number;
};

export type SkyChartDebugHook = {
  frame: SkyChartDebugFrame | null;
  labelCount: number;
  labels: readonly string[];
  disposeCount: number;
  renderCount: number;
  drawCalls: number;
  pixelRatio: number;
  labelTextureSizes: readonly [number, number][];
  labelOpacities: Record<string, number>;
};

declare global {
  interface Window {
    __FURLANICH_SKY_CHART__?: SkyChartDebugHook;
    __SKY_CHART_ALLOW_SOFTWARE_RENDERER__?: boolean;
  }
}

export const CHAPTERS = ['recognition', 'fragmentation', 'connection', 'coordination'] as const;
export type ChapterId = (typeof CHAPTERS)[number];

/** The five widths every acceptance journey covers (plan section 21, Task 11). */
export const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 800 },
] as const;
export type Viewport = (typeof VIEWPORTS)[number];

export const HOME = {
  es: { locale: 'es', route: stableRoutes.home.es, other: stableRoutes.home.en, processId: 'proceso', pause: 'Pausar movimiento', resume: 'Reanudar movimiento', switchLabel: 'Ver sitio en inglés' },
  en: { locale: 'en', route: stableRoutes.home.en, other: stableRoutes.home.es, processId: 'process', pause: 'Pause motion', resume: 'Resume motion', switchLabel: 'View site in Spanish' },
} as const;
export type HomeLocale = keyof typeof HOME;
export const LOCALES = ['es', 'en'] as const;

/** Tier visibility by width (plan section 10): 1024+ all tiers, 360-1023 tiers 1-2, below 360 tier 1. */
export function expectedLabelCount(width: number): number {
  if (width >= 1024) return 20;
  if (width >= 360) return 8;
  return 4;
}

/**
 * B1 (amended ADR 2026-09-28): SwiftShader is a software renderer and fails the capability gate
 * on its own. Every test that expects `webgl` mode sets the explicit test-only override first.
 */
export async function allowSoftwareRenderer(page: Page) {
  await page.addInitScript(() => {
    window.__SKY_CHART_ALLOW_SOFTWARE_RENDERER__ = true;
  });
}

export const instrumentMode = (page: Page) => page.locator('[data-instrument]').getAttribute('data-immersive-mode');
export const renderedChapter = (page: Page) => page.locator('[data-instrument]').getAttribute('data-rendered-chapter');
export const recedeValue = (page: Page) => page.locator('[data-instrument]').getAttribute('data-recede');
export const debugHook = (page: Page) => page.evaluate(() => window.__FURLANICH_SKY_CHART__ ?? null);
export const renderCount = async (page: Page) => (await debugHook(page))?.renderCount ?? -1;

export async function expectActive(page: Page, timeout = 30_000) {
  await expect.poll(() => instrumentMode(page), { timeout }).toBe('webgl');
  const canvas = page.locator('canvas[data-sky-chart-canvas]');
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toHaveAttribute('aria-hidden', 'true');
  await expect(canvas).toHaveAttribute('tabindex', '-1');
  expect(await canvas.evaluate((element) => getComputedStyle(element).pointerEvents)).toBe('none');
}

/**
 * A static path: no canvas, mode `static`, no Pause control, and the D-23 environment poster
 * is the composition (its `background-image` names one of the two locale-neutral WebPs).
 */
export async function expectStaticComposition(page: Page, settleMs = 1_500) {
  await page.waitForLoadState('load');
  // Give the one-shot activation attempt time to (not) happen; every gate declines quietly.
  await page.waitForTimeout(settleMs);
  expect(await instrumentMode(page)).toBe('static');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('[data-pause-motion-pill]')).toHaveCount(0);
  const poster = await page.locator('[data-environment-poster]').evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(poster, 'the environment poster is the static composition').toMatch(/environment-(?:wide|compact)\.webp/);
}

export async function scrollInstant(page: Page, top: number) {
  // `html` has `scroll-behavior: smooth`; an instant jump keeps positions deterministic.
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top);
}

export async function centreChapter(page: Page, chapter: ChapterId) {
  await page.evaluate((id) => {
    const rect = document.querySelector(`section[data-instrument-chapter="${id}"]`)!.getBoundingClientRect();
    window.scrollBy({ top: rect.top + rect.height / 2 - window.innerHeight / 2, behavior: 'instant' });
  }, chapter);
}

export async function scrollToSectionTop(page: Page, id: string) {
  await page.evaluate((target) => {
    const rect = document.getElementById(target)!.getBoundingClientRect();
    window.scrollBy({ top: rect.top - 96, behavior: 'instant' });
  }, id);
}

/**
 * Polls until two `renderCount` reads a settle interval apart agree, then re-confirms the count
 * stays put for one more window. The T-06 eased camera needs a real, variable number of frames to
 * converge (SwiftShader frames are ~100-180 ms), so a single read after a fixed wait is invalid.
 * An idle loop that never stops still fails: the poll times out because no two reads ever match.
 */
export async function expectIdleAfterSettle(page: Page, { timeout = 30_000, interval = 1_500 } = {}) {
  let previous: number | null = null;
  await expect
    .poll(
      async () => {
        const current = await renderCount(page);
        const stable = previous !== null && current === previous;
        previous = current;
        return stable;
      },
      { timeout, intervals: [interval] },
    )
    .toBe(true);
  const first = await renderCount(page);
  await page.waitForTimeout(interval);
  expect(await renderCount(page), 'idle rendering: zero new frames once settled').toBe(first);
}

/**
 * D-08: backdrop-filter surfaces intersecting the viewport, the App Bar excluded. Counts every
 * element in `main` (plates and sheets are the only content surfaces that use the filter). "In the
 * viewport" means visible below the sticky App Bar: a surface that ends above the bar's bottom edge
 * is entirely behind it and is not counted.
 */
export async function countBackdropSurfaces(page: Page): Promise<number> {
  return page.evaluate(() => {
    const appBarBottom = document.querySelector('[data-app-bar-surface]')?.getBoundingClientRect().bottom ?? 0;
    let count = 0;
    for (const element of Array.from(document.querySelectorAll<HTMLElement>('main *'))) {
      if (element.closest('[data-app-bar]')) continue;
      const style = getComputedStyle(element);
      const filter = style.backdropFilter || (style as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter;
      if (!filter || filter === 'none') continue;
      const rect = element.getBoundingClientRect();
      if (rect.bottom > appBarBottom && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth) count += 1;
    }
    return count;
  });
}

/** Records layout shifts with their sources, so the enhancement's own can be attributed. */
export async function observeLayoutShifts(page: Page) {
  await page.addInitScript(() => {
    const record: { value: number; time: number; enhancement: boolean; sources: string[] }[] = [];
    (window as unknown as { __layoutShifts: typeof record }).__layoutShifts = record;
    const describe = (node: Node | null | undefined) => {
      const element = node instanceof Element ? node : (node?.parentElement ?? null);
      if (!element) return { text: 'detached', enhancement: false };
      const enhancement = Boolean(element.closest('[data-sky-chart-canvas], [data-environment-scrim], [data-pause-motion-pill]')) || element.tagName === 'CANVAS';
      // Enough to identify the element from a CI log: tag, id, the first two classes and any data-* hooks.
      const classes = [...element.classList].slice(0, 2).map((name) => `.${name.slice(0, 40)}`).join('');
      const hooks = [...element.attributes].filter((attribute) => attribute.name.startsWith('data-')).map((attribute) => `[${attribute.name}]`).join('');
      const label = `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${classes}${hooks}`;
      return { text: label, enhancement };
    };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as { value: number; startTime: number; hadRecentInput: boolean; sources?: { node: Node | null }[] }[]) {
        if (entry.hadRecentInput) continue;
        const rect = (value: DOMRectReadOnly | undefined) => (value ? `${Math.round(value.x)},${Math.round(value.y)} ${Math.round(value.width)}x${Math.round(value.height)}` : '?');
        const sources = (entry.sources ?? []).map((source) => {
          const described = describe(source.node);
          const moved = source as unknown as { previousRect?: DOMRectReadOnly; currentRect?: DOMRectReadOnly };
          return { ...described, text: `${described.text} ${rect(moved.previousRect)} -> ${rect(moved.currentRect)}` };
        });
        record.push({ value: entry.value, time: entry.startTime, enhancement: sources.some((source) => source.enhancement), sources: sources.map((source) => source.text) });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
}

export type LayoutShiftReport = {
  total: number;
  /** Shifts at or after the runtime's `immersive:import-start` mark, or with a source inside the canvas, scrim or Pause pill. */
  fromEnhancement: number;
  /** Only shifts with a source inside the canvas, scrim or Pause pill (no time-based attribution). */
  fromEnhancementSources: number;
  entries: { value: number; time: number; enhancement: boolean; sources: string[] }[];
  importStart: number | null;
};

export async function layoutShiftReport(page: Page): Promise<LayoutShiftReport> {
  return page.evaluate(() => {
    const entries = (window as unknown as { __layoutShifts?: LayoutShiftReport['entries'] }).__layoutShifts ?? [];
    const importStart = performance.getEntriesByName('immersive:import-start')[0]?.startTime ?? null;
    const fromEnhancement = entries
      .filter((entry) => entry.enhancement || (importStart !== null && entry.time >= importStart))
      .reduce((sum, entry) => sum + entry.value, 0);
    const fromEnhancementSources = entries.filter((entry) => entry.enhancement).reduce((sum, entry) => sum + entry.value, 0);
    return { total: entries.reduce((sum, entry) => sum + entry.value, 0), fromEnhancement, fromEnhancementSources, entries: [...entries], importStart };
  });
}

/** axe with the WCAG 2.x A/AA and 2.2 AA rule tags; returns the critical and serious violations. */
export async function seriousAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  return results.violations
    .filter(({ impact }) => impact === 'critical' || impact === 'serious')
    .map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.slice(0, 3).map((node) => node.target.join(' ')) }));
}

/** Opens a page in a fresh context with the software-renderer override installed. */
export async function newEnhancedPage(browser: Browser, options: Parameters<Browser['newContext']>[0] = {}) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  await allowSoftwareRenderer(page);
  return { context, page };
}

export async function gotoHome(page: Page, locale: HomeLocale) {
  await page.goto(appUrl(HOME[locale].route));
}

export async function closeQuietly(context: BrowserContext) {
  await context.close().catch(() => undefined);
}
