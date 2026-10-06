import { expect, test } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { appPathname, appUrl, stableRoutes } from './support/paths';

// PLAN-SPF-V1 Task 3 (dated 2026-10-06): the Projects index holds both complete dossiers and the six
// project-detail destinations are retired, so the former detail-page and card tests are replaced by
// dossier tests and by negative assertions. Exact copy lives in connected-studio-static.spec.ts.

const MPC_SOURCE = 'https://github.com/Furlanich/MilkyPantsCheese-Administracion-';

const projectCases = [
  {
    locale: 'Spanish',
    index: stableRoutes.projects.es,
    founder: stableRoutes.founder.es,
    titles: ['Gestión de reservas para transporte de pasajeros', 'Gestión multiusuario de campañas de rol'],
    relationship: 'Repositorio publicado por el fundador con otro colaborador. No se presenta como trabajo para un cliente.',
    mpcTitle: 'MPC Administración',
    mpcAction: 'Ver código fuente',
    retiredAction: /Ver proyecto|Ver el proyecto/,
  },
  {
    locale: 'English',
    index: stableRoutes.projects.en,
    founder: stableRoutes.founder.en,
    titles: ['Passenger transport reservation management', 'Multi-user role-playing campaign management'],
    relationship: 'Founder-published repository with another contributor. It is not presented as client work.',
    mpcTitle: 'MPC Administración',
    mpcAction: 'View source code',
    retiredAction: /View project|View the project/,
  },
] as const;

const slugs = ['general-reservation-system', 'the-system'] as const;

