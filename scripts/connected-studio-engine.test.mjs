import test from 'node:test';
import assert from 'node:assert/strict';
import { BufferGeometry, InstancedMesh, Material, Texture, Vector3 } from 'three';

// PLAN-SPF-V1 Task 5. The engine runs in Node against fakes at the browser/GPU boundary only: a
// canvas, a mount, and a renderer that models GPU ownership the way three's WebGLRenderer does
// (it watches each geometry, material, texture and instanced mesh it draws, and frees its GPU copy
// when that resource dispatches `dispose`). Real three objects are used for everything the engine
// builds, so a count here is a count of real resources. Nothing below asserts mesh coordinates or
// shader source.

const { createConnectedScene } = await import('../components/connected-studio/runtime/create-connected-scene.ts');
const { getConnectedGraph, getQualityForTier, getTierForWidth, sampleConnectedPose } = await import(
  '../lib/connected-studio/model.ts'
);

// --- fakes at the browser/GPU boundary ------------------------------------------------------------

function createFakeCanvas() {
  const listeners = new Map();
  const canvas = {
    style: { cssText: '' },
    attributes: {},
    parent: null,
    removals: 0,
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
    },
    removeEventListener(type, listener) {
      listeners.get(type)?.delete(listener);
    },
    listenerCount(type) {
      return listeners.get(type)?.size ?? 0;
    },
    dispatch(type) {
      for (const listener of [...(listeners.get(type) ?? [])]) listener({ type, preventDefault() {} });
    },
    remove() {
      this.removals += 1;
      if (this.parent) {
        this.parent.children = this.parent.children.filter((child) => child !== this);
        this.parent = null;
      }
    },
  };
  return canvas;
}

function createFakeMount() {
  return {
    children: [],
    appendChild(node) {
      node.parent = this;
      this.children.push(node);
      return node;
    },
  };
}

function isDrawn(object) {
  if (!object.visible || !(object.isMesh || object.isLine || object.isPoints)) return false;
  if (object.isInstancedMesh) return object.count > 0;
  const range = object.geometry.drawRange;
  return range.count > 0;
}

function* resourcesOf(object) {
  yield ['geometry', object.geometry];
  const materials = Array.isArray(object.material) ? object.material : [object.material];
  for (const material of materials) {
    yield ['material', material];
    for (const value of Object.values(material)) {
      if (value && value.isTexture) yield ['texture', value];
    }
  }
  if (object.isInstancedMesh) yield ['instanced', object];
}

/**
 * A renderer that models what a GPU owns. Drawing an object uploads its geometry, material,
 * textures and instanced mesh; each upload frees itself when its resource dispatches `dispose`.
 * `disposeEvents` counts every dispose event per resource, so "released once" is checkable.
 */
function createFakeRenderer(canvas, behavior = {}) {
  const gpu = { geometry: new Set(), material: new Set(), texture: new Set(), instanced: new Set() };
  const disposeEvents = new Map();
  const state = {
    gpu,
    disposeEvents,
    renders: 0,
    drawn: [],
    setPixelRatio: [],
    setSize: [],
    dispose: 0,
    forceContextLoss: 0,
    renderListsDisposed: 0,
    animationLoops: 0,
    lastCamera: null,
    lastScene: null,
  };
  const watch = (kind, resource) => {
    if (gpu[kind].has(resource)) return;
    gpu[kind].add(resource);
    resource.addEventListener('dispose', () => {
      gpu[kind].delete(resource);
      disposeEvents.set(resource, (disposeEvents.get(resource) ?? 0) + 1);
    });
  };
  let pixelRatio = 1;
  const renderer = {
    domElement: canvas,
    renderLists: {
      dispose() {
        state.renderListsDisposed += 1;
      },
    },
    info: { render: { calls: 0 } },
    setPixelRatio(value) {
      pixelRatio = value;
      state.setPixelRatio.push(value);
    },
    getPixelRatio() {
      return pixelRatio;
    },
    setSize(width, height, updateStyle) {
      state.setSize.push({ width, height, updateStyle });
    },
    render(scene, camera) {
      if (behavior.renderThrows) throw new Error('GPU render failed');
      state.renders += 1;
      state.lastCamera = camera;
      state.lastScene = scene;
      state.drawn = [];
      scene.traverse((object) => {
        if (!isDrawn(object)) return;
        state.drawn.push(object);
        for (const [kind, resource] of resourcesOf(object)) watch(kind, resource);
      });
      renderer.info.render.calls = state.drawn.length;
    },
    dispose() {
      state.dispose += 1;
      if (behavior.disposeThrows) throw new Error('renderer dispose failed');
    },
    forceContextLoss() {
      state.forceContextLoss += 1;
      if (behavior.forceContextLossThrows) throw new Error('context already lost');
    },
    setAnimationLoop() {
      state.animationLoops += 1;
    },
  };
  return { renderer, state };
}

const VIEWPORTS = {
  wide: { width: 1440, height: 900, pixelRatio: 2, tier: 'wide' },
  tablet: { width: 900, height: 1180, pixelRatio: 2, tier: 'tablet' },
  compact: { width: 390, height: 844, pixelRatio: 3, tier: 'compact' },
};

function viewportForWidth(width, height = 900, pixelRatio = 2) {
  return { width, height, pixelRatio, tier: getTierForWidth(width) };
}

/**
 * Builds a scene against the fakes. `graph`, `quality` and `rendererFails` inject construction
 * failures; with `expectFailure` the construction error is returned instead of thrown.
 */
