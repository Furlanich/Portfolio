import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

const studioCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.studio.es,
    narrative: 'FURLANICH diseña, desarrolla y mejora software a medida',
    panel: 'Modelo de trabajo',
    principles: 'Principios para trabajar con claridad',
  },
  {
    locale: 'English',
    route: stableRoutes.studio.en,
    narrative: 'FURLANICH designs, builds, and improves custom software',
    panel: 'Operating model',
    principles: 'Principles for clear delivery',
  },
] as const;

for (const studioCase of studioCases) {
  test(`${studioCase.locale} Studio preserves source order and reflows without horizontal overflow`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

    const narrative = page.getByText(studioCase.narrative, { exact: false });
    const panel = page.getByText(studioCase.panel, { exact: true });
    await expect(narrative).toBeVisible();
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
    } else {
      expect(panelBox!.y).toBeGreaterThan(narrativeBox!.y);
    }

    const principles = page.getByRole('region', { name: studioCase.principles });
    await expect(principles.getByRole('listitem')).toHaveCount(4);
  });
}
