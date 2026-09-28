import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

const RUNTIME_DIR = 'components/homepage/immersive/runtime';
const CREATE_SCENE = `${RUNTIME_DIR}/create-sky-chart-scene.ts`;
const DISPOSE_SCENE = `${RUNTIME_DIR}/dispose-sky-chart-scene.ts`;
const LABELS = `${RUNTIME_DIR}/sky-chart-labels.ts`;
const GEOMETRY = `${RUNTIME_DIR}/sky-chart-geometry.ts`;
const CONTROLLER = `${RUNTIME_DIR}/sky-chart-controller.ts`;
const ENHANCEMENT = 'components/homepage/immersive/ImmersiveEnhancement.tsx';
const CAPABILITY = 'lib/immersive-home/capability.ts';

const { chooseRenderQuality } = await import('../lib/immersive-home/capability.ts');

test('T-07: field-star count is 520 wide, 260 compact, 160 compact and constrained', () => {
  assert.equal(chooseRenderQuality({ viewportWidth: 1440, devicePixelRatio: 2, hardwareConcurrency: 8 }).starCount, 520);
  assert.equal(chooseRenderQuality({ viewportWidth: 768, devicePixelRatio: 2, hardwareConcurrency: 8 }).starCount, 260);
  assert.equal(chooseRenderQuality({ viewportWidth: 768, devicePixelRatio: 2, hardwareConcurrency: 4 }).starCount, 160);
  assert.equal(chooseRenderQuality({ viewportWidth: 1440, devicePixelRatio: 2, hardwareConcurrency: 4 }).starCount, 520, 'wide-but-constrained keeps the wide star count');
});

test('T-07: DPR is capped at 1.5 wide and 1.25 compact or constrained', () => {
  assert.equal(chooseRenderQuality({ viewportWidth: 1440, devicePixelRatio: 3, hardwareConcurrency: 8 }).pixelRatio, 1.5);
  assert.equal(chooseRenderQuality({ viewportWidth: 768, devicePixelRatio: 3, hardwareConcurrency: 8 }).pixelRatio, 1.25);
  assert.equal(chooseRenderQuality({ viewportWidth: 1440, devicePixelRatio: 3, hardwareConcurrency: 2 }).pixelRatio, 1.25);
});