function createFixture({ viewport = VIEWPORTS.wide, rendererBehavior = {}, onContextLost, graph: graphOverride, quality, rendererFails = false, expectFailure = false } = {}) {
  const canvas = createFakeCanvas();
  const mount = createFakeMount();
  const fake = createFakeRenderer(canvas, rendererBehavior);
  const lost = { count: 0 };
  const graph = graphOverride ?? getConnectedGraph(getQualityForTier(viewport.tier));
  const factories = {
    created: { canvases: 0, renderers: 0 },
    createCanvas() {
      this.created.canvases += 1;
      return canvas;
    },
    createRenderer() {
      this.created.renderers += 1;
      if (rendererFails) throw new Error('WebGL2 context unavailable');
      return fake.renderer;
    },
  };
  const options = {
    mount,
    graph,
    quality: quality ?? graph.quality,
    tier: viewport.tier,
    words: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    onContextLost:
      onContextLost ??
      (() => {
        lost.count += 1;
      }),
  };
  const result = { canvas, mount, fake, state: fake.state, lost, graph, factories, viewport };
  if (!expectFailure) return { ...result, handle: createConnectedScene(options, factories) };
  try {
    createConnectedScene(options, factories);
    return { ...result, error: null };
  } catch (error) {
    return { ...result, error };
  }
}

function restPose(graph, tier, progress = 0) {
  return sampleConnectedPose(undefined, { graph, tier, progress, velocityPxPerSecond: 0, deltaSeconds: 0 });
}

// --- resource ownership ----------------------------------------------------------------------------

test('disposing a constructed connected scene releases every owned GPU resource once', () => {
  const fx = createFixture();
  fx.handle.resize(fx.viewport, fx.graph);
  fx.handle.render(restPose(fx.graph, 'wide', 0.5));

  const owned = fx.handle.diagnostics();
  assert.ok(owned.geometries > 0 && owned.materials > 0 && owned.textures > 0, 'a drawn scene owns geometries, materials and a texture');
  assert.ok(fx.state.gpu.geometry.size > 0 && fx.state.gpu.material.size > 0 && fx.state.gpu.texture.size > 0, 'the renderer holds GPU copies');
  assert.equal(fx.mount.children.length, 1, 'the canvas is mounted');
  assert.equal(fx.canvas.listenerCount('webglcontextlost'), 1, 'one context-loss listener');

  fx.handle.dispose();

  const after = fx.handle.diagnostics();
  assert.deepEqual(
    { geometries: after.geometries, materials: after.materials, textures: after.textures, drawables: after.drawables, drawCalls: after.drawCalls, disposed: after.disposed },
    { geometries: 0, materials: 0, textures: 0, drawables: 0, drawCalls: 0, disposed: true },
    'diagnostics report nothing left after dispose',
  );
  for (const kind of ['geometry', 'material', 'texture', 'instanced']) {
    assert.equal(fx.state.gpu[kind].size, 0, `no ${kind} stays on the GPU`);
  }
  assert.ok(fx.state.disposeEvents.size > 0);
  for (const [resource, events] of fx.state.disposeEvents) {
    assert.equal(events, 1, `${resource.constructor.name} is released exactly once`);
  }
  assert.equal(fx.state.renderListsDisposed, 1, 'render lists are cleared once');
  assert.equal(fx.state.dispose, 1, 'the renderer is disposed once');
  assert.equal(fx.state.forceContextLoss, 1, 'the context is released once');
  assert.equal(fx.canvas.listenerCount('webglcontextlost'), 0, 'the context-loss listener is removed');
  assert.equal(fx.mount.children.length, 0, 'the mount owns nothing afterwards');
  assert.equal(fx.canvas.parent, null);

  const snapshot = [...fx.state.disposeEvents.values()];
  assert.doesNotThrow(() => fx.handle.dispose(), 'a repeated dispose is safe');
  assert.equal(fx.state.dispose, 1);
  assert.equal(fx.state.forceContextLoss, 1);
  assert.equal(fx.state.renderListsDisposed, 1);
  assert.deepEqual([...fx.state.disposeEvents.values()], snapshot, 'a repeated dispose releases nothing twice');
});

// --- batched graph ------------------------------------------------------------------------------------

/** The engine tags what it builds with `userData.connectedRole`; counts come from the objects themselves. */
function drawnByRole(fx) {
  const byRole = {};
  for (const object of fx.state.drawn) {
    const role = object.userData.connectedRole;
    if (role) byRole[role] = object;
  }
  return byRole;
}

function drawFixture(viewport, progress = 0.5) {
  const fx = createFixture({ viewport });
  fx.handle.resize(viewport, fx.graph);
  fx.handle.render(restPose(fx.graph, viewport.tier, progress));
  return fx;
}

test('a wide scene batches 16 nodes with their rings and cores and 33 connections into a few drawables', () => {
  const fx = drawFixture(VIEWPORTS.wide);
  const roles = drawnByRole(fx);
  assert.equal(roles.nodes?.count, 16, 'sixteen faceted nodes in one instanced mesh');
  assert.equal(roles.cores?.count, 16, 'one light core per node');
  assert.equal(roles.rings?.count, 16, 'one ring per node');
  assert.equal(roles.paths?.userData.connections, 33, 'thirty-three connections in one path batch');
  assert.equal(roles.skeleton?.userData.connections, 33, 'the faint skeleton covers every connection');
  const { drawables, drawCalls } = fx.handle.diagnostics();
  assert.ok(drawables >= 6 && drawables <= 28, `a wide scene stays within 28 drawables, got ${drawables}`);
  assert.equal(drawCalls, drawables, 'each drawable is one draw call');
  assert.ok(drawables < 33, 'connections are batched, not one drawable each');
});

test('distant points are fewer on compact and share one soft-point texture', () => {
  const wide = drawFixture(VIEWPORTS.wide);
  const compact = drawFixture(VIEWPORTS.compact);
  const widePoints = drawnByRole(wide).points;
  const compactPoints = drawnByRole(compact).points;
  assert.ok(widePoints && compactPoints, 'both qualities draw distant points');
  const wideCount = widePoints.geometry.getAttribute('position').count;
  const compactCount = compactPoints.geometry.getAttribute('position').count;
  assert.ok(compactCount > 0 && compactCount * 2 <= wideCount, `compact has fewer points (${compactCount} vs ${wideCount})`);
  assert.equal(wide.handle.diagnostics().textures, 1, 'one tiny shared texture, no font or image textures');
  assert.equal(compact.handle.diagnostics().textures, 1);
});

