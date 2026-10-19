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
  observeEnhancementShifts,
  observePageErrors,
  overlaps,
  pauseLabels,
  pauseSlot,
  readConnected,
  scrollInstant,
  MIN_SAMPLED_FRAMES,
  scrollGestureLabelViolations,
  seedSession,
  trackWebglContexts,
  type ConnectedLocale,
} from './support/connected-studio';
import { appPathname, appUrl, stableRoutes } from './support/paths';
import { getConnectedProfile } from '../../lib/connected-studio/profiles';
import { anchorToScene, computeProjectionLayout, projectAnchor, sceneToAnchor, unprojectCss } from '../../lib/connected-studio/projection';
import { createEdgePath, PATH_SEGMENTS } from '../../components/connected-studio/runtime/connected-paths';
import { evaluateRestEdge } from '../../lib/connected-studio/rest-path';
import type { ConnectedRoute, ConnectedTier, EdgeSamplePoints, Vec3 } from '../../lib/connected-studio/types';

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
// n0 word is drawn until the content is corrected. Task 12 reproduced it on the actual page (one label element, n0, hidden
// under the introduction scrim) and has no seam in its write set: a numbered remediation packet owns the correction.
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

      // Three ordinary notches, then read as fast as the page answers for the whole transient: a single notch peaks for
      // less than the 40 ms sampling of a loaded software renderer, which made this case marginal (Task 12 saw it miss).
      for (let notch = 0; notch < 3; notch += 1) {
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(40);
      }
      let peak = 0;
      const watching = Date.now();
      while (Date.now() - watching < 700) peak = Math.max(peak, displacement(rest, await readNodes(page)));
      expect(peak, 'wheel notches kick the nodes').toBeGreaterThan(0.002);
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

  // PLAN-SFC-V1 Task 21: a scrim scrolling over a fixed label must not show it through its fade.
  test('studio: no label shows inside a reading mask or the App Bar on any frame of a smooth scroll down and back', async ({ page }) => {
    test.setTimeout(120_000);
    await liveRest(page, 'studio', 'en');
    const { frames, shownLabelFrames, violations } = await scrollGestureLabelViolations(page);
    expect(frames, 'frames were sampled').toBeGreaterThan(MIN_SAMPLED_FRAMES);
    expect(shownLabelFrames, 'the check is not vacuous: labels show where nothing covers them').toBeGreaterThan(0);
    expect(violations, `${violations.length} label-frames show inside a reading mask or the App Bar`).toEqual([]);
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

/**
 * Per bent string: how far its end samples are from the actual nodes (must be zero), its largest interior physics-sample
 * residual in CSS px, and the same distance measured on the curve the renderer draws (PATH_SEGMENTS segments through
 * the cubic interpolation of the samples, clamped to the profile cap) and on that interpolation without the clamp.
 */
function measureStrings(frame: Frame, nodes: NodeMap, samples: readonly { id: string; points: readonly Vec3[] }[]) {
  const edges = frame.profile.graph.edges;
  const path = createEdgePath();
  return samples.map(({ id, points }) => {
    const index = edges.findIndex((candidate) => candidate.id === id);
    const edge = edges[index];
    const from = nodes.get(edge.from);
    const to = nodes.get(edge.to);
    if (!from || !to) return { id, pinError: Number.POSITIVE_INFINITY, residualPx: Number.POSITIVE_INFINITY, renderedPx: Number.POSITIVE_INFINITY, unclampedPx: Number.POSITIVE_INFINITY };
    const pinError = Math.max(gap3(points[0], from), gap3(points[points.length - 1], to));
    const restAt = (u: number) => evaluateRestEdge({ nodeStyle: frame.profile.nodeStyle, edgeIndex: index, from, to, layout: frame.layout }, u);
    let residualPx = 0;
    for (let j = 1; j < points.length - 1; j += 1) {
      const a = frame.toCss(points[j]);
      const b = frame.toCss(restAt(j / (points.length - 1)));
      residualPx = Math.max(residualPx, Math.hypot(a.x - b.x, a.y - b.y));
    }
    // The drawn curve, sampled at every ring and halfway between rings, against the same rest path.
    const drawn = (capPx: number) => {
      path.prepare({ nodeStyle: frame.profile.nodeStyle, edgeIndex: index, from, to, layout: frame.layout, samples: points as unknown as EdgeSamplePoints, capPx });
      const out = [0, 0, 0];
      let largest = 0;
      for (let k = 1; k < PATH_SEGMENTS * 2; k += 1) {
        const u = k / (PATH_SEGMENTS * 2);
        path.pointAt(u, out);
        const a = frame.toCss(sceneToAnchor([out[0], out[1], out[2]], frame.layout));
        const b = frame.toCss(restAt(u));
        largest = Math.max(largest, Math.hypot(a.x - b.x, a.y - b.y));
      }
      return largest;
    };
    return { id, pinError, residualPx, renderedPx: drawn(frame.profile.input.edgeCapPx), unclampedPx: drawn(Number.POSITIVE_INFINITY) };
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
    renderedStringPx: Math.max(0, ...strings.map((string) => string.renderedPx)),
    unclampedStringPx: Math.max(0, ...strings.map((string) => string.unclampedPx)),
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
          console.log('[sfc12-profile] ' + JSON.stringify({ route, screen, lane: null }));
          return;
        }

        // Active: a slow pass beside the nearest node.
        let peakTravel = 0;
        let peakString = 0;
        let peakRendered = 0;
        let peakUnclamped = 0;
        let worstPin = 0;
        const observe = async () => {
          const state = await measure(page, frame, rest);
          peakTravel = Math.max(peakTravel, state.travelPx);
          peakString = Math.max(peakString, state.stringPx);
          peakRendered = Math.max(peakRendered, state.renderedStringPx);
          peakUnclamped = Math.max(peakUnclamped, state.unclampedStringPx);
          worstPin = Math.max(worstPin, state.pinError);
        };
        await sweep(page, lane.a, lane.b, 14, 35, observe);
        await sweep(page, lane.b, lane.a, 14, 35, observe);
        await observe();
        await testInfo.attach(`${route}-${screen}-active`, { body: await page.screenshot(), contentType: 'image/png' });
        expect(worstPin, 'string ends stay on their nodes').toBeLessThan(1e-6);
        expect(peakTravel, `node travel stays inside the ${nodeCap}px cap`).toBeLessThanOrEqual(nodeCap + CAP_TOLERANCE_PX);
        expect(peakString, `string physics samples stay inside the ${edgeCap}px cap`).toBeLessThanOrEqual(edgeCap + CAP_TOLERANCE_PX);
        expect(peakRendered, `the drawn string stays inside the ${edgeCap}px cap`).toBeLessThanOrEqual(edgeCap + CAP_TOLERANCE_PX);
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
          peakRendered = Math.max(peakRendered, state.renderedStringPx);
          peakUnclamped = Math.max(peakUnclamped, state.unclampedStringPx);
          worstPin = Math.max(worstPin, state.pinError);
          if (state.travelPx < 0.005 && state.stringPx < 0.005 && series.length > 5) break;
          await page.waitForTimeout(40);
        }
        expect(worstPin).toBeLessThan(1e-6);
        expect(peakTravel).toBeLessThanOrEqual(nodeCap + CAP_TOLERANCE_PX);
        expect(peakString).toBeLessThanOrEqual(edgeCap + CAP_TOLERANCE_PX);
        expect(peakRendered, 'the drawn string, through the inertial tail').toBeLessThanOrEqual(edgeCap + CAP_TOLERANCE_PX);
        expect(series.at(-1), 'every node returns to its rest position').toBeLessThan(0.01);
        expect(strings.at(-1), 'every string returns to its rest path').toBeLessThan(0.01);
        for (const [name, values, cap] of [['nodes', series, nodeCap], ['strings', strings, edgeCap]] as const) {
          const back = rebounds(values, 0.1);
          expect(back.count, `${name} settle with at most one overshoot`).toBeLessThanOrEqual(1);
          expect(back.largest, `${name} overshoot stays below ${0.05 * cap + 0.3}px`).toBeLessThanOrEqual(0.05 * cap + 0.3);
        }
        // The figures behind the pass, for the receipt (CSS px; software-rendered).
        const px = (value: number) => Math.round(value * 100) / 100;
        console.log('[sfc12-profile] ' + JSON.stringify({ route, screen, nodeCapPx: nodeCap, peakNodeTravelPx: px(peakTravel), edgeCapPx: edgeCap, peakSampleResidualPx: px(peakString), peakDrawnCurvePx: px(peakRendered), peakInterpolationUnclampedPx: px(peakUnclamped), settleSamples: series.length, laneDistanceToNodePx: Math.round(lane.distanceToNode) }));
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
// PLAN-SFC-V1 Task 13: direct Contact retains reading/control masks and one-renderer navigation.
// Form-specific Task 12 scenarios are retired by ADR-CONTACT-DIRECT-CHANNELS.
// ---------------------------------------------------------------------------------------------------------------------

async function openActualContact(page: Page, locale: ConnectedLocale = 'es') {
  await goto(page, 'contact', locale);
  await expect(page.locator('[data-contact-channels]')).toBeVisible();
  await expect(page.locator('main form')).toHaveCount(0);
  await expectLive(page); await expectSettled(page); await expectAsleep(page);
}

test.describe('direct Contact with the live graph (Task 13)', () => {
  test('the actual intake plate and introduction scrim are the masks the host caches, with the 8px pointer margin', async ({ page }) => {
    await openActualContact(page);
    const plate = page.locator('[data-connected-opaque-plate]');
    await expect(plate).toHaveCount(1);
    await expect(plate.locator('form')).toHaveCount(0);
    await expect(plate.locator('ul a')).toHaveCount(3);
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
    await expect(page.locator('[data-contact-channels]')).toBeVisible();
    expect(await gl.maxAlive(), 'never more than one live context').toBeLessThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------------------------------------------------
// PLAN-SFC-V1 Task 20: the Contact Pause control replaces the static label in the frame it mounts, as on Studio and
// Founder, so the enhancement moves nothing. The host's own effect hides the label only after a paint.
// ---------------------------------------------------------------------------------------------------------------------

test.describe('the Contact Pause control mounts without a layout shift (Task 20)', () => {
  for (const locale of LOCALES) {
    test(`contact ${locale}: one visible Pause control and zero enhancement shift at 1440x900 and 1280x720`, async ({ page }) => {
      const shifts = await observeEnhancementShifts(page);
      // The static label's style in the same task the control is inserted, before any effect of the host runs.
      await page.addInitScript(() => {
        const state = { labelDisplay: null as string | null };
        (window as unknown as { __pauseMount: typeof state }).__pauseMount = state;
        new MutationObserver(() => {
          if (state.labelDisplay !== null) return;
          const slot = document.getElementById('connected-pause-contact');
          const label = slot?.querySelector('[data-connected-static-label]');
          if (label && slot?.querySelector('[data-connected-pause]')) state.labelDisplay = getComputedStyle(label).display;
        }).observe(document, { childList: true, subtree: true });
      });
      await enableLiveForTest(page);

      for (const viewport of [{ width: 1440, height: 900 }, { width: 1280, height: 720 }]) {
        const at = `${viewport.width}x${viewport.height}`;
        await page.setViewportSize(viewport);
        await goto(page, 'contact', locale);
        await expectLive(page);
        const slot = pauseSlot(page, 'contact');
        await expect(slot.getByRole('button', { name: pauseLabels[locale].pause })).toBeVisible();
        await expect(slot.locator('[data-connected-static-label]')).toBeHidden();
        const shown = await slot.evaluate((element) => Array.from(element.children).filter((child) => child.getClientRects().length > 0).length);
        expect(shown, `${at}: the slot shows the control alone`).toBe(1);
        const mount = await page.evaluate(() => (window as unknown as { __pauseMount: { labelDisplay: string | null } }).__pauseMount);
        expect(mount.labelDisplay, `${at}: the static label is gone in the frame the control mounts`).toBe('none');
        await page.waitForTimeout(1_200);
        expect(await shifts.shiftsAfterActivation(), `${at}: layout shift caused by the enhancement`).toBe(0);
      }
    });
  }
});

// ---------------------------------------------------------------------------------------------------------------------
// PLAN-SFC-V1 Task 12: on the five actual pages a decorative label never lands on reading text or a control. The host
// hides a label that a plate or scrim would cover; this proves nothing else on the page is left uncovered.
// ---------------------------------------------------------------------------------------------------------------------

/** `fixed`: the box sits in a sticky or fixed ancestor, so it keeps its viewport place while the document scrolls. */
type ForegroundBox = Rect & { what: string; fixed: boolean };

/** The first visible label that overlaps a stored foreground box when the page is scrolled by `scrolled`. */
function findLabelClash(
  foreground: readonly ForegroundBox[],
  labels: readonly (Rect & { id: string; text: string; visible: boolean })[],
  scrolled: number,
): string | undefined {
  for (const label of labels.filter((candidate) => candidate.visible)) {
    const hit = foreground.find((box) => {
      const shift = box.fixed ? 0 : scrolled;
      return overlaps(label, { left: box.left, right: box.right, top: box.top - shift, bottom: box.bottom - shift });
    });
    if (hit) return `label "${label.text}" (${label.id}) overlaps ${hit.what}`;
  }
  return undefined;
}

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
      // Text and controls. Opaque artwork (img, figure) paints over the decorative layer the way the Footer does.
      'main :is(h1,h2,h3,h4,p,li,a[href],button,summary,label,input,textarea,select,dt,dd)',
      'footer :is(h2,h3,p,li,a[href],small)',
      '[data-app-bar] :is(a[href],button)',
    ].join(',');
    const foreground: { left: number; top: number; right: number; bottom: number; what: string; fixed: boolean }[] = [];
    const isFixed = (element: HTMLElement) => {
      for (let node: HTMLElement | null = element; node; node = node.parentElement) {
        const position = getComputedStyle(node).position;
        if (position === 'sticky' || position === 'fixed') return true;
      }
      return false;
    };
    const alphaOf = (color: string) => {
      const match = color.match(/rgba?\(([^)]+)\)/);
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
        foreground.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom, what, fixed: isFixed(element) });
      }
    }
    return { labels, foreground };
  });

