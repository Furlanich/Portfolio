import { expect, type BrowserContext, type Page } from '@playwright/test';
import type { ConnectedDiagnostics } from '../../../components/connected-studio/ConnectedStudioEnhancement';
import type { ConnectedLivePolicy, ConnectedRoute } from '../../../lib/connected-studio/types';
import { appPathname, appUrl, stableRoutes } from './paths';
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

/**
 * Waits for the start-pose settle to finish. The live scene's first frame is the static poster's pose and it eases
 * to the scroll-driven pose for about three seconds, so "at rest" starts when the progress stops changing.
 */
export async function expectSettled(page: Page, timeout = 20_000) {
  await expect
    .poll(
      async () => {
        const before = (await readConnected(page))?.progress ?? -1;
        await page.waitForTimeout(600);
        const after = (await readConnected(page))?.progress ?? -2;
        return Math.abs(after - before) < 1e-4;
      },
      { timeout },
    )
    .toBe(true);
}

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
  // The diagnostics hook installs when the page hydrates, which a slow runner can do well after `load`. Until
  // then no gate has run, so every assertion below would pass vacuously (or the hook read would find nothing).
  await expect
    .poll(() => readConnected(page), { message: 'the page hydrated and installed its diagnostics hook', timeout: 30_000 })
    .not.toBeNull();
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

/**
 * The page tried to go live and fell back: no canvas, no Pause control, a complete static page, and
 * the diagnostics report `failed` (an engine import was started, unlike a gated page).
 */
export async function expectFellBack(page: Page, route: ConnectedRoute, timeout = 30_000) {
  await expect.poll(async () => (await readConnected(page))?.mode, { timeout }).toBe('failed');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(pauseSlot(page, route).getByRole('button')).toHaveCount(0);
  await expect(page.locator('[data-connected-poster]')).toHaveCSS('opacity', '1');
  expect((await readConnected(page))?.imports, 'an engine import was attempted').toBeGreaterThan(0);
}

/** Uncaught page errors only (an unhandled rejection is one); failed resource loads are the test's own doing. */
export function observePageErrors(page: Page): { errors: string[] } {
  const seen = { errors: [] as string[] };
  page.on('pageerror', (error) => seen.errors.push(error.message));
  return seen;
}

/**
 * A real client-side navigation through the visible App Bar link, so the previous page unmounts
 * instead of unloading. Home is reached through the brand link, which targets its site-top anchor.
 */
export async function navigateInApp(page: Page, route: string) {
  const pathname = appPathname(route);
  const isHome = route === stableRoutes.home.es || route === stableRoutes.home.en;
  const link = isHome
    ? page.locator('a[data-app-bar-brand]:visible').first()
    : page.locator(`a[data-app-bar-nav-link]:is([href="${pathname}"], [href="${pathname}#site-top"]):visible`).first();
  await link.click();
  await page.waitForURL((url) => url.pathname === pathname);
}

/** Contexts still alive after a sequence of recorded events. */
export function liveContexts(events: readonly WebglEvent[]): number {
  return events.filter((event) => event.type === 'create').length - events.filter((event) => event.type === 'lose').length;
}

/**
 * Lets a spec hide and show the document without a second browser tab: document.hidden and
 * visibilityState become controllable and visibilitychange fires, as it does for a real tab switch.
 */
export async function controlVisibility(page: Page): Promise<{ setHidden(hidden: boolean): Promise<void> }> {
  await page.addInitScript(() => {
    let hidden = false;
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (hidden ? 'hidden' : 'visible') });
    (window as unknown as { __setConnectedHidden(value: boolean): void }).__setConnectedHidden = (value) => {
      hidden = value;
      document.dispatchEvent(new Event('visibilitychange'));
    };
  });
  return {
    setHidden: (hidden) => page.evaluate((value) => (window as unknown as { __setConnectedHidden(v: boolean): void }).__setConnectedHidden(value), hidden),
  };
}

export const scrollInstant = (page: Page, top: number | 'bottom') =>
  page.evaluate((target) => window.scrollTo({ top: target === 'bottom' ? document.documentElement.scrollHeight : target, behavior: 'instant' }), top);

/** Polls until the scene has stopped: suspended or paused, with no scheduled work and no further draws. */
export async function expectStopped(page: Page, settleMs = 800) {
  await expect
    .poll(async () => {
      const reading = await readConnected(page);
      return reading && reading.controller !== 'live' && reading.pendingCallbacks === 0 && reading.schedulerPending === 0;
    })
    .toBe(true);
  const first = await readConnected(page);
  await page.waitForTimeout(settleMs);
  const later = await readConnected(page);
  expect(later?.renderCount, 'a stopped scene draws nothing').toBe(first?.renderCount);
  expect(later?.schedulerPending).toBe(0);
}

