import { expect, test, type Page } from '@playwright/test';
import { setConnectedTestHook } from './support/connected-studio-test-hooks';
import {
  connectedCanvas,
  controlVisibility,
  enableLiveForTest,
  expectLive,
  expectSettled,
  expectStatic,
  expectStopped,
  navigateInApp,
  observePageErrors,
  pauseLabels,
  pauseSlot,
  readConnected,
  scrollInstant,
  seedSession,
  trackWebglContexts,
  type ConnectedLocale,
} from './support/connected-studio';
import { appPathname, appUrl, stableRoutes } from './support/paths';
import type { ConnectedRoute } from '../../lib/connected-studio/types';

// PLAN-SFC-V1 Task 11: the shared host on the three new routes, behind the runtime candidate
// (SFC_TEST_MODE=candidate with the live-policy fixture applied; see playwright.config.ts). WebGL here runs on
// SwiftShader, so these specs prove functional lifecycle and input behavior only, never frame pacing or feel.
// Actual Contact submission and the five rendered profiles are verified by Task 12.

test.describe.configure({ timeout: 90_000 });

const NEW_ROUTES = ['studio', 'founder', 'contact'] as const satisfies readonly ConnectedRoute[];
type NewRoute = (typeof NEW_ROUTES)[number];
const LOCALES = ['es', 'en'] as const satisfies readonly ConnectedLocale[];

/** Four decorative words on Studio and Founder, three on Contact; compact keeps the first two. */
const WORD_COUNT: Record<NewRoute, number> = { studio: 4, founder: 4, contact: 3 };

/** The margin right of the 1180px reading container at 1440px: no plate, scrim or control reaches it. */
const FREE_X = 1385;

/** A client-side navigation through a link inside the page (the App Bar has no Founder entry). */
async function followPageLink(page: Page, pathname: string) {
  await page.locator(`a[href="${pathname}"]:visible`).first().click();
  await page.waitForURL((url) => url.pathname === pathname);
}

const goto = (page: Page, route: ConnectedRoute, locale: ConnectedLocale) => page.goto(appUrl(stableRoutes[route][locale]));

async function readNodes(page: Page) {
  const reading = await readConnected(page);
  return new Map((reading?.nodes ?? []).map((node) => [node.id, node.position] as const));
}

type NodeMap = Awaited<ReturnType<typeof readNodes>>;

/** The largest distance any node moved between two readings, in scene units. */
function displacement(a: NodeMap, b: NodeMap): number {
  let largest = 0;
  for (const [id, from] of a) {
    const to = b.get(id);
    if (!to) return Number.POSITIVE_INFINITY;
    largest = Math.max(largest, Math.hypot(from[0] - to[0], from[1] - to[1], from[2] - to[2]));
  }
  return largest;
}

/** A new page holds no callback once its poster ease and every tail have settled. */
async function expectAsleep(page: Page, timeout = 30_000) {
  await expect
    .poll(
      async () => {
        const reading = await readConnected(page);
        return reading?.controller === 'live' && reading.pendingCallbacks === 0 && reading.schedulerPending === 0 && reading.targetFps === 0;
      },
      { timeout },
    )
    .toBe(true);
}

async function liveRest(page: Page, route: NewRoute, locale: ConnectedLocale) {
  await enableLiveForTest(page);
  await goto(page, route, locale);
  await expectLive(page);
  await expectSettled(page);
  await expectAsleep(page);
  return readNodes(page);
}

/** A slow sweep through the free margin beside the graph node n4 (u .94, v .25 on every Atlas composition). */
async function sweepBesideN4(page: Page) {
  await page.mouse.move(1425, 150);
  await page.mouse.move(FREE_X, 205, { steps: 12 });
  await page.mouse.move(FREE_X, 250, { steps: 12 });
}