test('the compact scene is 8 nodes, 13 connections and one ring per node', () => {
  const fx = drawFixture(VIEWPORTS.compact);
  const roles = drawnByRole(fx);
  assert.equal(roles.nodes?.count, 8);
  assert.equal(roles.cores?.count, 8);
  assert.equal(roles.rings?.count, 8, 'one ring per node, not a second orbit of rings');
  assert.equal(roles.paths?.userData.connections, 13);
  assert.equal(roles.skeleton?.userData.connections, 13);
  const { drawables } = fx.handle.diagnostics();
  assert.ok(drawables >= 6 && drawables <= 18, `a compact scene stays within 18 drawables, got ${drawables}`);
});

// --- paths and nodes follow the pose --------------------------------------------------------------------

const PATH_BLOCK = (pathMesh) => {
  const position = pathMesh.geometry.getAttribute('position');
  const perEdge = position.count / pathMesh.userData.connections;
  return (edgeIndex) => Array.from(position.array.slice(edgeIndex * perEdge * 3, (edgeIndex + 1) * perEdge * 3));
};

function extentOf(block) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let index = 0; index < block.length; index += 3) {
    for (let axis = 0; axis < 3; axis += 1) {
      min[axis] = Math.min(min[axis], block[index + axis]);
      max[axis] = Math.max(max[axis], block[index + axis]);
    }
  }
  return Math.hypot(max[0] - min[0], max[1] - min[1], max[2] - min[2]);
}

function movedPose(pose, nodeId, delta) {
  return {
    ...pose,
    nodes: pose.nodes.map((node) =>
      node.id === nodeId ? { ...node, position: node.position.map((value, axis) => value + delta[axis]) } : node,
    ),
  };
}

function grownPose(pose, edgeId, growth) {
  return { ...pose, edges: pose.edges.map((edge) => (edge.id === edgeId ? { ...edge, growth } : edge)) };
}

test('connections follow their moving endpoints and settle back when the node returns', () => {
  const fx = drawFixture(VIEWPORTS.wide, 1);
  const base = restPose(fx.graph, 'wide', 1);
  const target = fx.graph.nodes[0].id;
  const touching = fx.graph.edges.map((edge) => edge.from === target || edge.to === target);
  assert.ok(touching.some(Boolean) && touching.some((value) => !value));

  const paths = drawnByRole(fx).paths;
  const block = PATH_BLOCK(paths);
  const before = fx.graph.edges.map((_, index) => block(index));
  const matricesBefore = Array.from(drawnByRole(fx).nodes.instanceMatrix.array);

  fx.handle.render(movedPose(base, target, [0.6, -0.4, 0.3]));
  const moved = fx.graph.edges.map((_, index) => block(index));
  fx.graph.edges.forEach((_, index) => {
    if (touching[index]) assert.notDeepEqual(moved[index], before[index], `edge ${index} touches the moved node and must follow it`);
    else assert.deepEqual(moved[index], before[index], `edge ${index} does not touch the moved node and must stay put`);
  });
  const matricesMoved = Array.from(drawnByRole(fx).nodes.instanceMatrix.array);
  assert.notDeepEqual(matricesMoved, matricesBefore, 'the node instance moved');
  assert.deepEqual(matricesMoved.slice(16), matricesBefore.slice(16), 'only the moved node instance changed');

  fx.handle.render(base);
  assert.deepEqual(fx.graph.edges.map((_, index) => block(index)), before, 'returning the node restores every path exactly');
  assert.deepEqual(Array.from(drawnByRole(fx).nodes.instanceMatrix.array), matricesBefore);
});

test('a connection grows from its origin and shrinks back reversibly as growth changes', () => {
  const fx = drawFixture(VIEWPORTS.wide, 0);
  const edge = fx.graph.edges[3];
  const base = restPose(fx.graph, 'wide', 0);
  const block = PATH_BLOCK(drawnByRole(fx).paths);
  const extentAt = (growth) => {
    fx.handle.render(grownPose(base, edge.id, growth));
    return extentOf(block(3));
  };
  const extents = [0, 0.25, 0.5, 0.75, 1].map(extentAt);
  assert.ok(extents[0] < extents[4] * 0.1, `an ungrown connection has no visible reach (${extents[0]} vs ${extents[4]})`);
  for (let step = 1; step < extents.length; step += 1) {
    assert.ok(extents[step] > extents[step - 1], `growth ${step / 4} reaches further than growth ${(step - 1) / 4}`);
  }
  fx.handle.render(grownPose(base, edge.id, 1));
  const full = block(3);
  fx.handle.render(grownPose(base, edge.id, 0.4));
  assert.notDeepEqual(block(3), full);
  fx.handle.render(grownPose(base, edge.id, 1));
  assert.deepEqual(block(3), full, 'growing back to 1 restores the exact full path (reversible, no history)');
});

// --- tracers ----------------------------------------------------------------------------------------------

function sceneByRole(fx, role) {
  let found = null;
  fx.state.lastScene.traverse((object) => {
    if (object.userData.connectedRole === role) found = object;
  });
  return found;
}

function poseWithGrowth(pose, growthByIndex) {
  return { ...pose, edges: pose.edges.map((edge, index) => ({ ...edge, growth: growthByIndex[index] ?? edge.growth })) };
}

test('a growing connection carries a tracer on its tip; untouched and complete connections carry none', () => {
  const fx = drawFixture(VIEWPORTS.wide, 0);
  const base = restPose(fx.graph, 'wide', 0);
  const tracers = () => sceneByRole(fx, 'tracers');
  assert.ok(tracers(), 'the scene has a tracer batch');
  assert.equal(tracers().count, 0, 'nothing is growing at the top of the page');
  assert.ok(!fx.state.drawn.includes(tracers()), 'an empty tracer batch costs no draw call');
  const idle = fx.handle.diagnostics();
  assert.equal(idle.drawables, idle.drawCalls, 'drawables counts only what is drawn: an empty batch is not a drawable');

  fx.handle.render(poseWithGrowth(base, { 2: 0.3, 7: 0.6, 11: 0.9, 12: 1 }));
  assert.equal(tracers().count, 3, 'three connections are mid-growth, the complete one is not a tracer');
  assert.ok(fx.state.drawn.includes(tracers()));

  const block = PATH_BLOCK(sceneByRole(fx, 'paths'));
  const matrices = tracers().instanceMatrix.array;
  [2, 7, 11].forEach((edgeIndex, slot) => {
    const tip = [matrices[slot * 16 + 12], matrices[slot * 16 + 13], matrices[slot * 16 + 14]];
    const vertices = block(edgeIndex);
    let nearest = Infinity;
    for (let index = 0; index < vertices.length; index += 3) {
      nearest = Math.min(nearest, Math.hypot(vertices[index] - tip[0], vertices[index + 1] - tip[1], vertices[index + 2] - tip[2]));
    }
    assert.ok(nearest < extentOf(vertices) * 0.1, `tracer ${slot} rides its connection's tip (${nearest} from the path)`);
  });

  fx.handle.render(restPose(fx.graph, 'wide', 1));
  assert.equal(tracers().count, 0, 'every connection complete means no tracer');
});

