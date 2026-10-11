import { expect, test } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { allowSoftwareRenderer, expectActive } from './support/sky-chart';
import { setConnectedTestHook } from './support/connected-studio-test-hooks';
import {
  closeContext,
  connectedCanvas,
  controlVisibility,
  enableLiveForTest,
  expectFellBack,
  expectLive,
  expectStopped,
  expectStatic,
  gotoConnected,
  holdPageLoad,
  liveContexts,
  overlaps,
  readLabelGeometry,
  navigateInApp,
  pauseLabels,
  pauseSlot,
  readConnected,
  readSession,
  scrollInstant,
  seedSession,
  trackWebglContexts,
} from './support/connected-studio';
import { appPathname, appUrl, stableRoutes } from './support/paths';

// PLAN-SPF-V1 Task 7: the optional live scene behind Services and Projects. WebGL here runs on
// SwiftShader, so these specs prove functional behavior only. They opt in through the controlled
// test hook (`allowSoftwareRenderer`, `livePolicy`), which never changes the shipped policy. Hardware
// acceptance belongs to Task 9.

// Software rendering shares the CPU and the first test after a source edit meets a cold dev recompile.
test.describe.configure({ timeout: 60_000 });

test.describe('connected runtime', () => {
  test('eligible connected page starts a gently rotating scene with an accessible Pause control', async ({ page }) => {
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'es');
    await expectLive(page);

    const canvas = connectedCanvas(page);
    await expect(canvas).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas).toHaveAttribute('tabindex', '-1');
    expect(await canvas.evaluate((element) => getComputedStyle(element).pointerEvents)).toBe('none');

    const pause = pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.es.pause });
    await expect(pause).toBeVisible();
    await expect(pause).toHaveAttribute('aria-pressed', 'false');
    const box = await pause.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

    // Idle orientation changes while positions stay steady.
    const first = await readConnected(page);
    expect(first).not.toBeNull();
    await expect
      .poll(async () => (await readConnected(page))?.idleAngleRadians ?? first!.idleAngleRadians, { timeout: 15_000 })
      .not.toBe(first!.idleAngleRadians);
    const later = await readConnected(page);
    expect(later!.nodes.map((node) => node.position)).toEqual(first!.nodes.map((node) => node.position));
  });

  test('reduced motion requests no engine and keeps the static background', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'en');
    await expectStatic(page, 'services');
  });

  test('Save-Data requests no engine and keeps the static background', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true });
    });
    await enableLiveForTest(page);
    await gotoConnected(page, 'projects', 'es');
    await expectStatic(page, 'projects');
  });

test('activation waits for the page to finish loading', async ({ page }) => {
    const hold = await holdPageLoad(page);
    await enableLiveForTest(page);
    await page.goto(appUrl(stableRoutes.services.es), { waitUntil: 'domcontentloaded' });
    // The page is interactive but not loaded: the engine import has not started, and it stays that way.
    await page.waitForTimeout(1_500);
    expect(await page.evaluate(() => document.readyState)).not.toBe('complete');
    expect((await readConnected(page))?.imports).toBe(0);
    await expect(page.locator('canvas')).toHaveCount(0);

    hold.release();
    await expectLive(page);
    expect((await readConnected(page))?.imports).toBe(1);
  });

  test('leaving before activation starts cancels it and creates no scene', async ({ page }) => {
    const hold = await holdPageLoad(page);
    await enableLiveForTest(page);
    await page.goto(appUrl(stableRoutes.services.es), { waitUntil: 'domcontentloaded' });
    await expect.poll(async () => (await readConnected(page)) !== null, { message: 'the page hydrated' }).toBe(true);
    expect((await readConnected(page))?.imports).toBe(0);

    // A real client-side navigation unmounts the connected page while it still waits to activate.
    await page.locator('[data-app-bar-brand]').first().click();
    // 'commit': the held load event must not block this wait.
    await page.waitForURL((url) => url.pathname === appPathname(stableRoutes.home.es), { waitUntil: 'commit' });
    hold.release();
    await page.waitForLoadState('load');
    await page.waitForTimeout(1_500);
    expect((await readConnected(page))?.imports).toBe(0);
    await expect(page.locator('canvas')).toHaveCount(0);
  });

