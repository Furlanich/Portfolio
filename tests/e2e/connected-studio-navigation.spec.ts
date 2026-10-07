import { expect, test, type Browser, type Page } from '@playwright/test';
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

/**
 * Waits for the smooth fragment scroll to arrive and stop, then returns the element's top and the App
 * Bar bottom. Arrival is "the top sits just under the App Bar": a bare "two equal reads" check can fire
 * before WebKit starts the smooth scroll and report the pre-scroll position as settled.
 */
async function settledTop(page: Page, selector: string) {
  const measure = () => page.evaluate((target) => ({
    top: document.querySelector(target)?.getBoundingClientRect().top ?? Number.NaN,
    headerBottom: document.querySelector('header[data-app-bar]')?.getBoundingClientRect().bottom ?? Number.NaN,
  }), selector);
  await expect
    .poll(async () => {
      const { top, headerBottom } = await measure();
      return top >= headerBottom && top < headerBottom + 80;
    }, { timeout: 10_000, intervals: [150] })
    .toBe(true);
  // Confirm it has stopped there rather than passing through.
  await page.waitForTimeout(400);
  return measure();
}

/**
 * Asserts the exact pathname and fragment of the destination. The string form of `toHaveURL` polls the
 * page URL; the predicate form waits for the document's load state even when the URL already matches,
 * so it fails on a correct destination whenever an unrelated resource is slow.
 */
