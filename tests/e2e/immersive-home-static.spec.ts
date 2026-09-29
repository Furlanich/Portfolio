import { inflateSync } from 'node:zlib';
import { chromium, expect, test, type Page } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { appPathname, appUrl, normalizeBasePath, stableRoutes } from './support/paths';

// The static composition is the complete design; reduced motion keeps it deterministic here.
test.use({ reducedMotion: 'reduce' });

const chapterIds = ['recognition', 'fragmentation', 'connection', 'coordination'] as const;

const homeCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.home.es,
    label: 'FURLANICH · Del proceso al sistema',
    plates: ['Lámina 01/04', 'Lámina 02/04', 'Lámina 03/04', 'Lámina 04/04'],
    kickers: ['Reconocer', 'Fragmentar', 'Conectar', 'Coordinar'],
    chapters: ['Reconocer el sistema real', 'Ver dónde se fragmenta', 'Conectar lo que importa', 'Coordinar el trabajo'],
    firstDescription: 'Pedidos, reservas, mensajes y tareas ya conviven en un mismo negocio. El primer paso es entender cómo se relacionan.',
    readout: 'Inicio',
    primary: ['Ver contacto', '/contacto/'],
    secondary: ['Ver servicios', '/servicios/'],
  },
  {
    locale: 'English',
    route: stableRoutes.home.en,
    label: 'FURLANICH · From process to system',
    plates: ['Plate 01/04', 'Plate 02/04', 'Plate 03/04', 'Plate 04/04'],
    kickers: ['Recognize', 'Fragment', 'Connect', 'Coordinate'],
    chapters: ['Recognize the real system', 'See where it fragments', 'Connect what matters', 'Coordinate the work'],
    firstDescription: 'Orders, bookings, messages, and tasks already coexist in one business. The first step is understanding how they relate.',
    readout: 'Home',
    primary: ['Contact options', '/en/contact/'],
    secondary: ['Explore services', '/en/services/'],
  },
] as const;

// D-01: no ancestor of the fixed ground/scrim layers may create a stacking context. This
// checks every CSS mechanism that creates one: transform (and the individual translate/
// rotate/scale properties), filter, backdrop-filter, opacity < 1, isolation, mix-blend-mode,
// clip-path, mask/mask-image, a container-type, a paint/layout/strict/content `contain`
// value, a `will-change` naming any of those, position: fixed or sticky (which always
// creates one, regardless of z-index), a positioned element with a non-auto z-index, and a
// non-auto z-index on a flex or grid child (which creates one without `position` at all).
// None of them are used anywhere in this tree.
async function noStackingContextAncestors(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((element) => {
    // Defined inside the callback: `page.evaluate` serializes only the function body, not its
    // enclosing closure, so module-level constants are not visible in the browser context.
    const stackingWillChange = /\b(transform|opacity|filter|backdrop-filter|perspective|clip-path|mask(?:-image)?|isolation|position|contain)\b/;
    const stackingContain = /\b(paint|layout|strict|content)\b/;

    const findings: string[] = [];
    let node: Element | null = element.parentElement;
    while (node && node !== document.documentElement) {
      const style = getComputedStyle(node);
      const parentDisplay = node.parentElement ? getComputedStyle(node.parentElement).display : '';

      if (style.transform !== 'none') findings.push(`${node.tagName} has a transform`);
      if (style.translate !== 'none') findings.push(`${node.tagName} has a translate`);
      if (style.rotate !== 'none') findings.push(`${node.tagName} has a rotate`);
      if (style.scale !== 'none') findings.push(`${node.tagName} has a scale`);
      if (style.filter !== 'none') findings.push(`${node.tagName} has a filter`);
      if (style.backdropFilter && style.backdropFilter !== 'none') findings.push(`${node.tagName} has a backdrop-filter`);
      if (Number.parseFloat(style.opacity) < 1) findings.push(`${node.tagName} has opacity < 1`);
      if (style.isolation === 'isolate') findings.push(`${node.tagName} isolates`);
      if (style.mixBlendMode && style.mixBlendMode !== 'normal') findings.push(`${node.tagName} has a mix-blend-mode`);
      if (style.clipPath && style.clipPath !== 'none') findings.push(`${node.tagName} has a clip-path`);
      if (style.maskImage && style.maskImage !== 'none') findings.push(`${node.tagName} has a mask-image`);
      if (style.containerType && style.containerType !== 'normal') findings.push(`${node.tagName} has a container-type`);
      if (style.contain && stackingContain.test(style.contain)) findings.push(`${node.tagName} has a stacking contain value`);
      if (style.willChange && stackingWillChange.test(style.willChange)) findings.push(`${node.tagName} has a stacking will-change`);
      if (style.position === 'fixed' || style.position === 'sticky') {
        findings.push(`${node.tagName} is position: ${style.position}`);
      }
      if (style.position !== 'static' && style.zIndex !== 'auto') {
        findings.push(`${node.tagName} is positioned with a z-index`);
      }
      if (style.zIndex !== 'auto' && (parentDisplay === 'flex' || parentDisplay === 'grid')) {
        findings.push(`${node.tagName} has a z-index as a flex/grid child`);
      }

      node = node.parentElement;
    }
    return findings;
  });
}

