import AxeBuilder from '@axe-core/playwright';
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
  overlaps,
  pauseLabels,
  pauseSlot,
  readConnected,
  scrollInstant,
  seedSession,
  trackWebglContexts,
  type ConnectedLocale,
} from './support/connected-studio';
import { appPathname, appUrl, stableRoutes } from './support/paths';
import { getConnectedProfile } from '../../lib/connected-studio/profiles';
import { computeProjectionLayout, projectAnchor } from '../../lib/connected-studio/projection';
import { evaluateRestEdge } from '../../lib/connected-studio/rest-path';
import type { ConnectedRoute, ConnectedTier, Vec3 } from '../../lib/connected-studio/types';

// PLAN-SFC-V1 Task 11: the shared host on the three new routes, behind the runtime candidate
// (SFC_TEST_MODE=candidate with the live-policy fixture applied; see playwright.config.ts). WebGL here runs on
// SwiftShader, so these specs prove functional lifecycle and input behavior only, never frame pacing or feel.
// Task 12 adds the actual Contact form and the five rendered profiles below (the combined candidate:
// `prepare-sfc-candidate.mjs apply --kind=combined`, NEXT_PUBLIC_FORMSPREE_ENDPOINT set, provider traffic mocked).

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

      test('has no critical or serious axe violation with the live scene, its Pause control and labels', async ({ page }) => {
        await liveRest(page, route, locale);
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        const blocking = results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious');
        expect(blocking.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
        // The decorative layer is hidden from assistive technology and takes no pointer or focus.
        await expect(page.locator('[data-connected-ground]')).toHaveAttribute('aria-hidden', 'true');
        expect(await connectedCanvas(page).evaluate((element) => getComputedStyle(element).pointerEvents)).toBe('none');
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

// Reviewer R findings on PR 152 (head bf5a5bfa): the label, Pause and geometry-cache contracts of a sleeping scene.
test.describe('sleeping scene contracts (Reviewer R)', () => {
  const labelState = (page: Page) =>
    page.evaluate(() => {
      const rects = (selector: string) => Array.from(document.querySelectorAll<HTMLElement>(selector));
      const occluders = [
        ...rects('[data-connected-opaque-plate]').map((el) => el.getBoundingClientRect()),
        ...rects('[data-connected-reading-mask]').map((el) => {
          const r = el.getBoundingClientRect();
          const c = Number(el.getAttribute('data-connected-clearance')) || 0;
          return { left: r.left - c, top: r.top - c, right: r.right + c, bottom: r.bottom + c };
        }),
      ].map((r) => ({ left: r.left, top: r.top, right: r.right, bottom: r.bottom }));
      return rects('[data-connected-label]').map((el) => {
        const r = el.getBoundingClientRect();
        const covered = occluders.some((o) => r.left < o.right && o.left < r.right && r.top < o.bottom && o.top < r.bottom);
        return { id: el.dataset.nodeId, visible: el.dataset.visible === 'true', covered };
      });
    });

  test('a script or restored scroll over a sleeping scene refreshes label occlusion without waking it', async ({ page }) => {
    await liveRest(page, 'studio', 'es');
    const shownAtTop = (await labelState(page)).filter((label) => label.visible).map((label) => label.id);
    const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    let sawCovered = false;
    let sawShown = false;
    for (let top = 0; top <= max; top += 60) {
      await scrollInstant(page, top);
      await page.waitForTimeout(120);
      for (const label of await labelState(page)) {
        if (label.covered) {
          sawCovered = true;
          expect(label.visible, `label ${label.id} at scroll ${top} is under a plate or scrim`).toBe(false);
        } else if (label.visible) sawShown = true;
      }
    }
    expect(sawCovered, 'the sweep put a plate or scrim over a label').toBe(true);
    expect(sawShown, 'and a label was shown again once it moved away').toBe(true);
    await scrollInstant(page, 0);
    await page.waitForTimeout(200);
    expect((await labelState(page)).filter((label) => label.visible).map((label) => label.id), 'the labels the masks left are shown again').toEqual(shownAtTop);
    await expectAsleep(page);
  });

  test('the host reads no App Bar, plate or scrim geometry while the pointer is active or the scene is paused', async ({ page }) => {
    await page.addInitScript(() => {
      const counter = { calls: 0 };
      (window as unknown as { __geometryReads: typeof counter }).__geometryReads = counter;
      const original = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function (this: Element) {
        if (this.matches('[data-app-bar],[data-connected-opaque-plate],[data-connected-reading-mask]')) counter.calls += 1;
        return original.call(this);
      };
    });
    await liveRest(page, 'studio', 'es');
    const reads = () => page.evaluate(() => (window as unknown as { __geometryReads: { calls: number } }).__geometryReads.calls);
    const baseline = await reads();
    await sweepBesideN4(page);
    await page.mouse.move(FREE_X, 420, { steps: 10 });
    expect(await reads(), 'active pointer frames read cached boxes only').toBe(baseline);

    await pauseSlot(page, 'studio').getByRole('button', { name: pauseLabels.es.pause }).click();
    await expect.poll(async () => (await readConnected(page))?.controller).toBe('paused');
    const paused = await reads();
    await scrollInstant(page, 500);
    await page.waitForTimeout(300);
    expect(await reads(), 'paused label refreshes read cached boxes only').toBe(paused);
  });

  test('the visitor Pause rejects pointer input, and a keyboard Resume replays nothing', async ({ page }) => {
    const rest = await liveRest(page, 'studio', 'es');
    const pause = pauseSlot(page, 'studio').getByRole('button');
    await pause.focus();
    await page.keyboard.press('Space');
    await expect.poll(async () => (await readConnected(page))?.controller).toBe('paused');

    await sweepBesideN4(page);
    await page.waitForTimeout(300);
    expect((await readConnected(page))?.pointerActive, 'a paused scene takes no pointer sample').toBe(false);

    // The mouse stays put; the visitor resumes from the keyboard, then an ordinary (non-gesture) scroll updates the scene.
    await pause.focus();
    await page.keyboard.press('Space');
    await expect.poll(async () => (await readConnected(page))?.controller).toBe('live');
    await scrollInstant(page, 300);
    await page.waitForTimeout(800);
    await expectAsleep(page);
    expect(displacement(rest, await readNodes(page)), 'nothing collected during Pause is replayed').toBeLessThan(0.001);
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
    await sweepBesideN4(page);
    expect((await readConnected(page))?.pointerActive).toBe(true);

    await visibility.setHidden(true);
    await expectStopped(page);
    expect((await readConnected(page))?.pointerActive, 'a hidden tab forgets the pointer, so it supplies no momentum later').toBe(false);
    await visibility.setHidden(false);
    await expectAsleep(page);

    await scrollInstant(page, 'bottom');
    await expectStopped(page);
    await scrollInstant(page, 0);
    await expectAsleep(page);
  });

  test('Pause persists across the five routes and one renderer is live at a time', async ({ page }) => {
    // Five first visits to cold development routes on a software renderer: a journey, not one page load.
    test.setTimeout(240_000);
    const gl = await trackWebglContexts(page);
    await liveRest(page, 'studio', 'es');
    await pauseSlot(page, 'studio').getByRole('button', { name: pauseLabels.es.pause }).click();
    await expect.poll(async () => (await readConnected(page))?.controller).toBe('paused');

    for (const next of ['founder', 'contact', 'services', 'projects'] as const) {
      if (next === 'founder' || next === 'contact') await followPageLink(page, appPathname(stableRoutes[next].es));
      else await navigateInApp(page, stableRoutes[next].es);
      await expect(pauseSlot(page, next).getByRole('button', { name: pauseLabels.es.resume })).toBeVisible({ timeout: 30_000 });
      expect((await readConnected(page))?.controller).toBe('paused');
    }
    expect(await gl.maxAlive(), 'never more than one live context').toBeLessThanOrEqual(1);
  });

  test('a viewport change builds the compact profile with the first two words, and restores nothing it had', async ({ page }) => {
    test.setTimeout(150_000);
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

// ---------------------------------------------------------------------------------------------------------------------
// PLAN-SFC-V1 Task 12: the five rendered profiles on the actual pages. Software-rendered (SwiftShader), so this is
// functional evidence for caps, pins, masks and rest, never frame pacing, hardware cost or the feel of the motion.
// Every figure below is measured from the live pose through the pure projection the renderer itself uses.
// ---------------------------------------------------------------------------------------------------------------------

const FIVE_ROUTES = ['studio', 'founder', 'contact', 'services', 'projects'] as const satisfies readonly ConnectedRoute[];
const SCREENS = {
  wide: { width: 1440, height: 900, tier: 'wide' },
  compact: { width: 390, height: 844, tier: 'compact' },
} as const satisfies Record<string, { width: number; height: number; tier: ConnectedTier }>;
type ScreenName = keyof typeof SCREENS;

/** DESIGN-SFC-V1 "Pointer and node behavior" and "Flexible edges", written out independently of the profile under test. */
const NODE_CAP_PX = { wide: 34, compact: 14 } as const;
const EDGE_CAP_PX = { wide: 16, compact: 6 } as const;
const CONTACT_EDGE_CAP_PX = 4;
const CAP_TOLERANCE_PX = 0.75;
const NODE_COUNT = { wide: 16, compact: 8 } as const;
/** Undirected edge counts: DESIGN-SFC-V1 "Composition data" for the Atlas pages, the existing 33/13 graph for the others. */
const EDGE_COUNT = {
  wide: { studio: 20, founder: 18, contact: 15, services: 33, projects: 33 },
  compact: { studio: 10, founder: 10, contact: 10, services: 13, projects: 13 },
} as const;

function frameFor(route: ConnectedRoute, screen: ScreenName) {
  const size = SCREENS[screen];
  const profile = getConnectedProfile(route, size.tier, { width: size.width, height: size.height });
  const layout = computeProjectionLayout(profile, size);
  const toCss = (position: Vec3) => {
    const { xPx, yPx } = projectAnchor(position, layout);
    return { x: xPx, y: yPx };
  };
  return { profile, layout, toCss };
}
type Frame = ReturnType<typeof frameFor>;

const gap3 = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

function travelPx(frame: Frame, rest: NodeMap, now: NodeMap): number {
  let largest = 0;
  for (const [id, from] of rest) {
    const to = now.get(id);
    if (!to) return Number.POSITIVE_INFINITY;
    const a = frame.toCss(from);
    const b = frame.toCss(to);
    largest = Math.max(largest, Math.hypot(a.x - b.x, a.y - b.y));
  }
  return largest;
}

/** Per bent string: how far its end samples are from the actual nodes (must be zero) and its largest interior residual in CSS px. */
function measureStrings(frame: Frame, nodes: NodeMap, samples: readonly { id: string; points: readonly Vec3[] }[]) {
  const edges = frame.profile.graph.edges;
  return samples.map(({ id, points }) => {
    const index = edges.findIndex((candidate) => candidate.id === id);
    const edge = edges[index];
    const from = nodes.get(edge.from);
    const to = nodes.get(edge.to);
    if (!from || !to) return { id, pinError: Number.POSITIVE_INFINITY, residualPx: Number.POSITIVE_INFINITY };
    const pinError = Math.max(gap3(points[0], from), gap3(points[points.length - 1], to));
    let residualPx = 0;
    for (let j = 1; j < points.length - 1; j += 1) {
      const rest = evaluateRestEdge({ nodeStyle: frame.profile.nodeStyle, edgeIndex: index, from, to, layout: frame.layout }, j / (points.length - 1));
      const a = frame.toCss(points[j]);
      const b = frame.toCss(rest);
      residualPx = Math.max(residualPx, Math.hypot(a.x - b.x, a.y - b.y));
    }
    return { id, pinError, residualPx };
  });
}

async function measure(page: Page, frame: Frame, rest: NodeMap) {
  const reading = await readConnected(page);
  const nodes: NodeMap = new Map((reading?.nodes ?? []).map((node) => [node.id, node.position] as const));
  const strings = measureStrings(frame, nodes, reading?.edgeSamples ?? []);
  return {
    reading,
    travelPx: travelPx(frame, rest, nodes),
    stringPx: Math.max(0, ...strings.map((string) => string.residualPx)),
    pinError: Math.max(0, ...strings.map((string) => string.pinError)),
    bentStrings: strings.length,
  };
}

type Rect = { left: number; top: number; right: number; bottom: number };
type PointerMap = { exclusions: Rect[]; interactive: Rect[]; width: number; height: number };

/** The foreground the host must keep out of, read from the DOM independently of the host's own cache. */
const readPointerMap = (page: Page): Promise<PointerMap> =>
  page.evaluate(() => {
    const rect = (element: Element): Rect => {
      const { left, top, right, bottom } = element.getBoundingClientRect();
      return { left, top, right, bottom };
    };
    const grow = (r: Rect, by: number): Rect => ({ left: r.left - by, top: r.top - by, right: r.right + by, bottom: r.bottom + by });
    // 8px pointer margin plus clearance, and 2px of test safety so an edge-of-rule point never decides a result.
    const exclusions = [
      ...Array.from(document.querySelectorAll('[data-connected-opaque-plate]')).map((element) => grow(rect(element), 10)),
      ...Array.from(document.querySelectorAll('[data-connected-reading-mask]')).map((element) =>
        grow(rect(element), (Number(element.getAttribute('data-connected-clearance')) || 0) + 10),
      ),
    ];
    const interactive = Array.from(document.querySelectorAll('a[href],button,summary,input,select,textarea,label,form,[role="button"],[role="link"]')).map((element) => grow(rect(element), 2));
    return { exclusions, interactive, width: window.innerWidth, height: window.innerHeight };
  });

const within = (r: Rect, x: number, y: number) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
const isEligible = (map: PointerMap, x: number, y: number) =>
  x >= 4 && y >= 4 && x <= map.width - 4 && y <= map.height - 4 && !map.exclusions.some((r) => within(r, x, y)) && !map.interactive.some((r) => within(r, x, y));

type Lane = { a: { x: number; y: number }; b: { x: number; y: number }; distanceToNode: number };

/** The eligible straight pass (at least 70px long) that runs closest to any node, or null when no node has one within 160px. */
function findLane(map: PointerMap, nodes: readonly { x: number; y: number }[]): Lane | null {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]] as const;
  let best: Lane | null = null;
  for (let y = 8; y < map.height; y += 8) {
    for (let x = 8; x < map.width; x += 8) {
      if (!isEligible(map, x, y)) continue;
      const distanceToNode = Math.min(...nodes.map((node) => Math.hypot(node.x - x, node.y - y)));
      if (distanceToNode > 160 || (best && distanceToNode >= best.distanceToNode)) continue;
      for (const [dx, dy] of directions) {
        let forward = 0;
        while (forward < 90 && isEligible(map, x + dx * (forward + 6), y + dy * (forward + 6))) forward += 6;
        let backward = 0;
        while (backward < 90 && isEligible(map, x - dx * (backward + 6), y - dy * (backward + 6))) backward += 6;
        if (forward + backward >= 70) {
          best = { a: { x: x - dx * backward, y: y - dy * backward }, b: { x: x + dx * forward, y: y + dy * forward }, distanceToNode };
          break;
        }
      }
    }
  }
  return best;
}

async function sweep(page: Page, a: { x: number; y: number }, b: { x: number; y: number }, steps: number, pauseMs: number, onStep?: () => Promise<void>) {
  await page.mouse.move(a.x, a.y);
  for (let step = 1; step <= steps; step += 1) {
    await page.mouse.move(a.x + ((b.x - a.x) * step) / steps, a.y + ((b.y - a.y) * step) / steps);
    if (pauseMs) await page.waitForTimeout(pauseMs);
    await onStep?.();
  }
}

/** How many times a decaying series rose again (by more than `slack`) after it had fallen, and the largest such rise. */
function rebounds(series: readonly number[], slack: number) {
  let count = 0;
  let largest = 0;
  let low = Number.POSITIVE_INFINITY;
  let rising = false;
  for (let i = 1; i < series.length; i += 1) {
    if (series[i] < series[i - 1]) {
      rising = false;
      low = Math.min(low, series[i]);
    } else if (series[i] > series[i - 1] + 1e-9 && Number.isFinite(low)) {
      const rise = series[i] - low;
      if (rise > slack) {
        if (!rising) count += 1;
        rising = true;
        largest = Math.max(largest, rise);
      }
    }
  }
  return { count, largest };
}

test.describe('the five rendered profiles (Task 12)', () => {
  test.afterEach(async ({ page }) => {
    await page.goto('about:blank').catch(() => undefined);
  });

  for (const route of FIVE_ROUTES) {
    for (const screen of ['wide', 'compact'] as const) {
      test(`${route} ${screen}: rest composition, then active and inertial states stay inside the specified caps, pins and rest`, async ({ page }, testInfo) => {
        test.setTimeout(180_000);
        const size = SCREENS[screen];
        const frame = frameFor(route, screen);
        const atlas = frame.profile.nodeStyle === 'atlas';
        await page.setViewportSize({ width: size.width, height: size.height });
        await enableLiveForTest(page);
        await page.goto(appUrl(stableRoutes[route].es));
        await expectLive(page);
        await expectSettled(page);
        if (atlas) await expectAsleep(page, 45_000);

        // Stationary: the rendered rest composition is the specified one, with no bent string.
        const stationary = await readConnected(page);
        expect(stationary?.profile).toMatchObject({ route, tier: size.tier, nodeStyle: frame.profile.nodeStyle });
        expect(stationary?.nodes, 'node count').toHaveLength(NODE_COUNT[screen]);
        expect(stationary?.edgeGrowth, 'edge count').toHaveLength(EDGE_COUNT[screen][route]);
        const rest = await readNodes(page);
        if (atlas) {
          expect(stationary?.edgeSamples, 'a page at rest bends no string').toEqual([]);
          for (const anchor of frame.profile.restAnchors ?? []) {
            const at = frame.toCss(rest.get(anchor.id)!);
            expect(Math.hypot(at.x - anchor.u * size.width, at.y - anchor.v * size.height), `${anchor.id} renders at its specified rest position`).toBeLessThan(CAP_TOLERANCE_PX);
          }
        }
        await testInfo.attach(`${route}-${screen}-stationary`, { body: await page.screenshot(), contentType: 'image/png' });

        const map = await readPointerMap(page);
        const nodeCss = Array.from(rest.values()).map((position) => frame.toCss(position));
        const lane = findLane(map, nodeCss);
        const nodeCap = NODE_CAP_PX[screen];
        const edgeCap = route === 'contact' ? CONTACT_EDGE_CAP_PX : EDGE_CAP_PX[screen];

        if (!lane) {
          // Nothing eligible within reach of a node on this page at this size: every pointer position is masked. Prove it.
          testInfo.annotations.push({ type: 'no-eligible-lane', description: `${route} ${screen}: plates, scrims and controls mask every position within 160px of a node` });
          for (const [x, y] of [[size.width / 2, size.height / 2], [size.width * 0.8, size.height * 0.4], [size.width * 0.2, size.height * 0.6]]) {
            await page.mouse.move(x, y, { steps: 6 });
            expect((await readConnected(page))?.pointerActive, `(${Math.round(x)}, ${Math.round(y)}) is masked`).toBe(false);
          }
          expect((await measure(page, frame, rest)).travelPx).toBeLessThan(0.01);
          return;
        }

        // Active: a slow pass beside the nearest node.
        let peakTravel = 0;
        let peakString = 0;
        let worstPin = 0;
        const observe = async () => {
          const state = await measure(page, frame, rest);
          peakTravel = Math.max(peakTravel, state.travelPx);
          peakString = Math.max(peakString, state.stringPx);
          worstPin = Math.max(worstPin, state.pinError);
        };
        await sweep(page, lane.a, lane.b, 14, 35, observe);
        await sweep(page, lane.b, lane.a, 14, 35, observe);
        await observe();
        await testInfo.attach(`${route}-${screen}-active`, { body: await page.screenshot(), contentType: 'image/png' });
        expect(worstPin, 'string ends stay on their nodes').toBeLessThan(1e-6);
        expect(peakTravel, `node travel stays inside the ${nodeCap}px cap`).toBeLessThanOrEqual(nodeCap + CAP_TOLERANCE_PX);
        expect(peakString, `string residual stays inside the ${edgeCap}px cap`).toBeLessThanOrEqual(edgeCap + CAP_TOLERANCE_PX);
        if (route === 'contact') expect(peakTravel, 'Contact nodes never move').toBe(0);
        else expect(peakTravel, 'nodes near the pointer yield').toBeGreaterThan(0.25);
        expect(peakString, 'a string near the pointer bends').toBeGreaterThan(0.05);

        // Inertial: a fast pass, then the pointer is taken out of the field; the motion carries on and settles without jitter.
        await sweep(page, lane.a, lane.b, 4, 0, observe);
        await pauseSlot(page, route).getByRole('button').hover();
        const series: number[] = [];
        const strings: number[] = [];
        const started = Date.now();
        while (Date.now() - started < 12_000) {
          const state = await measure(page, frame, rest);
          series.push(state.travelPx);
          strings.push(state.stringPx);
          peakTravel = Math.max(peakTravel, state.travelPx);
          peakString = Math.max(peakString, state.stringPx);
          worstPin = Math.max(worstPin, state.pinError);
          if (state.travelPx < 0.005 && state.stringPx < 0.005 && series.length > 5) break;
          await page.waitForTimeout(40);
        }
        expect(worstPin).toBeLessThan(1e-6);
        expect(peakTravel).toBeLessThanOrEqual(nodeCap + CAP_TOLERANCE_PX);
        expect(peakString).toBeLessThanOrEqual(edgeCap + CAP_TOLERANCE_PX);
        expect(series.at(-1), 'every node returns to its rest position').toBeLessThan(0.01);
        expect(strings.at(-1), 'every string returns to its rest path').toBeLessThan(0.01);
        for (const [name, values, cap] of [['nodes', series, nodeCap], ['strings', strings, edgeCap]] as const) {
          const back = rebounds(values, 0.1);
          expect(back.count, `${name} settle with at most one overshoot`).toBeLessThanOrEqual(1);
          expect(back.largest, `${name} overshoot stays below ${0.05 * cap + 0.3}px`).toBeLessThanOrEqual(0.05 * cap + 0.3);
        }
        if (atlas) {
          await expectAsleep(page, 20_000);
          expect((await readConnected(page))?.edgeSamples, 'asleep means no bent string').toEqual([]);
          const first = await readConnected(page);
          await page.waitForTimeout(800);
          expect((await readConnected(page))?.renderCount, 'no draw after the stop').toBe(first?.renderCount);
        }
      });
    }
  }
});

// ---------------------------------------------------------------------------------------------------------------------
// PLAN-SFC-V1 Task 12: the actual Contact form against the host. No fixture writes the phase marker: every state below
// is reached by the visitor's own focus, typing, click and keys on the committed form, with the provider mocked.
// ---------------------------------------------------------------------------------------------------------------------

const CONTACT_ENDPOINT = 'https://formspree.io/f/meaqwnbr';

const CONTACT_COPY = {
  es: {
    submitting: 'Enviando...',
    retry: 'Intentar nuevamente',
    acceptedHeading: 'Mensaje aceptado.',
    uncertainHeading: 'No pudimos confirmar el envío.',
  },
  en: {
    submitting: 'Sending...',
    retry: 'Try again',
    acceptedHeading: 'Message accepted.',
    uncertainHeading: "We couldn't confirm your submission.",
  },
} as const satisfies Record<ConnectedLocale, Record<string, string>>;

/** The only network the page may reach is the exact approved endpoint, and every response is the test's own. */
function providerBoundary(page: Page) {
  const plan: { status: number; body: unknown; hold: Promise<void> | null } = { status: 200, body: { ok: true }, hold: null };
  const requests: string[] = [];
  const unexpected: string[] = [];
  let release: () => void = () => undefined;
  const installed = page.route('https://formspree.io/**', async (route) => {
    if (route.request().url() !== CONTACT_ENDPOINT) {
      unexpected.push(route.request().url());
      await route.abort();
      return;
    }
    requests.push(route.request().postData() ?? '');
    await plan.hold;
    await route.fulfill({ status: plan.status, contentType: 'application/json', body: JSON.stringify(plan.body) });
  });
  return {
    installed,
    requests,
    unexpected,
    respond(status: number, body: unknown) {
      plan.status = status;
      plan.body = body;
    },
    hold() {
      plan.hold = new Promise<void>((resolve) => {
        release = resolve;
      });
    },
    release() {
      release();
      plan.hold = null;
    },
  };
}

async function openActualContact(page: Page, locale: ConnectedLocale = 'es') {
  const boundary = providerBoundary(page);
  await boundary.installed;
  await enableLiveForTest(page);
  await goto(page, 'contact', locale);
  await expect(page.locator('form[data-contact-hydrated="true"]')).toBeVisible();
  await expectLive(page);
  await expectSettled(page);
  await expectAsleep(page);
  return boundary;
}

async function fillValidInquiry(page: Page) {
  await page.locator('#contact-name').fill('Ada Lovelace');
  await page.locator('#contact-email').fill('ada@example.com');
  await page.locator('#contact-company').fill('Analytical Engines');
  await page.locator('#contact-message').fill('Please help us scope a product idea.');
}

const submitButton = (page: Page) => page.locator('form[data-inquiry-phase] button[type="submit"]');
const formSuspended = async (page: Page) => (await readConnected(page))?.formSuspended;

/** The scene is held by the form: suspended, paused, no scheduled work and no further draw. */
async function expectHeldByForm(page: Page) {
  await expect.poll(() => formSuspended(page)).toBe(true);
  expect((await readConnected(page))?.controller).toBe('paused');
  await expectStopped(page, 300);
}

async function expectNoBlockingAxe(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  const blocking = results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious');
  expect(blocking.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
}

test.describe('the actual Contact form with the live graph (Task 12)', () => {
  test.afterEach(async ({ page }) => {
    await page.goto('about:blank').catch(() => undefined);
  });

  test('every field holds the graph; typing and textarea scrolling excite nothing; leaving the form waits for background input', async ({ page }) => {
    const boundary = await openActualContact(page);
    const first = await readConnected(page);

    for (const field of ['name', 'email', 'company', 'message']) {
      await page.locator(`#contact-${field}`).focus();
      await expectHeldByForm(page);
      expect((await readConnected(page))?.pointerActive).toBe(false);
    }
    // Moving between the fields of the form is not leaving it.
    await page.keyboard.press('Shift+Tab');
    await expectHeldByForm(page);
    await page.locator('#contact-message').focus();

    const message = page.locator('#contact-message');
    await message.fill(Array.from({ length: 60 }, (_, i) => `line ${i + 1}`).join('\n'));
    const before = await message.evaluate((element) => element.scrollTop);
    await message.hover();
    await page.mouse.wheel(0, 120);
    await expect.poll(() => message.evaluate((element) => element.scrollTop)).toBeGreaterThan(before);
    await page.waitForTimeout(300);
    const held = await readConnected(page);
    expect(held?.edgeSamples, 'textarea scrolling bends no string').toEqual([]);
    expect(held?.renderCount, 'typing and textarea scrolling draw nothing').toBe(first?.renderCount);
    expect(await formSuspended(page)).toBe(true);

    // Leaving the form does not resume the graph by itself; the next eligible background input does.
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.waitForTimeout(400);
    expect(await formSuspended(page)).toBe(true);
    await page.mouse.move(FREE_X, 400, { steps: 4 });
    await expect.poll(() => formSuspended(page)).toBe(false);
    await expectAsleep(page);
    expect(boundary.requests, 'focus, typing and scrolling transmit nothing').toEqual([]);
    expect(boundary.unexpected).toEqual([]);
  });

  for (const locale of ['es', 'en'] as const) {
    test(`${locale}: a valid submission moves focus to submit first, holds the graph while busy and after the result, and resumes on background input`, async ({ page }) => {
      const copy = CONTACT_COPY[locale];
      const boundary = await openActualContact(page, locale);
      await fillValidInquiry(page);
      await expectHeldByForm(page);

      boundary.hold();
      await submitButton(page).click();
      const form = page.locator('form[data-inquiry-phase]');
      await expect(form).toHaveAttribute('data-inquiry-phase', 'submitting');
      expect(await page.evaluate(() => document.activeElement?.getAttribute('type') + ':' + document.activeElement?.tagName), 'focus moved to submit before the fields were disabled').toBe('submit:BUTTON');
      await expect(page.locator('#contact-name')).toBeDisabled();
      await expect(submitButton(page)).toHaveAttribute('aria-disabled', 'true');
      await expect(page.locator('[data-contact-busy]')).toHaveText(copy.submitting);
      await expect.poll(() => boundary.requests.length).toBe(1);

      // Repeated activation, by pointer and by key, is one request.
      await submitButton(page).click({ force: true });
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
      expect(boundary.requests).toHaveLength(1);

      await expectHeldByForm(page);
      await page.mouse.move(FREE_X, 350, { steps: 4 });
      expect(await formSuspended(page), 'background input cannot lift a submission').toBe(true);

      boundary.release();
      const result = page.locator('[data-contact-result]');
      await expect(result).toBeFocused();
      await expect(result).toContainText(copy.acceptedHeading);
      expect(await result.getAttribute('aria-live')).toBeNull();
      await expect(page.locator('#contact-name')).toHaveValue('');
      await expectHeldByForm(page);
      await expectNoBlockingAxe(page);

      // The result region holds focus inside the form, so background input alone does not resume the graph ...
      await page.mouse.move(FREE_X, 420, { steps: 4 });
      await page.waitForTimeout(300);
      expect(await formSuspended(page), 'focus inside the form still holds').toBe(true);
      // ... leaving the form does, with the next eligible background input.
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      await page.mouse.move(FREE_X, 460, { steps: 4 });
      await expect.poll(() => formSuspended(page)).toBe(false);
      await expectAsleep(page);
      expect(boundary.requests).toHaveLength(1);
      expect(boundary.unexpected).toEqual([]);
    });
  }

  test('an invalid submission sends nothing, focuses the first invalid field and keeps the graph held', async ({ page }) => {
    const boundary = await openActualContact(page);
    await submitButton(page).click();
    await expect(page.locator('#contact-name')).toBeFocused();
    await expect(page.locator('#contact-name')).toHaveAttribute('aria-invalid', 'true');
    await expectHeldByForm(page);
    await page.waitForTimeout(300);
    expect(boundary.requests).toEqual([]);
  });

  test('a provider failure keeps every value and the held graph, sends nothing by itself, and retries only when asked', async ({ page }) => {
    const copy = CONTACT_COPY.es;
    const boundary = await openActualContact(page);
    boundary.respond(500, { error: 'unavailable' });
    await fillValidInquiry(page);
    await submitButton(page).click();

    const result = page.locator('[data-contact-result]');
    await expect(result).toBeFocused();
    await expect(result).toContainText(copy.uncertainHeading);
    await expect(page.locator('#contact-name')).toHaveValue('Ada Lovelace');
    await expect(page.locator('#contact-message')).toHaveValue('Please help us scope a product idea.');
    await expectHeldByForm(page);
    await expectNoBlockingAxe(page);
    await page.waitForTimeout(1_500);
    expect(boundary.requests, 'no automatic resend').toHaveLength(1);

    boundary.respond(200, { ok: true });
    await expect(submitButton(page)).toHaveText(copy.retry);
    await submitButton(page).click();
    await expect.poll(() => boundary.requests.length).toBe(2);
    await expect(result).toContainText(copy.acceptedHeading);
    await expectHeldByForm(page);
  });

  test('an explicit Resume after the form held the graph resumes it, and the control tells the truth', async ({ page }) => {
    await openActualContact(page);
    await page.locator('#contact-name').focus();
    await expectHeldByForm(page);

    // Shift+Tab from the first field reaches the Pause control, which precedes the form in the reading order.
    await page.keyboard.press('Shift+Tab');
    const pause = pauseSlot(page, 'contact').getByRole('button');
    await expect(pause).toBeFocused();
    await page.keyboard.press('Space');
    await expect(pause).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Space');
    await expect(pause).toHaveAttribute('aria-pressed', 'false');
    await expect(pause).toBeFocused();
    // The visitor asked for the background back, and nothing else holds it: it is live, not silently frozen.
    await expect.poll(async () => (await readConnected(page))?.controller).toBe('live');
    expect(await formSuspended(page)).toBe(false);
    await expectAsleep(page);
  });

  test('the actual intake plate and introduction scrim are the masks the host caches, with the 8px pointer margin', async ({ page }) => {
    await openActualContact(page);
    const plate = page.locator('[data-connected-opaque-plate]');
    await expect(plate).toHaveCount(1);
    await expect(plate.locator('form[data-inquiry-phase]')).toHaveCount(1);
    await expect(plate.locator('aside')).toHaveCount(1);
    const scrim = page.locator('[data-connected-reading-mask]');
    await expect(scrim).toHaveCount(1);
    await expect(scrim).toHaveAttribute('data-connected-clearance', '32');
    await expect(scrim.getByRole('heading', { level: 1 })).toHaveCount(1);

    const active = async () => (await readConnected(page))?.pointerActive;

    // The introduction scrim, at the top of the page.
    const scrimBox = (await scrim.boundingBox())!;
    const scrimY = scrimBox.y + Math.min(scrimBox.height / 2, 120);
    await page.mouse.move(scrimBox.x + 20, scrimY, { steps: 6 });
    expect(await active(), 'inside the introduction scrim').toBe(false);
    await page.mouse.move(scrimBox.x - 36, scrimY, { steps: 6 });
    expect(await active(), 'within the scrim 32px clearance plus 8px margin').toBe(false);
    await page.mouse.move(scrimBox.x - 46, scrimY, { steps: 6 });
    expect(await active(), 'beyond the scrim clearance and margin').toBe(true);

    // The intake plate, scrolled into the viewport by a script (a jump, not a gesture).
    await scrollInstant(page, await plate.evaluate((element) => element.getBoundingClientRect().top + window.scrollY - 160));
    await page.waitForTimeout(300);
    const plateBox = (await plate.boundingBox())!;
    expect(plateBox.y, 'the plate is in the viewport').toBeLessThan(400);
    const plateY = plateBox.y + 120;
    await page.mouse.move(plateBox.x + 40, plateY, { steps: 6 });
    expect(await active(), 'inside the plate').toBe(false);
    await page.mouse.move(plateBox.x - 4, plateY, { steps: 6 });
    expect(await active(), 'within the 8px margin of the plate').toBe(false);
    await page.mouse.move(plateBox.x - 14, plateY, { steps: 6 });
    expect(await active(), 'beyond the plate margin').toBe(true);
    await scrollInstant(page, 0);
    await expectAsleep(page);
  });

  test('one renderer stays live across the Founder bridge, the locale switch and back', async ({ page }) => {
    test.setTimeout(240_000);
    const gl = await trackWebglContexts(page);
    await openActualContact(page, 'es');
    await followPageLink(page, appPathname(stableRoutes.founder.es));
    await expectLive(page);
    expect((await readConnected(page))?.route).toBe('founder');

    await page.locator('a[hreflang]:visible').first().click();
    await page.waitForURL((url) => url.pathname === appPathname(stableRoutes.founder.en));
    await expectLive(page);
    expect((await readConnected(page))?.route).toBe('founder');

    await followPageLink(page, appPathname(stableRoutes.contact.en));
    await expectLive(page);
    expect((await readConnected(page))?.route).toBe('contact');
    await expect(page.locator('form[data-contact-hydrated="true"]')).toBeVisible();
    expect(await gl.maxAlive(), 'never more than one live context').toBeLessThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------------------------------------------------
// PLAN-SFC-V1 Task 12: on the five actual pages a decorative label never lands on reading text or a control. The host
// hides a label that a plate or scrim would cover; this proves nothing else on the page is left uncovered.
// ---------------------------------------------------------------------------------------------------------------------

type ForegroundBox = Rect & { what: string };

const readForeground = (page: Page): Promise<{ labels: (Rect & { id: string; text: string; visible: boolean; fontSize: number; upright: boolean })[]; foreground: ForegroundBox[] }> =>
  page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll<HTMLElement>('[data-connected-label]')).map((element) => {
      const style = getComputedStyle(element);
      const transform = style.transform === 'none' ? new DOMMatrixReadOnly() : new DOMMatrixReadOnly(style.transform);
      const { left, top, right, bottom } = element.getBoundingClientRect();
      return {
        id: element.dataset.nodeId ?? '',
        text: element.textContent ?? '',
        visible: parseFloat(style.opacity) > 0.01 && style.visibility !== 'hidden' && style.display !== 'none',
        fontSize: parseFloat(style.fontSize),
        upright: Math.abs(transform.b) < 1e-6 && Math.abs(transform.c) < 1e-6,
        left,
        top,
        right,
        bottom,
      };
    });
    const selector = [
      'main :is(h1,h2,h3,h4,p,li,a[href],button,summary,label,input,textarea,select,img,figure,dt,dd)',
      'footer :is(h2,h3,p,li,a[href],small)',
      '[data-app-bar] :is(a[href],button)',
    ].join(',');
    const foreground: { left: number; top: number; right: number; bottom: number; what: string }[] = [];
    const alphaOf = (color: string) => {
      const match = color.match(/rgba?(([^)]+))/);
      if (!match) return 0;
      const parts = match[1].split(/[ ,/]+/).filter(Boolean);
      return parts.length > 3 ? Number(parts[3]) : 1;
    };
    for (const element of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
      if (element.closest('[data-connected-ground]')) continue;
      // The shared Footer and App Bar paint an opaque surface above the decorative layer; text on one is not a clash.
      const surface = element.closest<HTMLElement>('footer, [data-app-bar]');
      if (surface && alphaOf(getComputedStyle(surface).backgroundColor) >= 0.95) continue;
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) continue;
      const what = `${element.tagName.toLowerCase()} "${(element.textContent ?? element.getAttribute('aria-label') ?? '').trim().slice(0, 40)}"`;
      for (const r of Array.from(element.getClientRects())) {
        if (r.width < 1 || r.height < 1) continue;
        foreground.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom, what });
      }
    }
    return { labels, foreground };
  });

test.describe('labels stay clear of text and controls on the five pages (Task 12)', () => {
  test.afterEach(async ({ page }) => {
    await page.goto('about:blank').catch(() => undefined);
  });

  for (const route of FIVE_ROUTES) {
    for (const screen of ['wide', 'compact'] as const) {
      test(`${route} ${screen}: no visible label overlaps reading text, a control or the App Bar at any scroll position`, async ({ page }) => {
        test.setTimeout(150_000);
        const size = SCREENS[screen];
        await page.setViewportSize({ width: size.width, height: size.height });
        await enableLiveForTest(page);
        await page.goto(appUrl(stableRoutes[route].es));
        await expectLive(page);
        await expectSettled(page);

        const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
        let sawLabel = false;
        for (let top = 0; top <= max; top += 180) {
          await scrollInstant(page, top);
          // A label fades out within a frame or two of a mask reaching it; a clash that outlasts that is a defect.
          await expect
            .poll(
              async () => {
                const { labels, foreground } = await readForeground(page);
                for (const label of labels.filter((candidate) => candidate.visible)) {
                  const hit = foreground.find((box) => overlaps(label, box));
                  if (hit) return `label "${label.text}" (${label.id}) at scroll ${top} overlaps ${hit.what}`;
                }
                return 'clear';
              },
              { timeout: 2_000, intervals: [100, 150, 250] },
            )
            .toBe('clear');
          for (const label of (await readForeground(page)).labels.filter((candidate) => candidate.visible)) {
            sawLabel = true;
            expect(label.fontSize, `label ${label.text} stays legible`).toBeGreaterThanOrEqual(12);
            expect(label.upright, `label ${label.text} stays upright`).toBe(true);
          }
        }
        expect(sawLabel, 'at least one label was shown somewhere on the page').toBe(true);
      });
    }
  }
});