/** The labels only, in viewport coordinates: a light read, so polling does not starve the page's own frames. */
const readLabels = (page: Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('[data-connected-label]')).map((element) => {
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
    }),
  );

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

        // The text and controls are read once, in document coordinates (the page is at the top, so viewport equals
        // document); only the labels are read as the page scrolls, so the heavy read cannot starve the page's frames.
        const { foreground } = await readForeground(page);
        const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
        let sawLabel = false;
        for (let top = 0; top <= max; top += 180) {
          await scrollInstant(page, top);
          // A label fades out within a frame or two of a mask reaching it, but a software-rendered page can hold its main
          // thread for seconds between frames: a clash that outlasts eight seconds is a defect, not a slow frame.
          await expect
            .poll(
              async () => {
                const scrolled = await page.evaluate(() => window.scrollY);
                const clash = findLabelClash(foreground, await readLabels(page), scrolled);
                return clash ? `${clash} at scroll ${top}` : 'clear';
              },
              { timeout: 8_000, intervals: [100, 150, 250, 500] },
            )
            .toBe('clear');
          for (const label of (await readLabels(page)).filter((candidate) => candidate.visible)) {
            sawLabel = true;
            expect(label.fontSize, `label ${label.text} stays legible`).toBeGreaterThanOrEqual(12);
            expect(label.upright, `label ${label.text} stays upright`).toBe(true);
          }
        }
        // At phone width the few bound words (one or two) are shown only in the gaps between full-width plates and scrims,
        // which a 180px scroll step can step over, so a label need only exist there; at desktop width one is shown somewhere.
        expect(await page.locator('[data-connected-label]').count(), 'the page builds its labels').toBeGreaterThan(0);
        if (screen === 'wide') expect(sawLabel, 'at least one label was shown somewhere on the page').toBe(true);
      });
    }
  }
});

