// Production-build instrumentation shared by `scripts/measure-immersive-production.mjs` and
// `scripts/measure-home-web-vitals.mjs` (PLAN-SKY-CHART-HOME-REDESIGN-V2 Task 11).
//
// The dev-only debug hook (`window.__FURLANICH_SKY_CHART__`) is compiled out of production
// builds (plan section 10), so production measurements cannot ask the runtime for its counters.
// Instead this module observes the browser itself, which is exactly what the section 14 gates
// are about:
//
//   - draw calls per frame  : WebGL2 `draw*` calls between two `clear` calls (one `renderer.render`)
//   - label textures        : distinct WebGL textures whose pixels came from a `<canvas>` source
//                             (the runtime's `CanvasTexture` label sprites), with their sizes
//   - idle rendering        : `clear` calls (= rendered frames) in a window after rendering settles
//   - backdrop surfaces     : `backdrop-filter` surfaces intersecting the viewport (DOM scan)
//   - layout shift          : shifts attributed to the enhancement (after `immersive:import-start`,
//                             or with a source inside the canvas, scrim or Pause pill) versus the
//                             whole-page total (font-swap reflow before the runtime import)

/** Serialized into the page by `addInitScript`; must stay self-contained. */
export function installInstrumentation() {
  const inst = {
    clears: 0,
    draws: 0,
    frameDraws: [],
    currentFrameDraws: 0,
    lastRenderAt: 0,
    textures: [],
    bound: null,
    shifts: [],
  };
  window.__inst = inst;

  const proto = window.WebGL2RenderingContext?.prototype;
  if (proto) {
    const wrap = (name, before) => {
      const original = proto[name];
      if (typeof original !== 'function') return;
      proto[name] = function (...args) {
        before.call(this, args);
        return original.apply(this, args);
      };
    };
    wrap('clear', () => {
      inst.frameDraws.push(inst.currentFrameDraws);
      inst.currentFrameDraws = 0;
      inst.clears += 1;
      inst.lastRenderAt = performance.now();
    });
    for (const name of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced', 'drawRangeElements']) {
      wrap(name, () => {
        inst.currentFrameDraws += 1;
        inst.draws += 1;
      });
    }
    const noteTexture = (dims, canvasSource) => {
      if (!inst.bound) return;
      let entry = inst.textures.find((texture) => texture.handle === inst.bound);
      if (!entry) {
        entry = { handle: inst.bound, width: 0, height: 0, fromCanvas: false };
        inst.textures.push(entry);
      }
      if (dims) {
        entry.width = dims[0];
        entry.height = dims[1];
      }
      if (canvasSource) {
        entry.fromCanvas = true;
        entry.width = canvasSource.width;
        entry.height = canvasSource.height;
      }
    };
    wrap('bindTexture', (args) => {
      inst.bound = args[1] ?? null;
    });
    wrap('texStorage2D', (args) => noteTexture([args[3], args[4]], null));
    wrap('texImage2D', (args) => {
      const source = args[args.length - 1];
      noteTexture(args.length >= 9 ? [args[3], args[4]] : null, source instanceof HTMLCanvasElement ? source : null);
    });
    wrap('texSubImage2D', (args) => {
      const source = args[args.length - 1];
      noteTexture(null, source instanceof HTMLCanvasElement ? source : null);
    });
  }

  const classify = (node) => {
    const element = node instanceof Element ? node : (node?.parentElement ?? null);
    if (!element) return { text: 'detached', enhancement: false };
    const enhancement = element.tagName === 'CANVAS' || Boolean(element.closest('[data-sky-chart-canvas], [data-environment-scrim], [data-pause-motion-pill]'));
    const tag = element.tagName.toLowerCase();
    const where = element.closest('[data-app-bar]') ? 'app-bar' : element.closest('section[aria-labelledby="home-heading"]') ? 'hero' : (element.closest('section[id]')?.id ?? 'page');
    return { text: `${tag} in ${where}`, enhancement };
  };
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.hadRecentInput) continue;
      const sources = (entry.sources ?? []).map((source) => classify(source.node));
      inst.shifts.push({ value: entry.value, time: entry.startTime, enhancement: sources.some((source) => source.enhancement), sources: sources.map((source) => source.text) });
    }
  }).observe({ type: 'layout-shift', buffered: true });
}

