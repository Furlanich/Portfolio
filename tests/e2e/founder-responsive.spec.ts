import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

const founderCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.founder.es,
    headings: [
      'Biografía profesional',
      'Perfil profesional',
      'Experiencia profesional',
      'Formación',
      'Capacidades para construir y mejorar sistemas',
      'Trabajo y evidencia técnica',
      '¿Querés conversar sobre una necesidad de tu negocio?',
    ],
  },
  {
    locale: 'English',
    route: stableRoutes.founder.en,
    headings: [
      'Professional biography',
      'Professional profile',
      'Professional experience',
      'Education',
      'Capabilities for building and improving systems',
      'Work and technical evidence',
      'Want to discuss a business need?',
    ],
  },
] as const;

for (const founderCase of founderCases) {
  test(`${founderCase.locale} Founder keeps complete text and the two plates aligned at all approved widths`, async ({ page }) => {
    await page.goto(appUrl(founderCase.route));
    const main = page.getByRole('main');

    for (const viewport of [
      { width: 320, height: 800 },
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await expect(main.locator('h2')).toHaveText([...founderCase.headings]);

      const layout = await main.locator('[data-founder-layout]').boundingBox();
      const intro = await main.locator('[data-founder-intro-plate]').boundingBox();
      const history = await main.locator('[data-founder-history-plate]').boundingBox();
      expect(layout, `${viewport.width}px layout`).not.toBeNull();
      expect(intro, `${viewport.width}px intro`).not.toBeNull();
      expect(history, `${viewport.width}px history`).not.toBeNull();

      const dimensions = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        const main = document.querySelector('main');
        const text = [...(main?.querySelectorAll('h1, h2, h3, p, a, li') ?? [])];
        return {
          width,
          scrollWidth: document.documentElement.scrollWidth,
          clipped: text
            .filter((element) => getComputedStyle(element).display !== 'none')
            .filter((element) => {
              const box = element.getBoundingClientRect();
              return box.left < -1 || box.right > width + 1;
            })
            .map((element) => element.textContent?.trim()),
        };
      });
      expect(dimensions.scrollWidth, `${viewport.width}px document overflow`).toBeLessThanOrEqual(dimensions.width);
      expect(dimensions.clipped, `${viewport.width}px clipped text`).toEqual([]);

      if (viewport.width >= 1024) {
        expect(intro!.width, `${viewport.width}px intro maximum`).toBeLessThanOrEqual(800);
        expect(history!.width, `${viewport.width}px reading plate maximum`).toBeLessThanOrEqual(800);
        expect(history!.x).toBeGreaterThan(intro!.x);
        expect(history!.x + history!.width).toBeCloseTo(layout!.x + layout!.width, 0);
      } else {
        expect(intro!.x).toBeCloseTo(layout!.x, 0);
        expect(history!.x).toBeCloseTo(layout!.x, 0);
        expect(intro!.width).toBeCloseTo(layout!.width, 0);
        expect(history!.width).toBeCloseTo(layout!.width, 0);
      }

      await expect(main.locator('[data-founder-experience-entry]')).toHaveCount(2);
      await expect(main.locator('[data-founder-education-project]')).toBeVisible();
      await expect(main.locator('[data-founder-capability-group]')).toHaveCount(4);
      await expect(main.locator('img')).toHaveCount(0);
    }
  });

  test(`${founderCase.locale} Founder retains the complete profile without JavaScript`, async ({ browser, page }) => {
    await page.goto(appUrl(founderCase.route));
    const url = page.url();
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const noScriptPage = await context.newPage();
      await noScriptPage.goto(url);
      const main = noScriptPage.getByRole('main');
      await expect(main.getByRole('heading', { level: 1, name: 'Samuel Furlanich' })).toBeVisible();
      await expect(main.locator('h2')).toHaveText([...founderCase.headings]);
      await expect(main.getByRole('link')).toHaveCount(6);
      await expect(noScriptPage.locator('#connected-pause-founder')).toBeVisible();
      await expect(noScriptPage.locator('#connected-pause-founder')).toContainText(
        founderCase.locale === 'Spanish' ? 'Fondo estático' : 'Static background',
      );
    } finally {
      await context.close();
    }
  });

  test(`${founderCase.locale} Founder content reflows under 200% text growth and WCAG text spacing`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(appUrl(founderCase.route));
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      const selectors = 'main h1, main h2, main h3, main p, main a, main li, [data-connected-static-label]';
      for (const element of document.querySelectorAll<HTMLElement>(selectors)) {
        const size = Number.parseFloat(getComputedStyle(element).fontSize);
        element.style.setProperty('font-size', `${size * 2}px`, 'important');
      }
    });
    let dimensions = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth, '200% text growth').toBeLessThanOrEqual(dimensions.width);
    await expect(page.getByRole('heading', { level: 1, name: 'Samuel Furlanich' })).toBeVisible();

    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.addStyleTag({
      content: `
        main * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
        main p { margin-block-end: 2em !important; }
      `,
    });
    dimensions = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth, 'WCAG text spacing').toBeLessThanOrEqual(dimensions.width);
    await expect(page.locator('main h2')).toHaveText([...founderCase.headings]);
  });
}