// --- projected labels -------------------------------------------------------------------------------------

function withNode(pose, index, patch) {
  return { ...pose, nodes: pose.nodes.map((node, at) => (at === index ? { ...node, ...patch } : node)) };
}

test('every node projects a finite label position inside the viewport in rest poses at all five widths', () => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const viewport = viewportForWidth(width, width < 768 ? 800 : 900);
    const fx = createFixture({ viewport });
    fx.handle.resize(viewport, fx.graph);
    for (const progress of [0, 0.5, 1]) {
      const labels = fx.handle.projectLabels(restPose(fx.graph, viewport.tier, progress));
      assert.equal(labels.length, fx.graph.nodes.length, `${width}px: one label per node`);
      labels.forEach((label, index) => {
        const node = fx.graph.nodes[index];
        assert.equal(label.id, node.id);
        assert.equal(label.capabilityIndex, node.capabilityIndex);
        assert.ok(Number.isFinite(label.xPx) && Number.isFinite(label.yPx), `${width}px ${node.id}: finite position`);
        assert.ok(label.depthScale > 0 && Number.isFinite(label.depthScale));
        assert.ok(label.inView, `${width}px progress ${progress} ${node.id}: the field is spread inside the viewport`);
        assert.ok(label.xPx >= 0 && label.xPx <= viewport.width && label.yPx >= 0 && label.yPx <= viewport.height);
      });
    }
  }
});

test('labels stay upright: projection ignores node rotation and the idle angle', () => {
  const fx = createFixture();
  fx.handle.resize(fx.viewport, fx.graph);
  const base = restPose(fx.graph, 'wide', 0.4);
  const turned = {
    ...base,
    idleAngleRadians: 2.5,
    nodes: base.nodes.map((node) => ({ ...node, rotation: [node.rotation[0] + 1.1, node.rotation[1] + 2.3, node.rotation[2] - 0.7] })),
  };
  assert.equal(fx.handle.projectLabels(base).length, 16, 'the labels exist to compare');
  assert.deepEqual(fx.handle.projectLabels(turned), fx.handle.projectLabels(base));
});

test('a label hangs below its node, follows it across the viewport and flags nodes out of view', () => {
  const fx = createFixture();
  fx.handle.resize(fx.viewport, fx.graph);
  const base = restPose(fx.graph, 'wide', 0);
  const at = (position) => fx.handle.projectLabels(withNode(base, 0, { position }))[0];
  const centre = at([0, 0, 0]);
  assert.ok(Math.abs(centre.xPx - fx.viewport.width / 2) < 1e-6, 'the origin is horizontally centred');
  assert.ok(centre.yPx > fx.viewport.height / 2 && centre.yPx < fx.viewport.height / 2 + 120, 'the label anchor sits just below the node');
  assert.ok(at([1, 0, 0]).xPx > centre.xPx && at([-1, 0, 0]).xPx < centre.xPx, 'right is right');
  assert.ok(at([0, 1, 0]).yPx < centre.yPx && at([0, -1, 0]).yPx > centre.yPx, 'up is up');

  for (const far of [[500, 0, 0], [0, -500, 0], [-500, 300, 0]]) {
    const label = at(far);
    assert.equal(label.inView, false, `${far} is outside the viewport`);
    assert.ok(Number.isFinite(label.xPx) && Number.isFinite(label.yPx));
  }
  const behind = at([0.5, 0.5, 30]);
  assert.equal(behind.inView, false, 'a node behind the camera is out of view');
  assert.ok(Number.isFinite(behind.xPx) && Number.isFinite(behind.yPx));
  const broken = at([Number.NaN, Number.POSITIVE_INFINITY, 0]);
  assert.ok(Number.isFinite(broken.xPx) && Number.isFinite(broken.yPx), 'a non-finite pose never yields a non-finite label');
});

test('tablet restrains depth: the same near pose spreads less than on wide', () => {
  const near = (tier, width, height) => {
    const viewport = { width, height, pixelRatio: 1, tier };
    const fx = createFixture({ viewport });
    fx.handle.resize(viewport, fx.graph);
    const base = restPose(fx.graph, tier, 0);
    const at = (z) => fx.handle.projectLabels(withNode(base, 0, { position: [1, 0, z] }))[0].xPx - width / 2;
    return at(2) / at(0);
  };
  const wide = near('wide', 1100, 800);
  const tablet = near('tablet', 900, 800);
  assert.ok(wide > 1 && tablet > 1, 'coming toward the camera enlarges the offset on both');
  assert.ok(tablet < wide, `tablet depth (${tablet}) is restrained against wide (${wide})`);
});

test('label anchors line up with the nodes the renderer draws, on every tier', () => {
  for (const viewport of [VIEWPORTS.wide, VIEWPORTS.tablet, VIEWPORTS.compact]) {
    const fx = createFixture({ viewport });
    fx.handle.resize(viewport, fx.graph);
    const pose = restPose(fx.graph, viewport.tier, 0.5);
    fx.handle.render(pose);
    const camera = fx.state.lastCamera;
    const matrices = drawnByRole(fx).nodes.instanceMatrix.array;
    const labels = fx.handle.projectLabels(pose);
    labels.forEach((label, index) => {
      // The renderer's own camera projects the drawn node centre (the translation of its matrix).
      const ndc = { x: matrices[index * 16 + 12], y: matrices[index * 16 + 13], z: matrices[index * 16 + 14] };
      const projected = new Vector3(ndc.x, ndc.y, ndc.z).project(camera);
      const drawnX = ((projected.x + 1) / 2) * viewport.width;
      const drawnY = ((1 - projected.y) / 2) * viewport.height;
      assert.ok(Math.abs(label.xPx - drawnX) < 0.01, `${viewport.tier} ${label.id}: label x ${label.xPx} vs drawn ${drawnX}`);
      assert.ok(label.yPx > drawnY && label.yPx - drawnY < 90, `${viewport.tier} ${label.id}: the label top sits just below the drawn node`);
    });
  }
});