// Decodes the single pixel of a 1x1 PNG buffer (as produced by `page.screenshot({ clip })`
// with `width: 1, height: 1`). For the very first pixel of a PNG's first scanline, every
// filter type (None/Sub/Up/Average/Paeth) reconstructs to "no change" -- their left, above
// and upper-left neighbours are all defined as 0 at that position -- so the raw inflated
// bytes right after the one filter-type byte are already the final channel values. This
// intentionally does not generalize to other pixel positions.
function readSinglePixelPng(png: Buffer): { r: number; g: number; b: number } {
  let offset = 8; // skip the fixed 8-byte PNG signature
  let colorType = -1;
  const idatParts: Buffer[] = [];
  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.toString('ascii', offset + 4, offset + 8);
    const data = png.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') colorType = data.readUInt8(9);
    else if (type === 'IDAT') idatParts.push(data);
    else if (type === 'IEND') break;
    offset += 12 + length;
  }
  if (colorType !== 6 && colorType !== 2) {
    throw new Error(`Unsupported PNG colorType ${colorType} for single-pixel sampling`);
  }
  const raw = inflateSync(Buffer.concat(idatParts));
  return { r: raw[1], g: raw[2], b: raw[3] };
}

// A point that is reliably part of the environment (not covered by any content), at any
// viewport width: the vertical gap the D-10 chapter spacing leaves between two chapter
// plates. Scrolls so that gap sits in the current viewport, then returns its viewport-
// relative midpoint, matching the coordinate space `page.screenshot({ clip })` expects.
async function pointBetweenChapters(page: Page): Promise<{ x: number; y: number }> {
  const initial = await page.evaluate(() => {
    const [first, second] = [...document.querySelectorAll('section[data-instrument-chapter]')];
    const firstRect = first.getBoundingClientRect();
    const secondRect = second.getBoundingClientRect();
    return {
      x: firstRect.left + 10,
      documentMidY: window.scrollY + (firstRect.bottom + secondRect.top) / 2,
    };
  });
  await page.evaluate((targetY) => window.scrollTo(0, Math.max(0, targetY - window.innerHeight / 2)), initial.documentMidY);
  const y = await page.evaluate(
    (targetDocumentY) => targetDocumentY - window.scrollY,
    initial.documentMidY,
  );
  return { x: initial.x, y };
}