test('the capability probe context is released before the engine creates its own', async ({ page }) => {
    const contexts = await trackWebglContexts(page);
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'en');
    await expectLive(page);
    expect((await contexts.events()).slice(0, 3)).toEqual([
      { type: 'create', context: 1 },
      { type: 'lose', context: 1 },
      { type: 'create', context: 2 },
    ]);
    expect(await contexts.maxAlive(), 'never two live contexts').toBe(1);
  });

test('a stored Home context loss keeps connected routes static (read-only, PC-5)', async ({ page }) => {
    await seedSession(page, { homeContextLost: '1' });
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'es');
    await expectStatic(page, 'services');
  });

  test('a stored connected context loss keeps both routes and locales static', async ({ page }) => {
    await seedSession(page, { contextLost: '1' });
    await enableLiveForTest(page);
    await gotoConnected(page, 'projects', 'en');
    await expectStatic(page, 'projects');
  });

  test('a stored Pause preference starts the scene paused on its current pose', async ({ page }) => {
    await seedSession(page, { paused: '1' });
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'es');
    await expectLive(page);
    const resume = pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.es.resume });
    await expect(resume).toHaveAttribute('aria-pressed', 'true');
    const first = await readConnected(page);
    expect(first?.controller).toBe('paused');
    expect(first?.pendingCallbacks).toBe(0);
    await page.waitForTimeout(1_200);
    const later = await readConnected(page);
    expect(later?.renderCount, 'a paused scene draws nothing').toBe(first?.renderCount);
    expect(later?.idleAngleRadians).toBe(first?.idleAngleRadians);
  });

test('the shipped policy keeps an ordinary page static even when the software gate is open', async ({ page }) => {
    await setConnectedTestHook(page, { allowSoftwareRenderer: true });
    await gotoConnected(page, 'services', 'en');
    await expectStatic(page, 'services');
  });

  for (const scenario of [
    { name: 'wide off, compact on', policy: { wide: false, compact: true }, width: 1440, height: 900, live: false },
    { name: 'wide off, compact on', policy: { wide: false, compact: true }, width: 390, height: 844, live: true },
    { name: 'wide on, compact off', policy: { wide: true, compact: false }, width: 390, height: 844, live: false },
    { name: 'wide on, compact off', policy: { wide: true, compact: false }, width: 1440, height: 900, live: true },
    { name: 'wide on, compact off (tablet follows wide)', policy: { wide: true, compact: false }, width: 820, height: 1180, live: true },
    { name: 'wide off, compact on (tablet follows wide)', policy: { wide: false, compact: true }, width: 820, height: 1180, live: false },
  ] as const) {
    test(`livePolicy ${scenario.name} at ${scenario.width}px is ${scenario.live ? 'live' : 'static'}`, async ({ page }) => {
      await page.setViewportSize({ width: scenario.width, height: scenario.height });
      await enableLiveForTest(page, scenario.policy);
      await gotoConnected(page, 'projects', 'es');
      if (scenario.live) await expectLive(page);
      else await expectStatic(page, 'projects');
    });
  }

test('a software renderer is rejected by default even with the live policy on', async ({ page }) => {
    await setConnectedTestHook(page, { livePolicy: { wide: true, compact: true } });
    await gotoConnected(page, 'services', 'es');
    await expectStatic(page, 'services');
  });

test('a renderer that fails after the probe returns quietly to static', async ({ page }) => {
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      let webgl2Requests = 0;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
        // The first request is the capability probe; the engine's own request fails.
        if (type === 'webgl2' && ++webgl2Requests > 1) return null;
        return (original as (...args: unknown[]) => unknown).call(this, type, ...rest);
      } as typeof HTMLCanvasElement.prototype.getContext;
    });
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'en');
    await expectFellBack(page, 'services');
    assertNoBrowserErrors();
  });

  test('a lost context disposes the scene and keeps the session static, writing only its own flag', async ({ page }) => {
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'es');
    await expectLive(page);
    await page.evaluate(() => {
      const canvas = document.querySelector<HTMLCanvasElement>('canvas[data-connected-canvas]');
      const extension = (canvas?.getContext('webgl2') as WebGL2RenderingContext | null)?.getExtension('WEBGL_lose_context');
      extension?.loseContext();
    });
    await expectFellBack(page, 'services');
    expect(await readSession(page)).toMatchObject({ contextLost: '1', homeContextLost: null });

    // The loss outlives the page: the same session stays static on the other route and locale.
    await seedSession(page, {});
    await gotoConnected(page, 'projects', 'en');
    await expectStatic(page, 'projects');
  });

