import { expect, test, type Page } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { appPathname, appUrl, stableRoutes } from './support/paths';

// The static composition is the complete design; reduced motion keeps it deterministic here.
test.use({ reducedMotion: 'reduce' });

const homeCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.home.es,
    label: 'FURLANICH · Del proceso al sistema',
    statuses: ['ETAPA 01 DE 04', 'ETAPA 02 DE 04', 'ETAPA 03 DE 04', 'ETAPA 04 DE 04'],
    chapters: ['Reconocer el sistema real', 'Ver dónde se fragmenta', 'Conectar lo que importa', 'Coordinar el trabajo'],
    firstDescription: 'Pedidos, reservas, mensajes y tareas ya conviven en un mismo negocio. El primer paso es entender cómo se relacionan.',
    problemsHeading: 'Cuando lo manual empieza a frenar el negocio',
    primary: ['Ver contacto', '/contacto/'],
    secondary: ['Ver servicios', '/servicios/'],
  },
  {
    locale: 'English',
    route: stableRoutes.home.en,
    label: 'FURLANICH · From process to system',
    statuses: ['PHASE 01 OF 04', 'PHASE 02 OF 04', 'PHASE 03 OF 04', 'PHASE 04 OF 04'],
    chapters: ['Recognize the real system', 'See where it fragments', 'Connect what matters', 'Coordinate the work'],
    firstDescription: 'Orders, bookings, messages, and tasks already coexist in one business. The first step is understanding how they relate.',
    problemsHeading: 'When manual work starts holding the business back',
    primary: ['Contact options', '/en/contact/'],
    secondary: ['Explore services', '/en/services/'],
  },
] as const;

const chapterIds = ['recognition', 'fragmentation', 'connection', 'coordination'] as const;

async function box(page: Page, selector: string) {
  const bounds = await page.locator(selector).first().boundingBox();
  expect(bounds, selector).not.toBeNull();
  return bounds!;
}

async function isVisuallyHidden(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return rect.width <= 1 && rect.height <= 1;
  });
}

