import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { appPathname, appUrl, stableRoutes } from './support/paths';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
const channels = ["https://wa.me/5491150117565","mailto:samuelfurlanich@gmail.com","tel:+5491150117565"];
for (const locale of ['es', 'en'] as const) {
  test(locale + ': native direct channels replace form intake', { tag: '@cross-browser' }, async ({ page, browserName }) => {
    const noErrors = observeUnexpectedBrowserErrors(page);
    const providerRequests: string[] = [];
    await page.route('https://formspree.io/**', route => { providerRequests.push(route.request().url()); return route.abort(); });
    await page.goto(appUrl(stableRoutes.contact[locale]));
    const main = page.getByRole('main');
    await expect(main).toHaveCount(1);
    await expect(main.getByRole('heading', {level:1})).toHaveCount(1);
    await expect(main.locator('form, input, textarea, button[type="submit"]')).toHaveCount(0);
    const surface = main.locator('[data-contact-channels]');
    const links = surface.locator('ul a');
    await expect(links).toHaveCount(3);
    for (const [i,href] of channels.entries()) {
      await expect(links.nth(i)).toHaveAttribute('href',href);
      expect((await links.nth(i).boundingBox())!.height).toBeGreaterThanOrEqual(48);
    }
    await links.first().focus();
    await expect(links.first()).toBeFocused();
    expect(await links.first().evaluate(el=>parseFloat(getComputedStyle(el).outlineWidth))).toBeGreaterThan(0);
    if (browserName !== 'webkit') {
      await page.keyboard.press('Tab'); await expect(links.nth(1)).toBeFocused();
      await page.keyboard.press('Tab'); await expect(links.nth(2)).toBeFocused();
      await page.keyboard.press('Tab'); await expect(surface.locator('p a')).toBeFocused();
    } else {
      // WebKit link tabbing depends on the host's Full Keyboard Access setting (docs/testing/playwright.md).
      for (const link of [links.nth(1), links.nth(2), surface.locator('p a')]) {
        await link.focus(); await expect(link).toBeFocused();
      }
    }
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(url=>url.pathname===appPathname(stableRoutes.privacy[locale]));
    expect(providerRequests).toEqual([]);
    noErrors();
  });
  test(locale + ': direct contact reflows with enlarged text, spacing and forced colors', async ({ page }) => {
    await page.goto(appUrl(stableRoutes.contact[locale]));
    for(const width of [320,390,768,820,1024,1440]) {
      await page.setViewportSize({width,height:900});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    await page.setViewportSize({width:320,height:800});
    await page.addStyleTag({content:'main p, main a { font-size: 200% !important; line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } main p { margin-bottom: 2em !important; }'});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await page.emulateMedia({forcedColors:'active'});
    await expect(page.locator('[data-contact-channels] a').first()).toBeVisible();
  });
  test(locale + ': direct channels remain available without JavaScript', async ({ browser }) => {
    const context=await browser.newContext({javaScriptEnabled:false});
    try {
      const page=await context.newPage();await page.goto(appUrl(stableRoutes.contact[locale]));
      await expect(page.getByRole('main').locator('form, input, textarea')).toHaveCount(0);
      for(const href of channels) await expect(page.locator('[data-contact-channels] a[href="'+href+'"]').first()).toBeVisible();
    } finally { await context.close(); }
  });
  test(locale + ': direct Contact has no serious or critical axe findings', async ({page})=>{
    await page.goto(appUrl(stableRoutes.contact[locale]));
    const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    expect(result.violations.filter(v=>v.impact==='serious'||v.impact==='critical')).toEqual([]);
  });
}
test('Contact locale switching preserves the paired route', async ({page})=>{
  await page.goto(appUrl(stableRoutes.contact.es));
  await page.getByRole('banner').locator('a[hreflang="en"]').click();
  await expect(page).toHaveURL(url=>url.pathname===appPathname(stableRoutes.contact.en));
  await page.getByRole('banner').locator('a[hreflang="es-AR"]').click();
  await expect(page).toHaveURL(url=>url.pathname===appPathname(stableRoutes.contact.es));
});