test('one live renderer across the whole navigation journey', async ({ page }) => {
    const contexts = await trackWebglContexts(page);
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'es');
    await expectLive(page);
    await navigateInApp(page, stableRoutes.projects.es);
    await expect(connectedCanvas(page)).toHaveCount(1);
    await expectLive(page);
    await navigateInApp(page, stableRoutes.services.es);
    await expectLive(page);
    expect(await contexts.maxAlive(), 'never two live contexts').toBe(1);

    await navigateInApp(page, stableRoutes.home.es);
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect.poll(async () => liveContexts(await contexts.events())).toBe(0);
    expect((await readConnected(page))?.mode).toBe('static');
  });

  test('a renderer that is still mounted from Home defers activation instead of creating a second context', async ({ page }) => {
    const contexts = await trackWebglContexts(page);
    await enableLiveForTest(page);
    await page.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        const home = document.createElement('canvas');
        home.setAttribute('data-sky-chart-canvas', '');
        document.body.appendChild(home);
        (window as unknown as { __releaseHome(): void }).__releaseHome = () => home.remove();
      });
    });
    await gotoConnected(page, 'projects', 'en');
    await page.waitForLoadState('load');
    await page.waitForTimeout(2_000);
    expect((await readConnected(page))?.imports, 'activation is deferred while Home still renders').toBe(0);
    expect(await contexts.events()).toEqual([]);

    await page.evaluate(() => (window as unknown as { __releaseHome(): void }).__releaseHome());
    await expectLive(page);
    expect(await contexts.maxAlive()).toBe(1);
  });

  test('navigating from a live Home to a connected route never holds two contexts', async ({ page }) => {
    test.slow();
    const contexts = await trackWebglContexts(page);
    await allowSoftwareRenderer(page);
    await enableLiveForTest(page);
    await page.goto(appUrl(stableRoutes.home.es));
    await expectActive(page);
    await navigateInApp(page, stableRoutes.services.es);
    await expectLive(page);
    await expect(page.locator('canvas[data-sky-chart-canvas]')).toHaveCount(0);
    expect(await contexts.maxAlive(), 'Home released its context before Services created one').toBe(1);
  });

test('a hidden tab stops all scheduled work and resumes only when visible again', async ({ page }) => {
    const visibility = await controlVisibility(page);
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'es');
    await expectLive(page);
    await visibility.setHidden(true);
    await expectStopped(page);
    expect((await readConnected(page))?.controller).toBe('suspended');

    const stoppedAt = (await readConnected(page))?.renderCount ?? 0;
    await visibility.setHidden(false);
    await expect.poll(async () => (await readConnected(page))?.renderCount ?? 0).toBeGreaterThan(stoppedAt);
    expect((await readConnected(page))?.controller).toBe('live');
  });

  test('the Footer suspends the scene and leaving it resumes from the current state', async ({ page }) => {
    await enableLiveForTest(page);
    await gotoConnected(page, 'projects', 'en');
    await expectLive(page);
    await scrollInstant(page, 'bottom');
    await expectStopped(page);
    expect((await readConnected(page))?.controller).toBe('suspended');

    await scrollInstant(page, 0);
    await expect.poll(async () => (await readConnected(page))?.controller).toBe('live');
    expect((await readConnected(page))?.progress).toBeLessThan(0.05);
  });