for (const homeCase of homeCases) {
  test(`${homeCase.locale} homepage renders the complete static instrument before Problems`, async ({ page }) => {
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    await page.goto(appUrl(homeCase.route));
    const main = page.getByRole('main');

    await expect(main.locator('h1')).toHaveCount(1);
    await expect(main.locator('h2').first()).toHaveText(homeCase.chapters[0]);
    await expect(main.locator('h2').nth(4)).toHaveText(homeCase.problemsHeading);
    for (const [index, id] of chapterIds.entries()) {
      const chapter = main.locator(`section[data-instrument-chapter="${id}"]`);
      await expect(chapter.getByRole('heading', { level: 2, name: homeCase.chapters[index], exact: true })).toBeVisible();
      await expect(chapter.locator('[data-phase-status]')).toHaveText(homeCase.statuses[index]);
      await expect(chapter.locator('[data-sequence]')).toHaveAttribute('aria-hidden', 'true');
    }
    await expect(main.getByText(homeCase.firstDescription, { exact: true })).toBeVisible();

    await expect(main.getByRole('link', { name: homeCase.primary[0], exact: true }).first()).toHaveAttribute('href', appPathname(homeCase.primary[1]));
    await expect(main.getByRole('link', { name: homeCase.secondary[0], exact: true }).first()).toHaveAttribute('href', appPathname(homeCase.secondary[1]));

    const images = main.locator('[data-instrument] img');
    for (const image of await images.all()) {
      await expect(image).toHaveAttribute('alt', '');
    }
    await expect(main.locator('canvas, video')).toHaveCount(0);
    assertNoBrowserErrors();
  });

  test(`${homeCase.locale} homepage keeps the chapter sequence, links and posters without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(appUrl(homeCase.route));
    const main = page.getByRole('main');

    await expect(main.locator('section[data-instrument-chapter] h2')).toHaveText([...homeCase.chapters]);
    await expect(main.getByRole('link', { name: homeCase.primary[0], exact: true }).first()).toHaveAttribute('href', appPathname(homeCase.primary[1]));
    for (const id of chapterIds) {
      const poster = main.locator(`section[data-instrument-chapter="${id}"] img`);
      await poster.scrollIntoViewIfNeeded();
      await expect(poster).toHaveAttribute('src', appPathname(`/brand/immersive/${id}.svg`).replace(/\/$/, ''));
      expect(await poster.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    }
    await context.close();
  });
}

test('wide 1440 composes the anchor, phase spine and a continuous 4:5 stage', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(appUrl(stableRoutes.home.es));

  const anchor = await box(page, 'section[aria-labelledby="home-heading"]');
  const stage = await box(page, '[data-instrument] > div > [data-instrument-artwork="recognition"]');
  expect(stage.x).toBeGreaterThan(anchor.x + anchor.width);
  expect(stage.height).toBeGreaterThanOrEqual(stage.width);

  for (const id of chapterIds.slice(1)) {
    const heading = await box(page, `section[data-instrument-chapter="${id}"] h2`);
    const artwork = await box(page, `section[data-instrument-chapter="${id}"] [data-instrument-artwork]`);
    expect(artwork.x).toBeGreaterThan(heading.x + heading.width);
    expect(artwork.height / artwork.width).toBeCloseTo(1.25, 1);
    await expect(page.locator(`section[data-instrument-chapter="${id}"] [data-phase-spine]`)).toBeVisible();
    expect(await isVisuallyHidden(page, `section[data-instrument-chapter="${id}"] [data-phase-status]`)).toBe(false);
  }
  await expect(page.locator('section[data-instrument-chapter="recognition"] [data-instrument-artwork]')).toBeHidden();
});

test('compact 1024 keeps two zones with fewer simultaneous labels', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(appUrl(stableRoutes.home.en));

  const heading = await box(page, 'section[data-instrument-chapter="connection"] h2');
  const artwork = await box(page, 'section[data-instrument-chapter="connection"] [data-instrument-artwork]');
  expect(artwork.x).toBeGreaterThan(heading.x + heading.width);
  for (const id of chapterIds) {
    expect(await isVisuallyHidden(page, `section[data-instrument-chapter="${id}"] [data-phase-status]`)).toBe(true);
    await expect(page.locator(`section[data-instrument-chapter="${id}"] [data-phase-status]`)).toHaveCount(1);
  }
});

for (const width of [768, 390, 320] as const) {
  test(`sequential ${width} flow places each poster after its copy as a square`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(appUrl(stableRoutes.home.es));

    await expect(page.locator('[data-instrument] > div > [data-instrument-artwork="recognition"]')).toBeHidden();
    for (const id of chapterIds) {
      const description = await box(page, `section[data-instrument-chapter="${id}"] h2 + p`);
      const artwork = await box(page, `section[data-instrument-chapter="${id}"] [data-instrument-artwork]`);
      expect(artwork.y).toBeGreaterThanOrEqual(description.y + description.height);
      expect(Math.abs(artwork.width - artwork.height)).toBeLessThanOrEqual(2);
      await expect(page.locator(`section[data-instrument-chapter="${id}"] [data-phase-spine]`)).toBeHidden();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test('320 condenses nonessential metadata and keeps full-width actions', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(appUrl(stableRoutes.home.es));

  await expect(page.getByText('FURLANICH · Del proceso al sistema', { exact: true })).toBeHidden();
  expect(await isVisuallyHidden(page, 'section[data-instrument-chapter="recognition"] [data-phase-status]')).toBe(true);
  const main = page.getByRole('main');
  const action = await main.getByRole('link', { name: 'Ver contacto', exact: true }).first().boundingBox();
  expect(action!.width).toBeGreaterThanOrEqual(270);
});
