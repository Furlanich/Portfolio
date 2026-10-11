import { expect, test } from '@playwright/test';
import {
  connectedCanvas,
  enableLiveForTest,
  expectLive,
  expectStatic,
  gotoConnected,
  holdPageLoad,
  pauseLabels,
  pauseSlot,
  readConnected,
  seedSession,
  trackWebglContexts,
} from './support/connected-studio';
import { appPathname, appUrl, stableRoutes } from './support/paths';

// PLAN-SPF-V1 Task 7: the optional live scene behind Services and Projects. WebGL here runs on
// SwiftShader, so these specs prove functional behavior only. They opt in through the controlled
// test hook (`allowSoftwareRenderer`, `livePolicy`), which never changes the shipped policy. Hardware
// acceptance belongs to Task 9.

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
});
