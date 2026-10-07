import { createServer, type AddressInfo } from 'node:net';
import { expect, test, type Browser, type BrowserContext, type Page } from '@playwright/test';
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
    return await firstNativeOpening(context, page, destination, () => page.locator('#native-control').click({ button: 'middle' }));
  } finally {
    await context.close();
  }
}

/**
 * Runs `activate` and reports which of the two native outcomes the browser chose, asserting that it
 * landed on `destination`.
 *
 * The two observers are alternatives, so the first one that SUCCEEDS decides. A rejection of one is not
 * a result: opening a link elsewhere can first cancel the current page's own navigation, and the
 * current-tab waiter then rejects ("Navigation canceled by policy check" in WebKit) while the new tab is
 * legitimately on its way. Only when both fail does the observation fail. The click is awaited together
 * with the outcome, so a click that genuinely fails still fails here, and nothing is left unobserved: both
 * observers are attached to the outcome from the start and the caller's `context.close()` ends the loser.
 */
async function firstNativeOpening(context: BrowserContext, page: Page, destination: string, activate: () => Promise<void>): Promise<Opening> {
  const newTab = context.waitForEvent('page');
  const sameTab = page.waitForURL((url) => url.pathname === destination);
  const outcome = Promise.any([newTab.then((): Opening => 'new tab'), sameTab.then((): Opening => 'current tab')]);
  const [, opening] = await Promise.all([activate(), outcome]);
  await expect(opening === 'new tab' ? await newTab : page).toHaveURL(destination);
  return opening;
}

/** A local port that was just bound and released, so a connection to it is refused. */
function unusedLocalPort(): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo;
      server.close(() => resolve(port));
    });
  });
}

test.describe('the native opening observer', () => {
  // A browser that opens a link elsewhere can first cancel the current page's own navigation (WebKit does
  // so with "Navigation canceled by policy check"). That cancellation belongs to the new-tab outcome; it
  // is not a result. The scenario forces the order cancellation, then new tab, with no timer: the page
  // starts a navigation that the test aborts, and the new tab is opened only after the abort.
  //
  // The route callback is owned by the scenario. Playwright keeps a callback alive until the promise it
  // returns completes, and `context.close()` does not wait for it, so the work is tracked in `opening`:
  // `finished()` awaits it and reports its error, and `release()` waits for it before the context closes.
  async function scenario(browser: Browser, baseURL: string | undefined, opened: string) {
    const context = await browser.newContext({ baseURL });
    try {
      const page = await context.newPage();
      await page.goto(appUrl(stableRoutes.privacy.es));
      const destination = appPathname(stableRoutes.privacy.en);
      const canceled = appPathname('/canceled-by-policy/');
      let opening: Promise<void> | undefined;
      await page.route((url) => url.pathname === canceled, (route) => {
        opening = (async () => {
          await route.abort();
          // What the browser does next in the outcome under test: the link opens in a new tab. Committing
          // is enough: the test asserts the tab's URL itself.
          const tab = await context.newPage();
          await tab.goto(opened, { waitUntil: 'commit' });
        })();
        // Playwright waits for this promise; the error itself is reported through `finished()`.
        return opening.catch(() => {});
      });
      await page.evaluate((href) => {
        const control = document.createElement('div');
        control.id = 'native-control';
        control.textContent = 'scripted control';
        control.style.cssText = 'position:fixed;left:24px;top:240px;z-index:2147483647;padding:16px;background:#fff;color:#000';
        control.addEventListener('mouseup', () => { location.assign(href); });
        document.body.append(control);
      }, canceled);
      return {
        context,
        page,
        destination,
        activate: () => page.locator('#native-control').click({ button: 'middle' }),
        /** Awaits the scenario's own new-tab navigation and throws its error, if any. */
        finished: async () => { await opening; },
        /** Waits for that work to end, whatever its outcome, then closes the context. */
        release: async () => {
          await opening?.catch(() => {});
          await context.close();
        },
      };
    } catch (error) {
      // Setup failed after the context existed: release it and report the original error.
      await context.close().catch(() => {});
      throw error;
    }
  }

  test('a canceled current-tab navigation that precedes a new tab at the destination is a new tab', async ({ browser, baseURL }) => {
    const { context, page, destination, activate, finished, release } = await scenario(browser, baseURL, appPathname(stableRoutes.privacy.en));
    try {
      expect(await firstNativeOpening(context, page, destination, activate)).toBe('new tab');
      await finished();
    } finally {
      await release();
    }
  });

  test('a failure of the scenario\'s own new-tab navigation is reported, not discarded', async ({ browser, baseURL }) => {
    const unused = await unusedLocalPort();
    const { context, page, destination, activate, finished, release } = await scenario(browser, baseURL, `http://127.0.0.1:${unused}/`);
    try {
      // The tab is created but never reaches the destination, so the observation fails on the URL...
      await expect(firstNativeOpening(context, page, destination, activate)).rejects.toThrow(/toHaveURL/);
      // ...and the scenario's own navigation error is still there to read.
      await expect(finished()).rejects.toThrow(/CONNECTION_REFUSED|Could not connect/);
    } finally {
      await release();
    }
  });

  test('a scenario whose setup fails releases its context and reports the original error', async ({ browser }) => {
    const before = browser.contexts().length;
    // A port that was just bound and released: nothing listens on it, so the scenario's first navigation
    // fails (connection refused) after its context exists.
    const unused = await unusedLocalPort();
    await expect(scenario(browser, `http://127.0.0.1:${unused}`, appPathname(stableRoutes.privacy.en))).rejects.toThrow(/CONNECTION_REFUSED|Could not connect/);
    expect(browser.contexts().length, 'the failed setup left no context behind').toBe(before);
  });

  test('a new tab at the wrong destination still fails', async ({ browser, baseURL }) => {
    const { context, page, destination, activate, finished, release } = await scenario(browser, baseURL, appPathname(stableRoutes.services.es));
    try {
      await expect(firstNativeOpening(context, page, destination, activate)).rejects.toThrow(/toHaveURL/);
      await finished();
    } finally {
      await release();
    }
  });
});

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