// --- resize, DPR caps and tier transitions -----------------------------------------------------------------

const DPR_CAP = { wide: 1.5, tablet: 1.5, compact: 1.25 };

test('resize applies CSS-pixel size and a pixel ratio capped per tier through the 767/768/1023/1024 transitions', () => {
  const fx = createFixture({ viewport: viewportForWidth(767, 800, 3) });
  for (const [width, tier] of [[767, 'compact'], [768, 'tablet'], [1023, 'tablet'], [1024, 'wide'], [767, 'compact']]) {
    const viewport = { width, height: 800, pixelRatio: 3, tier };
    const graph = getConnectedGraph(getQualityForTier(tier));
    fx.handle.resize(viewport, graph);
    const { pixelRatio } = fx.handle.diagnostics();
    assert.equal(pixelRatio, DPR_CAP[tier], `${width}px (${tier}): a DPR 3 device is capped`);
    assert.deepEqual(fx.state.setSize.at(-1), { width, height: 800, updateStyle: false }, 'the buffer is sized in CSS px; the canvas CSS fills its mount');
    fx.handle.render(restPose(graph, tier, 0.5));
    for (const label of fx.handle.projectLabels(restPose(graph, tier, 0.5))) {
      assert.ok(Number.isFinite(label.xPx) && Number.isFinite(label.yPx), `${width}px ${label.id}: finite`);
    }
  }
  const compact = { width: 390, height: 800, pixelRatio: 1.1, tier: 'compact' };
  fx.handle.resize(compact, getConnectedGraph('compact'));
  assert.equal(fx.handle.diagnostics().pixelRatio, 1.1, 'a low-density screen is not raised to the cap');
  for (const bad of [Number.NaN, 0, -2, Number.POSITIVE_INFINITY]) {
    fx.handle.resize({ ...compact, pixelRatio: bad }, getConnectedGraph('compact'));
    const { pixelRatio } = fx.handle.diagnostics();
    assert.ok(Number.isFinite(pixelRatio) && pixelRatio >= 1 && pixelRatio <= 1.25, `pixel ratio ${bad} resolves to a safe value, got ${pixelRatio}`);
  }
});

test('a quality change rebuilds the batched graph in the same renderer and releases the old allocations', () => {
  const fx = createFixture({ viewport: viewportForWidth(767, 800) });
  const compactGraph = getConnectedGraph('compact');
  const wideGraph = getConnectedGraph('wide');
  fx.handle.resize(viewportForWidth(767, 800), compactGraph);
  fx.handle.render(restPose(compactGraph, 'compact', 0.5));
  const compactResources = new Set([...fx.state.gpu.geometry, ...fx.state.gpu.material, ...fx.state.gpu.texture, ...fx.state.gpu.instanced]);
  const compactCounts = fx.handle.diagnostics();
  assert.equal(drawnByRole(fx).nodes.count, 8);

  fx.handle.resize(viewportForWidth(768, 800), wideGraph);
  fx.handle.render(restPose(wideGraph, 'tablet', 0.5));
  assert.equal(drawnByRole(fx).nodes.count, 16, 'the wide graph is drawn after crossing 768');
  assert.equal(drawnByRole(fx).paths.userData.connections, 33);
  for (const resource of compactResources) {
    assert.equal(fx.state.disposeEvents.get(resource), 1, 'every compact resource is released exactly once');
  }
  const wideCounts = fx.handle.diagnostics();
  assert.deepEqual(
    { geometries: fx.state.gpu.geometry.size, materials: fx.state.gpu.material.size, textures: fx.state.gpu.texture.size },
    { geometries: wideCounts.geometries, materials: wideCounts.materials, textures: wideCounts.textures },
    'the GPU holds exactly what the scene reports, so nothing from the old graph leaked',
  );
  assert.equal(fx.factories.created.renderers, 1, 'one renderer and one context across the swap');
  assert.equal(fx.state.dispose, 0);
  assert.equal(fx.state.forceContextLoss, 0);
  assert.equal(fx.mount.children.length, 1);

  fx.handle.resize(viewportForWidth(767, 800), compactGraph);
  fx.handle.render(restPose(compactGraph, 'compact', 0.5));
  assert.equal(drawnByRole(fx).nodes.count, 8, 'and back again');
  assert.equal(fx.handle.diagnostics().geometries, compactCounts.geometries, 'back to the compact allocation, no growth');
  assert.equal(fx.state.gpu.geometry.size, compactCounts.geometries);
});

test('a resize inside the same tier and graph keeps the allocation', () => {
  const fx = drawFixture(VIEWPORTS.wide);
  const stable = (objects) => objects.filter((object) => object.userData.connectedRole !== 'tracers');
  const before = stable(fx.state.drawn);
  fx.handle.resize({ ...VIEWPORTS.wide, width: 1200, height: 800 }, fx.graph);
  fx.handle.render(restPose(fx.graph, 'wide', 0.5));
  assert.deepEqual(stable(fx.state.drawn), before);
  assert.equal(fx.state.disposeEvents.size, 0, 'nothing was released');
});