for (const homeCase of homeCases) {
  test(`${homeCase.locale} homepage renders the complete static composition before Problems`, async ({ page }) => {
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    await page.goto(appUrl(homeCase.route));
    const main = page.getByRole('main');

    await expect(main.locator('h1')).toHaveCount(1);
    await expect(main.locator('h2').first()).toHaveText(homeCase.chapters[0]);
    for (const [index, id] of chapterIds.entries()) {
      const chapter = main.locator(`section[data-instrument-chapter="${id}"]`);
      await expect(chapter.getByRole('heading', { level: 2, name: homeCase.chapters[index], exact: true })).toBeVisible();
      await expect(chapter).toHaveAttribute('data-readout', homeCase.readout);
    }
    await expect(main.getByText(homeCase.firstDescription, { exact: true })).toBeVisible();
    await expect(main.getByText(homeCase.label, { exact: true })).toBeVisible();

    await expect(main.getByRole('link', { name: homeCase.primary[0], exact: true }).first()).toHaveAttribute('href', appPathname(homeCase.primary[1]));
    await expect(main.getByRole('link', { name: homeCase.secondary[0], exact: true }).first()).toHaveAttribute('href', appPathname(homeCase.secondary[1]));

    await expect(main.locator('canvas, video, img')).toHaveCount(0);

    // The test title claims the chapters render "before Problems": prove the DOM order, not
    // just that both exist. Problems is HomeProblems.tsx's own `#problems` (not owned by
    // Task 8), so this only reads it by id rather than asserting anything about its content.
    const chaptersPrecedeProblems = await page.evaluate((lastChapterId) => {
      const lastChapter = document.querySelector(`section[data-instrument-chapter="${lastChapterId}"]`);
      const problems = document.querySelector('#problems');
      if (!lastChapter || !problems) return false;
      return Boolean(lastChapter.compareDocumentPosition(problems) & Node.DOCUMENT_POSITION_FOLLOWING);
    }, chapterIds[chapterIds.length - 1]);
    expect(chaptersPrecedeProblems, 'the last chapter must precede #problems in the DOM').toBe(true);

    assertNoBrowserErrors();
  });

  test(`${homeCase.locale} hero root carries the Home readout`, async ({ page }) => {
    await page.goto(appUrl(homeCase.route));
    await expect(page.locator('section[aria-labelledby="home-heading"]')).toHaveAttribute('data-readout', homeCase.readout);
  });

  // RED 1: the hero top equals the header top. D-11 pulls the hero up by the full App Bar
  // height via a negative margin, so its rendered top sits exactly at the bar's own edge.
  //
  // DEVIATION: this only asserts the margin-top formula and that the hero's top is at or
  // above the header's bottom edge, not literal top-to-top equality. The header here is the
  // pre-Task-6 header (Task 8 merges before Task 6 in the plan's Wave 2 order), so its
  // rendered height is not yet the approved 84px `--app-bar-height`; asserting equality now
  // would either be vacuously true against the wrong header height or fail for a reason that
  // has nothing to do with this task's own D-11 work. Task 11 (integration hardening, after
  // Task 6 merges) is the right place to assert `|heroTop - headerTop| <= 1` against the real
  // 84px bar.
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }] as const) {
    test(`${homeCase.locale} hero is pulled up under the App Bar at ${viewport.width}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(appUrl(homeCase.route));

      const appBarHeight = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--app-bar-height').trim(),
      );
      const hero = page.locator('section[aria-labelledby="home-heading"]');
      await expect(hero).toHaveCSS('margin-top', `-${appBarHeight}`);

      const heroBox = await hero.boundingBox();
      const headerBox = await page.locator('header').first().boundingBox();
      expect(heroBox).not.toBeNull();
      expect(headerBox).not.toBeNull();
      // The negative margin pulls the hero's visible top at or above the header's own
      // bottom edge, so it renders underneath the bar rather than below it.
      expect(heroBox!.y).toBeLessThanOrEqual(headerBox!.y + headerBox!.height);
    });
  }

  // N7: below 480px the hero actions are full width (D-11), which also forces them onto
  // separate rows since they no longer fit side by side in the flex-wrap row.
  test(`${homeCase.locale} hero actions are full width below 480`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(appUrl(homeCase.route));
    const primary = page.getByRole('link', { name: homeCase.primary[0], exact: true }).first();
    const secondary = page.getByRole('link', { name: homeCase.secondary[0], exact: true }).first();
    const actionsWidth = await primary.evaluate((el) => el.parentElement!.getBoundingClientRect().width);
    const primaryBox = await primary.boundingBox();
    const secondaryBox = await secondary.boundingBox();
    expect(primaryBox).not.toBeNull();
    expect(secondaryBox).not.toBeNull();
    expect(Math.abs(primaryBox!.width - actionsWidth)).toBeLessThanOrEqual(1);
    expect(Math.abs(secondaryBox!.width - actionsWidth)).toBeLessThanOrEqual(1);
    expect(secondaryBox!.y).toBeGreaterThan(primaryBox!.y + primaryBox!.height / 2);
  });

  // Fidelity finding (orchestrator's side-by-side against sky-chart-reference.html at 1440):
  // D-11 does not specify a trust-row max-width; the reference prototype's 760px was never an
  // approved requirement. The approved English availability sentence is longer than the
  // reference's shortened placeholder and wrapped to a second line inside that 760px cap.
  // Because the hero is bottom-aligned, the extra line lifted the H1 about 50px higher than
  // the reference, colliding with the runtime's node labels ("Simplify"/"Orders",
  // "Messages"/trust text). Both locales must fit the trust line and availability sentence on
  // one row at 1440.
  test(`${homeCase.locale} trust row items share one row at 1440`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(homeCase.route));
    const tops = await page.evaluate(() => {
      const hero = document.querySelector('section[aria-labelledby="home-heading"]')!;
      return [...hero.querySelectorAll('p')].slice(-2).map((p) => p.getBoundingClientRect().top);
    });
    expect(tops).toHaveLength(2);
    expect(Math.abs(tops[0] - tops[1]), JSON.stringify(tops)).toBeLessThanOrEqual(2);

    // The reference prototype's H1 bottom sits at roughly 460px in this same 1440x900 frame;
    // wrapping the trust row to two lines pushed it noticeably higher than that.
    const h1Bottom = await page.locator('h1#home-heading').evaluate((el) => el.getBoundingClientRect().bottom);
    expect(h1Bottom).toBeGreaterThanOrEqual(460);
  });

  // RED 2: the H1 uses the D-09 display-1 scale, which clamps to exactly 96px at 1440 and
  // to its 44px floor at 320.
  test(`${homeCase.locale} H1 uses the display-1 clamp at 1440 and 320`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(homeCase.route));
    const h1 = page.locator('h1#home-heading');
    await expect(h1).toHaveCSS('font-size', '96px');

    await page.setViewportSize({ width: 320, height: 800 });
    const fontSize = await h1.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(44);
  });

  // RED 3: four chapter sections, each wrapping an atlas plate, with no artwork frame left.
  test(`${homeCase.locale} four chapters each wrap an atlas plate with no artwork frame`, async ({ page }) => {
    await page.goto(appUrl(homeCase.route));
    const chapters = page.locator('section[data-instrument-chapter]');
    await expect(chapters).toHaveCount(4);
    await expect(page.locator('[data-instrument-artwork]')).toHaveCount(0);

    for (const [index, id] of chapterIds.entries()) {
      const chapter = page.locator(`section[data-instrument-chapter="${id}"]`);
      const plate = chapter.locator('> div').first();
      // D-05's registration radius: the deterministic signature of an atlas plate.
      await expect(plate).toHaveCSS('border-radius', '18px');
      await expect(chapter.getByText(homeCase.plates[index], { exact: true })).toHaveAttribute('aria-hidden', 'true');
      await expect(chapter.getByText(homeCase.kickers[index], { exact: true })).toBeVisible();
    }
  });

  // RED 4: chapter plate width is capped at 520px from 768px up (checked at 1440, 1024 and
  // 768, D-12's own breakpoint), and matches the container (full width) at 390.
  test(`${homeCase.locale} chapter plate width follows D-12 at 1440, 1024, 768 and 390`, async ({ page }) => {
    for (const width of [1440, 1024, 768] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(appUrl(homeCase.route));
      for (const chapterWidth of await page.locator('section[data-instrument-chapter]').evaluateAll((chapters) =>
        chapters.map((chapter) => chapter.getBoundingClientRect().width),
      )) {
        expect(chapterWidth, `width ${width}`).toBeLessThanOrEqual(520);
      }
    }

    await page.setViewportSize({ width: 390, height: 844 });
    // The container's own bounding box includes its horizontal padding, so the content-box
    // width available to a chapter is that box minus its own left/right padding.
    const contentWidth = await page.locator('[data-instrument-chapters]').evaluate((el) => {
      const style = getComputedStyle(el);
      return el.getBoundingClientRect().width - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight);
    });
    for (const width of await page.locator('section[data-instrument-chapter]').evaluateAll((chapters) =>
      chapters.map((chapter) => chapter.getBoundingClientRect().width),
    )) {
      expect(Math.abs(width - contentWidth)).toBeLessThanOrEqual(1);
    }
  });
}

// RED 5: EnvironmentGround is a fixed, z-index -3, aria-hidden layer, and nothing between it
// and <html> creates a stacking context that would trap it or a WebGL portal beside it.
test('EnvironmentGround is a fixed z-index -3 layer with no stacking-context ancestor', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.home.es));
  const ground = page.locator('[data-environment-ground]');
  await expect(ground).toHaveAttribute('aria-hidden', 'true');
  await expect(ground).toHaveCSS('position', 'fixed');
  await expect(ground).toHaveCSS('z-index', '-3');
  expect(await noStackingContextAncestors(page, '[data-environment-ground]')).toEqual([]);

  const scrim = page.locator('[data-environment-scrim]');
  await expect(scrim).toHaveAttribute('aria-hidden', 'true');
  await expect(scrim).toHaveCSS('position', 'fixed');
  await expect(scrim).toHaveCSS('z-index', '-1');
  expect(await noStackingContextAncestors(page, '[data-environment-scrim]')).toEqual([]);
});

// `body` carries no background of its own (app/globals.css, Task 8 lock transfer L-02). If
// it did, that background would paint as an ordinary block background above every negative
// z-index layer of the root stacking context, hiding the ground and scrim regardless of
// their own (correct) CSS. With `body` transparent, `html`'s background only paints the
// document canvas, and the ground and scrim render above it.
test('body has no background colour of its own', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.home.es));
  const bodyBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bodyBackground).toBe('rgba(0, 0, 0, 0)');
});

// On Home only, `html` takes the lightest D-02 ground stop (#0E2B4A) instead of Bone: a safe
// fallback if the ground ever failed to paint, and a conservative background for tools (axe)
// that cannot see the fixed ground layer and fall back to `html`'s own background. Every
// other route keeps the approved Bone canvas untouched.
for (const route of [stableRoutes.home.es, stableRoutes.home.en]) {
  test(`html takes the D-02 ground colour on Home (${route})`, async ({ page }) => {
    await page.goto(appUrl(route));
    const htmlBackground = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
    expect(htmlBackground).toBe('rgb(14, 43, 74)');
  });
}

test('html keeps the Bone canvas on non-Home routes', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.services.en));
  const htmlBackground = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
  expect(htmlBackground).toBe('rgb(249, 246, 238)');
});

// The ground is not just declared correctly (RED 5): it must actually be the pixel that
// paints in an area no content covers, at both a wide and a compact width. This is the
// direct regression test for the root-canvas occlusion above -- without the app/globals.css
// fix it fails here even though every `getComputedStyle` assertion on `.ground` passes.
//
// The Bone-exclusion threshold alone is not enough any more: `html` itself is now dark
// (#0E2B4A, the N1 fix below) on Home, so a *missing* ground would also sample as "not Bone"
// at this point. The differential half hides the ground and re-samples the same point,
// asserting the pixel changes materially -- that only happens if a real ground layer was
// covering `html`'s flat colour with its own (different, gradient) colour in the first place.
for (const width of [1440, 390] as const) {
  test(`the environment ground actually paints (not the Bone canvas) at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await page.goto(appUrl(stableRoutes.home.es));
    const point = await pointBetweenChapters(page);
    const clip = { x: point.x, y: point.y, width: 1, height: 1 };

    const shown = readSinglePixelPng(await page.screenshot({ clip }));
    // Bone (#F9F6EE) is (249, 246, 238); the D-02 night ground is dark navy in every stop
    // (#06121F.. #0E2B4A). A generous per-channel threshold well below Bone's darkest
    // channel (238) keeps this robust to anti-aliasing at the sampled point.
    expect(shown.r, JSON.stringify(shown)).toBeLessThan(200);
    expect(shown.g, JSON.stringify(shown)).toBeLessThan(200);
    expect(shown.b, JSON.stringify(shown)).toBeLessThan(200);

    await page.locator('[data-environment-ground]').evaluate((element) => {
      (element as HTMLElement).style.visibility = 'hidden';
    });
    const hidden = readSinglePixelPng(await page.screenshot({ clip }));
    const delta = Math.abs(shown.r - hidden.r) + Math.abs(shown.g - hidden.g) + Math.abs(shown.b - hidden.b);
    // The sampled point can land near the gradient's darkest stop (close to html's own
    // #0E2B4A fallback), so the real observed delta is modest (high teens) even when the
    // ground is genuinely painting; anti-aliasing noise alone is a few units. 8 sits clearly
    // above noise and below every real delta measured during development.
    expect(delta, `shown ${JSON.stringify(shown)} vs hidden ${JSON.stringify(hidden)}`).toBeGreaterThan(8);
  });
}

