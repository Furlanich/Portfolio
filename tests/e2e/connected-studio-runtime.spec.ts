import { expect, test } from '@playwright/test';
import {
  connectedCanvas,
  enableLiveForTest,
  expectLive,
  expectStatic,
  gotoConnected,
  pauseLabels,
  pauseSlot,
  readConnected,
} from './support/connected-studio';

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
});