test('resize ignores unusable input without throwing and keeps the last good layout', () => {
  const fx = drawFixture(VIEWPORTS.wide);
  const pose = restPose(fx.graph, 'wide', 0.5);
  const good = fx.handle.projectLabels(pose);
  const sizes = fx.state.setSize.length;
  const bad = [
    { ...VIEWPORTS.wide, width: 0 },
    { ...VIEWPORTS.wide, height: -1 },
    { ...VIEWPORTS.wide, width: Number.NaN },
    { ...VIEWPORTS.wide, height: Number.POSITIVE_INFINITY },
    { ...VIEWPORTS.wide, tier: 'huge' },
  ];
  for (const viewport of bad) assert.doesNotThrow(() => fx.handle.resize(viewport, fx.graph));
  assert.doesNotThrow(() => fx.handle.resize(VIEWPORTS.compact, fx.graph), 'a compact tier with the wide graph is incoherent');
  assert.doesNotThrow(() => fx.handle.resize(VIEWPORTS.wide, getConnectedGraph('compact')), 'a wide tier with the compact graph is incoherent');
  assert.equal(fx.state.setSize.length, sizes, 'no unusable viewport reached the renderer');
  assert.deepEqual(fx.handle.projectLabels(pose), good, 'the layout did not change');
});

/**
 * Observes every three resource created and disposed while it runs, by wrapping the library's
 * prototypes (the engine builds real three objects, so this is the only seam that sees a
 * half-built set). Everything is restored afterwards.
 */
function watchThreeResources() {
  const created = new Set();
  const disposed = new Map();
  const restores = [];
  const wrap = (target, name, onCall) => {
    const original = target[name];
    target[name] = function wrapped(...args) {
      onCall(this);
      return original.apply(this, args);
    };
    restores.push(() => {
      target[name] = original;
    });
  };
  wrap(BufferGeometry.prototype, 'setAttribute', (geometry) => created.add(geometry));
  wrap(BufferGeometry.prototype, 'setIndex', (geometry) => created.add(geometry));
  wrap(Material.prototype, 'setValues', (material) => created.add(material));
  const needsUpdate = Object.getOwnPropertyDescriptor(Texture.prototype, 'needsUpdate');
  Object.defineProperty(Texture.prototype, 'needsUpdate', {
    ...needsUpdate,
    set(value) {
      created.add(this);
      needsUpdate.set.call(this, value);
    },
  });
  restores.push(() => Object.defineProperty(Texture.prototype, 'needsUpdate', needsUpdate));
  for (const type of [BufferGeometry, Material, Texture, InstancedMesh]) {
    wrap(type.prototype, 'dispose', (resource) => disposed.set(resource, (disposed.get(resource) ?? 0) + 1));
  }
  return {
    created,
    disposed,
    stop: () => restores.reverse().forEach((restore) => restore()),
  };
}

function malformedGraph(graph) {
  return { ...graph, edges: [...graph.edges.slice(0, -1), { ...graph.edges.at(-1), to: 'no-such-node' }] };
}

test('a failed graph rebuild keeps the previous scene running and releases the half-built one', () => {
  const fx = drawFixture(VIEWPORTS.compact);
  const before = fx.handle.diagnostics();
  const watch = watchThreeResources();
  try {
    assert.doesNotThrow(() => fx.handle.resize({ ...VIEWPORTS.tablet }, malformedGraph(getConnectedGraph('wide'))));
    assert.ok(watch.created.size > 0, 'the rebuild did start allocating');
    for (const resource of watch.created) {
      assert.equal(watch.disposed.get(resource), 1, `${resource.constructor.name} from the failed rebuild is released exactly once`);
    }
  } finally {
    watch.stop();
  }
  const after = fx.handle.diagnostics();
  assert.deepEqual(
    { geometries: after.geometries, materials: after.materials, textures: after.textures },
    { geometries: before.geometries, materials: before.materials, textures: before.textures },
  );
  assert.equal(after.disposed, false);
  assert.doesNotThrow(() => fx.handle.render(restPose(fx.graph, 'compact', 0.3)), 'the previous graph still renders');
  assert.equal(drawnByRole(fx).nodes.count, 8);
});

// --- context loss -------------------------------------------------------------------------------------------

test('a lost context is reported once, stops all drawing, and the host can still dispose cleanly', () => {
  const fx = drawFixture(VIEWPORTS.wide);
  const rendersBefore = fx.state.renders;
  const pose = restPose(fx.graph, 'wide', 0.5);

  fx.canvas.dispatch('webglcontextlost');
  fx.canvas.dispatch('webglcontextlost');
  assert.equal(fx.lost.count, 1, 'the host hears about a loss exactly once');

  assert.doesNotThrow(() => fx.handle.render(pose));
  assert.equal(fx.state.renders, rendersBefore, 'a lost context is never drawn to');
  assert.equal(fx.handle.diagnostics().renderCount, 1, 'renderCount counts only completed draws');
  assert.equal(fx.handle.projectLabels(pose).length, 16, 'projection needs no GPU and keeps working');
  assert.doesNotThrow(() => fx.handle.resize(VIEWPORTS.wide, fx.graph));

  fx.handle.dispose();
  for (const [resource, events] of fx.state.disposeEvents) assert.equal(events, 1, `${resource.constructor.name} released once`);
  assert.equal(fx.state.gpu.geometry.size + fx.state.gpu.material.size + fx.state.gpu.texture.size, 0);
  assert.equal(fx.canvas.listenerCount('webglcontextlost'), 0);
  fx.canvas.dispatch('webglcontextlost');
  assert.equal(fx.lost.count, 1, 'a loss after disposal is nobody\'s business');
});

test('a host callback that throws or disposes re-entrantly cannot break the engine', () => {
  const thrower = createFixture({
    onContextLost() {
      throw new Error('host callback failed');
    },
  });
  assert.doesNotThrow(() => thrower.canvas.dispatch('webglcontextlost'), 'a throwing callback never escapes into the event dispatch');

  let fixture;
  fixture = createFixture({ onContextLost: () => fixture.handle.dispose() });
  fixture.handle.render(restPose(fixture.graph, 'wide', 0.5));
  assert.doesNotThrow(() => fixture.canvas.dispatch('webglcontextlost'));
  assert.equal(fixture.handle.diagnostics().disposed, true);
  assert.equal(fixture.state.dispose, 1, 'disposed once even from inside the callback');
  for (const [resource, events] of fixture.state.disposeEvents) assert.equal(events, 1, `${resource.constructor.name} released once`);
});