for (const projectCase of projectCases) {
  test(`${projectCase.locale} Projects publishes GRS then The-System as two complete dossiers`, async ({ page }) => {
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    await page.goto(appUrl(projectCase.index));

    const main = page.getByRole('main');
    await expect(main.getByRole('heading', { level: 1 })).toHaveCount(1);
    const dossiers = main.locator('article');
    await expect(dossiers).toHaveCount(2);
    for (const [index, slug] of slugs.entries()) {
      await expect(dossiers.nth(index)).toHaveAttribute('id', slug);
      await expect(dossiers.nth(index)).toHaveAttribute('data-project-slug', slug);
      await expect(dossiers.nth(index).getByRole('heading', { level: 2, name: projectCase.titles[index], exact: true })).toBeVisible();
    }
    await expect(main.getByText(projectCase.relationship, { exact: true })).toBeVisible();
    await expect(main.getByText(projectCase.mpcTitle, { exact: true })).toHaveCount(0);

    // Nothing is hidden behind an accordion, a disclosure or a tab.
    await expect(main.locator('details, summary, [aria-expanded], [role="tab"], [hidden]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    assertNoBrowserErrors();
  });

  test(`${projectCase.locale} Projects exposes no project-detail action or retired destination`, async ({ page }) => {
    await page.goto(appUrl(projectCase.index));
    const main = page.getByRole('main');
    await expect(main.getByRole('link', { name: projectCase.retiredAction })).toHaveCount(0);
    const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    expect(hrefs.filter((href) => /(?:proyectos|work)\/(?:general-reservation-system|the-system|mpc-administracion)/.test(href))).toEqual([]);
    // Project cards are gone: no dossier is one big link and none is focusable on its own.
    for (const article of await main.locator('article').all()) {
      await expect(article).not.toHaveAttribute('tabindex', /.*/);
      expect(await article.evaluate((element) => getComputedStyle(element).cursor)).not.toBe('pointer');
    }
  });

  test(`${projectCase.locale} Projects keeps every foreground plate opaque Deep with the chart border`, async ({ page }) => {
    await page.goto(appUrl(projectCase.index));
    const masks = page.locator('main [data-connected-reading-mask]');
    // The introduction, the capability legend, the two dossiers and the publication note.
    await expect(masks).toHaveCount(5);
    for (const mask of await masks.all()) {
      const style = await mask.evaluate((element) => {
        const computed = getComputedStyle(element);
        return {
          background: computed.backgroundColor,
          border: computed.borderTopWidth,
          borderStyle: computed.borderTopStyle,
          borderColor: computed.borderTopColor,
          radius: computed.borderTopLeftRadius,
        };
      });
      expect(style).toEqual({ background: 'rgb(10, 30, 51)', border: '1px', borderStyle: 'solid', borderColor: 'rgb(54, 83, 108)', radius: '16px' });
    }
  });

  test(`${projectCase.locale} Projects dossier hover emphasizes only its border`, async ({ page }) => {
    const hoverable = await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches);
    test.skip(!hoverable, 'hover treatments exist for fine pointers only');
    await page.goto(appUrl(projectCase.index));
    const article = page.locator('main article').first();
    await article.scrollIntoViewIfNeeded();
    // Page coordinates: hovering may scroll the page, which must not read as the article moving.
    const pageBox = () => article.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height };
    });
    const before = await pageBox();
    expect(await article.evaluate((element) => getComputedStyle(element).borderTopColor)).toBe('rgb(54, 83, 108)');

    await article.locator('h2').hover();
    await expect.poll(() => article.evaluate((element) => getComputedStyle(element).borderTopColor)).toBe('rgb(111, 168, 224)');
    expect(await pageBox()).toEqual(before);
    expect(await article.evaluate((element) => getComputedStyle(element).transform)).toBe('none');
  });

  test(`${projectCase.locale} Projects artwork scales at most 1.018 while its caption stays still`, async ({ page }) => {
    const hoverable = await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches);
    test.skip(!hoverable, 'hover treatments exist for fine pointers only');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(appUrl(projectCase.index));
    const figure = page.locator('main article').first().locator('figure');
    const image = figure.locator('img');
    const caption = figure.locator('figcaption');
    await figure.scrollIntoViewIfNeeded();
    const pageBox = (locator: typeof caption) => locator.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x + scrollX, y: box.y + scrollY, width: box.width, height: box.height };
    });
    const captionBefore = await pageBox(caption);
    const frameBefore = await pageBox(figure);

    await image.hover();
    const scale = () => image.evaluate((element) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
      return Math.round(matrix.a * 10000) / 10000;
    });
    await expect.poll(scale).toBeGreaterThan(1.017);
    expect(await scale()).toBeLessThanOrEqual(1.018);
    expect(await pageBox(caption)).toEqual(captionBefore);
    expect(await pageBox(figure)).toEqual(frameBefore);
    expect(await image.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe('0.26s');
    expect(await image.evaluate((element) => getComputedStyle(element).transitionProperty)).toBe('transform');
  });

  test(`${projectCase.locale} Projects removes the artwork zoom under reduced motion`, async ({ page }) => {
    const hoverable = await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches);
    test.skip(!hoverable, 'hover treatments exist for fine pointers only');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(appUrl(projectCase.index));
    const image = page.locator('main article').first().locator('figure img');
    await image.scrollIntoViewIfNeeded();
    await image.hover();
    await page.waitForTimeout(400);
    expect(await image.evaluate((element) => getComputedStyle(element).transform)).toBe('none');
  });

  test(`${projectCase.locale} Founder keeps the educational MPC context and links to its approved source`, async ({ page }) => {
    await page.goto(appUrl(projectCase.founder));

    const education = page.locator('section[aria-labelledby="founder-education-heading"]');
    await expect(education.getByText(projectCase.mpcTitle, { exact: true })).toBeVisible();
    await expect(education.getByText(/(?:Trabajo educativo grupal|Educational group work) · 2021/)).toBeVisible();
    await expect(education.getByText(/fictic|ficticio|fictional/i)).toBeVisible();
    await expect(education.getByText(/no representa|does not represent/i)).toBeVisible();
    await expect(education.getByText(/No se verificó|has not been verified/i)).toBeVisible();

    const source = education.getByRole('link', { name: projectCase.mpcAction, exact: true });
    await expect(source).toHaveCount(1);
    await expect(source).toHaveAttribute('href', MPC_SOURCE);
    await expect(source).toHaveAttribute('target', '_blank');
    await expect(source).toHaveAttribute('rel', /noreferrer/);
    // No internal MPC destination remains, and the old educational-project action is gone.
    await expect(education.getByRole('link', { name: /Ver proyecto educativo|View educational project/ })).toHaveCount(0);
    const hrefs = await education.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    expect(hrefs.filter((href) => /mpc-administracion/.test(href))).toEqual([]);
  });
}

test('the MPC source link remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(appUrl(stableRoutes.founder.es));
  await expect(page.getByRole('link', { name: 'Ver código fuente', exact: true })).toHaveAttribute('href', MPC_SOURCE);
  await expect(page.getByRole('link', { name: 'Ver código fuente', exact: true })).toHaveAttribute('href', MPC_SOURCE);
  await context.close();
});

test('the Founder page carries no link to a retired MPC route in either locale', async ({ page }) => {
  for (const route of [stableRoutes.founder.es, stableRoutes.founder.en]) {
    await page.goto(appUrl(route));
    const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    expect(hrefs.filter((href) => href.includes(appPathname('/proyectos/mpc')) || href.includes(appPathname('/en/work/mpc')))).toEqual([]);
  }
});