// RED 6: the full D-03 scrim gradient string, wide (90deg, left to right) and compact
// (linear-gradient()'s own default "to bottom" direction, so Chromium's computed style omits
// the angle rather than printing "180deg" back out), including every stop's alpha and
// position. An exact match (not a substring/count check) so a wrong stop, a wrong position or
// a swapped alpha order all fail this test, not just a missing or extra colour.
test('the scrim uses the full D-03 gradient string at 1440 and 390', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(appUrl(stableRoutes.home.es));
  const wideImage = await page.locator('[data-environment-scrim]').evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(wideImage).toBe('linear-gradient(90deg, rgba(6, 18, 31, 0.78) 0%, rgba(6, 18, 31, 0.5) 34%, rgba(6, 18, 31, 0) 62%)');

  await page.setViewportSize({ width: 390, height: 844 });
  const compactImage = await page.locator('[data-environment-scrim]').evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(compactImage).toBe('linear-gradient(rgba(6, 18, 31, 0) 0%, rgba(6, 18, 31, 0.55) 45%, rgba(6, 18, 31, 0.82) 100%)');
});

// RED 7: no horizontal overflow at 320, in either locale.
for (const homeCase of homeCases) {
  test(`${homeCase.locale} has no horizontal overflow at 320`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(appUrl(homeCase.route));
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}

// RED 8: without JavaScript the complete document renders, and nothing other than the H1's
// own text competes for the largest-contentful-paint role (no img, video or canvas exists).
for (const homeCase of homeCases) {
  test(`${homeCase.locale} renders the complete document with JavaScript disabled`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(appUrl(homeCase.route));
    const main = page.getByRole('main');

    await expect(main.locator('h1')).toHaveCount(1);
    await expect(main.locator('h1')).toBeVisible();
    await expect(main.locator('section[data-instrument-chapter] h2')).toHaveText([...homeCase.chapters]);
    await expect(main.getByRole('link', { name: homeCase.primary[0], exact: true }).first()).toHaveAttribute('href', appPathname(homeCase.primary[1]));
    // No image, video or canvas exists anywhere on Home, so the H1 (or another text node)
    // is necessarily the largest paintable candidate.
    await expect(page.locator('img, video, canvas')).toHaveCount(0);
    await expect(page.locator('[data-environment-ground]')).toHaveCount(1);
    await context.close();
  });
}

