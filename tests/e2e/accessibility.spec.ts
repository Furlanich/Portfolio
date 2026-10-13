import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

const representativeRoutes = [
  ['Spanish homepage', stableRoutes.home.es],
  ['English homepage', stableRoutes.home.en],
  ['Spanish Services', stableRoutes.services.es],
  ['English Services', stableRoutes.services.en],
  ['Spanish Projects', stableRoutes.projects.es],
  ['English Projects', stableRoutes.projects.en],
  ['Spanish Studio', stableRoutes.studio.es],
  ['English Studio', stableRoutes.studio.en],
  ['Spanish Founder', stableRoutes.founder.es],
  ['English Founder', stableRoutes.founder.en],
  ['Spanish Privacy', stableRoutes.privacy.es],
  ['English Privacy', stableRoutes.privacy.en],
  ['Spanish Contact', stableRoutes.contact.es],
  ['English Contact', stableRoutes.contact.en],
] as const;

for (const [name, route] of representativeRoutes) {
  test(`${name} has no automatically detectable critical or serious axe violations`, async ({ page }) => {
    await page.goto(appUrl(route));
    await expect(page.locator('html')).toHaveAttribute('lang', name.startsWith('English') ? 'en' : 'es-AR');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const blockingViolations = results.violations.filter(
      ({ impact }) => impact === 'critical' || impact === 'serious',
    );

    expect(blockingViolations).toEqual([]);
    await expect(page.locator('main h1:visible')).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: /Navegación principal|Primary navigation/ })).toBeVisible();
    await expect(page.getByRole('banner').locator('a[hreflang]')).toBeVisible();
  });
}

// PLAN-SPF-V1 Task 9: all fourteen hosts of the shared Footer (seven pages in two locales) keep one set of
// landmarks, an ordered heading outline and a Footer a keyboard user can walk in reading order. Axe alone
// does not prove any of this; contrast is judged by hand in the receipt.
for (const [name, route] of representativeRoutes) {
  test(`${name} keeps one banner, one main and one Footer, an ordered outline and a keyboard-ordered Footer`, async ({ page }) => {
    await page.goto(appUrl(route));
    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
    await expect(page.locator('[data-site-footer]')).toHaveCount(1);

    const levels = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6'))
        .filter((heading) => heading.getClientRects().length > 0 && getComputedStyle(heading).visibility !== 'hidden')
        .map((heading) => Number(heading.tagName[1])),
    );
    expect(levels[0], 'the outline starts at the one H1').toBe(1);
    levels.slice(1).forEach((level, index) => {
      expect(level - levels[index], `heading ${index + 2} (h${level}) does not skip a level after h${levels[index]}`).toBeLessThanOrEqual(1);
    });

    const links = page.getByRole('contentinfo').locator('a[href]:visible');
    const count = await links.count();
    expect(count, 'the Footer exposes its channels and links').toBeGreaterThanOrEqual(4);
    const expected = await links.evaluateAll((elements) => elements.map((element) => (element as HTMLAnchorElement).href));
    await links.first().focus();
    const visited: string[] = [];
    for (let step = 0; step < count; step += 1) {
      if (step > 0) await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const element = document.activeElement as HTMLAnchorElement | null;
        const style = element ? getComputedStyle(element) : null;
        return {
          href: element?.href ?? '',
          inFooter: Boolean(element?.closest('footer, [role="contentinfo"]')),
          indicated: Boolean(style && ((style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== 'none')),
        };
      });
      expect(focused.inFooter, `step ${step + 1} stays inside the Footer`).toBe(true);
      expect(focused.indicated, `step ${step + 1} shows a focus indicator`).toBe(true);
      visited.push(focused.href);
    }
    expect(visited, 'Tab walks the Footer links in reading order').toEqual(expected);
  });
}

test('homepage focus progresses through the brand, language switch, and primary navigation', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.home.es));

  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('banner').getByRole('link', { name: 'FURLANICH' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('banner').getByRole('link', { name: 'Ver sitio en inglés' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Servicios' })).toBeFocused();
});