test('Pause persists across connected routes and locales, and Resume samples the current pose', async ({ page }) => {
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'es');
    await expectLive(page);

    await pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.es.pause }).click();
    const resumeEs = pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.es.resume });
    await expect(resumeEs).toHaveAttribute('aria-pressed', 'true');
    await expectStopped(page);
    expect((await readConnected(page))?.controller).toBe('paused');
    expect((await readSession(page)).paused).toBe('1');

    // Scrolling while paused must not advance the canvas.
    const frozen = await readConnected(page);
    await scrollInstant(page, 1_800);
    await page.waitForTimeout(600);
    expect((await readConnected(page))?.progress).toBe(frozen?.progress);

    // The same session on the other route and the other locale starts paused too.
    await navigateInApp(page, stableRoutes.projects.es);
    await expect(pauseSlot(page, 'projects').getByRole('button', { name: pauseLabels.es.resume })).toHaveAttribute('aria-pressed', 'true');
    expect((await readConnected(page))?.controller).toBe('paused');
    await page.locator('a[hreflang="en"]:visible').first().click();
    await page.waitForURL((url) => url.pathname === appPathname(stableRoutes.projects.en));
    await expect(pauseSlot(page, 'projects').getByRole('button', { name: pauseLabels.en.resume })).toHaveAttribute('aria-pressed', 'true');
    expect((await readConnected(page))?.controller).toBe('paused');

    // Resume lands on the current scroll state at once instead of catching up through unseen frames.
    // The keyboard activates the focused control from wherever the page is scrolled, with no scroll into view.
    await pauseSlot(page, 'projects').getByRole('button', { name: pauseLabels.en.resume }).evaluate((element) => (element as HTMLElement).focus({ preventScroll: true }));
    await scrollInstant(page, 1_800);
    await page.keyboard.press('Space');
    await expect(pauseSlot(page, 'projects').getByRole('button', { name: pauseLabels.en.pause })).toHaveAttribute('aria-pressed', 'false');
    await expect.poll(async () => (await readConnected(page))?.controller).toBe('live');
    await expect.poll(async () => (await readConnected(page))?.progress ?? 0).toBeGreaterThan(0.1);
    expect((await readSession(page)).paused).toBe('0');
  });

test('a focused Pause control keeps focus and becomes the inactive Static background control after a context loss', async ({ page }) => {
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'es');
    await expectLive(page);
    const control = pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.es.pause });
    await control.focus();
    await page.evaluate(() => {
      const canvas = document.querySelector<HTMLCanvasElement>('canvas[data-connected-canvas]');
      (canvas?.getContext('webgl2') as WebGL2RenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext();
    });
    await expect(page.locator('canvas')).toHaveCount(0);
    const fallback = pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.es.staticBackground });
    await expect(fallback).toBeFocused();
    await expect(fallback).toHaveAttribute('aria-disabled', 'true');
    await expect(fallback).not.toHaveAttribute('aria-pressed', /.*/);

    // It stays only while it holds focus; the reserved slot keeps its space when it goes.
    const slotBefore = await pauseSlot(page, 'services').boundingBox();
    await page.keyboard.press('Tab');
    await expect(pauseSlot(page, 'services').getByRole('button')).toHaveCount(0);
    const slotAfter = await pauseSlot(page, 'services').boundingBox();
    expect(slotAfter?.height).toBe(slotBefore?.height);
    expect(slotAfter?.height ?? 0).toBeGreaterThanOrEqual(44);
  });

  test('reduced motion turned on while live goes static, keeping a focused control in place', async ({ page }) => {
    await enableLiveForTest(page);
    await gotoConnected(page, 'projects', 'en');
    await expectLive(page);
    await pauseSlot(page, 'projects').getByRole('button', { name: pauseLabels.en.pause }).focus();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('canvas')).toHaveCount(0);
    const fallback = pauseSlot(page, 'projects').getByRole('button', { name: pauseLabels.en.staticBackground });
    await expect(fallback).toBeFocused();
    await expect(fallback).toHaveAttribute('aria-disabled', 'true');
    await expectStopped(page);
    expect((await readConnected(page))?.mode).toBe('static');
  });

  test('reduced motion turned on while live removes an unfocused control with the canvas', async ({ page }) => {
    await enableLiveForTest(page);
    await gotoConnected(page, 'projects', 'es');
    await expectLive(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(pauseSlot(page, 'projects').getByRole('button')).toHaveCount(0);
    await expectStopped(page);
  });

test('resizing across a tier rebuilds the graph in the same renderer without a second context', async ({ page }) => {
    const contexts = await trackWebglContexts(page);
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'en');
    await expectLive(page);
    expect((await readConnected(page))?.nodes).toHaveLength(16);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect.poll(async () => (await readConnected(page))?.tier).toBe('compact');
    await expect.poll(async () => (await readConnected(page))?.nodes.length).toBe(8);
    expect((await readConnected(page))?.edgeGrowth).toHaveLength(13);
    expect((await readConnected(page))?.pixelRatio ?? 9).toBeLessThanOrEqual(1.25);

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect.poll(async () => (await readConnected(page))?.nodes.length).toBe(16);
    expect((await readConnected(page))?.edgeGrowth).toHaveLength(33);
    expect(await contexts.events(), 'the same renderer and context: probe, then engine, nothing else').toHaveLength(3);
    expect(await contexts.maxAlive()).toBe(1);
  });

  test('content that changes height after activation re-measures the Footer geometry', async ({ page }) => {
    await enableLiveForTest(page);
    await gotoConnected(page, 'projects', 'es');
    await expectLive(page);
    const before = (await readConnected(page))?.layout?.footerDocumentTop ?? 0;
    expect(before).toBeGreaterThan(0);

    // A late font or a longer translation grows the document; the cached geometry must follow.
    await page.evaluate(() => {
      const spacer = document.createElement('div');
      spacer.style.height = '1500px';
      spacer.setAttribute('data-test-spacer', '');
      document.querySelector('main')!.appendChild(spacer);
    });
    await expect.poll(async () => (await readConnected(page))?.layout?.footerDocumentTop ?? 0).toBeGreaterThan(before + 1_000);
  });

  test('a restored scroll position starts on the current geometry without replaying the page', async ({ page }) => {
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'es');
    await expectLive(page);
    await scrollInstant(page, 2_400);
    await expect.poll(async () => (await readConnected(page))?.progress ?? 0).toBeGreaterThan(0.2);
    await page.reload();
    await expectLive(page);
    const first = await readConnected(page);
    expect(first?.progress, 'the first drawn frame is already at the restored scroll').toBeGreaterThan(0.2);
  });