export type LabelGeometry = {
  labels: { id: string; text: string; visible: boolean; fontSize: number; upright: boolean; pointerEvents: string; left: number; top: number; right: number; bottom: number }[];
  occluders: { name: string; left: number; top: number; right: number; bottom: number }[];
  viewport: { width: number; height: number };
};

/**
 * Reads the labels and the things they must stay clear of from the live DOM, independently of the
 * runtime's own bookkeeping: a label counts as visible only if it computes to non-zero opacity.
 */
export const readLabelGeometry = (page: Page): Promise<LabelGeometry> =>
  page.evaluate(() => {
    const rect = (element: Element) => {
      const { left, top, right, bottom } = element.getBoundingClientRect();
      return { left, top, right, bottom };
    };
    const labels = Array.from(document.querySelectorAll<HTMLElement>('[data-connected-label]')).map((element) => {
      const style = getComputedStyle(element);
      const transform = style.transform === 'none' ? new DOMMatrixReadOnly() : new DOMMatrixReadOnly(style.transform);
      return {
        id: element.dataset.nodeId ?? '',
        text: element.textContent ?? '',
        visible: parseFloat(style.opacity) > 0.01 && style.visibility !== 'hidden' && style.display !== 'none',
        fontSize: parseFloat(style.fontSize),
        upright: Math.abs(transform.b) < 1e-6 && Math.abs(transform.c) < 1e-6,
        pointerEvents: style.pointerEvents,
        ...rect(element),
      };
    });
    const occluders = [
      ...Array.from(document.querySelectorAll('[data-connected-reading-mask]')).map((element) => ({ name: 'reading-mask', ...rect(element) })),
      ...Array.from(document.querySelectorAll('[data-app-bar]')).map((element) => ({ name: 'app-bar', ...rect(element) })),
    ];
    return { labels, occluders, viewport: { width: window.innerWidth, height: window.innerHeight } };
  });

type Box = { left: number; top: number; right: number; bottom: number };

/** Strict overlap with a sub-pixel tolerance, so rectangles that only touch do not count. */
export function overlaps(a: Box, b: Box, tolerance = 0.5): boolean {
  return a.left < b.right - tolerance && b.left < a.right - tolerance && a.top < b.bottom - tolerance && b.top < a.bottom - tolerance;
}

/**
 * Layout shifts that happen once the enhancement is in the page. The activation moment is the first
 * time the optional canvas or the Pause control is inserted; every shift without recent input from
 * then on counts. A page that reserved its slot and sized its canvas as a fixed layer reports 0.
 */
export async function observeEnhancementShifts(page: Page): Promise<{ shiftsAfterActivation(): Promise<number> }> {
  await page.addInitScript(() => {
    const state = { activationAt: Number.POSITIVE_INFINITY, shifts: [] as { value: number; startTime: number }[] };
    (window as unknown as { __connectedShifts: typeof state }).__connectedShifts = state;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as { value: number; startTime: number; hadRecentInput: boolean }[]) {
        if (!entry.hadRecentInput) state.shifts.push({ value: entry.value, startTime: entry.startTime });
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new MutationObserver((records) => {
      if (state.activationAt !== Number.POSITIVE_INFINITY) return;
      for (const record of records) {
        for (const node of Array.from(record.addedNodes)) {
          if (node instanceof Element && (node.matches('canvas, [data-connected-pause], [data-connected-labels]') || node.querySelector('canvas, [data-connected-pause]'))) {
            state.activationAt = performance.now();
          }
        }
      }
    }).observe(document, { childList: true, subtree: true });
  });
  return {
    shiftsAfterActivation: () =>
      page.evaluate(() => {
        const state = (window as unknown as { __connectedShifts: { activationAt: number; shifts: { value: number; startTime: number }[] } }).__connectedShifts;
        if (state.activationAt === Number.POSITIVE_INFINITY) return -1;
        return state.shifts.filter((shift) => shift.startTime >= state.activationAt - 50).reduce((sum, shift) => sum + shift.value, 0);
      }),
  };
}

/**
 * Closes a context after leaving its pages. Tearing a context down around a running software-rendered
 * scene can stall under load, whereas unmounting the scene releases its GL context at once.
 */
export async function closeContext(context: BrowserContext) {
  await Promise.all(context.pages().map((page) => page.goto('about:blank').catch(() => undefined)));
  await context.close();
}
