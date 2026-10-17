import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { chooseConnectedMode } from '../lib/connected-studio/capability.ts';

// PLAN-SPF-V1 Task 7: the structural contracts of the connected-studio host. The runtime behavior
// (lifecycle, gates, labels, Pause, fallback) is proved in the browser by
// tests/e2e/connected-studio-runtime.spec.ts; this file also isolates the real effect for delayed-import
// races (without a browser's eager development chunks). Its source contracts assert
// the boundaries that must hold in the source regardless of what a browser run happens to exercise:
// the engine is a dynamic import behind the gates, the diagnostics hook never ships, Home's session
// flag is only read, the scroll path reads no layout, and the Pause control keeps its target size.

const read = (relative) => readFileSync(fileURLToPath(new URL(`../${relative}`, import.meta.url)), 'utf8').replace(/\r\n/g, '\n');

const enhancement = read('components/connected-studio/ConnectedStudioEnhancement.tsx');
const pauseControl = read('components/connected-studio/ConnectedPauseControl.tsx');
const ground = read('components/connected-studio/ConnectedStudioGround.tsx');
const css = read('components/connected-studio/connected-studio.module.css');

/** The body of the first top-level `const name = (...) => {` block in the source, braces balanced. */
function blockAfter(source, marker) {
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `source contains ${marker}`);
  const open = source.indexOf('{', start);
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(open, index + 1);
  }
  throw new Error(`unbalanced block after ${marker}`);
}

test('the enhancement is a thin client leaf and the Ground stays a server component', () => {
  assert.match(enhancement, /^'use client';/);
  assert.doesNotMatch(ground, /'use client'/);
  // Legacy routes always mount the leaf (it gates itself); PLAN-SFC-V1 profile routes mount it only by policy (sfc-contracts.test.mjs).
  assert.match(ground, /<ConnectedStudioEnhancement route=\{props\.route\} locale=\{locale\} capabilityWords=\{props\.capabilityWords\} \/>/);
  assert.match(ground, /aria-hidden="true"/);
});