// ---------------------------------------------------------------------------------------------------------------------
// PLAN-SFC-V1 Task 12: a scrim's opaque backing extends its clearance beyond the text. No control outside the scrim may
// sit inside that backing, or the backing paints over its border and focus indicator.
// ---------------------------------------------------------------------------------------------------------------------

test.describe('a scrim backing never covers a control (Task 12)', () => {
  test.afterEach(async ({ page }) => {
    await page.goto('about:blank').catch(() => undefined);
  });

  for (const route of FIVE_ROUTES) {
    for (const screen of ['wide', 'compact'] as const) {
      test(`${route} ${screen}: every control outside a reading scrim is clear of its opaque backing`, async ({ page }) => {
        // OPEN FINDING (Task 12, reproduced: "button Pausar fondo overlaps the 32px backing by 16px", wide and compact):
        // contact.module.css gives .pauseSlot margin-top 16px under the introduction scrim, whose opaque backing extends
        // 32px, so the backing paints over the top 16px of the Pause control (its border and the top of its focus ring).
        // The seam is Contact's standalone layout, outside this packet's write set; a numbered remediation packet owns it
        // and this case turns green when the slot clears the backing. Remove the fixme with that fix.
        test.fixme(route === 'contact', 'The Contact Pause slot sits 16px under a 32px scrim backing (remediation packet 20+)');
        test.setTimeout(120_000);
        const size = SCREENS[screen];
        await page.setViewportSize({ width: size.width, height: size.height });
        await enableLiveForTest(page);
        await page.goto(appUrl(stableRoutes[route].es));
        await expectLive(page);
        await expectSettled(page);
        const covered = await page.evaluate(() => {
          const intersects = (a: DOMRect, b: { left: number; top: number; right: number; bottom: number }) =>
            a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom && a.width > 0 && a.height > 0;
          const controls = Array.from(document.querySelectorAll<HTMLElement>('main a[href], main button, main input, main textarea, main select, main summary'));
          const found: string[] = [];
          for (const mask of Array.from(document.querySelectorAll<HTMLElement>('[data-connected-reading-mask]'))) {
            const clearance = Number(mask.getAttribute('data-connected-clearance')) || 0;
            const r = mask.getBoundingClientRect();
            const backing = { left: r.left - clearance, top: r.top - clearance, right: r.right + clearance, bottom: r.bottom + clearance };
            for (const control of controls) {
              if (mask.contains(control)) continue;
              const box = control.getBoundingClientRect();
              if (intersects(box, backing)) {
                const label = (control.getAttribute('aria-label') ?? control.textContent ?? control.tagName).trim().slice(0, 30);
                const depth = Math.round(Math.min(box.bottom, backing.bottom) - Math.max(box.top, backing.top));
                found.push(`${control.tagName.toLowerCase()} "${label}" overlaps the ${clearance}px backing by ${depth}px`);
              }
            }
          }
          return found;
        });
        expect(covered).toEqual([]);
      });
    }
  }
});

