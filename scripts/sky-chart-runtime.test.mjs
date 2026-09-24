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