function expectDestination(page: Page, route: string, hash: string, timeout?: number) {
  return expect(page).toHaveURL(appPathname(route) + hash, { timeout });
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
        await expectDestination(page, locale.alternate, `#${slug}`);
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

test.describe('the locale-switch destination assertion', () => {
  for (const locale of locales) {
    test(`${locale.name} switch destination is asserted without waiting for the page to finish loading, and a wrong destination still fails`, async ({ page }) => {
      const slug = 'general-reservation-system';
      await page.goto(appUrl(locale.index) + `#${slug}`);
      const link = page.getByRole('banner').locator(`a[hreflang="${locale.switchHreflang}"]`);
      await expect(link).toHaveAttribute('href', appPathname(locale.alternate) + `#${slug}`);
      // Hold the destination's stylesheets: the document commits at the right URL but cannot finish loading.
      let release!: () => void;
      const gate = new Promise<void>((resolve) => { release = resolve; });
      let held = 0;
      await page.route('**/*', async (route) => {
        if (route.request().resourceType() === 'stylesheet') {
          held += 1;
          await gate;
        }
        await route.continue().catch(() => {});
      });
      try {
        await link.click();
        await expectDestination(page, locale.alternate, `#${slug}`);
        expect(held, 'a destination resource that blocks loading is held').toBeGreaterThan(0);
        expect(await page.evaluate(() => document.readyState), 'the page is still loading').not.toBe('complete');

        await expect(expectDestination(page, locale.index, `#${slug}`, 500), 'the other locale is not the destination').rejects.toThrow();
        await expect(expectDestination(page, locale.alternate, '#the-system', 500), 'another fragment is not the destination').rejects.toThrow();
        await expect(expectDestination(page, locale.alternate, '', 500), 'no fragment is not the destination').rejects.toThrow();
      } finally {
        release();
        await page.unrouteAll({ behavior: 'ignoreErrors' });
      }
    });
  }
});

type Opening = 'new tab' | 'current tab';

/**
 * What this browser does with a middle click on an ordinary link that has no script behind it. Chromium
 * and Firefox open a new tab; the WebKit that Playwright drives follows the link in the current tab. The
 * locale switch must do exactly what a plain anchor does, so its tests take their expectation from this
 * control instead of naming a browser. It runs in its own context, so its tabs never reach a test's
 * `context.waitForEvent('page')`, and it waits on the browser's own outcome (a new page or a navigation of
 * the page that was clicked), never on a timer. Whichever happens must land on the control's exact
 * destination. It is measured once per worker in a `beforeAll` (below), so that setup has a budget of its
 * own and never shares a journey's.
 */
async function nativeMiddleClickOpening(browser: Browser, baseURL: string | undefined): Promise<Opening> {
  const context = await browser.newContext({ baseURL });
  try {
    const page = await context.newPage();
    await page.goto(appUrl(stableRoutes.privacy.es));
    const destination = appPathname(stableRoutes.privacy.en);
    await page.evaluate((href) => {
      const control = document.createElement('a');
      control.id = 'native-control';
      control.href = href;
      control.textContent = 'native control';
      control.style.cssText = 'position:fixed;left:24px;top:240px;z-index:2147483647;display:block;padding:16px;background:#fff;color:#000';
      document.body.append(control);
    }, destination);
    const newTab = context.waitForEvent('page');
    const sameTab = page.waitForURL((url) => url.pathname === destination);
    await page.locator('#native-control').click({ button: 'middle' });
    const opening = await Promise.race([newTab.then((): Opening => 'new tab'), sameTab.then((): Opening => 'current tab')]);
    await expect(opening === 'new tab' ? await newTab : page).toHaveURL(destination);
    return opening;
  } finally {
    await context.close();
  }
}

/**
 * The Spanish and English routes live under separate root layouts, so every locale switch is a full
 * document load whatever component renders it (Next: route groups, "Full page load"). The switch must
 * therefore be a native link whose navigation does not depend on Next's RSC (`?_rsc=`) requests. These
 * tests hold every such request for the whole test: a router-driven switch waits on them and never arrives.
 */
async function holdRscRequests(page: Page) {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const held: string[] = [];
  await page.route((url) => url.searchParams.has('_rsc'), async (route) => {
    held.push(route.request().url());
    await gate;
    await route.continue().catch(() => {});
  });
  return {
    held,
    async stop() {
      release();
      await page.unrouteAll({ behavior: 'ignoreErrors' });
    },
  };
}

test.describe('the locale switch is a native document navigation that does not wait on RSC requests', () => {
  // Measured once per worker (a worker serves one project, so one browser), in a hook whose budget is its
  // own: the journeys below each keep their whole configured timeout for the switch itself.
  let middleClickOpening: Opening | undefined;
  test.beforeAll(async ({ browser }, testInfo) => {
    middleClickOpening = await nativeMiddleClickOpening(browser, testInfo.project.use.baseURL);
  });
  const nativeMiddleOpening = (): Opening => {
    if (!middleClickOpening) throw new Error('the native middle-click control was not measured');
    return middleClickOpening;
  };

  for (const locale of locales) {
    const alternateServices = locale.services === stableRoutes.services.es ? stableRoutes.services.en : stableRoutes.services.es;
    const cases = [
      { name: 'a known fragment', from: locale.index, hash: '#the-system', to: locale.alternate, expectHash: '#the-system' },
      { name: 'an unknown fragment', from: locale.index, hash: '#nope', to: locale.alternate, expectHash: '' },
      { name: 'an ordinary page and a dossier fragment', from: locale.services, hash: '#the-system', to: alternateServices, expectHash: '' },
    ] as const;
    for (const region of ['banner', 'contentinfo'] as const) {
      for (const scenario of cases) {
        test(`${locale.name} ${region} switch reaches the exact destination for ${scenario.name} with every RSC request held`, async ({ page }) => {
          await page.goto(appUrl(scenario.from) + scenario.hash);
          const link = page.getByRole(region).locator(`a[hreflang="${locale.switchHreflang}"]`);
          await expect(link).toHaveCount(1);
          await expect(link).toHaveAttribute('href', appPathname(scenario.to) + scenario.expectHash);
          const rsc = await holdRscRequests(page);
          try {
            await link.click();
            await expectDestination(page, scenario.to, scenario.expectHash);
            if (scenario.expectHash) {
              await expect(page.locator(`article${scenario.expectHash}`)).toBeVisible();
              const { top, headerBottom } = await settledTop(page, `article${scenario.expectHash}`);
              expect(top).toBeGreaterThanOrEqual(headerBottom);
            }
          } finally {
            await rsc.stop();
          }
        });
      }
    }

    test(`${locale.name} switch used the instant a client-side jump lands on a dossier still reaches that dossier`, async ({ page }) => {
      // Services evidence is a client-side `next/link` navigation: Next writes the fragment to the URL after
      // committing, with no `hashchange`, so the header's own copy of the link can briefly lag the URL. Activate
      // the switch in the first frame where the URL carries the fragment AND the destination's switch exists:
      // the URL changes before the destination renders (measured: a document with no header, main or switch
      // for several frames), and clicking a switch that is not there starts no navigation at all.
      await page.goto(appUrl(locale.services));
      const evidence = page.getByRole('main').locator(`a[href="${appPathname(locale.index)}#general-reservation-system"]`);
      await expect(evidence).toHaveCount(1);
      await page.evaluate(({ evidenceSelector, switchSelector }) => {
        (document.querySelector(evidenceSelector) as HTMLElement).click();
        const activate = () => {
          const anchor = location.hash === '#general-reservation-system' ? document.querySelector(switchSelector) as HTMLAnchorElement | null : null;
          if (anchor) {
            // Recorded before the click so the test can tell, across the document change, that it happened.
            sessionStorage.setItem('switchActivated', 'true');
            anchor.click();
            return;
          }
          requestAnimationFrame(activate);
        };
        requestAnimationFrame(activate);
      }, {
        evidenceSelector: `main a[href="${appPathname(locale.index)}#general-reservation-system"]`,
        switchSelector: `header a[hreflang="${locale.switchHreflang}"]`,
      });
      // The destination's own limit starts at the activation, not at the start of the first leg.
      await page.waitForFunction(() => sessionStorage.getItem('switchActivated') === 'true');
      await expectDestination(page, locale.alternate, '#general-reservation-system');
      await expect(page.locator('article#general-reservation-system')).toBeVisible();
    });

    // The same lag window, activated the ways that open the destination elsewhere. The browser reads the
    // anchor's `href` for these too, so it must already name the fragment. These are trusted pointer events:
    // the jump is started by the page, the first animation frame whose URL carries the fragment is awaited,
    // and the real click follows at once (a round trip of a few milliseconds against a window of about 100).
    for (const activation of [
      { name: 'a Control or Meta click', button: 'left', keys: ['ControlOrMeta'] },
      { name: 'a Shift click', button: 'left', keys: ['Shift'] },
      { name: 'a middle click', button: 'middle', keys: [] },
    ] as const) {
      test(`${locale.name} switch activated by ${activation.name} the instant a client-side jump lands opens the dossier exactly as a plain link does`, async ({ page, context }) => {
        const opening = activation.button === 'middle' ? nativeMiddleOpening() : 'new tab';
        await page.goto(appUrl(locale.services));
        const evidence = page.getByRole('main').locator(`a[href="${appPathname(locale.index)}#general-reservation-system"]`);
        await expect(evidence).toHaveCount(1);
        const box = (await page.getByRole('banner').locator(`a[hreflang="${locale.switchHreflang}"]`).boundingBox())!;
        const opened = opening === 'new tab' ? context.waitForEvent('page') : undefined;
        // Held before the jump so that only the click itself remains inside the window. The page's own
        // `click()` that starts the jump is script-dispatched and carries no modifier.
        for (const key of activation.keys) await page.keyboard.down(key);
        await evidence.evaluate((element) => (element as HTMLElement).click());
        // The URL changes before the destination renders: for several frames the document can have no header,
        // main or switch, and a pointer click there would land on nothing (measured). Wait for the switch too.
        await page.waitForFunction(
          (switchSelector) => location.hash === '#general-reservation-system' && document.querySelector(switchSelector) !== null,
          `header a[hreflang="${locale.switchHreflang}"]`,
          { polling: 'raf' },
        );
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { button: activation.button });
        for (const key of activation.keys) await page.keyboard.up(key);
        if (opened) {
          const tab = await opened;
          await expect(tab).toHaveURL(appPathname(locale.alternate) + '#general-reservation-system');
          await expectDestination(page, locale.index, '#general-reservation-system');
        } else {
          // This browser follows a middle-clicked link in the current tab, so the page itself must arrive.
          await expectDestination(page, locale.alternate, '#general-reservation-system');
        }
      });
    }

    // The real lag window is about 100 ms and browsers reach it with different odds, so the tests above are
    // not equally sensitive everywhere. This one fixes the state they target: the URL already carries the
    // fragment and the anchor's `href` does not, which the jump above was observed to produce. The page sets
    // that `href` back to the fragmentless route (React only rewrites it when its own state changes, so it
    // stays), then real pointer input activates the link. Only the activation can bring the fragment back.
    for (const activation of [
      { name: 'a plain click', button: 'left', keys: [] },
      { name: 'a Control or Meta click', button: 'left', keys: ['ControlOrMeta'] },
      { name: 'a Shift click', button: 'left', keys: ['Shift'] },
      { name: 'a middle click', button: 'middle', keys: [] },
    ] as const) {
      test(`${locale.name} switch whose href lags the URL still carries the fragment when activated by ${activation.name}`, async ({ page, context }) => {
        const opening: Opening = activation.button === 'middle'
          ? nativeMiddleOpening()
          : activation.keys.length ? 'new tab' : 'current tab';
        await page.goto(appUrl(locale.index) + '#the-system');
        const link = page.getByRole('banner').locator(`a[hreflang="${locale.switchHreflang}"]`);
        await expect(link).toHaveAttribute('href', appPathname(locale.alternate) + '#the-system');
        await link.evaluate((anchor, stale) => anchor.setAttribute('href', stale), appPathname(locale.alternate));
        await expect(link).toHaveAttribute('href', appPathname(locale.alternate));
        const opened = opening === 'new tab' ? context.waitForEvent('page') : undefined;
        for (const key of activation.keys) await page.keyboard.down(key);
        await link.click({ button: activation.button });
        for (const key of activation.keys) await page.keyboard.up(key);
        if (opened) {
          const tab = await opened;
          await expect(tab).toHaveURL(appPathname(locale.alternate) + '#the-system');
          await expectDestination(page, locale.index, '#the-system');
        } else {
          await expectDestination(page, locale.alternate, '#the-system');
        }
      });
    }

    test(`${locale.name} switch is reachable by keyboard and Enter reaches the exact destination with every RSC request held`, async ({ page }) => {
      await page.goto(appUrl(locale.index) + '#the-system');
      const link = page.getByRole('banner').locator(`a[hreflang="${locale.switchHreflang}"]`);
      await expect(link).toHaveAttribute('href', appPathname(locale.alternate) + '#the-system');
      const rsc = await holdRscRequests(page);
      try {
        await link.focus();
        await expect(link).toBeFocused();
        await page.keyboard.press('Enter');
        await expectDestination(page, locale.alternate, '#the-system');
      } finally {
        await rsc.stop();
      }
    });

    for (const [button, modifiers] of [['left', ['ControlOrMeta']], ['middle', []]] as const) {
      test(`${locale.name} switch opens the exact destination on a ${button} click with ${modifiers.length ? 'a modifier' : 'no modifier'} exactly as a plain link does`, async ({ page, context }) => {
        const opening = button === 'middle' ? nativeMiddleOpening() : 'new tab';
        await page.goto(appUrl(locale.index) + '#the-system');
        const link = page.getByRole('banner').locator(`a[hreflang="${locale.switchHreflang}"]`);
        await expect(link).toHaveAttribute('href', appPathname(locale.alternate) + '#the-system');
        const opened = opening === 'new tab' ? context.waitForEvent('page') : undefined;
        await link.click({ button, modifiers: [...modifiers] });
        if (opened) {
          const tab = await opened;
          await expect(tab).toHaveURL(appPathname(locale.alternate) + '#the-system');
          await expectDestination(page, locale.index, '#the-system');
        } else {
          // This browser follows a middle-clicked link in the current tab, so the page itself must arrive.
          await expectDestination(page, locale.alternate, '#the-system');
        }
      });
    }
  }
});

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
