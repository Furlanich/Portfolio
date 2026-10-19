import { expect, test, type Locator } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

// DESIGN-SFC-V1 "Visual system and dimensions" and "Studio": the 1180px editorial measure, 32/20px gutters,
// 1024/768 breakpoints, H1 68/48/42, plate padding 40/32/24, the 7/5 identity grid with a 64px gap and the
// two-column principles list from 768px. Typography values are defaults for these named surfaces, so only the
// resolved size classes are asserted, never a forced line count.

const studioCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.studio.es,
    heading: 'Software a medida con responsabilidad técnica directa.',
    caption: 'Responsabilidad central, especialidades conectadas.',
    accountability: 'Dirección técnica de principio a fin',
    principles: 'Principios para trabajar con claridad',
  },
  {
    locale: 'English',
    route: stableRoutes.studio.en,
    heading: 'Custom software with direct technical accountability.',
    caption: 'Central accountability, connected specialties.',
    accountability: 'Technical direction from start to finish',
    principles: 'Principles for clear delivery',
  },
] as const;

async function box(locator: Locator) {
  const value = await locator.boundingBox();
  expect(value).not.toBeNull();
  return value!;
}

const tier = (width: number) => (width >= 1024 ? 'wide' : width >= 768 ? 'tablet' : 'compact');