// --- init failure, partial construction, render failure and hostile input ---------------------------------

test('a renderer that cannot be created fails construction cleanly with nothing left behind', () => {
  const fx = createFixture({ rendererFails: true, expectFailure: true });
  assert.ok(fx.error instanceof Error, 'construction reports a plain Error the host can catch');
  assert.match(fx.error.message, /connected-studio/);
  assert.equal(fx.mount.children.length, 0, 'no canvas was left in the mount');
  assert.equal(fx.canvas.listenerCount('webglcontextlost'), 0);
  assert.equal(fx.lost.count, 0, 'an init failure is not a context loss');
});

test('a graph that fails part-way through construction releases everything built, the renderer and the canvas', () => {
  const watch = watchThreeResources();
  let fx;
  try {
    fx = createFixture({ graph: malformedGraph(getConnectedGraph('wide')), expectFailure: true });
    assert.ok(watch.created.size > 0, 'construction did start allocating');
    for (const resource of watch.created) {
      assert.equal(watch.disposed.get(resource), 1, `${resource.constructor.name} built before the failure is released exactly once`);
    }
  } finally {
    watch.stop();
  }
  assert.ok(fx.error instanceof Error && /connected-studio/.test(fx.error.message));
  assert.equal(fx.state.dispose, 1, 'the renderer is disposed');
  assert.equal(fx.state.forceContextLoss, 1, 'the context is released');
  assert.equal(fx.state.renderListsDisposed, 1);
  assert.equal(fx.mount.children.length, 0, 'the canvas never reached the mount');
  assert.equal(fx.canvas.removals >= 1, true, 'the canvas is removed');
  assert.equal(fx.canvas.listenerCount('webglcontextlost'), 0);
});

test('incoherent construction options fail before anything is allocated', () => {
  const watch = watchThreeResources();
  try {
    const mismatched = createFixture({ viewport: VIEWPORTS.compact, graph: getConnectedGraph('wide'), expectFailure: true });
    assert.ok(mismatched.error instanceof Error, 'a wide graph for a compact tier is refused');
    const wrongQuality = createFixture({ quality: 'compact', expectFailure: true });
    assert.ok(wrongQuality.error instanceof Error, 'a quality that disagrees with the graph is refused');
    const unknownTier = createFixture({ viewport: { ...VIEWPORTS.wide, tier: 'huge' }, graph: getConnectedGraph('wide'), expectFailure: true });
    assert.ok(unknownTier.error instanceof Error, 'an unknown tier is refused');
    assert.equal(watch.created.size, 0, 'no resource was built for any of them');
    for (const fx of [mismatched, wrongQuality, unknownTier]) {
      assert.equal(fx.mount.children.length, 0);
      assert.equal(fx.factories.created.renderers, 0, 'no context was created for a configuration that cannot run');
    }
  } finally {
    watch.stop();
  }
});

test('a renderer that throws while drawing never reaches the reader: the scene stops and reports a loss once', () => {
  const fx = drawFixture(VIEWPORTS.compact);
  fx.fake.renderer.render = () => {
    throw new Error('GPU render failed');
  };
  const pose = restPose(fx.graph, 'compact', 0.5);
  assert.doesNotThrow(() => fx.handle.render(pose));
  assert.doesNotThrow(() => fx.handle.render(pose));
  assert.equal(fx.lost.count, 1, 'the host learns once that the GPU path is unusable');
  assert.equal(fx.handle.diagnostics().renderCount, 1, 'only the draw before the failure counted');
  fx.handle.dispose();
  for (const [resource, events] of fx.state.disposeEvents) assert.equal(events, 1, `${resource.constructor.name} released once`);
});

test('disposal never throws and still finishes when the renderer or its context refuse to release', () => {
  const fx = drawFixture(VIEWPORTS.wide);
  fx.fake.renderer.dispose = () => {
    throw new Error('renderer dispose failed');
  };
  fx.fake.renderer.forceContextLoss = () => {
    throw new Error('context already lost');
  };
  assert.doesNotThrow(() => fx.handle.dispose());
  assert.equal(fx.mount.children.length, 0, 'the canvas is still removed');
  assert.equal(fx.state.gpu.geometry.size + fx.state.gpu.material.size + fx.state.gpu.texture.size + fx.state.gpu.instanced.size, 0);
  assert.equal(fx.handle.diagnostics().disposed, true);
});

test('calls after disposal are inert and never touch the renderer again', () => {
  const fx = drawFixture(VIEWPORTS.wide);
  fx.handle.dispose();
  const renders = fx.state.renders;
  const sizes = fx.state.setSize.length;
  const pose = restPose(fx.graph, 'wide', 0.5);
  assert.doesNotThrow(() => fx.handle.render(pose));
  assert.doesNotThrow(() => fx.handle.resize(VIEWPORTS.compact, getConnectedGraph('compact')));
  assert.doesNotThrow(() => fx.handle.projectLabels(pose));
  assert.doesNotThrow(() => fx.handle.diagnostics());
  assert.equal(fx.state.renders, renders);
  assert.equal(fx.state.setSize.length, sizes);
  assert.equal(fx.mount.children.length, 0);
});

test('hostile poses never produce non-finite geometry or throw: NaN, missing, unknown and reordered entries', () => {
  const fx = drawFixture(VIEWPORTS.wide);
  const base = restPose(fx.graph, 'wide', 0.6);
  const hostile = {
    ...base,
    nodes: [
      { id: base.nodes[0].id, position: [Number.NaN, Number.POSITIVE_INFINITY, undefined], rotation: [Number.NaN, 0, 0], scale: Number.NaN },
      ...base.nodes.slice(2),
      { id: 'not-a-node', position: [1, 1, 1], rotation: [0, 0, 0], scale: 1 },
    ],
    edges: [
      { id: base.edges[0].id, growth: Number.NaN },
      { id: base.edges[1].id, growth: 7 },
      { id: base.edges[2].id, growth: -3 },
      ...base.edges.slice(4),
    ],
  };
  assert.doesNotThrow(() => fx.handle.render(hostile));
  const finite = (array) => Array.from(array).every(Number.isFinite);
  const roles = drawnByRole(fx);
  for (const role of ['nodes', 'cores', 'rings']) assert.ok(finite(roles[role].instanceMatrix.array), `${role} matrices are finite`);
  assert.ok(finite(roles.paths.geometry.getAttribute('position').array), 'path vertices are finite');
  assert.ok(finite(roles.paths.geometry.getAttribute('color').array));
  assert.ok(finite(roles.skeleton.geometry.getAttribute('position').array));
  assert.ok(fx.handle.projectLabels(hostile).every((label) => Number.isFinite(label.xPx) && Number.isFinite(label.yPx)));
});