for (const route of NEW_ROUTES) {
  for (const locale of LOCALES) {
    test.describe(`${route} ${locale}`, () => {
      test('goes live with a named Pause control in its reserved slot and a profile of its own', async ({ page }) => {
        const errors = observePageErrors(page);
        await liveRest(page, route, locale);

        const reading = await readConnected(page);
        expect(reading?.route).toBe(route);
        expect(reading?.profile).toMatchObject({ route, nodeStyle: 'atlas', tier: 'wide' });
        expect(reading?.profile?.wordNodeIds).toHaveLength(WORD_COUNT[route]);
        expect(reading?.nodes).toHaveLength(16);

        const pause = pauseSlot(page, route).getByRole('button', { name: pauseLabels[locale].pause });
        await expect(pause).toBeVisible();
        await expect(pause).toHaveAttribute('aria-pressed', 'false');
        // The server-rendered static-background label gives way to the live control instead of duplicating it.
        await expect(pauseSlot(page, route).locator('[data-connected-static-label]')).toBeHidden();

        // One label per word the profile binds: the bound ids of the page intersected with the profile ids.
        const bound: { nodeId: string }[] = JSON.parse((await page.locator('[data-word-bindings]').getAttribute('data-word-bindings')) ?? '[]');
        const allowed = bound.filter((binding) => reading?.profile?.wordNodeIds.includes(binding.nodeId));
        expect(await page.locator('[data-connected-label]').count(), 'one label element per allowed binding').toBe(allowed.length);
        if (route !== 'contact') expect(allowed).toHaveLength(WORD_COUNT[route]);
        expect(errors.errors).toEqual([]);
      });

      test('sleeps at rest: no pending callback, no scheduled timer and no further draw', async ({ page }) => {
        await liveRest(page, route, locale);
        const first = await readConnected(page);
        await page.waitForTimeout(1_200);
        const later = await readConnected(page);
        expect(later?.renderCount, 'a settled new page draws nothing').toBe(first?.renderCount);
        expect(later?.schedulerPending).toBe(0);
      });
    });
  }
}

// OPEN FINDING (Task 11, for the planning authority): app/(es|en)/_content/{,commercial/}contact.ts bind the three
// Contact words to n0, n5 and n10, while DESIGN-SFC-V1 ("Composition data") and the Task 4 profile bind them to
// n0, n4 and n8. The content belongs to Task 10, outside this packet; the host follows the profile, so only the
// n0 word is drawn until the content is corrected by Task 12 or a numbered remediation packet.
test.fixme('contact: its three words are bound to n0, n4 and n8', async ({ page }) => {
  await liveRest(page, 'contact', 'es');
  const reading = await readConnected(page);
  expect(reading?.profile?.wordNodeIds).toEqual(['n0', 'n4', 'n8']);
  expect(await page.locator('[data-connected-label]').count()).toBe(3);
});

