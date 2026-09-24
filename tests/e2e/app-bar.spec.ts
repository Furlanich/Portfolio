import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

// SKY-CHART-V2 D-22 App Bar, Task 6 packet RED list (plan section 21, Task 6). Cases 3 and
// the Process-location half of case 4 read markup owned by Tasks 8 and 9
// (`data-readout`, `#impact`) that has not merged yet on this branch (Wave 2 integration
// contract rule 3, plan "Important implementation decisions"). They stay RED until Task 6
// rebases onto the merged Tasks 8, 7 and 9 in Phase B; that is documented, valid RED.

const surface = '[data-app-bar-surface]';

test.describe('1. no-JS docked default', () => {
  test.use({ javaScriptEnabled: false });

  for (const [name, route] of [
    ['Home', stableRoutes.home.es],
    ['English Services', stableRoutes.services.en],
  ] as const) {
    test(`shows the docked atlas-plate background on ${name} without JavaScript`, async ({ page }) => {
      await page.goto(appUrl(route));
      await expect(page.locator(surface)).toHaveCSS('background-color', 'rgba(10, 30, 51, 0.82)');
      await expect(page.locator(surface)).toHaveCSS('border-color', 'rgba(249, 246, 238, 0.13)');
    });
  }
});

test.describe('2. Home docking', () => {
  test('starts undocked at the top and docks past 24px of scroll', async ({ page }) => {
    await page.goto(appUrl(stableRoutes.home.es));
    await expect(page.locator(surface)).toHaveAttribute('data-docked', 'false');

    await page.evaluate(() => window.scrollTo(0, 200));
    await expect(page.locator(surface)).toHaveAttribute('data-docked', 'true');

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator(surface)).toHaveAttribute('data-docked', 'false');
  });

  test('non-Home routes stay docked and never receive a docked=false state', async ({ page }) => {
    await page.goto(appUrl(stableRoutes.services.en));
    await expect(page.locator(surface)).not.toHaveAttribute('data-docked', 'false');
    await page.evaluate(() => window.scrollTo(0, 200));
    await expect(page.locator(surface)).not.toHaveAttribute('data-docked', 'false');
  });
});

test.describe('3. Home readout (EN, 1440)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('reads "03 · Position fix" once #impact crosses the 40% line', async ({ page }) => {
    await page.goto(appUrl(stableRoutes.home.en));
    const impact = page.locator('#impact');
    await impact.scrollIntoViewIfNeeded();
    await expect(page.locator('[data-app-bar-readout]')).toHaveText('03 · Position fix');
  });
});

test.describe('4. aria-current', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('the Process link gets aria-current="location" while #process is in view', async ({ page }) => {
    await page.goto(appUrl(stableRoutes.home.en));
    const processSection = page.locator('#process');
    await processSection.scrollIntoViewIfNeeded();
    const processLink = page.getByRole('banner').getByRole('link', { name: 'How we work', exact: true });
    await expect(processLink).toHaveAttribute('aria-current', 'location');
  });

  test('the Services link gets aria-current="page" on /en/services/', async ({ page }) => {
    await page.goto(appUrl(stableRoutes.services.en));
    const servicesLink = page.getByRole('banner').getByRole('link', { name: 'Services', exact: true });
    await expect(servicesLink).toHaveAttribute('aria-current', 'page');
  });
});

test.describe('5. compact disclosure panel', () => {
  for (const width of [320, 390]) {
    test.describe(`at ${width}px`, () => {
      test.use({ viewport: { width, height: 800 } });

      test('is centred with at least 20px gutters, and Escape closes it and refocuses the trigger', async ({ page }) => {
        await page.goto(appUrl(stableRoutes.home.es));
        const menu = page.locator('summary[aria-label="Abrir navegación principal"]');
        await menu.click();

        const panel = page.locator('#primary-navigation-panel');
        await expect(panel).toBeVisible();
        const box = await panel.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
          expect(box.x).toBeGreaterThanOrEqual(20);
          expect(box.x + box.width).toBeLessThanOrEqual(width - 20);
        }

        await page.keyboard.press('Escape');
        await expect(panel).toBeHidden();
        await expect(menu).toBeFocused();
      });
    });
  }
});

test.describe('6. target sizes', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('nav links and the language switch are at least 44px, the CTA at least 48px', async ({ page }) => {
    await page.goto(appUrl(stableRoutes.home.es));
    const banner = page.getByRole('banner');

    const navLinks = await banner.locator('[data-app-bar-nav-link]').all();
    expect(navLinks.length).toBeGreaterThan(0);
    for (const link of navLinks) {
      const box = await link.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }

    const languageSwitch = banner.getByRole('link', { name: 'Ver sitio en inglés' });
    const languageBox = await languageSwitch.boundingBox();
    expect(languageBox?.height ?? 0).toBeGreaterThanOrEqual(44);

    const cta = banner.getByRole('link', { name: 'Ver contacto', exact: true });
    const ctaBox = await cta.boundingBox();
    expect(ctaBox?.height ?? 0).toBeGreaterThanOrEqual(48);
  });
});

test.describe('7. no horizontal overflow at 320', () => {
  test.use({ viewport: { width: 320, height: 800 } });

  test('the document does not scroll horizontally', async ({ page }) => {
    await page.goto(appUrl(stableRoutes.home.es));
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
});

test.describe('8. the header never translates', () => {
  test('boundingClientRect.top stays constant while scrolling', async ({ page }) => {
    await page.goto(appUrl(stableRoutes.home.es));
    const header = page.locator('header[data-app-bar]');
    const topBefore = (await header.boundingBox())?.y ?? -1;

    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(50);
    const topAfter = (await header.boundingBox())?.y ?? -2;

    expect(topAfter).toBe(topBefore);
  });
});

test.describe('9. no console errors', () => {
  for (const [name, route] of [
    ['Home', stableRoutes.home.es],
    ['English Services', stableRoutes.services.en],
  ] as const) {
    test(`${name} loads and scrolls with no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      page.on('pageerror', (error) => errors.push(String(error)));

      await page.goto(appUrl(route));
      await page.evaluate(() => window.scrollTo(0, 300));
      await page.waitForTimeout(100);

      expect(errors).toEqual([]);
    });
  }
});
