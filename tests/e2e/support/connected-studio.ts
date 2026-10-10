import { expect, type Page } from '@playwright/test';
import type { ConnectedDiagnostics } from '../../../components/connected-studio/ConnectedStudioEnhancement';
import type { ConnectedLivePolicy, ConnectedRoute } from '../../../lib/connected-studio/types';
import { appUrl, stableRoutes } from './paths';
import { setConnectedTestHook } from './connected-studio-test-hooks';

// PLAN-SPF-V1 Task 7: helpers for the connected-studio runtime, responsive and accessibility specs.
// Everything here observes the page through its public DOM or the non-production diagnostics hook
// (`window.__FURLANICH_CONNECTED__`); nothing reaches into the engine.

export type { ConnectedDiagnostics };

declare global {
  interface Window {
    __FURLANICH_CONNECTED__?: { read(): ConnectedDiagnostics };
  }
}

export const LIVE_POLICY: ConnectedLivePolicy = { wide: true, compact: true };

export const pauseLabels = {
  es: { pause: 'Pausar fondo', resume: 'Reanudar fondo', staticBackground: 'Fondo estático' },
  en: { pause: 'Pause background', resume: 'Resume background', staticBackground: 'Static background' },
} as const;

export type ConnectedLocale = keyof typeof pauseLabels;

/** A controlled-test opt-in: SwiftShader allowed and both live tiers on, as the plan's first RED prescribes. */
export async function enableLiveForTest(page: Page, livePolicy: ConnectedLivePolicy = LIVE_POLICY) {
  await setConnectedTestHook(page, { allowSoftwareRenderer: true, livePolicy });
}

export async function gotoConnected(page: Page, route: ConnectedRoute, locale: ConnectedLocale) {
  await page.goto(appUrl(stableRoutes[route === 'services' ? 'services' : 'projects'][locale]));
}

export const readConnected = (page: Page) =>
  page.evaluate(() => window.__FURLANICH_CONNECTED__?.read() ?? null);

export const connectedCanvas = (page: Page) => page.locator('main [data-connected-ground] canvas[data-connected-canvas]');

export const pauseSlot = (page: Page, route: ConnectedRoute) => page.locator(`#connected-pause-${route}`);

/** Waits for the live scene to be attached and to have drawn at least once. */
export async function expectLive(page: Page, timeout = 30_000) {
  await expect(connectedCanvas(page)).toHaveCount(1, { timeout });
  await expect
    .poll(async () => (await readConnected(page))?.renderCount ?? 0, { timeout })
    .toBeGreaterThan(0);
}

/** A page that stays on the static background: no canvas, no Pause control, no engine request. */
export async function expectStatic(page: Page, route: ConnectedRoute, settleMs = 1_500) {
  await page.waitForLoadState('load');
  // Give any activation attempt time to (not) happen; every gate declines quietly.
  await page.waitForTimeout(settleMs);
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(pauseSlot(page, route).getByRole('button')).toHaveCount(0);
  // The dev-only witness counts every start of the dynamic engine import, which a gated page never makes.
  const reading = await readConnected(page);
  expect(reading?.mode, 'diagnostics hook present on a static page').toBe('static');
  expect(reading?.imports, 'no engine import was started').toBe(0);
}

/**
 * The optional engine closure is the dynamically imported runtime: the scene factory, its geometry
 * helpers and Three itself. A request for any of them means the engine was fetched. The pattern is
 * proved against the real closure by the positive-control assertion in the runtime spec, which
 * requires at least one match in a live run, so it cannot silently stop matching.
 */
export function isConnectedEngineRequest(url: string): boolean {
  return /create-connected-scene|connected-geometry|dispose-connected-scene|connected-labels|[\\/_.-]three(?:[\\/_.-]|$)|three_build|three\.module/i.test(
    decodeURIComponent(url),
  );
}

export function observeEngineRequests(page: Page): { urls: string[] } {
  const seen = { urls: [] as string[] };
  page.on('request', (request) => {
    if (isConnectedEngineRequest(request.url())) seen.urls.push(request.url());
  });
  return seen;
}