// The budgets are the plan's, read from the engine's own diagnostics (real draw calls of the last frame).
  for (const budget of [
    { name: '1440', width: 1440, height: 900, route: 'services', drawCalls: 28, dpr: 1.5, nodes: 16, edges: 33 },
    { name: '390', width: 390, height: 844, route: 'projects', drawCalls: 18, dpr: 1.25, nodes: 8, edges: 13 },
  ] as const) {
    test(`real draw calls and pixel ratio stay within budget at ${budget.name}px`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: budget.width, height: budget.height }, deviceScaleFactor: 2 });
      const page = await context.newPage();
      await enableLiveForTest(page);
      await gotoConnected(page, budget.route, 'es');
      await expectLive(page);
      await scrollInstant(page, 600);
      await expect.poll(async () => (await readConnected(page))?.drawCalls ?? 0).toBeGreaterThan(0);
      const reading = await readConnected(page);
      expect(reading?.nodes).toHaveLength(budget.nodes);
      expect(reading?.edgeGrowth).toHaveLength(budget.edges);
      expect(reading?.drawCalls).toBeLessThanOrEqual(budget.drawCalls);
      expect(reading?.pixelRatio).toBeLessThanOrEqual(budget.dpr);
      await closeContext(context);
    });
  }

  for (const handoff of [
    { name: '1440', width: 1440, height: 900, route: 'services', edges: 33 },
    { name: '390', width: 390, height: 844, route: 'projects', edges: 13 },
  ] as const) {
    test(`every connection has grown by the Footer handoff at ${handoff.name}px, and the scene is then suspended`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: handoff.width, height: handoff.height } });
      const page = await context.newPage();
      await enableLiveForTest(page);
      await gotoConnected(page, handoff.route, 'en');
      await expectLive(page);

      // Footer top at 70% of the viewport is the handoff: put it there.
      const target = await page.evaluate(() => {
        const footer = document.querySelector<HTMLElement>('[data-site-footer]')!;
        return footer.getBoundingClientRect().top + window.scrollY - 0.7 * window.innerHeight;
      });
      await scrollInstant(page, target);
      await expect.poll(async () => (await readConnected(page))?.progress ?? 0).toBeGreaterThanOrEqual(0.999);
      await expect
        .poll(async () => {
          const growth = (await readConnected(page))?.edgeGrowth ?? [];
          return growth.length === handoff.edges && growth.every((value) => value >= 0.999);
        })
        .toBe(true);

      // Footer top at 18% of the viewport: suspended, no pending work, zero further draws.
      await scrollInstant(page, 'bottom');
      await expectStopped(page);
      const stopped = await readConnected(page);
      expect(stopped?.controller).toBe('suspended');
      expect(stopped?.pendingCallbacks).toBe(0);
      expect(stopped?.schedulerPending).toBe(0);
      await closeContext(context);
    });
  }

  // The approved vocabulary, restated on purpose (docs/product/pages/services.md, Revision 5 capability words).
  const approvedWords = {
    es: ['Sitios web', 'Apps', 'Chatbots', 'Agentes', 'Automatización', 'Consultoría', 'Soporte', 'Modernización'],
    en: ['Websites', 'Apps', 'Chatbots', 'Agents', 'Automation', 'Consulting', 'Support', 'Modernization'],
  } as const;

  for (const scenario of [
    { width: 1440, height: 900, locale: 'es', labels: 16 },
    { width: 820, height: 1180, locale: 'en', labels: 16 },
    { width: 390, height: 844, locale: 'es', labels: 8 },
  ] as const) {
    test(`every node carries an upright, pointer-inert, readable word at ${scenario.width}px (${scenario.locale})`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: scenario.width, height: scenario.height } });
      const page = await context.newPage();
      await enableLiveForTest(page);
      await gotoConnected(page, 'services', scenario.locale);
      await expectLive(page);
      await expect.poll(async () => (await readLabelGeometry(page)).labels.length).toBe(scenario.labels);
      const { labels } = await readLabelGeometry(page);
      const words = approvedWords[scenario.locale];
      // Each word is assigned to two wide nodes or one compact node, in the approved vocabulary.
      const perWord = scenario.labels / words.length;
      for (const word of words) expect(labels.filter((label) => label.text === word)).toHaveLength(perWord);
      for (const label of labels) {
        expect(label.fontSize, `${label.text} is never smaller than about 11px`).toBeGreaterThanOrEqual(11);
        expect(label.upright, `${label.text} never rotates`).toBe(true);
        expect(label.pointerEvents).toBe('none');
      }
      expect(await page.locator('[data-connected-ground]').getAttribute('aria-hidden')).toBe('true');
      await closeContext(context);
    });
  }

  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`no label overlaps another label, a reading mask or the App Bar, or leaves the viewport, at ${width}px`, async ({ browser }) => {
      const height = width >= 1024 ? 900 : width >= 768 ? 1024 : 844;
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      await enableLiveForTest(page);
      let visibleTotal = 0;
      for (const [route, locale] of [['services', 'es'], ['projects', 'en']] as const) {
        await gotoConnected(page, route, locale);
        await expectLive(page);
        const scrollable = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
        for (const fraction of [0, 0.25, 0.55, 0.85]) {
          await scrollInstant(page, Math.round(scrollable * fraction));
          await page.waitForTimeout(900);
          const { labels, occluders, viewport } = await readLabelGeometry(page);
          const visible = labels.filter((label) => label.visible);
          visibleTotal += visible.length;
          const where = `${route} ${locale} at ${Math.round(fraction * 100)}%`;
          for (const label of visible) {
            expect(label.left, `${where} ${label.text} left edge`).toBeGreaterThanOrEqual(-0.5);
            expect(label.top, `${where} ${label.text} top edge`).toBeGreaterThanOrEqual(-0.5);
            expect(label.right, `${where} ${label.text} right edge`).toBeLessThanOrEqual(viewport.width + 0.5);
            expect(label.bottom, `${where} ${label.text} bottom edge`).toBeLessThanOrEqual(viewport.height + 0.5);
            for (const occluder of occluders) {
              expect(overlaps(label, occluder), `${where} ${label.text} overlaps a ${occluder.name}`).toBe(false);
            }
          }
          for (let i = 0; i < visible.length; i += 1) {
            for (let j = i + 1; j < visible.length; j += 1) {
              expect(overlaps(visible[i], visible[j]), `${where} ${visible[i].text} overlaps ${visible[j].text}`).toBe(false);
            }
          }
        }
      }
      expect(visibleTotal, 'the check is not vacuous: some labels are visible at this width').toBeGreaterThan(0);
      await closeContext(context);
    });
  }

  test('the first scroll notch accelerates the scene and starts connection growth, then it settles back to a gentle rotation', async ({ page }) => {
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'en');
    await expectLive(page);
    const idle = await readConnected(page);
    expect(idle?.targetFps, 'ambient cadence at rest').toBe(30);
    expect(idle?.edgeGrowth.every((growth) => growth === 0)).toBe(true);

    // A real wheel notch, not a teleport: the browser turns it into a short run of scroll events.
    await page.mouse.move(700, 500);
    await page.mouse.wheel(0, 40);
    // The impulse lasts a few hundred milliseconds, so the page records the highest one any frame carried.
    await expect.poll(async () => (await readConnected(page))?.peakScrollActivity ?? 0).toBeGreaterThan(0.02);
    await expect.poll(async () => (await readConnected(page))?.targetFps, { timeout: 5_000 }).toBe(30);
    const settled = await readConnected(page);
    expect(settled?.edgeGrowth.some((growth) => growth > 0), 'growth started with the first scroll').toBe(true);
  });

  test('scrolling back reverses growth, and an anchor jump lands on the current geometry without replaying the page', async ({ page }) => {
    await enableLiveForTest(page);
    await gotoConnected(page, 'services', 'es');
    await expectLive(page);
    const grown = async () => ((await readConnected(page))?.edgeGrowth ?? []).reduce((sum, growth) => sum + growth, 0);

    await scrollInstant(page, 2_400);
    await expect.poll(grown).toBeGreaterThan(8);
    const deep = await grown();
    await scrollInstant(page, 400);
    await expect.poll(grown).toBeLessThan(deep);

    // Jump to the working-boundaries anchor: the pose converges on the new scroll state within a moment.
    await page.evaluate(() => document.getElementById('condiciones')!.scrollIntoView({ behavior: 'instant', block: 'start' }));
    const expected = await page.evaluate(() => {
      const footerTop = document.querySelector<HTMLElement>('[data-site-footer]')!.getBoundingClientRect().top + window.scrollY;
      return Math.min(1, Math.max(0, window.scrollY / Math.max(1, footerTop - 0.7 * window.innerHeight)));
    });
    expect(expected).toBeGreaterThan(0.3);
    await expect.poll(async () => Math.abs(((await readConnected(page))?.progress ?? 0) - expected), { timeout: 5_000 }).toBeLessThan(0.02);
  });
});

