import { inflateSync } from 'node:zlib';
import { expect, test, type Page } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { appPathname, appUrl, stableRoutes } from './support/paths';

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

// D-01: no ancestor of the fixed ground/scrim layers may create a stacking context.
// Transform, filter, opacity < 1, isolation and a positioned z-index all qualify, and none
// of them are used anywhere in this tree.
async function noStackingContextAncestors(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((element) => {
    const findings: string[] = [];
    let node: Element | null = element.parentElement;
    while (node && node !== document.documentElement) {
      const style = getComputedStyle(node);
      if (style.transform !== 'none') findings.push(`${node.tagName} has a transform`);
      if (style.filter !== 'none') findings.push(`${node.tagName} has a filter`);
      if (Number.parseFloat(style.opacity) < 1) findings.push(`${node.tagName} has opacity < 1`);
      if (style.isolation === 'isolate') findings.push(`${node.tagName} isolates`);
      if (style.position !== 'static' && style.zIndex !== 'auto') {
        findings.push(`${node.tagName} is positioned with a z-index`);
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
    assertNoBrowserErrors();
  });

  test(`${homeCase.locale} hero root carries the Home readout`, async ({ page }) => {
    await page.goto(appUrl(homeCase.route));
    await expect(page.locator('section[aria-labelledby="home-heading"]')).toHaveAttribute('data-readout', homeCase.readout);
  });

  // RED 1: the hero top equals the header top. D-11 pulls the hero up by the full App Bar
  // height via a negative margin, so its rendered top sits exactly at the bar's own edge.
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

  // RED 4: chapter plate width is capped at 520px from 768px up, and matches the container
  // (full width) at 390.
  test(`${homeCase.locale} chapter plate width follows D-12 at 1440 and 390`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(appUrl(homeCase.route));
    for (const width of await page.locator('section[data-instrument-chapter]').evaluateAll((chapters) =>
      chapters.map((chapter) => chapter.getBoundingClientRect().width),
    )) {
      expect(width).toBeLessThanOrEqual(520);
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
for (const width of [1440, 390] as const) {
  test(`the environment ground actually paints (not the Bone canvas) at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await page.goto(appUrl(stableRoutes.home.es));
    const point = await pointBetweenChapters(page);
    const png = await page.screenshot({ clip: { x: point.x, y: point.y, width: 1, height: 1 } });
    const pixel = readSinglePixelPng(png);
    // Bone (#F9F6EE) is (249, 246, 238); the D-02 night ground is dark navy in every stop
    // (#06121F.. #0E2B4A). A generous per-channel threshold well below Bone's darkest
    // channel (238) keeps this robust to anti-aliasing at the sampled point.
    expect(pixel.r, JSON.stringify(pixel)).toBeLessThan(200);
    expect(pixel.g, JSON.stringify(pixel)).toBeLessThan(200);
    expect(pixel.b, JSON.stringify(pixel)).toBeLessThan(200);
  });
}

// RED 6: the D-03 scrim gradient, wide (90deg, left to right) and compact (180deg, top to
// bottom).
test('the scrim uses the D-03 gradient at 1440 and 390', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(appUrl(stableRoutes.home.es));
  const wideImage = await page.locator('[data-environment-scrim]').evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(wideImage).toContain('90deg');
  expect(wideImage.match(/rgba?\(6,\s*18,\s*31/g)?.length).toBe(3);

  await page.setViewportSize({ width: 390, height: 844 });
  const compactImage = await page.locator('[data-environment-scrim]').evaluate((el) => getComputedStyle(el).backgroundImage);
  // 180deg is linear-gradient()'s own default direction ("to bottom"), so Chromium's
  // computed style omits the angle entirely rather than printing "180deg" back out. The
  // absence of the wide (90deg) marker, together with the stop order (transparent first,
  // opaque last -- the opposite order from the wide gradient), is the compact signature.
  expect(compactImage).not.toContain('90deg');
  expect(compactImage.match(/rgba?\(6,\s*18,\s*31/g)?.length).toBe(3);
  const alphas = [...compactImage.matchAll(/rgba\(6,\s*18,\s*31,\s*([\d.]+)\)/g)].map((match) => Number.parseFloat(match[1]));
  expect(alphas).toEqual([0, 0.55, 0.82]);
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