const KIB = 1024;

/** Draw-call and label-texture metrics, read after the runtime has rendered at least once. */
export async function readWebglMetrics(page) {
  return page.evaluate(() => {
    const inst = window.__inst;
    const frames = inst.frameDraws.filter((count) => count > 0);
    const sorted = [...frames].sort((a, b) => a - b);
    const labelTextures = inst.textures.filter((texture) => texture.fromCanvas);
    return {
      renderedFrames: inst.clears,
      drawCallsPerFrame: { max: Math.max(0, ...frames), p95: sorted[Math.floor(sorted.length * 0.95)] ?? 0, framesObserved: frames.length },
      labelTextures: {
        count: labelTextures.length,
        largest: labelTextures.reduce((max, texture) => [Math.max(max[0], texture.width), Math.max(max[1], texture.height)], [0, 0]),
      },
    };
  });
}

/** Waits until no frame has been rendered for `quietMs`, then counts frames in the next `windowMs`. */
export async function measureIdleFrames(page, { quietMs = 1500, windowMs = 2000, timeout = 30_000 } = {}) {
  await page.waitForFunction(
    (quiet) => performance.now() - window.__inst.lastRenderAt > quiet,
    quietMs,
    { timeout, polling: 250 },
  );
  const before = await page.evaluate(() => window.__inst.clears);
  await page.waitForTimeout(windowMs);
  const after = await page.evaluate(() => window.__inst.clears);
  return { framesInWindow: after - before, windowMs };
}

/**
 * Sweeps the page in half-viewport steps and returns the worst `backdrop-filter` surface count
 * (App Bar excluded). A surface that ends above the sticky App Bar's bottom edge is entirely
 * behind it and is not counted.
 */
export async function sweepBackdropSurfaces(page) {
  return page.evaluate(async () => {
    const count = () => {
      const appBarBottom = document.querySelector('[data-app-bar-surface]')?.getBoundingClientRect().bottom ?? 0;
      let surfaces = 0;
      for (const element of document.querySelectorAll('main *')) {
        if (element.closest('[data-app-bar]')) continue;
        const style = getComputedStyle(element);
        const filter = style.backdropFilter || style.webkitBackdropFilter;
        if (!filter || filter === 'none') continue;
        const rect = element.getBoundingClientRect();
        if (rect.bottom > appBarBottom && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth) surfaces += 1;
      }
      return surfaces;
    };
    const height = document.documentElement.scrollHeight;
    const step = Math.floor(window.innerHeight / 2);
    let max = 0;
    let at = 0;
    for (let y = 0; y < height; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const surfaces = count();
      if (surfaces > max) {
        max = surfaces;
        at = y;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    return { max, atScrollY: at, steps: Math.ceil(height / step) };
  });
}

/** Layout shifts split into the enhancement's own (gated at 0) and the whole page (reported). */
export async function readLayoutShifts(page) {
  return page.evaluate(() => {
    const importStart = performance.getEntriesByName('immersive:import-start')[0]?.startTime ?? null;
    const shifts = window.__inst.shifts;
    const fromEnhancement = shifts.filter((shift) => shift.enhancement || (importStart !== null && shift.time >= importStart));
    const sum = (list) => list.reduce((total, shift) => total + shift.value, 0);
    return {
      importStartMs: importStart === null ? null : Math.round(importStart),
      wholePage: +sum(shifts).toFixed(4),
      fromEnhancement: +sum(fromEnhancement).toFixed(4),
      beforeImport: shifts.filter((shift) => !fromEnhancement.includes(shift)).map((shift) => ({ value: +shift.value.toFixed(4), atMs: Math.round(shift.time), sources: shift.sources })),
    };
  });
}

/** Canvas buffer size over its CSS size: the effective pixel ratio the runtime chose. */
export async function readCanvasPixelRatio(page) {
  return page.evaluate(() => {
    const canvas = document.querySelector('canvas[data-sky-chart-canvas]');
    if (!canvas) return null;
    return { ratioX: +(canvas.width / window.innerWidth).toFixed(3), ratioY: +(canvas.height / window.innerHeight).toFixed(3), deviceScaleFactor: window.devicePixelRatio };
  });
}

export const round = (value, digits = 1) => +value.toFixed(digits);
export const kib = (bytes) => round(bytes / KIB);
