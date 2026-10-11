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

/**
 * Holds the page `load` event open on a never-answered image until `release()`. The optional engine
 * must not start while the page is still loading, and must not start at all if the visitor leaves
 * first. Install it before the first navigation and navigate with `waitUntil: 'domcontentloaded'`.
 */
export async function holdPageLoad(page: Page): Promise<{ release(): void }> {
  let release = () => undefined as void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  await page.route('**/__connected-load-hold__.gif', async (route) => {
    await gate;
    await route.fulfill({ status: 200, contentType: 'image/gif', body: pixel }).catch(() => undefined);
  });
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const image = new Image();
      image.src = `${location.origin}/__connected-load-hold__.gif`;
    });
  });
  return { release };
}

export type WebglEvent = { type: 'create' | 'lose'; context: number };

/**
 * Records every WebGL2 context the page creates and every WEBGL_lose_context release, in order,
 * without changing what either returns. It lets a spec prove that the probe context is released
 * before the engine context exists, that there is never more than one live context, and that
 * disposal releases the last one. Install it before the first navigation.
 */
export async function trackWebglContexts(page: Page): Promise<{ events(): Promise<WebglEvent[]>; maxAlive(): Promise<number> }> {
  await page.addInitScript(() => {
    const record = { events: [] as { type: 'create' | 'lose'; context: number }[], alive: 0, maxAlive: 0, next: 0 };
    const ids = new WeakMap<object, number>();
    const released = new WeakSet<object>();
    (window as unknown as { __connectedGl: typeof record }).__connectedGl = record;
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
      const context = (original as (...args: unknown[]) => unknown).call(this, type, ...rest) as WebGL2RenderingContext | null;
      if (context && type === 'webgl2' && !ids.has(context)) {
        const id = ++record.next;
        ids.set(context, id);
        record.events.push({ type: 'create', context: id });
        record.alive += 1;
        record.maxAlive = Math.max(record.maxAlive, record.alive);
        const getExtension = context.getExtension.bind(context);
        context.getExtension = ((name: string) => {
          const extension = getExtension(name);
          if (name !== 'WEBGL_lose_context' || !extension) return extension;
          return new Proxy(extension, {
            get(target, property) {
              if (property !== 'loseContext') return Reflect.get(target, property);
              return () => {
                if (!released.has(context)) {
                  released.add(context);
                  record.events.push({ type: 'lose', context: id });
                  record.alive -= 1;
                }
                target.loseContext();
              };
            },
          });
        }) as typeof context.getExtension;
      }
      return context;
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  return {
    events: () => page.evaluate(() => (window as unknown as { __connectedGl: { events: WebglEvent[] } }).__connectedGl.events),
    maxAlive: () => page.evaluate(() => (window as unknown as { __connectedGl: { maxAlive: number } }).__connectedGl.maxAlive),
  };
}

export const SESSION_KEYS = {
  paused: 'furlanich:connected-studio-paused',
  contextLost: 'furlanich:connected-studio-context-lost',
  /** Home's own flag: connected routes only read it (PC-5). */
  homeContextLost: 'furlanich:sky-chart-context-lost',
} as const;

/** Seeds browsing-session state before any page script runs, as an earlier page in the session would have. */
export async function seedSession(page: Page, values: Partial<Record<keyof typeof SESSION_KEYS, '1' | '0'>>) {
  const entries = Object.entries(values).map(([key, value]) => [SESSION_KEYS[key as keyof typeof SESSION_KEYS], value]);
  await page.addInitScript((pairs) => {
    for (const [key, value] of pairs) window.sessionStorage.setItem(key as string, value as string);
  }, entries);
}

export const readSession = (page: Page) =>
  page.evaluate((keys) => Object.fromEntries(Object.entries(keys).map(([name, key]) => [name, window.sessionStorage.getItem(key)])), SESSION_KEYS);
