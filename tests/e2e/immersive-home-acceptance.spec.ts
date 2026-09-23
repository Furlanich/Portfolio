import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { appPathname, appUrl, stableRoutes } from './support/paths';

// PR8 acceptance matrix (PLAN-VISUAL-IDENTITY-ADAPTIVE-IMMERSIVE-V1 Task 8.1). The focused
// runtime and fallback contracts live in immersive-home.spec.ts; this file adds the journey-level
// evidence: exact acceptance viewports, handoff into Problems, final CTA, orientation, keyboard,
// 200% zoom, the accessibility tree while enhanced, absent video, assets and fragments.

const CHAPTERS = ['recognition', 'fragmentation', 'connection', 'coordination'] as const;
const VIEWPORTS = [
  { width: 320, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
] as const;

const locales = {
  es: {
    route: stableRoutes.home.es,
    other: stableRoutes.home.en,
    switchLabel: 'Ver sitio en inglés',
    pause: 'Pausar movimiento',
    resume: 'Reanudar movimiento',
    secondaryHero: 'Ver servicios',
    problems: 'Cuando lo manual empieza a frenar el negocio',
    finalCta: ['Ver contacto', stableRoutes.contact.es],
  },
  en: {
    route: stableRoutes.home.en,
    other: stableRoutes.home.es,
    switchLabel: 'View site in Spanish',
    pause: 'Pause motion',
    resume: 'Resume motion',
    secondaryHero: 'Explore services',
    problems: 'When manual work starts holding the business back',
    finalCta: ['Contact options', stableRoutes.contact.en],
  },
} as const;

const mode = (page: Page) => page.locator('[data-instrument]').getAttribute('data-immersive-mode');
const rendered = (page: Page) => page.locator('[data-instrument-overlay]').getAttribute('data-rendered-chapter');

async function expectActive(page: Page) {
  await expect.poll(() => mode(page), { timeout: 20_000 }).toBe('webgl');
  await expect(page.locator('canvas[data-instrument-canvas]')).toHaveCount(1);
}

async function centreChapter(page: Page, chapter: (typeof CHAPTERS)[number]) {
  await page.evaluate((id) => {
    const rect = document.querySelector(`section[data-instrument-chapter="${id}"]`)!.getBoundingClientRect();
    window.scrollBy(0, rect.top + rect.height / 2 - window.innerHeight / 2);
  }, chapter);
}

function observeFailedAssets(page: Page) {
  const failed: string[] = [];
  page.on('response', (response) => {
    if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
  });
  // Router prefetches are cancelled when a journey scrolls on or navigates; that is not a missing asset.
  page.on('requestfailed', (request) => {
    if (request.failure()?.errorText !== 'net::ERR_ABORTED') failed.push(`${request.failure()?.errorText} ${request.url()}`);
  });
  return () => expect(failed, 'missing or failed assets').toEqual([]);
}

function intersects(a: DOMRect | { left: number; right: number; top: number; bottom: number }, b: typeof a) {
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

for (const locale of ['es', 'en'] as const) {
  const copy = locales[locale];

  for (const viewport of VIEWPORTS) {
    test(`${locale} ${viewport.width}x${viewport.height} completes the journey from first view to final CTA`, async ({ page }) => {
      const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
      const assertNoFailedAssets = observeFailedAssets(page);
      await page.setViewportSize(viewport);
      await page.goto(appUrl(copy.route));

      // Initial viewport: the proposition is readable before any enhancement.
      const h1 = page.getByRole('main').locator('h1');
      await expect(h1).toBeInViewport();
      await expectActive(page);
      await expect(page.getByRole('button', { name: copy.pause })).toBeVisible();

      // Four chapters forward, then in reverse.
      for (const chapter of [...CHAPTERS, ...[...CHAPTERS].reverse()]) {
        await centreChapter(page, chapter);
        await expect.poll(() => rendered(page)).toBe(chapter);
      }

      // Handoff: once Problems is reached, the stage no longer covers its heading.
      const problems = page.getByRole('heading', { level: 2, name: copy.problems, exact: true });
      await problems.scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, -Math.round(window.innerHeight / 3)));
      await expect(problems).toBeInViewport();
      const covered = await page.evaluate((name) => {
        const heading = [...document.querySelectorAll('h2')].find((node) => node.textContent === name)!.getBoundingClientRect();
        const overlay = document.querySelector('[data-instrument-overlay]')?.getBoundingClientRect();
        if (!overlay) return false;
        return !(heading.right <= overlay.left || heading.left >= overlay.right || heading.bottom <= overlay.top || heading.top >= overlay.bottom);
      }, copy.problems);
      expect(covered, 'Problems heading stays clear of the stage').toBe(false);
      expect(await mode(page)).toBe('webgl');

      // Final CTA remains an ordinary link to the localized Contact page.
      const finalSection = page.locator('section#cta');
      await finalSection.scrollIntoViewIfNeeded();
      const finalAction = finalSection.getByRole('link', { name: copy.finalCta[0], exact: true });
      await expect(finalAction).toBeInViewport();
      await expect(finalAction).toHaveAttribute('href', appPathname(copy.finalCta[1]));

      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await expect(page.locator('video')).toHaveCount(0);
      await expect(page.locator('canvas')).toHaveCount(1);
      assertNoFailedAssets();
      assertNoBrowserErrors();
    });
  }

  test(`${locale} rotating during Connection keeps the chapter and one canvas`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(appUrl(copy.route));
    await expectActive(page);
    await centreChapter(page, 'connection');
    await expect.poll(() => rendered(page)).toBe('connection');

    await page.setViewportSize({ width: 844, height: 390 });
    await centreChapter(page, 'connection');
    await expect.poll(() => rendered(page)).toBe('connection');
    await page.setViewportSize({ width: 390, height: 844 });
    await centreChapter(page, 'connection');
    await expect.poll(() => rendered(page)).toBe('connection');
    await expect(page.locator('canvas')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test(`${locale} keyboard reaches Pause after the hero actions with a visible focus ring`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(copy.route));
    await expectActive(page);

    const secondary = page.getByRole('main').getByRole('link', { name: copy.secondaryHero, exact: true }).first();
    await secondary.focus();
    await page.keyboard.press('Tab');
    const pause = page.getByRole('button', { name: copy.pause });
    await expect(pause).toBeFocused();
    const ring = await pause.evaluate((element) => getComputedStyle(element).boxShadow);
    expect(ring, 'focus-visible ring').not.toBe('none');

    await page.keyboard.press('Space');
    const resume = page.getByRole('button', { name: copy.resume });
    await expect(resume).toBeFocused();
    await expect(resume).toHaveAttribute('data-state', 'paused');
    await page.keyboard.press('Enter');
    await expect(pause).toHaveAttribute('data-state', 'playing');

    // The canvas never takes focus, and the next stop is chapter content, not the stage.
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => ({ tag: document.activeElement?.tagName, inOverlay: Boolean(document.activeElement?.closest('[data-instrument-overlay]')) }));
    expect(focused.tag).not.toBe('CANVAS');
    expect(focused.inOverlay).toBe(false);
  });

  test(`${locale} 200% zoom reflows with copy ahead of the stage`, async ({ page }) => {
    // 1440x900 at 200% zoom is a 720x450 CSS viewport.
    await page.setViewportSize({ width: 720, height: 450 });
    await page.goto(appUrl(copy.route));
    await expectActive(page);
    for (const chapter of CHAPTERS) {
      await centreChapter(page, chapter);
      await expect.poll(() => rendered(page)).toBe(chapter);
      const overlap = await page.evaluate((id) => {
        const overlay = document.querySelector('[data-instrument-overlay]')!.getBoundingClientRect();
        return [...document.querySelectorAll(`section[data-instrument-chapter="${id}"] h2, section[data-instrument-chapter="${id}"] h2 + p`)]
          .some((node) => {
            const text = node.getBoundingClientRect();
            return !(text.right <= overlay.left || text.left >= overlay.right || text.bottom <= overlay.top || text.top >= overlay.bottom);
          });
      }, chapter);
      expect(overlap, `${chapter} copy stays clear of the stage`).toBe(false);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole('button', { name: copy.pause })).toBeVisible();
  });

  test(`${locale} enhanced accessibility tree keeps meaning in HTML and passes axe`, async ({ page }) => {
    test.slow(); // axe over a live SwiftShader canvas
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(copy.route));
    await expectActive(page);

    const tree = await page.locator('[data-instrument]').ariaSnapshot();
    const headings = [...tree.matchAll(/heading "([^"]+)" \[level=(\d)\]/g)].map((match) => `h${match[2]} ${match[1]}`);
    expect(headings).toHaveLength(5);
    expect(headings[0]).toMatch(/^h1 /);
    expect(headings.slice(1).every((heading) => heading.startsWith('h2 '))).toBe(true);
    expect(tree).toContain(`button "${copy.pause}"`);
    expect(tree).not.toMatch(/\bimg\b/);

    for (const state of ['playing', 'paused'] as const) {
      if (state === 'paused') await page.getByRole('button', { name: copy.pause }).click();
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious'), state).toEqual([]);
    }
  });

  test(`${locale} direct entry and language switch reactivate cleanly with valid fragments`, async ({ page }) => {
    test.slow(); // two cold activations
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    const assertNoFailedAssets = observeFailedAssets(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(copy.route));
    await expectActive(page);

    await page.getByRole('banner').getByRole('link', { name: copy.switchLabel }).click();
    await page.waitForURL(`**${appPathname(copy.other)}`);
    await expectActive(page);
    await expect(page.locator('canvas')).toHaveCount(1);

    // Every same-document fragment on Home resolves to an element.
    const missing = await page.evaluate(() => [...document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]')]
      .filter((link) => link.pathname === window.location.pathname && link.hash.length > 1)
      .map((link) => link.hash)
      .filter((hash) => !document.getElementById(decodeURIComponent(hash.slice(1)))));
    expect(missing).toEqual([]);
    assertNoFailedAssets();
    assertNoBrowserErrors();
  });
}

test('the optional Connection film is absent: no video request and no empty frame', async ({ page }) => {
  const media: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'media' || /\.(mp4|webm|mov)(\?|$)/.test(request.url())) media.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(appUrl(locales.es.route));
  await expectActive(page);
  await centreChapter(page, 'connection');
  await expect.poll(() => rendered(page)).toBe('connection');

  const frame = page.locator('section[data-instrument-chapter="connection"] [data-instrument-artwork]');
  const box = await frame.boundingBox();
  expect(box && box.width > 0 && box.height > 0).toBe(true);
  // The frame is either drawn by the canvas (compact overlay) or by its poster, never empty.
  const overlay = await page.locator('[data-instrument-overlay]').boundingBox();
  expect(overlay && intersects(
    { left: overlay.x, right: overlay.x + overlay.width, top: overlay.y, bottom: overlay.y + overlay.height },
    { left: box!.x, right: box!.x + box!.width, top: box!.y, bottom: box!.y + box!.height },
  )).toBe(true);
  await expect(page.locator('video')).toHaveCount(0);
  expect(media).toEqual([]);
});
