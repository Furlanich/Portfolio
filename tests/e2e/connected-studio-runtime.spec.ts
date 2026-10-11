import { expect, test } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { allowSoftwareRenderer, expectActive } from './support/sky-chart';
import { setConnectedTestHook } from './support/connected-studio-test-hooks';
import {
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
    await expect(page).toHaveURL(new RegExp(appPathname(stableRoutes.home.es) + '$'));
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
});
