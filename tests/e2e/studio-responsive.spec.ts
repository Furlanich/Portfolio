import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

const studioCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.studio.es,
    heading: 'Software a medida con responsabilidad técnica directa.',
    panel: 'Modelo de trabajo',
    principles: 'Principios para trabajar con claridad',
  },
  {
    locale: 'English',
    route: stableRoutes.studio.en,
    heading: 'Custom software with direct technical accountability.',
    panel: 'Operating model',
    principles: 'Principles for clear delivery',
  },
] as const;

for (const studioCase of studioCases) {
  test(`${studioCase.locale} Studio introduction preserves source order and its 7/5 wide geometry`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

    const heading = page.getByRole('heading', { level: 1, name: studioCase.heading });
    const narrative = heading.locator('..');
    const panel = page.getByRole('complementary', { name: studioCase.panel });
    await expect(heading).toBeVisible();
    await expect(panel).toBeVisible();
    const panelHandle = await panel.elementHandle();
    expect(panelHandle).not.toBeNull();
    expect(
      await narrative.evaluate(
        (node, other) =>
          Boolean(node.compareDocumentPosition(other as Node) & Node.DOCUMENT_POSITION_FOLLOWING),
        panelHandle,
      ),
    ).toBe(true);

    const viewportWidth = page.viewportSize()?.width ?? 0;
    const narrativeBox = await narrative.boundingBox();
    const panelBox = await panel.boundingBox();
    expect(narrativeBox).not.toBeNull();
    expect(panelBox).not.toBeNull();
    if (viewportWidth >= 1024) {
      expect(panelBox!.x).toBeGreaterThan(narrativeBox!.x);
      expect(Math.abs(panelBox!.y - narrativeBox!.y)).toBeLessThanOrEqual(1);

      const occupiedWidth = narrativeBox!.width + panelBox!.width;
      const narrativeShare = narrativeBox!.width / occupiedWidth;
      const panelShare = panelBox!.width / occupiedWidth;
      expect(Math.abs(narrativeShare - 7 / 12)).toBeLessThanOrEqual(0.025);
      expect(Math.abs(panelShare - 5 / 12)).toBeLessThanOrEqual(0.025);
    } else {
      expect(panelBox!.y).toBeGreaterThan(narrativeBox!.y + narrativeBox!.height);
    }
  });

  test(`${studioCase.locale} Studio principles switch from one to two columns at 768px`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));
    const principles = page.getByRole('region', { name: studioCase.principles });
    const items = principles.getByRole('listitem');
    await expect(items).toHaveCount(4);
    const itemBoxes = await Promise.all(
      [0, 1, 2, 3].map((index) => items.nth(index).boundingBox()),
    );
    for (const itemBox of itemBoxes) {
      expect(itemBox).not.toBeNull();
    }

    const [first, second, third] = itemBoxes as [
      NonNullable<(typeof itemBoxes)[number]>,
      NonNullable<(typeof itemBoxes)[number]>,
      NonNullable<(typeof itemBoxes)[number]>,
      NonNullable<(typeof itemBoxes)[number]>,
    ];
    const viewportWidth = page.viewportSize()?.width ?? 0;
    if (viewportWidth >= 768) {
      expect(Math.abs(first.y - second.y)).toBeLessThanOrEqual(1);
      expect(second.x).toBeGreaterThan(first.x + first.width);
      expect(Math.abs(first.x - third.x)).toBeLessThanOrEqual(1);
      expect(third.y).toBeGreaterThan(first.y + first.height);
    } else {
      expect(Math.abs(first.x - second.x)).toBeLessThanOrEqual(1);
      expect(second.y).toBeGreaterThan(first.y + first.height);
    }
  });
}
