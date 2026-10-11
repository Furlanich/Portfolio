import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// PLAN-SPF-V1 Task 7: the structural contracts of the connected-studio host. The runtime behavior
// (lifecycle, gates, labels, Pause, fallback) is proved in the browser by
// tests/e2e/connected-studio-runtime.spec.ts; Node cannot load a `.tsx` module, so this file asserts
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
  assert.match(ground, /<ConnectedStudioEnhancement route=\{route\} locale=\{locale\} capabilityWords=\{capabilityWords\} \/>/);
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
  assert.match(enhancement, /import\('\.\/runtime\/create-connected-scene'\)[\s\S]*?\.catch\(\(\) => fallBack\(\)\)/);
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