// The native middle-click control is measured once per worker (a worker serves one project, so one
// browser) and only for the journeys that use it. Each of those gets a `beforeAll` of its own, so the
// control has a budget separate from the journeys' and a control that cannot be measured fails only the
// middle-click journeys, never the unrelated ones around them.
let nativeControl: Promise<Opening> | undefined;
let nativeOpening: Opening | undefined;

function journeyTest(needsNativeMiddleClick: boolean, title: string, body: (fixtures: { page: Page; context: BrowserContext }) => Promise<void>) {
  if (!needsNativeMiddleClick) {
    test(title, ({ page, context }) => body({ page, context }));
    return;
  }
  test.describe(() => {
    test.beforeAll(async ({ browser }, testInfo) => {
      nativeControl ??= nativeMiddleClickOpening(browser, testInfo.project.use.baseURL);
      nativeOpening = await nativeControl;
    });
    test(title, ({ page, context }) => body({ page, context }));
  });
}

const nativeMiddleOpening = (): Opening => {
  if (!nativeOpening) throw new Error('the native middle-click control was not measured');
  return nativeOpening;
};

test.describe('the locale switch is a native document navigation that does not wait on RSC requests', () => {
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
      journeyTest(activation.button === 'middle', `${locale.name} switch activated by ${activation.name} the instant a client-side jump lands opens the dossier exactly as a plain link does`, async ({ page, context }) => {
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
      journeyTest(activation.button === 'middle', `${locale.name} switch whose href lags the URL still carries the fragment when activated by ${activation.name}`, async ({ page, context }) => {
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
      journeyTest(button === 'middle', `${locale.name} switch opens the exact destination on a ${button} click with ${modifiers.length ? 'a modifier' : 'no modifier'} exactly as a plain link does`, async ({ page, context }) => {
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