test('the dispose contract releases every geometry, material and texture, then the renderer and its context', () => {
  const dispose = read(DISPOSE_SCENE);
  assert.match(dispose, /geometries\.forEach\(\(geometry\) => geometry\.dispose\(\)\)/, 'geometries are disposed');
  assert.match(dispose, /materials\.forEach\(\(material\) => material\.dispose\(\)\)/, 'materials are disposed');
  assert.match(dispose, /textures\.forEach\(\(texture\) => texture\.dispose\(\)\)/, 'label textures are disposed');
  assert.match(dispose, /renderer\.dispose\(\)/, 'the renderer is disposed');
  assert.match(dispose, /renderer\.forceContextLoss\(\)/, 'the WebGL context is force-lost so it cannot outlive the scene');

  const scene = read(CREATE_SCENE);
  assert.match(scene, /disposeSkyChartScene\(/, 'the scene factory delegates to the shared dispose helper');
  assert.match(scene, /geometries:\s*BufferGeometry\[\]\s*=\s*\[graticuleGeometry,\s*starsGeometry,\s*linkGeometry\]/);
  assert.match(scene, /materials:\s*Material\[\]\s*=\s*\[graticuleMaterial,\s*starsMaterial,\s*linkMaterial/);
  assert.match(scene, /textures:\s*Texture\[\]\s*=\s*labels\.map\(\(entry\)\s*=>\s*entry\.texture\)/);
});

test('label fonts are awaited before any CanvasTexture is built (T-03)', () => {
  const labels = read(LABELS);
  assert.match(labels, /document\.fonts\.load/, 'awaits the label font faces');
  assert.match(labels, /async function loadSkyChartFonts/, 'font loading is an explicit awaited step');
  assert.match(labels, /try\s*\{[\s\S]*document\.fonts\.load[\s\S]*\}\s*catch/, 'a font-loading failure is swallowed, not surfaced');

  const scene = read(CREATE_SCENE);
  const prepareBody = scene.slice(scene.indexOf('async prepare()'), scene.indexOf('resize(width, height)'));
  const fontsIndex = prepareBody.indexOf('loadSkyChartFonts');
  const textureIndex = prepareBody.indexOf('createLabelSprite');
  assert.ok(fontsIndex >= 0, 'prepare() calls loadSkyChartFonts');
  assert.ok(textureIndex >= 0, 'prepare() builds label sprites');
  assert.ok(fontsIndex < textureIndex, 'fonts are awaited before any label sprite (CanvasTexture) is built');
  assert.match(prepareBody, /await loadSkyChartFonts\(\)/);
});

test('the canvas is portaled to document.body (T-04)', () => {
  const source = read(ENHANCEMENT);
  assert.match(source, /createPortal\(/, 'uses createPortal');
  assert.match(source, /createPortal\(\s*<div[\s\S]*?,\s*document\.body,?\s*\)/, 'the portal target is document.body');
  assert.match(source, /canvas\.setAttribute\('aria-hidden', 'true'\)|aria-hidden="true"/);
});

test('the canvas itself is created aria-hidden, non-focusable and pointer-events: none', () => {
  const scene = read(CREATE_SCENE);
  assert.match(scene, /canvas\.setAttribute\('aria-hidden', 'true'\)/);
  assert.match(scene, /canvas\.tabIndex = -1/);
  assert.match(scene, /pointer-events:none/);
});

test('there is no setAnimationLoop: rendering is demand-driven only', () => {
  for (const file of [CREATE_SCENE, CONTROLLER, ENHANCEMENT]) {
    assert.doesNotMatch(read(file), /setAnimationLoop/, file);
  }
});

test('the controller damps toward its target by 0.12 per frame and snaps below 0.0005', () => {
  const controller = read(CONTROLLER);
  assert.match(controller, /DAMPING = 0\.12/);
  assert.match(controller, /SETTLE_EPSILON = 0\.0005/);
  assert.match(controller, /requestAnimationFrame/);
  assert.match(controller, /cancelAnimationFrame/);
});

test('resume recalculates immediately instead of resuming a stale target', () => {
  const controller = read(CONTROLLER);
  assert.match(controller, /resume\(target: number\): void \{[\s\S]*?this\.setTarget\(target, true\)/);
});

test('the old instrument runtime modules are removed', () => {
  for (const file of [
    'create-instrument-scene.ts',
    'dispose-instrument-scene.ts',
    'instrument-geometry.ts',
    'instrument-materials.ts',
    'instrument-signals.ts',
  ]) {
    assert.equal(fs.existsSync(path.join(root, RUNTIME_DIR, file)), false, file);
  }
});

test('Appendix B node vocabulary and yaw/pitch drive fixed node positions at radius 40', () => {
  const geometry = read(GEOMETRY);
  const scene = read(CREATE_SCENE);
  assert.match(geometry, /directionFromDegrees/);
  assert.match(scene, /NODE_RADIUS = 40/);
});

test('field stars use the seeded LCG (seed 7, multiplier 16807, modulus 2147483647)', () => {
  const geometry = read(GEOMETRY);
  assert.match(geometry, /LCG_SEED = 7/);
  assert.match(geometry, /LCG_MULTIPLIER = 16807/);
  assert.match(geometry, /LCG_MODULUS = 2147483647/);
});

test('the App Bar readout token is never touched here: capability.ts only exports mode and quality helpers', () => {
  const capability = read(CAPABILITY);
  assert.match(capability, /export function chooseImmersiveMode/);
  assert.match(capability, /export function chooseRenderQuality/);
  assert.doesNotMatch(capability, /'use client'/);
});

// --- Task 7 follow-up (PR #83 review): B1 software-renderer capability gate -----------------

const { chooseImmersiveMode, isSoftwareRenderer } = await import('../lib/immersive-home/capability.ts');

const ELIGIBLE = {
  reducedMotion: false,
  saveData: false,
  webglAvailable: true,
  nearViewport: true,
  sessionContextLost: false,
  softwareRenderer: false,
};

test('B1: a software renderer fails the capability gate like every other gate', () => {
  assert.equal(chooseImmersiveMode(ELIGIBLE), 'webgl');
  assert.equal(chooseImmersiveMode({ ...ELIGIBLE, softwareRenderer: true }), 'static');
});

test('B1: isSoftwareRenderer matches every named software rasterizer, case-insensitively', () => {
  for (const rendererString of [
    'Google SwiftShader',
    'llvmpipe (LLVM 15.0.0, 256 bits)',
    'softpipe',
    'Microsoft Basic Render Driver',
    'ANGLE (SwiftShader Device)',
    'SOFTWARE RASTERIZER',
  ]) {
    assert.equal(isSoftwareRenderer(rendererString), true, rendererString);
  }
});

test('B1: isSoftwareRenderer does not flag a real hardware GPU string', () => {
  for (const rendererString of [
    'ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 Direct3D11 vs_5_0 ps_5_0)',
    'Apple M1',
    'AMD Radeon Pro 5500M OpenGL Engine',
  ]) {
    assert.equal(isSoftwareRenderer(rendererString), false, rendererString);
  }
});

test('B1: the runtime detects the renderer string via WEBGL_debug_renderer_info, with a plain RENDERER fallback, and respects the test-only override', () => {
  const enhancement = read(ENHANCEMENT);
  assert.match(enhancement, /WEBGL_debug_renderer_info/);
  assert.match(enhancement, /UNMASKED_RENDERER_WEBGL/);
  assert.match(enhancement, /__SKY_CHART_ALLOW_SOFTWARE_RENDERER__/);
});

// --- N5: create the WebGL2 context directly; no THREE-internal console.error on failure -----

test('N5: the capability probe and the scene each create their own WebGL2 context explicitly, and the scene passes it into WebGLRenderer', () => {
  const enhancement = read(ENHANCEMENT);
  assert.match(enhancement, /getContext\('webgl2'/);
  const scene = read(CREATE_SCENE);
  assert.match(scene, /canvas\.getContext\('webgl2'/);
  assert.match(scene, /new WebGLRenderer\(\{[^}]*\bcontext\b/s);
});

// --- N7: debug hook exposes draw calls, pixel ratio and label-texture sizes -----------------

test('N7: the scene exposes draw calls, pixel ratio and label-texture sizes for the debug hook', () => {
  const scene = read(CREATE_SCENE);
  assert.match(scene, /renderer\.info\.render\.calls/);
  assert.match(scene, /getPixelRatio\(/);
  assert.match(scene, /getDebugInfo/);
});

test('N7: the enhancement debug hook forwards drawCalls, pixelRatio and labelTextureSizes', () => {
  const enhancement = read(ENHANCEMENT);
  assert.match(enhancement, /drawCalls/);
  assert.match(enhancement, /pixelRatio/);
  assert.match(enhancement, /labelTextureSizes/);
});

// --- N9: stop activation if context loss happens during prepare() ---------------------------

test('N9: activation checks the scene is still the current one after prepare() resolves, not only `cancelled`', () => {
  const enhancement = read(ENHANCEMENT);
  const gateEffect = enhancement.slice(enhancement.indexOf('await scene.prepare()'), enhancement.indexOf('performance.mark(\'immersive:scene-created\')'));
  assert.match(gateEffect, /sceneRef\.current !== scene/);
});

// --- N10: ResizeObserver watches document.documentElement, not the instrument root ----------

test('N10: the resize effect observes document.documentElement (plan section 10), not [data-instrument]', () => {
  const enhancement = read(ENHANCEMENT);
  assert.match(enhancement, /resizeObserver\.observe\(document\.documentElement\)/);
});

// --- N11: release the probe context ----------------------------------------------------------

test('N11: the capability probe releases its WebGL2 context via WEBGL_lose_context', () => {
  const enhancement = read(ENHANCEMENT);
  const probe = enhancement.slice(enhancement.indexOf('function probeWebgl'), enhancement.indexOf('function probeWebgl') + 900);
  assert.match(probe, /WEBGL_lose_context/);
  assert.match(probe, /loseContext\(\)/);
});

// --- N4: the react-dom shim is a project-wide declaration, not scoped -----------------------

test('N4: the react-dom shim comment states it is project-wide and must be deleted once @types/react-dom is approved', () => {
  const shim = read(`${RUNTIME_DIR}/react-dom-shim.d.ts`);
  assert.match(shim, /project-wide/i);
  assert.doesNotMatch(shim, /scoped inside `?runtime\/?`?/i);
  assert.match(shim, /delete(d)? once `?@types\/react-dom`? is approved/i);
});

// --- B2: hidden must actually hide the Pause pill (Tailwind flex must not win over [hidden]) -

test('B2: PauseMotionControl never combines the hidden attribute with a display utility class', () => {
  const pause = read('components/homepage/immersive/PauseMotionControl.tsx');
  // The old bug: `hidden={hidden}` alongside an unconditional `flex` class, which preflight's
  // `[hidden]{display:none}` loses to Tailwind's `.flex{display:flex}` on specificity ties
  // broken by source order. The fix must make `flex` conditional on `!hidden`.
  assert.doesNotMatch(pause, /className="sky-plate-material-solid pointer-events-none fixed z-40 flex/);
  assert.match(pause, /hidden \? 'hidden' : /);
});

// --- B3 / N8: tick() always measures/recedes/updates the pill while paused; label-opacity ----
// --- renders are routed through the controller, which skips rendering while paused ----------

test('B3: tick() only skips the controller target while paused, not the recede/pill-visibility measurement', () => {
  const enhancement = read(ENHANCEMENT);
  const tickFn = enhancement.slice(enhancement.indexOf('const tick = useCallback'), enhancement.indexOf('}, [applyRecede, measure, updatePauseVisibility]);'));
  // measure/applyRecede/updatePauseVisibility must run unconditionally (no early return before them)
  assert.doesNotMatch(tickFn.split('measure()')[0], /pausedRef\.current/, 'measure() must not be gated by pausedRef before it runs');
  assert.match(tickFn, /if \(pausedRef\.current\) return;[\s\S]*controllerRef\.current\.setTarget/);
});

test('N8: label-opacity scale changes are routed through the controller, which stores the scale without rendering while paused', () => {
  const controller = read(CONTROLLER);
  assert.match(controller, /setLabelOpacityScale/);
  const enhancement = read(ENHANCEMENT);
  assert.match(enhancement, /controllerRef\.current\?\.setLabelOpacityScale/);
  assert.doesNotMatch(enhancement, /sceneRef\.current\?\.setLabelOpacity\(/);
});

// --- N13: recede applies instantly (no canvas, no transition) on every static-with-JS path --

test('N13: a static-with-JS path still applies the D-24 scrim recede, instantly and without a canvas', () => {
  const enhancement = read(ENHANCEMENT);
  assert.match(enhancement, /applyStaticRecede/);
  assert.match(enhancement, /transition = 'none'/);
});

// --- N14: tier-2 labels fade out where they would overlap the hero's text column, >=768px ---

test('N14: the scene supports a hero-exclusion rectangle that fades tier-2 labels to 0 where they project over it', () => {
  const scene = read(CREATE_SCENE);
  assert.match(scene, /setHeroExclusion/);
  const enhancement = read(ENHANCEMENT);
  assert.match(enhancement, /setHeroExclusion/);
});