// Reviewer R finding 1 on PR 153: the sticky App Bar keeps its place in the viewport while the page scrolls, so its
// controls must be compared in viewport space, not translated with the document. The helpers run against a controlled DOM.
test.describe('the label clash helper follows the sticky App Bar (Reviewer R)', () => {
  test('a label under the App Bar control is a clash at a nonzero scroll, and a label under scrolled-away text is not', async ({ page }) => {
    await page.setContent(`
      <header data-app-bar style="position: sticky; top: 0; height: 60px; z-index: 50">
        <div data-app-bar-surface style="background: rgba(10,30,51,.82); height: 60px"><a href="#x" style="position: absolute; left: 100px; top: 20px; width: 80px; height: 20px">Home</a></div>
      </header>
      <main style="height: 3000px"><p style="position: absolute; left: 400px; top: 100px; width: 200px; height: 20px">Intro text</p></main>
      <div data-connected-label data-node-id="n1" style="position: fixed; left: 100px; top: 20px; width: 80px; height: 20px; opacity: 1">Label</div>
      <div data-connected-label data-node-id="n2" style="position: fixed; left: 400px; top: 100px; width: 80px; height: 20px; opacity: 1">Other</div>
    `);
    const { foreground } = await readForeground(page);
    await page.evaluate(() => window.scrollTo(0, 400));
    const labels = await readLabels(page);
    const clash = findLabelClash(foreground, labels, await page.evaluate(() => window.scrollY));
    // n1 sits under the sticky App Bar link (viewport 20..40) at any scroll: that is the clash. n2 sat under the
    // paragraph at scroll 0 only; at scroll 400 the paragraph has scrolled away, so it is not.
    expect(clash, 'the label under the sticky App Bar control').toBe('label "Label" (n1) overlaps a "Home"');
  });
});