test('a pose is matched to the graph by id, so its entry order does not matter', () => {
  const fx = drawFixture(VIEWPORTS.wide, 0.7);
  const pose = restPose(fx.graph, 'wide', 0.7);
  const roles = drawnByRole(fx);
  const snapshot = () => [
    Array.from(roles.nodes.instanceMatrix.array),
    Array.from(roles.paths.geometry.getAttribute('position').array),
  ];
  fx.handle.render(pose);
  const ordered = snapshot();
  fx.handle.render({ ...pose, nodes: [...pose.nodes].reverse(), edges: [...pose.edges].reverse() });
  assert.deepEqual(snapshot(), ordered);
});

// --- budgets and the scheduler -----------------------------------------------------------------------------

test('drawables stay within 28 on wide and tablet and 18 on compact, even with every connection mid-growth', () => {
  const budgets = [[VIEWPORTS.wide, 28], [VIEWPORTS.tablet, 28], [VIEWPORTS.compact, 18]];
  for (const [viewport, budget] of budgets) {
    const fx = createFixture({ viewport });
    fx.handle.resize(viewport, fx.graph);
    const base = restPose(fx.graph, viewport.tier, 0);
    const poses = [
      base,
      restPose(fx.graph, viewport.tier, 0.5),
      restPose(fx.graph, viewport.tier, 1),
      { ...base, edges: base.edges.map((edge) => ({ ...edge, growth: 0.5 })) },
    ];
    for (const pose of poses) {
      fx.handle.render(pose);
      const { drawables, drawCalls } = fx.handle.diagnostics();
      assert.ok(drawables <= budget, `${viewport.tier}: ${drawables} drawables exceeds ${budget}`);
      assert.ok(drawCalls <= budget, `${viewport.tier}: ${drawCalls} fake draw calls exceeds ${budget}`);
      assert.equal(drawCalls, drawables);
    }
  }
});

test('the engine schedules nothing of its own: no timer, frame, idle callback, microtask or animation loop', () => {
  const names = ['setTimeout', 'setInterval', 'setImmediate', 'requestAnimationFrame', 'cancelAnimationFrame', 'requestIdleCallback', 'queueMicrotask'];
  const calls = [];
  const originals = new Map();
  for (const name of names) {
    originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, {
      configurable: true,
      writable: true,
      value: (...args) => {
        calls.push(name);
        return originals.get(name)?.value?.(...args);
      },
    });
  }
  let fx;
  try {
    fx = createFixture();
    fx.handle.resize(VIEWPORTS.wide, fx.graph);
    for (let step = 0; step <= 4; step += 1) fx.handle.render(restPose(fx.graph, 'wide', step / 4));
    fx.handle.projectLabels(restPose(fx.graph, 'wide', 0.5));
    fx.handle.resize(VIEWPORTS.compact, getConnectedGraph('compact'));
    fx.handle.render(restPose(getConnectedGraph('compact'), 'compact', 0.5));
    fx.handle.diagnostics();
    fx.canvas.dispatch('webglcontextlost');
    fx.handle.dispose();
  } finally {
    for (const name of names) {
      const original = originals.get(name);
      if (original) Object.defineProperty(globalThis, name, original);
      else delete globalThis[name];
    }
  }
  assert.deepEqual(calls, [], 'zero scheduler calls inside the engine');
  assert.equal(fx.state.animationLoops, 0, 'the renderer animation loop is never started');
});

// --- distant points fill the viewport ----------------------------------------------------------------------------

test('distant points are spread across the whole viewport at every aspect ratio', () => {
  const viewports = [VIEWPORTS.wide, VIEWPORTS.tablet, VIEWPORTS.compact, { width: 2560, height: 1080, pixelRatio: 1, tier: 'wide' }];
  for (const viewport of viewports) {
    const fx = drawFixture(viewport);
    const camera = fx.state.lastCamera;
    const positions = drawnByRole(fx).points.geometry.getAttribute('position');
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let index = 0; index < positions.count; index += 1) {
      const ndc = new Vector3(positions.getX(index), positions.getY(index), positions.getZ(index)).project(camera);
      assert.ok(ndc.x >= -1 && ndc.x <= 1 && ndc.y >= -1 && ndc.y <= 1, `${viewport.width}px: every point is inside the viewport`);
      minX = Math.min(minX, ndc.x);
      maxX = Math.max(maxX, ndc.x);
      minY = Math.min(minY, ndc.y);
      maxY = Math.max(maxY, ndc.y);
    }
    assert.ok(minX < -0.8 && maxX > 0.8 && minY < -0.8 && maxY > 0.8, `${viewport.width}px: the points reach every edge region (${minX}, ${maxX}, ${minY}, ${maxY})`);
  }
});

// --- the canvas is decorative -----------------------------------------------------------------------------------

test('the canvas is decorative, unfocusable, pointer-inert and fills its mount whatever the pixel ratio', () => {
  const fx = drawFixture({ ...VIEWPORTS.compact, pixelRatio: 3 });
  assert.equal(fx.canvas.attributes['aria-hidden'], 'true');
  assert.equal(fx.canvas.attributes.tabindex, '-1');
  const style = fx.canvas.style.cssText.replace(/\s+/g, '');
  assert.match(style, /pointer-events:none/);
  assert.match(style, /width:100%/);
  assert.match(style, /height:100%/, 'the backing store is sized by the pixel ratio, the box by CSS');
  assert.match(style, /position:absolute/);
  assert.equal(fx.mount.children[0], fx.canvas);
});