test('the engine is one dynamic import behind the gates, never a static or server-side import', () => {
  assert.doesNotMatch(enhancement, /from 'three'/);
  assert.doesNotMatch(enhancement, /from '\.\/runtime\//);
  assert.doesNotMatch(enhancement, /next\/dynamic|ssr:\s*false/);
  // The type-only `typeof import(...)` reference is not a runtime import.
  const runtimeImport = /(?<!typeof )import\('\.\/runtime\/create-connected-scene'\)/;
  const imports = enhancement.match(new RegExp(runtimeImport.source, 'g')) ?? [];
  assert.equal(imports.length, 1);
  // Every gate runs before the import is reached.
  const importAt = enhancement.search(runtimeImport);
  for (const gate of ['chooseConnectedMode', 'probeWebgl()', 'readConnectedSession()', 'scheduleAfterLoad(activate)', 'HOME_RENDERER_SELECTOR']) {
    const gateAt = enhancement.indexOf(gate);
    assert.ok(gateAt !== -1 && gateAt < importAt || gate === 'scheduleAfterLoad(activate)', `${gate} guards the import`);
  }
  // A module that fails to load ends in the quiet fallback, never an unhandled rejection.
  assert.match(enhancement, /\.catch\(/);
});

test('activation waits for load, honors every preference and releases the probe context', () => {
  assert.match(enhancement, /document\.readyState === 'complete'/);
  assert.match(enhancement, /addEventListener\('load'/);
  for (const query of ['(prefers-reduced-motion: reduce)', '(forced-colors: active)']) assert.ok(enhancement.includes(query), query);
  assert.match(enhancement, /saveData/);
  assert.match(enhancement, /loseContext\(\)/);
  const probe = blockAfter(enhancement, 'function probeWebgl');
  assert.ok(probe.indexOf('loseContext') > probe.indexOf('getParameter'), 'the renderer is read before the probe is released');
});

test('the diagnostics hook never ships in production and the test hook is read only from its global', () => {
  const install = blockAfter(enhancement, 'function installDiagnostics');
  assert.match(install, /process\.env\.NODE_ENV === 'production'\) return/);
  assert.ok(install.indexOf('NODE_ENV') < install.indexOf('__FURLANICH_CONNECTED__'));
  assert.match(enhancement, /__FURLANICH_CONNECTED_TEST__/);
  assert.doesNotMatch(enhancement, /location\.search|URLSearchParams|localStorage/);
});

test('Home\'s context-loss flag is only read; the connected flag and Pause go through the session module', () => {
  assert.doesNotMatch(enhancement, /sky-chart-context-lost/);
  assert.match(enhancement, /markConnectedContextLost\(\)/);
  assert.match(enhancement, /setConnectedPaused\(next\)/);
  assert.match(enhancement, /readConnectedSession\(\)/);
  assert.doesNotMatch(enhancement, /sessionStorage/);
  assert.doesNotMatch(enhancement, /from '@\/components\/homepage|from '\.\.\/homepage/);
});

test('the scroll path reads no layout and the layout is measured in one batched pass', () => {
  const onScroll = blockAfter(enhancement, 'const onScroll = ');
  for (const read of ['getBoundingClientRect', 'offsetWidth', 'offsetHeight', 'clientWidth', 'clientHeight', 'querySelector']) {
    assert.ok(!onScroll.includes(read), `onScroll does not call ${read}`);
  }
  const remeasure = blockAfter(enhancement, 'const remeasure = ');
  assert.match(remeasure, /readLayout\(\)/);
  assert.match(remeasure, /labelLayer\.measure\(\)/);
  for (const trigger of ["'resize'", "visualViewport", "loadingdone", 'ResizeObserver']) assert.ok(enhancement.includes(trigger), trigger);
});

test('every acquisition has a release, and no endless timer exists', () => {
  assert.doesNotMatch(enhancement, /setInterval|requestIdleCallback/);
  for (const release of [
    'releases.push(() => scene.dispose())',
    'releases.push(timing.cancelAll)',
    'releases.push(() => controller.dispose())',
    'releases.push(labelLayer.dispose)',
    'contentObserver.disconnect()',
    "removeEventListener('scroll', onScroll)",
    "removeEventListener('visibilitychange', onVisibility)",
    'window.cancelAnimationFrame(remeasureFrame)',
  ]) {
    assert.ok(enhancement.includes(release), release);
  }
  // A failure while building releases what exists and rethrows to the quiet fallback.
  assert.match(enhancement, /catch \(error\) \{\s*dispose\(\);\s*throw error;/);
});

test('the Pause control is a native button with aria-pressed, a 44px target and a focus ring', () => {
  assert.match(pauseControl, /<button\s+type="button"/);
  assert.match(pauseControl, /aria-pressed=\{fallback \? undefined : paused\}/);
  assert.match(pauseControl, /aria-disabled=\{fallback \? true : undefined\}/);
  const pause = blockAfter(css, '.pause {');
  assert.match(pause, /min-width:\s*44px/);
  assert.match(pause, /min-height:\s*44px/);
  const focus = blockAfter(css, '.pause:focus-visible');
  assert.match(focus, /outline:\s*3px solid/);
});

test('labels are decorative, pointer-inert and never below the 11px floor', () => {
  const labels = blockAfter(css, '.labels {');
  assert.match(labels, /pointer-events:\s*none/);
  const label = blockAfter(css, '.label {');
  assert.match(label, /pointer-events:\s*none/);
  const size = Number(/font-size:\s*(\d+)px/.exec(label)?.[1]);
  assert.ok(size >= 11, `label font-size ${size}px`);
  assert.doesNotMatch(label, /rotate|skew/);
  assert.match(css, /\.mount\[data-connected-state='suspended'\]\s*\{\s*visibility:\s*hidden/);
});

const LEGACY_PROPS = { route: 'services', capabilityWords: [] };
const PROFILE_PROPS = { route: 'studio', wordBindings: [{ nodeId: 'n0', word: 'Software' }] };

/**
 * Exercise the real React effect with a delayed module promise. Only React/DOM and the scene
 * attachment boundary are substituted: Node cannot mount JSX or create a WebGL context.
 * Browser tests separately prove attachment, disposal and the focused fallback with a real scene.
 */
function delayedHost(props = LEGACY_PROPS) {
  const sceneStart = enhancement.indexOf('function attachLiveScene(');
  const sceneEnd = enhancement.indexOf('\n/**\n * PLAN-SPF-V1 Task 7:', sceneStart);
  assert.ok(sceneStart >= 0 && sceneEnd > sceneStart);
  const isolated = (enhancement.slice(0, sceneStart)
    + 'function attachLiveScene(options: LiveOptions): LiveScene { return globalThis.attachScene(options); }\n'
    + enhancement.slice(sceneEnd)).replace(
      /(?<!typeof )import\('\.\/runtime\/create-connected-scene'\)/, 'globalThis.loadScene()',
    );
  const { outputText } = ts.transpileModule(isolated, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  let effect;
  let resolveImport;
  let rejectImport;
  let attachments = 0;
  let imports = 0;
  const media = new Map();
  const timers = [];
  const mount = {};
  const session = { paused: false, contextLost: false };
  const connection = { saveData: false };
  const policy = { wide: true, compact: true };
  const matchMedia = (query) => {
    if (!media.has(query)) media.set(query, {
      matches: false, listener: null,
      addEventListener(_event, listener) { this.listener = listener; }, removeEventListener() {},
    });
    return media.get(query);
  };
  const document = {
    readyState: 'complete', hidden: false,
    querySelector: (selector) => selector.includes('sky-chart') ? null : mount,
    getElementById: () => null, addEventListener() {}, removeEventListener() {},
    createElement: () => ({ getContext: () => ({
      RENDERER: 1,
      getExtension: (name) => name === 'WEBGL_lose_context' ? { loseContext() {} } : null,
      getParameter: () => 'hardware',
    }) }),
  };
  const moduleExports = {};
  runInNewContext(outputText, {
    exports: moduleExports, process: { env: { NODE_ENV: 'production' } }, document,
    navigator: { connection },
    window: {
      innerWidth: 1440, matchMedia,
      setTimeout(callback) { timers.push(callback); return timers.length; }, clearTimeout() {},
      addEventListener() {}, removeEventListener() {},
    },
    loadScene() { imports++; return new Promise((resolve, reject) => { resolveImport = resolve; rejectImport = reject; }); },
    attachScene() { attachments++; return { controller: {}, dispose() {} }; },
    require(path) {
      if (path === 'react') return {
        useEffect(callback) { effect ??= callback; }, useRef: () => ({ current: null }),
        useState: () => [false, () => {}],
      };
      if (path === 'react/jsx-runtime') return { jsx: () => null, jsxs: () => null };
      if (path === '@/lib/connected-studio/capability') return { CONNECTED_LIVE_POLICY: policy, chooseConnectedMode };
      if (path === '@/lib/immersive-home/capability') return { isSoftwareRenderer: () => false };
      if (path === '@/lib/connected-studio/session') return { readConnectedSession: () => session };
      if (path === '@/lib/connected-studio/model') return { getTierForWidth: () => 'wide' };
      return {};
    },
  });
  moduleExports.ConnectedStudioEnhancement({ locale: 'es', ...props });
  const cleanup = effect();
  timers.shift()();
  assert.equal(imports, 1, 'the module was requested before the test changes eligibility');
  return {
    session, connection, document, policy, cleanup,
    preference(query, matches) {
      const pref = matchMedia(query);
      pref.matches = matches;
      pref.listener({ matches });
    },
    async finish() {
      resolveImport({ createConnectedScene() {} });
      await new Promise((resolve) => setImmediate(resolve));
      return attachments;
    },
    async fail() {
      rejectImport(new Error('optional module unavailable'));
      await new Promise((resolve) => setImmediate(resolve));
      return attachments;
    },
  };
}

for (const [kind, props] of [['legacy', LEGACY_PROPS], ['profile', PROFILE_PROPS]]) {
for (const [name, change] of [
    ['reduced motion', (host) => host.preference('(prefers-reduced-motion: reduce)', true)],
    ['forced colors', (host) => host.preference('(forced-colors: active)', true)],
    ['Save-Data', (host) => { host.connection.saveData = true; }],
    ['session loss', (host) => { host.session.contextLost = true; }],
    ['tier policy', (host) => { host.policy.wide = false; }],
    ['hidden document', (host) => { host.document.hidden = true; }],
  ]) {
    test(`${kind}: a pending import cannot attach after ${name} rejects it`, async () => {
      const host = delayedHost(props);
      change(host);
      assert.equal(await host.finish(), 0);
    });
  }

  test(`${kind}: an eligible delayed import attaches once`, async () => {
    const host = delayedHost(props);
    assert.equal(await host.finish(), 1);
  });

  test(`${kind}: a delayed import cannot attach after route cleanup`, async () => {
    const host = delayedHost(props);
    host.cleanup();
    assert.equal(await host.finish(), 0);
  });
}

for (const [kind, props] of [['legacy', LEGACY_PROPS], ['profile', PROFILE_PROPS]]) {
  test(`${kind}: a rejected optional import is handled without attaching a scene`, async () => {
    assert.equal(await delayedHost(props).fail(), 0);
  });
}

// PLAN-SFC-V1 Task 11: the cached input model. These are the pure rules the host applies to pointer, scroll and form
// events; the browser specs (sfc-runtime.spec.ts) prove the host wires them without reading layout per event.
const input = await import('../components/connected-studio/connected-input.ts');

const plate = (left, docTop, width, height) => ({ kind: 'plate', left, docTop, width, height, clearance: 0 });
const scrim = (left, docTop, width, height, clearance) => ({ kind: 'scrim', left, docTop, width, height, clearance });
const legacy = (left, docTop, width, height) => ({ kind: 'legacy', left, docTop, width, height, clearance: 0 });

test('an opaque plate excludes new excitation 8px beyond its edge', () => {
  const [rect] = input.exclusionRects([plate(100, 500, 400, 200)], 0);
  assert.deepEqual(rect, { left: 92, top: 492, width: 416, height: 216 });
  assert.equal(input.isExcluded(92, 492, [rect]), true);
  assert.equal(input.isExcluded(91.9, 600, [rect]), false);
});

test('reading text excludes its scrim clearance plus 8px, 24 on most pages and 32 on the Contact introduction', () => {
  const [wide] = input.exclusionRects([scrim(100, 100, 300, 80, 24)], 0);
  assert.deepEqual(wide, { left: 68, top: 68, width: 364, height: 144 });
  const [contact] = input.exclusionRects([scrim(100, 100, 300, 80, 32)], 0);
  assert.deepEqual(contact, { left: 60, top: 60, width: 380, height: 160 });
});

test('the boxes are document-space and follow the scroll offset without being measured again', () => {
  const boxes = [plate(0, 1000, 200, 100)];
  assert.equal(input.exclusionRects(boxes, 0)[0].top, 992);
  assert.equal(input.exclusionRects(boxes, 400)[0].top, 592);
});

test('labels avoid a plate as drawn and a scrim with its clearance, but not the extra pointer margin', () => {
  const rects = input.labelOccluders([plate(10, 20, 100, 50), scrim(200, 40, 100, 30, 24)], 0);
  assert.deepEqual(rects[0], { left: 10, top: 20, width: 100, height: 50 });
  assert.deepEqual(rects[1], { left: 176, top: 16, width: 148, height: 78 });
});

test('a legacy reading mask is used as measured, so Services and Projects labels do not change', () => {
  assert.deepEqual(input.labelOccluders([legacy(5, 10, 60, 40)], 0), [{ left: 5, top: 10, width: 60, height: 40 }]);
});

test('degenerate or non-finite boxes exclude nothing', () => {
  const rects = input.exclusionRects([plate(0, 0, 0, 0), plate(Number.NaN, 0, 10, 10), plate(0, 0, -5, 10)], 0);
  assert.equal(rects.length, 0);
});

test('a first pointer sample carries no velocity and later samples measure it over elapsed time', () => {
  const sampler = input.createPointerSampler();
  assert.deepEqual(sampler.sample({ x: 100, y: 100, timeStampMs: 1000 }), { x: 100, y: 100, vx: 0, vy: 0 });
  const moved = sampler.sample({ x: 110, y: 95, timeStampMs: 1016 });
  assert.equal(moved.vx, 625);
  assert.equal(moved.vy, -312.5);
});

test('a reset makes the next sample a first entry, so a hidden pointer supplies no velocity on re-entry', () => {
  const sampler = input.createPointerSampler();
  sampler.sample({ x: 0, y: 0, timeStampMs: 0 });
  sampler.sample({ x: 80, y: 0, timeStampMs: 16 });
  sampler.reset();
  assert.deepEqual(sampler.sample({ x: 500, y: 300, timeStampMs: 40 }), { x: 500, y: 300, vx: 0, vy: 0 });
});

test('samples that arrive faster than 8ms accumulate into one velocity window, so the rate does not change the speed', () => {
  const at = (hz) => {
    const sampler = input.createPointerSampler();
    let last = sampler.sample({ x: 0, y: 0, timeStampMs: 0 });
    const step = 1000 / hz;
    for (let t = step; t <= 200; t += step) last = sampler.sample({ x: t * 0.5, y: 0, timeStampMs: t });
    return last.vx;
  };
  assert.ok(Math.abs(at(60) - 500) < 25, `60Hz ${at(60)}`);
  assert.ok(Math.abs(at(240) - 500) < 25, `240Hz ${at(240)}`);
  assert.ok(Math.abs(at(1000) - 500) < 25, `1000Hz ${at(1000)}`);
});

test('a long gap or a non-finite sample never invents speed', () => {
  const sampler = input.createPointerSampler();
  sampler.sample({ x: 0, y: 0, timeStampMs: 0 });
  assert.deepEqual(sampler.sample({ x: 400, y: 0, timeStampMs: 600 }), { x: 400, y: 0, vx: 0, vy: 0 });
  assert.equal(sampler.sample({ x: Number.NaN, y: 0, timeStampMs: 616 }), null);
  assert.equal(sampler.sample({ x: 1, y: 1, timeStampMs: Number.NaN }), null);
});

test('an ordinary scroll is counted only shortly after a wheel, touch or key gesture', () => {
  const scroll = input.createScrollClassifier();
  assert.equal(scroll.classify(1000, 80), 0, 'no gesture: a restore or script scroll');
  scroll.noteGesture(1000);
  assert.equal(scroll.classify(1100, 80), 80);
  assert.equal(scroll.classify(1399, -60), -60);
  assert.equal(scroll.classify(1500, 80), 0, 'the gesture window has ended');
});

test('an anchor, history, page-show or resize jump is a state update, not a gesture to replay', () => {
  const scroll = input.createScrollClassifier();
  scroll.noteGesture(1000);
  scroll.noteJump(1010);
  assert.equal(scroll.classify(1050, 80), 0);
  scroll.noteGesture(2100);
  assert.equal(scroll.classify(2150, 80), 80, 'a later real gesture counts again');
});

test('a single enormous delta is a jump even inside a gesture', () => {
  const scroll = input.createScrollClassifier();
  scroll.noteGesture(0);
  assert.equal(scroll.classify(10, 2400), 0);
  assert.equal(scroll.classify(20, 90), 90);
});

test('the form suspends the graph while it holds focus or submits, and resumes only on the next eligible background input', () => {
  const form = input.createFormSuspension();
  assert.equal(form.suspended(), false);
  assert.equal(form.backgroundInput(), false, 'nothing to lift');
  form.focusChanged(true);
  assert.equal(form.suspended(), true);
  assert.equal(form.backgroundInput(), false, 'input while the form holds focus does not lift it');
  form.focusChanged(false);
  assert.equal(form.suspended(), true, 'leaving the form does not resume by itself');
  assert.equal(form.backgroundInput(), true);
  assert.equal(form.suspended(), false);
  assert.equal(form.backgroundInput(), false);
});

test('submission keeps the graph suspended after focus leaves, until the phase ends and an eligible input arrives', () => {
  const form = input.createFormSuspension();
  form.phaseChanged('submitting');
  assert.equal(form.suspended(), true);
  assert.equal(form.backgroundInput(), false);
  form.phaseChanged('error');
  assert.equal(form.suspended(), true);
  assert.equal(form.backgroundInput(), true);
  assert.equal(form.suspended(), false);
});

test('only a real form control counts as interactive or editable, never plain text or a missing target', () => {
  const element = (matches) => ({ closest: (selector) => (matches.includes(selector) ? {} : null) });
  assert.equal(input.isInteractiveTarget(null), false);
  assert.equal(input.isInteractiveTarget({}), false);
  assert.equal(input.isInteractiveTarget({ closest: () => ({}) }), true);
  assert.equal(input.isInteractiveTarget(element([])), false);
  assert.match(input.INTERACTIVE_SELECTOR, /a\[href\]/);
  for (const part of ['button', 'summary', 'input', 'select', 'textarea', 'form']) assert.ok(input.INTERACTIVE_SELECTOR.includes(part), part);
  assert.equal(input.isEditableTarget({ closest: () => ({}) }), true);
  assert.equal(input.isEditableTarget({}), false);
});

// PLAN-SFC-V1 Task 11: the host serves all five routes from one cached input pipeline. The browser specs prove
// the behavior; these are the boundaries that must hold in the source regardless of what a run exercises.
test('the host serves profile routes: it resolves decorative words by node id and builds the route profile', () => {
  assert.match(enhancement, /resolveNodeWord\(/);
  assert.match(enhancement, /wordNodeIds/);
  assert.match(enhancement, /getConnectedProfile\(/);
  assert.match(enhancement, /profileKit:\s*entry\.connectedProfileKit/);
  assert.doesNotMatch(enhancement, /if \(!capabilityWords\) return;/, 'a profile route is not skipped');
});

test('the physics stays in the gated entry: the host imports no projection, interaction, rest-path or profile module', () => {
  for (const module of ['projection', 'interaction', 'rest-path', 'profiles']) {
    assert.doesNotMatch(enhancement, new RegExp(`from '@/lib/connected-studio/${module}'`), module);
  }
  assert.doesNotMatch(enhancement, /from '\.\/runtime\//);
});

test('pointer input is one passive document listener that reads cached boxes and no layout', () => {
  assert.match(enhancement, /addEventListener\('pointermove', onPointerMove, \{ passive: true \}\)/);
  const onPointerMove = blockAfter(enhancement, 'const onPointerMove = ');
  for (const read of ['getBoundingClientRect', 'offsetWidth', 'offsetHeight', 'clientWidth', 'clientHeight', 'querySelector', 'elementFromPoint', 'getComputedStyle']) {
    assert.ok(!onPointerMove.includes(read), `onPointerMove does not call ${read}`);
  }
  assert.doesNotMatch(enhancement, /elementFromPoint/);
  assert.match(onPointerMove, /pointerType !== 'mouse'/, 'touch and pen use native scrolling only');
  assert.match(onPointerMove, /isInteractiveTarget\(/);
  assert.match(onPointerMove, /isExcluded\(/);
});

test('there is no tap, click or drag response and no default is ever prevented', () => {
  assert.doesNotMatch(enhancement, /addEventListener\('(?:click|pointerdown|pointerup|touchstart|touchend|mousedown)'/);
  assert.doesNotMatch(enhancement, /preventDefault|setPointerCapture/);
  // Wheel, touch and key events only feed the scroll classifier, and they are passive.
  for (const gesture of ['wheel', 'touchmove', 'keydown']) assert.match(enhancement, new RegExp(`addEventListener\\('${gesture}', onGesture, \\{ passive: true \\}\\)`), gesture);
  const onGesture = blockAfter(enhancement, 'const onGesture = ');
  assert.match(onGesture, /isEditableTarget\(/, 'typing and textarea scrolling are not gestures');
});

test('anchor, history, page-show and resize movement is classified as a jump', () => {
  for (const event of ['hashchange', 'popstate', 'pageshow']) assert.ok(enhancement.includes(`'${event}'`), event);
  assert.match(enhancement, /noteJump\(/);
});

test('the inquiry form suspends the graph through delegated focus and its phase marker', () => {
  assert.match(enhancement, /addEventListener\('focusin'/);
  assert.match(enhancement, /addEventListener\('focusout'/);
  assert.match(enhancement, /form\[data-inquiry-phase\]/);
  assert.match(enhancement, /new MutationObserver\(/);
  assert.match(enhancement, /attributeFilter:\s*\['data-inquiry-phase'\]/);
  assert.match(enhancement, /formSuspension\.suspended\(\)/);
});

test('plate and scrim boxes are cached in the one batched pass and shared by labels and exclusion', () => {
  const measure = blockAfter(enhancement, 'measure() {');
  assert.match(measure, /data-connected-opaque-plate/);
  assert.match(measure, /data-connected-reading-mask/);
  assert.match(measure, /data-connected-clearance/);
  assert.match(enhancement, /labelOccluders\(/);
  assert.match(enhancement, /exclusionRects\(/);
  assert.match(enhancement, /layoutReads/);
});

test('a resize or tier change hands the renderer and the controller the profile for the new viewport', () => {
  assert.match(enhancement, /scene\.resize\(\s*\{[^}]*\},\s*graph,\s*profile,?\s*\)/);
  assert.match(enhancement, /profile,\s*\n?\s*scrollY/);
});
