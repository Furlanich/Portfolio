import { expect, test, type Page } from '@playwright/test';
import { appPathname, appUrl, stableRoutes } from './support/paths';

// PLAN-SPF-V1 Task 3: the stable dossier fragments, the locale switch that keeps a known one, and
// the Services evidence link that lands on the GRS dossier. The index and the fragments are the only
// destinations: there is no per-project route (those six URLs are asserted absent in
// marketing-navigation.spec.ts).

const slugs = ['general-reservation-system', 'the-system'] as const;

const locales = [
  { name: 'Spanish', index: stableRoutes.projects.es, alternate: stableRoutes.projects.en, switchHreflang: 'en', services: stableRoutes.services.es },
  { name: 'English', index: stableRoutes.projects.en, alternate: stableRoutes.projects.es, switchHreflang: 'es-AR', services: stableRoutes.services.en },
] as const;

/** Waits for the smooth fragment scroll to settle, then returns the element's top and the App Bar bottom. */
async function settledTop(page: Page, selector: string) {
  let last = Number.NaN;
  await expect
    .poll(async () => {
      const top = await page.locator(selector).evaluate((element) => element.getBoundingClientRect().top);
      const settled = top === last;
      last = top;
      return settled;
    }, { timeout: 8_000, intervals: [150] })
    .toBe(true);
  return page.evaluate((target) => ({
    top: document.querySelector(target)?.getBoundingClientRect().top ?? Number.NaN,
    headerBottom: document.querySelector('header[data-app-bar]')?.getBoundingClientRect().bottom ?? Number.NaN,
  }), selector);
}

for (const locale of locales) {
  for (const slug of slugs) {
    test(`${locale.name} jump link reaches #${slug} below the App Bar`, async ({ page }) => {
      await page.goto(appUrl(locale.index));
      const jump = page.getByRole('main').locator(`a[href="#${slug}"]`);
      await expect(jump).toHaveCount(1);
      await jump.click();
      await expect(page).toHaveURL((url) => url.hash === `#${slug}`);
      const { top, headerBottom } = await settledTop(page, `article#${slug}`);
      expect(top).toBeGreaterThanOrEqual(headerBottom);
      expect(top).toBeLessThan(headerBottom + 80);
    });

    test(`${locale.name} switch keeps #${slug} from the header and the footer`, async ({ page }) => {
      for (const region of ['banner', 'contentinfo'] as const) {
        await page.goto(appUrl(locale.index) + `#${slug}`);
        const link = page.getByRole(region).locator(`a[hreflang="${locale.switchHreflang}"]`);
        await expect(link).toHaveCount(1);
        // The enhancement has run once the destination carries the known fragment.
        await expect(link).toHaveAttribute('href', appPathname(locale.alternate) + `#${slug}`);
        await link.click();
        await expect(page).toHaveURL((url) => url.pathname === appPathname(locale.alternate) && url.hash === `#${slug}`);
        const { top, headerBottom } = await settledTop(page, `article#${slug}`);
        expect(top).toBeGreaterThanOrEqual(headerBottom);
      }
    });
  }

  test(`${locale.name} switch follows a fragment reached by a jump link`, async ({ page }) => {
    await page.goto(appUrl(locale.index));
    await page.getByRole('main').locator('a[href="#the-system"]').click();
    await expect(page).toHaveURL((url) => url.hash === '#the-system');
    await page.getByRole('banner').locator(`a[hreflang="${locale.switchHreflang}"]`).click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(locale.alternate) && url.hash === '#the-system');
  });

  for (const hash of ['#nope', '#mpc-administracion', '#The-System', '#web', '#']) {
    test(`${locale.name} switch drops the unknown fragment "${hash}" and lands on the equivalent index`, async ({ page }) => {
      await page.goto(appUrl(locale.index) + hash);
      const link = page.getByRole('banner').locator(`a[hreflang="${locale.switchHreflang}"]`);
      await expect(link).toHaveAttribute('href', appPathname(locale.alternate));
      await link.click();
      await expect(page).toHaveURL((url) => url.pathname === appPathname(locale.alternate) && url.hash === '');
    });
  }

  test(`${locale.name} switch without a fragment lands on the equivalent index`, async ({ page }) => {
    await page.goto(appUrl(locale.index));
    await page.getByRole('contentinfo').locator(`a[hreflang="${locale.switchHreflang}"]`).click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(locale.alternate) && url.hash === '');
  });

  test(`${locale.name} switch on an ordinary page keeps the existing equivalent route and drops a dossier fragment`, async ({ page }) => {
    await page.goto(appUrl(locale.services) + '#the-system');
    const link = page.getByRole('banner').locator(`a[hreflang="${locale.switchHreflang}"]`);
    const alternateServices = locale.services === stableRoutes.services.es ? stableRoutes.services.en : stableRoutes.services.es;
    await expect(link).toHaveAttribute('href', appPathname(alternateServices));
    await link.click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(alternateServices) && url.hash === '');
  });

  test(`${locale.name} Services evidence reaches the GRS dossier below the App Bar`, async ({ page }) => {
    await page.goto(appUrl(locale.services));
    const evidence = page.getByRole('main').locator(`a[href="${appPathname(locale.index)}#general-reservation-system"]`);
    await expect(evidence).toHaveCount(1);
    await evidence.click();
    await expect(page).toHaveURL((url) => url.pathname === appPathname(locale.index) && url.hash === '#general-reservation-system');
    await expect(page.locator('article#general-reservation-system')).toBeVisible();
    const { top, headerBottom } = await settledTop(page, 'article#general-reservation-system');
    expect(top).toBeGreaterThanOrEqual(headerBottom);
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const locale of locales) {
    test(`${locale.name} switch is a native link to the equivalent index`, async ({ page }) => {
      await page.goto(appUrl(locale.index) + '#the-system');
      for (const region of ['banner', 'contentinfo'] as const) {
        await expect(page.getByRole(region).locator(`a[hreflang="${locale.switchHreflang}"]`)).toHaveAttribute('href', appPathname(locale.alternate));
      }
    });

    test(`${locale.name} jump links are native in-page anchors`, async ({ page }) => {
      await page.goto(appUrl(locale.index));
      for (const slug of slugs) {
        // Return to the top instantly: a click on a link that Playwright must scroll to under smooth scrolling never settles.
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.getByRole('main').locator(`a[href="#${slug}"]`).click();
        await expect(page).toHaveURL((url) => url.hash === `#${slug}`);
        await expect(page.locator(`article#${slug}`)).toBeInViewport();
      }
    });
  }
});
