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
//   - layout shift          : shifts attributed to the enhancement (a source inside the canvas, scrim
//                             or Pause pill, or any shift after `immersive:import-start` that is not
//                             within 500 ms of a web font finishing loading) versus the whole-page
//                             total (the font-swap reflow of the App Bar and hero text)

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
    fontsDoneAt: [],
  };
  window.__inst = inst;
  // A web font arriving late reflows text; on a throttled network that happens after the runtime
  // import has started, so time alone cannot attribute a shift to the enhancement.
  document.fonts?.addEventListener('loadingdone', () => inst.fontsDoneAt.push(performance.now()));

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

/**
 * Waits until no frame has been rendered for `quietMs`, then counts frames in the next `windowMs`.
 * `reacted` names the DOM state that proves the page has responded to the scroll that preceded the
 * call (a scroll event is delivered a frame later, so "quiet" alone can be true before the runtime
 * has even started): `{ attribute: 'data-recede', value: '1' }` or `{ attribute: 'data-rendered-chapter', value: 'connection' }`.
 */
export async function measureIdleFrames(page, { quietMs = 1500, windowMs = 2000, timeout = 30_000, reacted = null } = {}) {
  if (reacted) {
    await page.waitForFunction(
      ({ attribute, value }) => document.querySelector('[data-instrument]')?.getAttribute(attribute) === value,
      reacted,
      { timeout, polling: 100 },
    );
  }
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
 * Backdrop-filter surfaces intersecting the viewport (App Bar excluded; a surface that ends above
 * the sticky App Bar's bottom edge is entirely behind it and is not counted), measured two ways:
 *   - `atSections`: every Home section aligned under the App Bar and centred. This is the section 14
 *     gate ("E2E DOM scan at each section").
 *   - `sweep`: every half-viewport of scroll. D-08 says "no viewport", and between two sections the
 *     viewport straddles both, so the sweep's worst case can exceed the gate (plan PR 11, escalation
 *     E1). It is reported, not gated.
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
    const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

    let atSectionsMax = 0;
    const atSections = {};
    for (const section of document.querySelectorAll('main > section[id]')) {
      const rect = section.getBoundingClientRect();
      window.scrollBy({ top: rect.top - 96, behavior: 'instant' });
      await nextFrame();
      const aligned = count();
      const centred = section.getBoundingClientRect();
      window.scrollBy({ top: centred.top + centred.height / 2 - window.innerHeight / 2, behavior: 'instant' });
      await nextFrame();
      const centredCount = count();
      atSections[section.id] = { aligned, centred: centredCount };
      atSectionsMax = Math.max(atSectionsMax, aligned, centredCount);
    }

    const height = document.documentElement.scrollHeight;
    const step = Math.floor(window.innerHeight / 2);
    let sweepMax = 0;
    let sweepAt = 0;
    for (let y = 0; y < height; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await nextFrame();
      const surfaces = count();
      if (surfaces > sweepMax) {
        sweepMax = surfaces;
        sweepAt = y;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    return { max: atSectionsMax, atSections, sweep: { max: sweepMax, atScrollY: sweepAt, steps: Math.ceil(height / step) } };
  });
}

/** Layout shifts split into the enhancement's own (gated at 0) and the whole page (reported). */
export async function readLayoutShifts(page) {
  return page.evaluate(() => {
    const importStart = performance.getEntriesByName('immersive:import-start')[0]?.startTime ?? null;
    const shifts = window.__inst.shifts;
    const nearFontSwap = (shift) => window.__inst.fontsDoneAt.some((doneAt) => shift.time >= doneAt - 50 && shift.time <= doneAt + 500);
    const fromEnhancement = shifts.filter((shift) => shift.enhancement || (importStart !== null && shift.time >= importStart && !nearFontSwap(shift)));
    const sum = (list) => list.reduce((total, shift) => total + shift.value, 0);
    return {
      importStartMs: importStart === null ? null : Math.round(importStart),
      wholePage: +sum(shifts).toFixed(4),
      fromEnhancement: +sum(fromEnhancement).toFixed(4),
      enhancementDetail: fromEnhancement.map((shift) => ({ value: +shift.value.toFixed(5), atMs: Math.round(shift.time), sources: shift.sources, sourceInEnhancement: shift.enhancement })),
      notFromEnhancement: shifts.filter((shift) => !fromEnhancement.includes(shift)).map((shift) => ({ value: +shift.value.toFixed(4), atMs: Math.round(shift.time), sources: shift.sources })),
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