// RED 8 (JS-enabled complement): directly confirm the H1 is the LCP element with a real
// `PerformanceObserver`, rather than only inferring it from "no other candidate exists".
for (const homeCase of homeCases) {
  test(`${homeCase.locale} H1 is the reported Largest Contentful Paint element`, async ({ page }) => {
    await page.goto(appUrl(homeCase.route));
    const lcpTag = await page.evaluate(
      () =>
        new Promise<string | null>((resolve) => {
          let lastTag: string | null = null;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const element = (entry as PerformanceEntry & { element?: Element }).element;
              if (element) lastTag = `${element.tagName}#${element.id}`;
            }
          });
          observer.observe({ type: 'largest-contentful-paint', buffered: true });
          // LCP reporting stops on user input; none occurs here, so a short wait after
          // `load` is enough to collect the buffered entry without racing it.
          setTimeout(() => {
            observer.disconnect();
            resolve(lastTag);
          }, 500);
        }),
    );
    expect(lcpTag).toBe('H1#home-heading');
  });
}

// RED 9: at 200% zoom (simulated, as elsewhere in this suite, by halving the viewport) the
// hero's content is allowed to grow past 100svh instead of being clipped to it.
for (const homeCase of homeCases) {
  test(`${homeCase.locale} hero grows past the viewport at 200% zoom without clipping`, async ({ page }) => {
    // 1440x900 at 200% zoom is a 720x450 CSS viewport, matching the convention used by the
    // enhanced acceptance suite for the same simulated zoom level.
    await page.setViewportSize({ width: 720, height: 450 });
    await page.goto(appUrl(homeCase.route));

    const hero = page.locator('section[aria-labelledby="home-heading"]');
    await expect(hero).toHaveCSS('overflow', 'visible');
    const heroHeight = await hero.evaluate((el) => el.getBoundingClientRect().height);
    expect(heroHeight).toBeGreaterThan(450);

    const h1Box = await page.locator('h1#home-heading').boundingBox();
    expect(h1Box).not.toBeNull();
    expect(h1Box!.height).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

// D-23 / Task 10: the environment poster is the final static art in every static path. It is a
// decorative CSS background (no alt) that switches from the wide to the compact WebP below 768px
// and carries the optional deployment base path in its URL. The whole file runs under reduced
// motion, which is itself one of the static paths.
const posterBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? '');
const posterCases = [
  { width: 1440, height: 900, served: 'environment-wide.webp', other: 'environment-compact.webp' },
  { width: 390, height: 844, served: 'environment-compact.webp', other: 'environment-wide.webp' },
] as const;

for (const posterCase of posterCases) {
  test(`the environment poster layer serves ${posterCase.served} at ${posterCase.width} in static mode`, async ({ page }) => {
    await page.setViewportSize({ width: posterCase.width, height: posterCase.height });
    await page.goto(appUrl(stableRoutes.home.es));
    const poster = page.locator('[data-environment-poster]');
    await expect(poster).toHaveCount(1);
    await expect(poster).toHaveAttribute('aria-hidden', 'true');

    const backgroundImage = await poster.evaluate((element) => getComputedStyle(element).backgroundImage);
    expect(backgroundImage).toContain(posterCase.served);
    expect(backgroundImage).not.toContain(posterCase.other);
    expect(backgroundImage).toContain(`${posterBasePath}/brand/sky-chart/${posterCase.served}`);
    await expect(poster).toHaveCSS('background-size', 'cover');
    await expect(poster).toHaveCSS('background-position', '70% 30%');

    // Static mode shows the poster; it never hides in reduced motion.
    await expect(poster).toHaveCSS('visibility', 'visible');

    // The URL the layer asks for is a real WebP.
    const url = backgroundImage.match(/url\("([^"]+)"\)/)?.[1];
    expect(url, backgroundImage).toBeTruthy();
    const response = await page.request.get(url!);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/webp');
  });
}

// Once the WebGL scene has painted its first frame the poster hides beneath the canvas. The
// software-renderer gate sends headless Chromium's SwiftShader to static, so this test uses the
// documented test-only override, the SwiftShader launch flags (a worker-scoped option that a
// describe block cannot set, hence its own browser) and reduced motion off.
test('the poster hides once data-immersive-mode is webgl', async ({ baseURL }) => {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    const context = await browser.newContext({ baseURL, reducedMotion: 'no-preference', viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.addInitScript(() => {
      (window as typeof window & { __SKY_CHART_ALLOW_SOFTWARE_RENDERER__?: boolean }).__SKY_CHART_ALLOW_SOFTWARE_RENDERER__ = true;
    });
    await page.goto(appUrl(stableRoutes.home.es));
    const poster = page.locator('[data-environment-poster]');
    await expect(poster).toHaveCSS('visibility', 'visible');
    await expect.poll(() => page.locator('[data-instrument]').getAttribute('data-immersive-mode'), { timeout: 20_000 }).toBe('webgl');
    await expect(poster).toHaveCSS('visibility', 'hidden');
  } finally {
    await browser.close();
  }
});