// Reviewer R finding 2 on PR 153: the physics keeps five interior samples, the renderer draws twelve segments through a cubic
// interpolation of them and clamps that curve separately. The measurement must see the drawn curve, not only the knots.
test.describe('string measurement covers the rendered curve, not only the physics samples (Reviewer R)', () => {
  test('a residual pattern whose interpolation overshoots its samples is measured on the drawn curve, and clamped to the cap', () => {
    const frame = frameFor('studio', 'wide');
    const index = 0;
    const edge = frame.profile.graph.edges[index];
    const anchorOf = (id: string) => frame.profile.graph.nodes.find((node) => node.id === id)!.anchor;
    const from = anchorOf(edge.from);
    const to = anchorOf(edge.to);
    const nodes: NodeMap = new Map([[edge.from, from], [edge.to, to]]);
    const a = frame.toCss(from);
    const b = frame.toCss(to);
    const chord = Math.hypot(b.x - a.x, b.y - a.y);
    const normal = { x: -(b.y - a.y) / chord, y: (b.x - a.x) / chord };
    // The reviewer's pattern, in CSS px at the seven samples: the cubic through it peaks above the largest knot.
    const knots = [0, 15.2, 15.2, -15.2, 0, 0, 0];
    const points = knots.map((d, j) => {
      const rest = evaluateRestEdge({ nodeStyle: frame.profile.nodeStyle, edgeIndex: index, from, to, layout: frame.layout }, j / 6);
      const css = frame.toCss(rest);
      return unprojectCss({ xPx: css.x + normal.x * d, yPx: css.y + normal.y * d, zScene: anchorToScene(rest, frame.layout)[2] }, frame.layout);
    });
    const [measured] = measureStrings(frame, nodes, [{ id: edge.id, points }]);
    expect(measured.residualPx, 'the physics samples').toBeCloseTo(15.2, 1);
    expect(measured.renderedPx, 'the drawn curve, clamped to the 16px profile cap').toBeLessThanOrEqual(16 + 1e-6);
    expect(measured.unclampedPx, 'the interpolation alone would exceed the cap and the samples').toBeGreaterThan(17);
    expect(measured.renderedPx, 'and the clamp is what holds it').toBeGreaterThan(15.9);
  });
});