for (const studioCase of studioCases) {
  test(`${studioCase.locale} Studio uses the editorial measure, gutters and type scale for its width`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));
    const width = page.viewportSize()?.width ?? 0;
    const scale = { wide: { h1: 68, h2: 40, padding: 40, gutter: 32 }, tablet: { h1: 48, h2: 34, padding: 32, gutter: 32 }, compact: { h1: 42, h2: 30, padding: 24, gutter: 20 } }[tier(width)];

    const dimensions = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

    const heading = page.getByRole('heading', { level: 1, name: studioCase.heading });
    const style = await heading.evaluate((element) => {
      const computed = getComputedStyle(element);
      return { fontSize: parseFloat(computed.fontSize), weight: computed.fontWeight, lineHeight: parseFloat(computed.lineHeight) / parseFloat(computed.fontSize) };
    });
    // Complete words outrank the pixel value: the size eases down only below ~390px and from 1024 to ~1104px,
    // where the plate cannot hold the longest word at the approved size (checked by the no-clipping case).
    if ([390, 768, 1440].includes(width)) expect(style.fontSize).toBe(scale.h1);
    else {
      expect(style.fontSize).toBeLessThanOrEqual(scale.h1);
      expect(style.fontSize).toBeGreaterThanOrEqual(scale.h1 * 0.7);
    }
    expect(style.weight).toBe('600');
    expect(style.lineHeight).toBeCloseTo(1.04, 2);

    const plate = page.locator('[data-connected-opaque-plate]').first();
    const plateBox = await box(plate);
    const expectedLeft = Math.max(scale.gutter, (width - 1180) / 2);
    expect(Math.abs(plateBox.x - expectedLeft)).toBeLessThanOrEqual(1.5);
    expect(plateBox.width).toBeLessThanOrEqual(1180 + 1);
    const padding = await plate.evaluate((element) => parseFloat(getComputedStyle(element).paddingLeft));
    expect(padding).toBe(scale.padding);

    const sectionHeading = page.getByRole('heading', { level: 2, name: studioCase.accountability });
    expect(await sectionHeading.evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBe(scale.h2);
  });

  test(`${studioCase.locale} Studio introduction keeps source order and its 7/5 grid with a 64px gap`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));
    const width = page.viewportSize()?.width ?? 0;

    const plate = page.locator('[data-connected-opaque-plate]').first();
    const caption = page.getByText(studioCase.caption, { exact: true });
    await expect(plate.getByRole('heading', { level: 1, name: studioCase.heading })).toBeVisible();
    await expect(caption).toBeVisible();
    await expect(plate.getByText(studioCase.caption, { exact: true })).toHaveCount(0);
    const plateBox = await box(plate);
    const captionBox = await box(caption);

    if (width >= 1024) {
      const gap = captionBox.x - (plateBox.x + plateBox.width);
      expect(gap).toBeGreaterThanOrEqual(63);
      const columns = await plate.evaluate((element) => {
        const grid = element.parentElement!;
        return getComputedStyle(grid).gridTemplateColumns.split(' ').map(parseFloat);
      });
      expect(columns).toHaveLength(2);
      expect(Math.abs(columns[0] / (columns[0] + columns[1]) - 7 / 12)).toBeLessThanOrEqual(0.01);
      // The open caption sits near the plate's lower edge, with room for its 24px scrim.
      expect(Math.abs(captionBox.y + captionBox.height - (plateBox.y + plateBox.height))).toBeLessThanOrEqual(32);
    } else {
      const breathing = captionBox.y - (plateBox.y + plateBox.height);
      expect(breathing).toBeGreaterThanOrEqual(24);
      expect(breathing).toBeLessThanOrEqual(120);
    }
  });

  test(`${studioCase.locale} Studio accountability keeps its heading beside a 7-column plate from 1024px`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));
    const width = page.viewportSize()?.width ?? 0;
    const heading = page.getByRole('heading', { level: 2, name: studioCase.accountability });
    const plate = page.locator('[data-connected-opaque-plate]').filter({ has: page.getByRole('heading', { level: 3 }) }).first();
    const headingBox = await box(heading);
    const plateBox = await box(plate);

    if (width >= 1024) {
      expect(plateBox.x).toBeGreaterThan(headingBox.x + headingBox.width);
      expect(Math.abs(plateBox.y - headingBox.y)).toBeLessThanOrEqual(48);
      const inner = Math.min(1180, width - 64);
      // Seven of twelve columns less the 64px gap's share: always wider than the 5-column heading cell.
      expect(plateBox.width).toBeGreaterThan(headingBox.width);
      expect(Math.abs(plateBox.width - ((inner - 64) * 7) / 12)).toBeLessThanOrEqual(2);
    } else {
      expect(plateBox.y).toBeGreaterThan(headingBox.y + headingBox.height);
    }
  });

  test(`${studioCase.locale} Studio principles are one continuous plate that is one column below 768px and two from 768px`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));
    const principles = page.getByRole('region', { name: studioCase.principles });
    await expect(principles.locator('[data-connected-opaque-plate]')).toHaveCount(1);
    const items = principles.getByRole('listitem');
    await expect(items).toHaveCount(4);
    const [first, second, third] = await Promise.all([0, 1, 2].map((index) => box(items.nth(index))));
    const width = page.viewportSize()?.width ?? 0;

    if (width >= 768) {
      expect(Math.abs(first.y - second.y)).toBeLessThanOrEqual(1);
      const gap = second.x - (first.x + first.width);
      expect(gap).toBeGreaterThanOrEqual(31);
      expect(gap).toBeLessThanOrEqual(33);
      expect(Math.abs(first.x - third.x)).toBeLessThanOrEqual(1);
      expect(third.y).toBeGreaterThan(first.y + first.height);
    } else {
      expect(Math.abs(first.x - second.x)).toBeLessThanOrEqual(1);
      expect(second.y).toBeGreaterThan(first.y + first.height);
    }
  });

  test(`${studioCase.locale} Studio actions are at least 44px and its text never overflows or clips`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));
    for (const link of await page.getByRole('main').getByRole('link').all()) {
      const linkBox = await box(link);
      expect(linkBox.height).toBeGreaterThanOrEqual(44);
      expect(linkBox.x).toBeGreaterThanOrEqual(0);
      expect(linkBox.x + linkBox.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    }
    // Every readable block stays inside the viewport: complete words, natural flow, no horizontal scroll.
    const clipped = await page.locator('main').evaluate((root) =>
      [...root.querySelectorAll<HTMLElement>('h1, h2, h3, p, li')]
        .filter((element) => element.scrollWidth > element.clientWidth + 1)
        .map((element) => element.textContent?.slice(0, 40)),
    );
    expect(clipped).toEqual([]);
  });

  test(`${studioCase.locale} Studio body text is 18px at a 1.6 line height with a 20px introduction`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));
    const metrics = await page.locator('main').evaluate((root) => {
      const read = (element: Element) => {
        const computed = getComputedStyle(element);
        return { size: parseFloat(computed.fontSize), ratio: parseFloat(computed.lineHeight) / parseFloat(computed.fontSize) };
      };
      const plate = root.querySelector('[data-connected-opaque-plate]')!;
      const introduction = plate.querySelector('h1 + p')!;
      const body = root.querySelector('[data-connected-opaque-plate] ul li p')!;
      return { introduction: read(introduction), body: read(body) };
    });
    expect(metrics.introduction.size).toBe(20);
    expect(metrics.introduction.ratio).toBeCloseTo(1.5, 2);
    expect(metrics.body.size).toBe(18);
    expect(metrics.body.ratio).toBeCloseTo(1.6, 2);
  });
}
