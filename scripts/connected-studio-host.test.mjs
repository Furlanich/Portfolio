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

/**
 * Exercise the real React effect with a delayed module promise. Only React/DOM and the scene
 * attachment boundary are substituted: Node cannot mount JSX or create a WebGL context.
 * Browser tests separately prove attachment, disposal and the focused fallback with a real scene.
 */
function delayedHost() {
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
        useEffect(callback) { effect = callback; }, useRef: () => ({ current: null }),
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
  moduleExports.ConnectedStudioEnhancement({ route: 'services', locale: 'es', capabilityWords: [] });
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

for (const [name, change] of [
  ['reduced motion', (host) => host.preference('(prefers-reduced-motion: reduce)', true)],
  ['forced colors', (host) => host.preference('(forced-colors: active)', true)],
  ['Save-Data', (host) => { host.connection.saveData = true; }],
  ['session loss', (host) => { host.session.contextLost = true; }],
  ['tier policy', (host) => { host.policy.wide = false; }],
  ['hidden document', (host) => { host.document.hidden = true; }],
]) {
  test(`a pending import cannot attach after ${name} rejects it`, async () => {
    const host = delayedHost();
    change(host);
    assert.equal(await host.finish(), 0);
  });
}

test('an eligible delayed import attaches once', async () => {
  const host = delayedHost();
  assert.equal(await host.finish(), 1);
});

test('a delayed import cannot attach after route cleanup', async () => {
  const host = delayedHost();
  host.cleanup();
  assert.equal(await host.finish(), 0);
});

test('a rejected optional import is handled without attaching a scene', async () => {
  assert.equal(await delayedHost().fail(), 0);
});