test.describe('input on the Atlas routes', () => {
  for (const route of ['studio', 'founder'] as const) {
    test(`${route}: a mouse beside the graph moves nodes without a layout read, then everything settles`, async ({ page }) => {
      const rest = await liveRest(page, route, 'es');
      const reads = (await readConnected(page))?.layoutReads ?? 0;

      let peak = 0;
      const watch = setInterval(() => {
        void readNodes(page).then((now) => {
          peak = Math.max(peak, displacement(rest, now));
        });
      }, 50);
      await sweepBesideN4(page);
      await page.waitForTimeout(250);
      clearInterval(watch);
      expect(peak, 'nearby nodes yield to the pointer').toBeGreaterThan(0.002);
      expect((await readConnected(page))?.layoutReads, 'pointer movement reads no layout').toBe(reads);

      // A pointer held near the graph keeps a small steady yield by design; entering a control removes it.
      await pauseSlot(page, route).getByRole('button').hover();
      await expectAsleep(page);
      expect(displacement(rest, await readNodes(page)), 'every node returns to its rest position').toBeLessThan(0.001);
    });

    test(`${route}: a pointer over an opaque plate, reading text or a control excites nothing`, async ({ page }) => {
      const rest = await liveRest(page, route, 'es');
      const heading = page.getByRole('heading', { level: 1 });
      const box = await heading.boundingBox();
      expect(box).not.toBeNull();
      // Inside the scrim, then inside its 24px clearance, then one pixel inside the extra 8px margin.
      for (const [x, y] of [
        [box!.x + 20, box!.y + box!.height / 2],
        [box!.x - 20, box!.y + box!.height / 2],
        [box!.x - 31, box!.y + box!.height / 2],
      ]) {
        await page.mouse.move(x, Math.max(y, 90), { steps: 6 });
        expect((await readConnected(page))?.pointerActive, `(${Math.round(x)}, ${Math.round(y)}) is excluded`).toBe(false);
      }
      await page.mouse.move(FREE_X, 300, { steps: 6 });
      expect((await readConnected(page))?.pointerActive, 'the free margin is not').toBe(true);
      await page.mouse.move(box!.x + 20, Math.max(box!.y + box!.height / 2, 90), { steps: 6 });
      expect((await readConnected(page))?.pointerActive).toBe(false);
      await expectAsleep(page);
      expect(displacement(rest, await readNodes(page))).toBeLessThan(0.001);

      const control = pauseSlot(page, route).getByRole('button');
      await control.hover();
      expect((await readConnected(page))?.pointerActive, 'a control keeps the pointer for itself').toBe(false);
    });

    test(`${route}: an ordinary wheel scroll excites the graph, while a restore or script scroll does not`, async ({ page }) => {
      const rest = await liveRest(page, route, 'es');

      await scrollInstant(page, 700);
      await page.waitForTimeout(600);
      await expectAsleep(page);
      expect(displacement(rest, await readNodes(page)), 'a jump is a state update, not a gesture to replay').toBeLessThan(0.001);

      await page.mouse.wheel(0, 100);
      let peak = 0;
      for (let i = 0; i < 12; i += 1) {
        peak = Math.max(peak, displacement(rest, await readNodes(page)));
        await page.waitForTimeout(40);
      }
      expect(peak, 'a wheel notch kicks the nodes').toBeGreaterThan(0.002);
      await expectAsleep(page);
      expect(displacement(rest, await readNodes(page))).toBeLessThan(0.001);
    });
  }

  test('contact: nodes never move; only the quiet strings respond', async ({ page }) => {
    const rest = await liveRest(page, 'contact', 'es');
    await sweepBesideN4(page);
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(400);
    expect(displacement(rest, await readNodes(page))).toBe(0);
    await pauseSlot(page, 'contact').getByRole('button').hover();
    await expectAsleep(page);
  });

  test('a touch tap excites nothing and keeps native scrolling', async ({ browser }) => {
    const context = await browser.newContext({ hasTouch: true, viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    try {
      const rest = await liveRest(page, 'studio', 'es');
      await page.touchscreen.tap(FREE_X, 250);
      await page.waitForTimeout(500);
      expect((await readConnected(page))?.pointerActive).toBe(false);
      expect(displacement(rest, await readNodes(page))).toBe(0);
    } finally {
      await context.close();
    }
  });
});

test.describe('contact form signal', () => {
  test('focus in the form pauses the graph, and only the next eligible background input resumes it', async ({ page }) => {
    await liveRest(page, 'contact', 'es');
    const field = page.locator('form[data-inquiry-phase] input:not([name="_gotcha"])').first();
    await expect(page.locator('form[data-inquiry-phase]')).toHaveAttribute('data-contact-hydrated', 'true');

    await field.focus();
    await expect.poll(async () => (await readConnected(page))?.formSuspended).toBe(true);
    await expectStopped(page);
    expect((await readConnected(page))?.controller).toBe('paused');

    // Typing inside the field changes nothing.
    await page.keyboard.type('Ada');
    await expectStopped(page, 300);

    // Focus leaving the form does not resume it by itself ...
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.waitForTimeout(400);
    expect((await readConnected(page))?.formSuspended).toBe(true);
    // ... the next eligible background input does.
    await page.mouse.move(FREE_X, 400, { steps: 4 });
    await expect.poll(async () => (await readConnected(page))?.formSuspended).toBe(false);
    await expectAsleep(page);
  });

  test('a submission in flight suspends the graph; an outcome alone does not resume it', async ({ page }) => {
    await liveRest(page, 'contact', 'es');
    const form = page.locator('form[data-inquiry-phase]');
    // The form-signal fixture: the phase marker is the whole contract (no values, no event bus).
    await form.evaluate((element) => element.setAttribute('data-inquiry-phase', 'submitting'));
    await expect.poll(async () => (await readConnected(page))?.formSuspended).toBe(true);
    await expectStopped(page);
    await page.mouse.move(FREE_X, 350, { steps: 4 });
    expect((await readConnected(page))?.formSuspended, 'input cannot lift a submission').toBe(true);

    await form.evaluate((element) => element.setAttribute('data-inquiry-phase', 'error'));
    await page.waitForTimeout(200);
    expect((await readConnected(page))?.formSuspended, 'the outcome alone does not resume').toBe(true);
    await page.mouse.move(FREE_X, 420, { steps: 4 });
    await expect.poll(async () => (await readConnected(page))?.formSuspended).toBe(false);
  });

  test('the visitor Pause is kept when the form suspension lifts', async ({ page }) => {
    await liveRest(page, 'contact', 'es');
    await pauseSlot(page, 'contact').getByRole('button', { name: pauseLabels.es.pause }).click();
    await expect.poll(async () => (await readConnected(page))?.controller).toBe('paused');
    const field = page.locator('form[data-inquiry-phase] input:not([name="_gotcha"])').first();
    await field.focus();
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.mouse.move(FREE_X, 400, { steps: 4 });
    await expect.poll(async () => (await readConnected(page))?.formSuspended).toBe(false);
    expect((await readConnected(page))?.controller, 'still paused by the visitor').toBe('paused');
  });
});

test.describe('lifecycle on the Atlas routes', () => {
  test('hidden and Footer-dominated states hold zero callbacks and draw nothing', async ({ page }) => {
    const visibility = await controlVisibility(page);
    await liveRest(page, 'studio', 'es');

    await visibility.setHidden(true);
    await expectStopped(page);
    await visibility.setHidden(false);
    await expectAsleep(page);

    await scrollInstant(page, 'bottom');
    await expectStopped(page);
    await scrollInstant(page, 0);
    await expectAsleep(page);
  });

  test('Pause persists across the five routes and one renderer is live at a time', async ({ page }) => {
    const gl = await trackWebglContexts(page);
    await liveRest(page, 'studio', 'es');
    await pauseSlot(page, 'studio').getByRole('button', { name: pauseLabels.es.pause }).click();
    await expect.poll(async () => (await readConnected(page))?.controller).toBe('paused');

    for (const next of ['founder', 'contact', 'services', 'projects'] as const) {
      if (next === 'founder' || next === 'contact') await followPageLink(page, appPathname(stableRoutes[next].es));
      else await navigateInApp(page, stableRoutes[next].es);
      await expectLive(page);
      await expect(pauseSlot(page, next).getByRole('button', { name: pauseLabels.es.resume })).toBeVisible({ timeout: 30_000 });
      expect((await readConnected(page))?.controller).toBe('paused');
    }
    expect(await gl.maxAlive(), 'never more than one live context').toBeLessThanOrEqual(1);
  });

  test('a viewport change builds the compact profile with the first two words, and restores nothing it had', async ({ page }) => {
    await liveRest(page, 'studio', 'es');
    await page.setViewportSize({ width: 390, height: 844 });
    await expect.poll(async () => (await readConnected(page))?.profile?.tier, { timeout: 30_000 }).toBe('compact');
    const reading = await readConnected(page);
    expect(reading?.profile?.wordNodeIds).toEqual(['n0', 'n4']);
    expect(reading?.nodes).toHaveLength(8);
    expect(await page.locator('[data-connected-label]').count()).toBe(2);
    await expectAsleep(page);
  });

  test('the optional engine is never imported under reduced motion, after a session context loss or with a denied policy', async ({ page, browser }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await enableLiveForTest(page);
    await goto(page, 'founder', 'en');
    await expectStatic(page, 'founder');
    expect((await readConnected(page))?.imports, 'no import was started').toBe(0);

    const lost = await browser.newPage();
    try {
      await seedSession(lost, { contextLost: '1' });
      await enableLiveForTest(lost);
      await goto(lost, 'contact', 'es');
      await expectStatic(lost, 'contact');
      expect((await readConnected(lost))?.imports).toBe(0);
    } finally {
      await lost.close();
    }

    const denied = await browser.newPage();
    try {
      await setConnectedTestHook(denied, { allowSoftwareRenderer: true, livePolicy: { wide: false, compact: false } });
      await goto(denied, 'studio', 'es');
      await expectStatic(denied, 'studio');
      expect((await readConnected(denied))?.imports).toBe(0);
      await expect(connectedCanvas(denied)).toHaveCount(0);
    } finally {
      await denied.close();
    }
  });
});