test.describe('review regressions', () => {
  test.afterEach(async ({ page }) => { await page.goto('about:blank'); });

  for (const scenario of [
    { name: 'wide to compact', start: 1440, end: 390, policy: { wide: true, compact: false } },
    { name: 'compact to wide', start: 390, end: 1440, policy: { wide: false, compact: true } },
  ]) {
    test(`resizing ${scenario.name} respects the disabled destination policy and focused fallback`, async ({ page }) => {
      await page.setViewportSize({ width: scenario.start, height: 900 });
      await enableLiveForTest(page, scenario.policy);
      await gotoConnected(page, 'services', 'en');
      await expectLive(page);
      await pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.en.pause }).focus();
      await page.setViewportSize({ width: scenario.end, height: 900 });
      await expect(connectedCanvas(page)).toHaveCount(0);
      const fallback = pauseSlot(page, 'services').getByRole('button', { name: pauseLabels.en.staticBackground });
      await expect(fallback).toBeFocused();
      await expect(fallback).toHaveAttribute('aria-disabled', 'true');
      await expectStopped(page);
    });
  }

  test('a page initialized in a hidden tab activates once when shown', async ({ page }) => {
    await enableLiveForTest(page);
    await page.addInitScript(() => {
      let hidden = true;
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
      (window as unknown as { __showConnected(): void }).__showConnected = () => {
        hidden = false;
        document.dispatchEvent(new Event('visibilitychange'));
      };
    });
    await gotoConnected(page, 'services', 'es');
    await expectStatic(page, 'services');
    await page.evaluate(() => (window as unknown as { __showConnected(): void }).__showConnected());
    await expectLive(page);
    const imports = (await readConnected(page))?.imports;
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await page.waitForTimeout(500);
    expect((await readConnected(page))?.imports).toBe(imports);
  });

  test('Home ownership still prevents a second context after the bounded deferral expires', async ({ page }) => {
    const contexts = await trackWebglContexts(page);
    await enableLiveForTest(page);
    await page.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        const home = document.createElement('canvas');
        home.dataset.skyChartCanvas = '';
        document.body.appendChild(home);
        const gl = home.getContext('webgl2');
        (window as unknown as { __releaseRetainedHome(): void }).__releaseRetainedHome = () => {
          gl?.getExtension('WEBGL_lose_context')?.loseContext();
          home.remove();
        };
      });
    });
    await gotoConnected(page, 'projects', 'en');
    await page.waitForTimeout(11_500);
    await expect(connectedCanvas(page)).toHaveCount(0);
    expect((await readConnected(page))?.imports).toBe(0);
    expect(await contexts.maxAlive()).toBe(1);
    await page.evaluate(() => (window as unknown as { __releaseRetainedHome(): void }).__releaseRetainedHome());
    // Exhausted deferral stays static without another initialization attempt.
    await page.waitForTimeout(500);
    await expect(connectedCanvas(page)).toHaveCount(0);
  });
});
