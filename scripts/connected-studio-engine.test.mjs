import test from 'node:test';
import assert from 'node:assert/strict';
import { BufferGeometry, InstancedMesh, Material, Matrix4, Texture, Vector3 } from 'three';

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

function createFakeCanvas(behavior = {}) {
  const listeners = new Map();
  const canvas = {
    style: { cssText: '' },
    attributes: {},
    parent: null,
    removals: 0,
    setAttribute(name, value) {
      if (behavior.setAttributeThrows) throw new Error('canvas attribute refused');
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

/** `appendThrows` refuses outright; `attachThenThrows` models a DOM that adopts the node and then fails. */
function createFakeMount(behavior = {}) {
  return {
    children: [],
    appendChild(node) {
      if (behavior.appendThrows) throw new Error('mount refused the canvas');
      node.parent = this;
      this.children.push(node);
      if (behavior.attachThenThrows) throw new Error('mount failed after adopting the canvas');
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
function createFixture({
  viewport = VIEWPORTS.wide,
  rendererBehavior = {},
  canvasBehavior = {},
  mountBehavior = {},
  onContextLost,
  graph: graphOverride,
  profile,
  omitWords = false,
  quality,
  rendererFails = false,
  expectFailure = false,
} = {}) {
  const canvas = createFakeCanvas(canvasBehavior);
  const mount = createFakeMount(mountBehavior);
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
    ...(omitWords ? {} : { words: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] }),
    ...(profile ? { profile } : {}),
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

/** The world matrices of every instance of the meshes tagged with `role`. */
function instancesOf(fx, role) {
  const instances = [];
  fx.state.lastScene.traverse((object) => {
    if (object.userData.connectedRole !== role) return;
    for (let index = 0; index < object.count; index += 1) {
      const matrix = new Matrix4();
      object.getMatrixAt(index, matrix);
      instances.push(matrix);
    }
  });
  return instances;
}

/** Every ring instance the scene draws, whichever instanced meshes hold them, as world matrices. */
const ringInstances = (fx) => instancesOf(fx, 'rings');

const translationOf = (matrix) => new Vector3().setFromMatrixPosition(matrix);

/** The unit normal of the plane an instance lies in (a flat disc or ring is built in its local XY plane). */
const planeNormal = (matrix) => new Vector3(0, 0, 1).transformDirection(matrix);

/** The ring instances centred on each node, in node order, found by position so no instance layout is assumed. */
function ringsByNode(fx) {
  const rings = ringInstances(fx);
  const nodes = drawnByRole(fx).nodes;
  const matrix = new Matrix4();
  return fx.graph.nodes.map((_, index) => {
    nodes.getMatrixAt(index, matrix);
    const centre = translationOf(matrix);
    return rings.filter((ring) => translationOf(ring).distanceTo(centre) < 1e-6);
  });
}

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

test('a wide scene batches 16 nodes, each a white dot with one ring and one bead, and 33 connections into a few drawables', () => {
  const fx = drawFixture(VIEWPORTS.wide);
  const roles = drawnByRole(fx);
  assert.equal(roles.nodes?.count, 16, 'sixteen white dots in one instanced mesh');
  assert.equal(roles.rings?.count, 16, 'one ring per node, with no second orbit');
  assert.equal(roles.beads?.count, 16, 'one bead riding each ring');
  assert.equal(roles.cores, undefined, 'the dot is the node: there is no separate core');
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

test('the compact scene is 8 nodes, 13 connections and one ring and bead per node', () => {
  const fx = drawFixture(VIEWPORTS.compact);
  const roles = drawnByRole(fx);
  assert.equal(roles.nodes?.count, 8);
  assert.equal(roles.rings?.count, 8, 'one ring per node');
  assert.equal(roles.beads?.count, 8);
  assert.equal(roles.paths?.userData.connections, 13);
  assert.equal(roles.skeleton?.userData.connections, 13);
  const { drawables } = fx.handle.diagnostics();
  assert.ok(drawables >= 6 && drawables <= 18, `a compact scene stays within 18 drawables, got ${drawables}`);
});

// --- the node look (owner direction, 2026-10-12: a simple white dot with an outer ring) ---------------------

test('on every tier a node is a flat white dot with one thin outer ring: no body sphere and no tilted orbit', () => {
  for (const viewport of [VIEWPORTS.wide, VIEWPORTS.tablet, VIEWPORTS.compact]) {
    const fx = drawFixture(viewport, 0.5);
    const roles = drawnByRole(fx);
    assert.equal(roles.nodes.geometry.type, 'CircleGeometry', `${viewport.tier}: the node is a flat disc`);
    assert.equal(roles.rings.geometry.type, 'RingGeometry', `${viewport.tier}: the ring is a flat annulus`);
    assert.equal(roles.beads.geometry.type, 'CircleGeometry', `${viewport.tier}: the bead is a flat disc`);
    assert.equal(roles.nodes.material.color.getHex(), 0xf9f6ee, `${viewport.tier}: the dot is the light Bone white`);
    fx.state.lastScene.traverse((object) => {
      // The tracer beads along the paths are small icosahedra by design; the node pieces must not be.
      if (!['nodes', 'rings', 'beads'].includes(object.userData.connectedRole)) return;
      assert.ok(!['IcosahedronGeometry', 'TorusGeometry', 'SphereGeometry'].includes(object.geometry.type), `${viewport.tier}: no ${object.geometry.type} in a node piece`);
    });
    ringsByNode(fx).forEach((rings, index) => assert.equal(rings.length, 1, `${viewport.tier} node ${index}: exactly one ring, centred on the node`));
    const { drawables, drawCalls } = fx.handle.diagnostics();
    assert.ok(drawables <= (viewport.tier === 'compact' ? 18 : 28), `${viewport.tier}: ${drawables} drawables stays inside its budget`);
    assert.equal(drawCalls, drawables);
  }
});

test('the dot is about a third of the ring radius and the ring is thin, so it reads as a conventional graph node', () => {
  const fx = drawFixture(VIEWPORTS.wide);
  const { nodes, rings, beads } = drawnByRole(fx);
  const dot = nodes.geometry.parameters.radius;
  const { innerRadius, outerRadius } = rings.geometry.parameters;
  const centreline = (innerRadius + outerRadius) / 2;
  assert.ok(dot / centreline > 0.3 && dot / centreline < 0.45, `the dot is ${(dot / centreline).toFixed(2)} of the ring radius`);
  assert.ok((outerRadius - innerRadius) / outerRadius < 0.12, 'the ring is a thin line, not a band');
  assert.ok(beads.geometry.parameters.radius < dot * 0.6, 'the bead is smaller than the dot');
});

test('every dot and ring faces the camera, so a ring reads as a circle across the whole viewport', async () => {
  const { CAMERA_Z } = await import('../components/connected-studio/runtime/connected-geometry.ts');
  for (const viewport of [VIEWPORTS.wide, VIEWPORTS.compact]) {
    const fx = drawFixture(viewport, 0.5);
    const nodes = instancesOf(fx, 'nodes');
    const rings = ringsByNode(fx);
    nodes.forEach((dot, index) => {
      const centre = translationOf(dot);
      const towardCamera = new Vector3(0, 0, CAMERA_Z).sub(centre).normalize();
      assert.ok(planeNormal(dot).dot(towardCamera) > 0.99999, `${viewport.tier} node ${index}: the dot faces the camera`);
      assert.ok(planeNormal(rings[index][0]).dot(towardCamera) > 0.99999, `${viewport.tier} node ${index}: the ring faces the camera`);
    });
  }
});

function turnedPose(pose, angle) {
  return { ...pose, nodes: pose.nodes.map((node) => ({ ...node, rotation: [0, angle, 0] })) };
}

test('the bead rides the ring and turns with the rotation angle, the slow rotation the design asks for', async () => {
  const { RING_RADIUS } = await import('../components/connected-studio/runtime/connected-geometry.ts');
  const fx = drawFixture(VIEWPORTS.wide, 0.5);
  const base = restPose(fx.graph, 'wide', 0.5);
  const beadOffset = () => {
    const dot = instancesOf(fx, 'nodes')[0];
    const ring = ringsByNode(fx)[0][0];
    const bead = instancesOf(fx, 'beads')[0];
    return { offset: translationOf(bead).sub(translationOf(dot)), ringRadius: RING_RADIUS * ring.getMaxScaleOnAxis(), normal: planeNormal(ring) };
  };
  fx.handle.render(turnedPose(base, 0.2));
  const first = beadOffset();
  assert.ok(Math.abs(first.offset.length() - first.ringRadius) < 1e-6, `the bead sits on the ring (distance ${first.offset.length()}, ring ${first.ringRadius})`);
  assert.ok(Math.abs(first.offset.dot(first.normal)) < 1e-6, 'the bead lies in the ring plane');
  fx.handle.render(turnedPose(base, 0.7));
  const second = beadOffset();
  assert.ok(Math.abs(second.offset.length() - second.ringRadius) < 1e-6);
  const turned = first.offset.angleTo(second.offset);
  assert.ok(Math.abs(turned - 0.5) < 1e-6, `half a radian of rotation moves the bead half a radian round the ring (got ${turned})`);
});

test('the ring, dot and bead follow a moving node and settle back when it returns, and no other node\'s pieces move', () => {
  const fx = drawFixture(VIEWPORTS.wide, 1);
  const base = restPose(fx.graph, 'wide', 1);
  const snapshot = () => ['nodes', 'rings', 'beads'].map((role) => instancesOf(fx, role).map((matrix) => Array.from(matrix.elements)));
  const before = snapshot();

  fx.handle.render(movedPose(base, fx.graph.nodes[0].id, [0.6, -0.4, 0.3]));
  const centre = translationOf(instancesOf(fx, 'nodes')[0]);
  assert.ok(translationOf(ringsByNode(fx)[0][0]).distanceTo(centre) < 1e-6, 'the ring is centred on the node at its new position');
  const after = snapshot();
  after.forEach((matrices, role) => {
    assert.notDeepEqual(matrices[0], before[role][0], 'the moved node\'s piece moved');
    assert.deepEqual(matrices.slice(1), before[role].slice(1), 'every other node keeps its pieces');
  });

  fx.handle.render(base);
  assert.deepEqual(snapshot(), before, 'returning the node restores every piece exactly');
});

test('every ring instance is released exactly once, with the GPU copy', () => {
  const fx = drawFixture(VIEWPORTS.wide);
  const ringMeshes = [];
  fx.state.lastScene.traverse((object) => {
    if (object.userData.connectedRole === 'rings') ringMeshes.push(object);
  });
  assert.ok(ringMeshes.length >= 1 && ringMeshes.every((mesh) => fx.state.gpu.instanced.has(mesh)), 'the renderer holds every ring mesh');
  assert.equal(ringMeshes.reduce((total, mesh) => total + mesh.count, 0), 16);
  fx.handle.dispose();
  for (const mesh of ringMeshes) {
    assert.equal(fx.state.gpu.instanced.has(mesh), false, 'no ring mesh stays on the GPU');
    assert.equal(fx.state.disposeEvents.get(mesh), 1, 'each ring mesh is released exactly once');
  }
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

// --- resize failure containment -------------------------------------------------------------------------------

/** Every resource that exists after the fixture's own disposal must have been released once, and none left on the GPU. */
function assertEverythingReleasedOnce(fx, watch) {
  fx.handle.dispose();
  for (const resource of watch.created) {
    assert.equal(watch.disposed.get(resource), 1, `${resource.constructor.name} is released exactly once`);
  }
  for (const [resource, events] of fx.state.disposeEvents) assert.equal(events, 1, `${resource.constructor.name} released once on the GPU`);
  for (const kind of ['geometry', 'material', 'texture', 'instanced']) assert.equal(fx.state.gpu[kind].size, 0, `no ${kind} stays on the GPU`);
}

test('a renderer that fails while sizing is contained: the host hears one loss, and nothing is drawn or retried after it', () => {
  for (const method of ['setPixelRatio', 'setSize']) {
    const fx = drawFixture(VIEWPORTS.wide);
    const watch = watchThreeResources();
    try {
      let attempts = 0;
      fx.fake.renderer[method] = () => {
        attempts += 1;
        throw new Error(`GPU ${method} failed`);
      };
      assert.doesNotThrow(() => fx.handle.resize({ ...VIEWPORTS.wide, width: 1200, height: 800 }, fx.graph), `${method} failing never reaches the reader`);
      assert.equal(fx.lost.count, 1, `${method}: the host learns that the GPU path is unusable, once`);
      assert.equal(attempts, 1, `${method}: the failed operation is attempted once`);

      const rendersBefore = fx.state.renders;
      assert.doesNotThrow(() => fx.handle.render(restPose(fx.graph, 'wide', 0.5)));
      assert.equal(fx.state.renders, rendersBefore, `${method}: a scene that failed to size is never drawn again`);
      assert.equal(fx.lost.count, 1, `${method}: still one loss`);
      assert.equal(fx.handle.projectLabels(restPose(fx.graph, 'wide', 0.5)).length, 16, 'projection needs no GPU and keeps working');
      assertEverythingReleasedOnce(fx, watch);
    } finally {
      watch.stop();
    }
  }
});

test('once the scene is lost, resize does no renderer work and allocates nothing', () => {
  const fx = drawFixture(VIEWPORTS.compact);
  fx.canvas.dispatch('webglcontextlost');
  assert.equal(fx.lost.count, 1);
  const before = { sizes: fx.state.setSize.length, ratios: fx.state.setPixelRatio.length, counts: fx.handle.diagnostics() };
  const watch = watchThreeResources();
  try {
    assert.doesNotThrow(() => fx.handle.resize(VIEWPORTS.compact, fx.graph), 'a same-graph resize');
    assert.doesNotThrow(() => fx.handle.resize(VIEWPORTS.wide, getConnectedGraph('wide')), 'a resize that would rebuild the graph');
    assert.equal(watch.created.size, 0, 'a lost scene allocates no resource, not even to replace its graph');
  } finally {
    watch.stop();
  }
  assert.equal(fx.state.setSize.length, before.sizes, 'no later resize reaches setSize');
  assert.equal(fx.state.setPixelRatio.length, before.ratios, 'no later resize reaches setPixelRatio');
  const after = fx.handle.diagnostics();
  assert.deepEqual(
    { geometries: after.geometries, materials: after.materials, textures: after.textures },
    { geometries: before.counts.geometries, materials: before.counts.materials, textures: before.counts.textures },
    'the scene still owns exactly what it owned when it was lost',
  );
  assert.equal(fx.lost.count, 1, 'still one loss');
  fx.handle.dispose();
  for (const [resource, events] of fx.state.disposeEvents) assert.equal(events, 1, `${resource.constructor.name} released once`);
});

function unplaceableGraph(quality) {
  const graph = getConnectedGraph(quality);
  return { ...graph, nodes: graph.nodes.map((node, index) => (index === graph.nodes.length - 1 ? { ...node, anchor: null } : node)) };
}

test('a rebuilt graph that cannot be laid out is contained: one loss, the half-swapped graph is released and the running scene stays whole', () => {
  const fx = drawFixture(VIEWPORTS.compact);
  const before = fx.handle.diagnostics();
  const sizes = fx.state.setSize.length;
  const watch = watchThreeResources();
  try {
    assert.doesNotThrow(() => fx.handle.resize(VIEWPORTS.tablet, unplaceableGraph('wide')), 'a layout failure never reaches the reader');
    assert.ok(watch.created.size > 0, 'the rebuild did start allocating');
    for (const resource of watch.created) {
      assert.equal(watch.disposed.get(resource), 1, `${resource.constructor.name} of the rejected graph is released exactly once`);
    }
    assert.equal(fx.lost.count, 1, 'the host learns that the scene cannot follow the viewport, once');
    assert.equal(fx.state.setSize.length, sizes, 'the renderer was not resized to a layout that does not exist');
    const after = fx.handle.diagnostics();
    assert.deepEqual(
      { geometries: after.geometries, materials: after.materials, textures: after.textures },
      { geometries: before.geometries, materials: before.materials, textures: before.textures },
      'the scene still owns exactly the previous graph, not a mixture',
    );
    assert.equal(fx.handle.projectLabels(restPose(fx.graph, 'compact', 0.5)).length, 8, 'the previous graph still projects');
    for (const resource of fx.state.gpu.geometry) assert.equal(watch.disposed.has(resource), false, 'no live GPU resource was disposed by the failed swap');

    watch.created.clear();
    assert.doesNotThrow(() => fx.handle.resize(VIEWPORTS.tablet, getConnectedGraph('wide')));
    assert.equal(watch.created.size, 0, 'a lost scene allocates nothing afterwards');
  } finally {
    watch.stop();
  }
  assert.equal(fx.state.setSize.length, sizes, 'no renderer work after the loss');
  fx.handle.dispose();
  for (const [resource, events] of fx.state.disposeEvents) assert.equal(events, 1, `${resource.constructor.name} released once`);
  for (const kind of ['geometry', 'material', 'texture', 'instanced']) assert.equal(fx.state.gpu[kind].size, 0, `no ${kind} stays on the GPU`);
});

test('a renderer that fails sizing while a graph swap is pending releases the unswapped graph and the running one exactly once', () => {
  const fx = drawFixture(VIEWPORTS.compact);
  const compactResources = new Set([...fx.state.gpu.geometry, ...fx.state.gpu.material, ...fx.state.gpu.texture, ...fx.state.gpu.instanced]);
  const watch = watchThreeResources();
  try {
    fx.fake.renderer.setSize = () => {
      throw new Error('GPU setSize failed');
    };
    assert.doesNotThrow(() => fx.handle.resize(VIEWPORTS.tablet, getConnectedGraph('wide')));
    assert.ok(watch.created.size > 0, 'the wide graph was built beside the compact one');
    assert.equal(fx.lost.count, 1);
    for (const resource of watch.created) {
      assert.equal(watch.disposed.get(resource), 1, `${resource.constructor.name} of the unswapped graph is released exactly once`);
    }
    assert.doesNotThrow(() => fx.handle.render(restPose(fx.graph, 'compact', 0.5)));
    assertEverythingReleasedOnce(fx, watch);
    for (const resource of compactResources) assert.equal(fx.state.disposeEvents.get(resource), 1, 'the running graph is released once');
  } finally {
    watch.stop();
  }
});

test('a host that throws and disposes re-entrantly from the loss callback during a failed resize releases everything once', () => {
  let fx;
  let calls = 0;
  fx = createFixture({
    onContextLost() {
      calls += 1;
      fx.handle.dispose();
      throw new Error('host callback failed');
    },
  });
  fx.handle.resize(VIEWPORTS.wide, fx.graph);
  fx.handle.render(restPose(fx.graph, 'wide', 0.5));
  const watch = watchThreeResources();
  try {
    fx.fake.renderer.setSize = () => {
      throw new Error('GPU setSize failed');
    };
    assert.doesNotThrow(() => fx.handle.resize(VIEWPORTS.tablet, unplaceableGraph('wide')), 'neither the failure nor the callback reaches the reader');
    assert.equal(calls, 1, 'the callback ran exactly once');
    assert.equal(fx.handle.diagnostics().disposed, true);
    assert.doesNotThrow(() => fx.handle.resize(VIEWPORTS.wide, fx.graph));
    assert.doesNotThrow(() => fx.handle.dispose());
    assert.equal(calls, 1, 'and never again');
    assert.equal(fx.state.dispose, 1, 'disposed once from inside the callback');
    for (const resource of watch.created) assert.equal(watch.disposed.get(resource), 1, `${resource.constructor.name} of the rejected graph released once`);
  } finally {
    watch.stop();
  }
  for (const [resource, events] of fx.state.disposeEvents) assert.equal(events, 1, `${resource.constructor.name} released once on the GPU`);
  for (const kind of ['geometry', 'material', 'texture', 'instanced']) assert.equal(fx.state.gpu[kind].size, 0, `no ${kind} stays on the GPU`);
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

/** Builds with the failure injected and asserts that the failed construction left nothing behind. */
function assertLateFailureLeavesNothing(options) {
  const watch = watchThreeResources();
  let fx;
  try {
    fx = createFixture({ ...options, expectFailure: true });
    assert.ok(watch.created.size > 0, 'the graph was fully built before the late failure');
    for (const resource of watch.created) {
      assert.equal(watch.disposed.get(resource), 1, `${resource.constructor.name} built before the late failure is released exactly once`);
    }
  } finally {
    watch.stop();
  }
  assert.ok(fx.error instanceof Error, 'construction reports a plain Error the host can catch');
  assert.match(fx.error.message, /connected-studio: scene initialization failed/, 'the documented wrapped initialization error');
  assert.equal(fx.state.renderListsDisposed, 1, 'render lists are cleared once');
  assert.equal(fx.state.dispose, 1, 'the renderer is disposed once');
  assert.equal(fx.state.forceContextLoss, 1, 'the context is released once');
  assert.equal(fx.canvas.listenerCount('webglcontextlost'), 0, 'no context-loss listener is retained');
  assert.equal(fx.mount.children.length, 0, 'the mount owns nothing');
  assert.equal(fx.canvas.parent, null, 'the canvas is detached');
  assert.ok(fx.canvas.removals >= 1, 'the canvas is removed');
  assert.equal(fx.lost.count, 0, 'an init failure is not a context loss');
  fx.canvas.dispatch('webglcontextlost');
  assert.equal(fx.lost.count, 0, 'a loss event after the failed construction reaches nobody');
  return fx;
}

test('a mount that refuses the canvas fails construction with every resource, the renderer, its context and the listener released', () => {
  assertLateFailureLeavesNothing({ mountBehavior: { appendThrows: true } });
});

test('a mount that adopts the canvas and then fails still ends with the canvas removed and nothing retained', () => {
  const fx = assertLateFailureLeavesNothing({ mountBehavior: { attachThenThrows: true } });
  assert.equal(fx.mount.children.includes(fx.canvas), false, 'the half-attached canvas is gone from the mount');
});

test('a graph that cannot be laid out after the canvas is attached releases the attached canvas, its listener and everything built', () => {
  const wide = getConnectedGraph('wide');
  const unplaceable = { ...wide, nodes: wide.nodes.map((node, index) => (index === wide.nodes.length - 1 ? { ...node, anchor: null } : node)) };
  assertLateFailureLeavesNothing({ graph: unplaceable });
});

test('a canvas that refuses its decoration fails construction with the documented error before any context exists', () => {
  const watch = watchThreeResources();
  let fx;
  try {
    fx = createFixture({ canvasBehavior: { setAttributeThrows: true }, expectFailure: true });
    assert.equal(watch.created.size, 0, 'no resource was built for a canvas that cannot be prepared');
  } finally {
    watch.stop();
  }
  assert.ok(fx.error instanceof Error, 'construction reports an Error the host can catch');
  assert.match(fx.error.message, /connected-studio: scene initialization failed/, 'the documented wrapped initialization error, not the raw DOM error');
  assert.equal(fx.factories.created.renderers, 0, 'no renderer or context was created');
  assert.equal(fx.mount.children.length, 0);
  assert.equal(fx.canvas.listenerCount('webglcontextlost'), 0);
});

test('a renderer that fails part-way through its own initialization still gives its acquired context back', () => {
  // The default factory acquires the WebGL2 context first and then hands it to three. A context that three
  // cannot finish initializing on (this one has none of the GL surface) is already allocated by then.
  const calls = { contexts: [], loseContext: 0 };
  const context = {
    getExtension(name) {
      return name === 'WEBGL_lose_context' ? { loseContext: () => (calls.loseContext += 1) } : null;
    },
  };
  const canvas = createFakeCanvas();
  canvas.getContext = (type) => (calls.contexts.push(type), context);
  const mount = createFakeMount();
  const graph = getConnectedGraph('wide');
  const hadDocument = 'document' in globalThis;
  globalThis.document = { createElement: () => canvas };
  try {
    assert.throws(
      () => createConnectedScene({ mount, graph, quality: 'wide', tier: 'wide', words: [], onContextLost() {} }),
      /connected-studio: scene initialization failed \(no renderer\)/,
    );
  } finally {
    if (!hadDocument) delete globalThis.document;
  }
  assert.deepEqual(calls.contexts, ['webgl2'], 'the default factory did acquire a context');
  assert.equal(calls.loseContext, 1, 'the context three could not finish initializing on is released once');
  assert.equal(mount.children.length, 0);
  assert.equal(canvas.listenerCount('webglcontextlost'), 0);
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
  for (const role of ['nodes', 'rings', 'beads']) assert.ok(finite(roles[role].instanceMatrix.array), `${role} matrices are finite`);
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

// SPF-T8-02: compare real drawn geometry/camera with the poster capture's CSS cover transform.
function screenPoint(fx, point) {
  const ndc = point.clone().project(fx.state.lastCamera);
  return { x: (ndc.x + 1) * fx.viewport.width / 2, y: (1 - ndc.y) * fx.viewport.height / 2 };
}
function posterPose(graph, tier, blend = 1) {
  return { ...sampleConnectedPose({ progress: 0.6, idleAngleRadians: 0.5, scrollActivity: 0, nodes: [], edges: [] },
    { graph, tier, progress: 0.6, velocityPxPerSecond: 0, deltaSeconds: 0 }), posterBlend: blend };
}
for (const viewport of [VIEWPORTS.wide, { width: 768, height: 1024, pixelRatio: 1, tier: 'tablet' },
  { width: 390, height: 844, pixelRatio: 1, tier: 'compact' }, { width: 320, height: 800, pixelRatio: 1, tier: 'compact' }]) {
  test('first live frame matches poster nodes, rings and paths at ' + viewport.width + 'x' + viewport.height, () => {
    const capture = viewport.tier === 'compact' ? { width: 450, height: 800, pixelRatio: 2, tier: 'compact' }
      : { width: 1920, height: 1080, pixelRatio: 1, tier: 'wide' };
    const source = createFixture({ viewport: capture });
    source.handle.resize(capture, source.graph);
    source.handle.render(posterPose(source.graph, capture.tier, 0));
    const fx = createFixture({ viewport });
    fx.handle.resize(viewport, fx.graph);
    fx.handle.render(posterPose(fx.graph, viewport.tier));
    const scale = Math.max(viewport.width / capture.width, viewport.height / capture.height);
    const expected = point => { const xy = screenPoint(source, point); return {
      x: xy.x * scale + (viewport.width - capture.width * scale) * 0.7,
      y: xy.y * scale + (viewport.height - capture.height * scale) * 0.3 }; };
    const check = (actual, wanted, label) => assert.ok(Math.hypot(actual.x - wanted.x, actual.y - wanted.y) < 0.002,
      label + ': expected ' + JSON.stringify(wanted) + ', got ' + JSON.stringify(actual));
    for (const role of ['nodes', 'rings', 'beads']) {
      const base = instancesOf(source, role), drawn = instancesOf(fx, role);
      drawn.forEach((matrix, index) => {
        check(screenPoint(fx, translationOf(matrix)), expected(translationOf(base[index])), role + ' centre ' + index);
        // Also compare a point on the drawable: matching centres alone would miss a size/orientation jump.
        const local = new Vector3(0.14, 0.08, 0);
        check(screenPoint(fx, local.clone().applyMatrix4(matrix)), expected(local.clone().applyMatrix4(base[index])), role + ' size ' + index);
      });
    }
    for (const role of ['paths', 'skeleton', 'points']) {
      const base = drawnByRole(source)[role].geometry.getAttribute('position');
      const drawn = drawnByRole(fx)[role].geometry.getAttribute('position');
      for (let index = 0; index < drawn.count; index += 17)
        check(screenPoint(fx, new Vector3().fromBufferAttribute(drawn, index)), expected(new Vector3().fromBufferAttribute(base, index)), role + ' vertex ' + index);
    }
    assert.ok(Math.abs(drawnByRole(fx).points.material.size - drawnByRole(source).points.material.size * scale) < 1e-9, 'distant point sizes also follow the poster cover scale');
    const labels = fx.handle.projectLabels(posterPose(fx.graph, viewport.tier));
    const sourceLabels = source.handle.projectLabels(posterPose(source.graph, capture.tier, 0));
    labels.forEach((label, index) => check({ x: label.xPx, y: label.yPx }, {
      x: sourceLabels[index].xPx * scale + (viewport.width - capture.width * scale) * 0.7,
      y: (sourceLabels[index].yPx - 6) * scale + (viewport.height - capture.height * scale) * 0.3 + 6,
    }, 'label anchor ' + index));
    // During the settle the label's bottom-of-ring anchor must still follow actual drawn geometry.
    fx.handle.render(posterPose(fx.graph, viewport.tier, 0.5));
    const halfway = fx.handle.projectLabels(posterPose(fx.graph, viewport.tier, 0.5));
    instancesOf(fx, 'rings').forEach((matrix, index) => {
      const centre = screenPoint(fx, translationOf(matrix));
      check({ x: halfway[index].xPx, y: centre.y }, centre, 'settling label centre ' + index);
      assert.ok(halfway[index].yPx > centre.y + 6 && halfway[index].yPx < centre.y + 90, 'settling label stays below its ring');
      assert.equal(halfway[index].inView, centre.x >= 0 && centre.x <= viewport.width && centre.y >= 0 && centre.y <= viewport.height);
    });
    fx.handle.render(posterPose(fx.graph, viewport.tier, 0));
    const native = createFixture({ viewport }); native.handle.resize(viewport, native.graph);
    native.handle.render(posterPose(native.graph, viewport.tier, 0));
    assert.deepEqual(instancesOf(fx, 'nodes').map(m => Array.from(m.elements)), instancesOf(native, 'nodes').map(m => Array.from(m.elements)), 'after settling normal responsive geometry is restored');
    assert.deepEqual(fx.state.lastCamera.position.toArray(), [0, 0, 12], 'the camera does not move');
    assert.equal(fx.handle.diagnostics().drawCalls, source.handle.diagnostics().drawCalls, 'no second graph or extra draws');
    source.handle.dispose(); fx.handle.dispose(); native.handle.dispose();
  });
}

// --- PLAN-SFC-V1 Task 8: pooled flexible paths, the pure projection seam and the gated entry --------------------

const { getConnectedProfile } = await import('../lib/connected-studio/profiles.ts');
const { anchorToScene, computeProjectionLayout, projectAnchor } = await import('../lib/connected-studio/projection.ts');
const { evaluateRestEdge } = await import('../lib/connected-studio/rest-path.ts');
const gatedEntry = await import('../components/connected-studio/runtime/create-connected-scene.ts');

const HALF_FOV_TAN = Math.tan((35 * Math.PI) / 360);
const RING_COUNT = 13; // twelve segments
const SIDES = 5;

function atlasFixture(route = 'studio', viewport = VIEWPORTS.wide, extra = {}) {
  const profile = getConnectedProfile(route, viewport.tier, viewport);
  const fx = createFixture({ viewport, graph: profile.graph, profile, omitWords: true, ...extra });
  fx.handle.resize(viewport, profile.graph);
  return { fx, profile, viewport, layout: computeProjectionLayout(profile, viewport) };
}

/** An Atlas pose at the rest anchors; `positions` displaces nodes, `samples` supplies the strings, growth defaults to full. */
function atlasPose(profile, layout, { positions = new Map(), growth = 1, samples } = {}) {
  const nodes = profile.graph.nodes.map((node) => ({ id: node.id, position: positions.get(node.id) ?? node.anchor, rotation: [0, 0, 0], scale: node.depthScale }));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const edges = profile.graph.edges.map((edge, index) => ({ id: edge.id, growth: typeof growth === 'function' ? growth(edge, index) : growth }));
  const edgeSamples = [];
  profile.graph.edges.forEach((edge, index) => {
    const points = samples?.({ edge, index, from: byId.get(edge.from).position, to: byId.get(edge.to).position });
    if (points) edgeSamples.push({ id: edge.id, points });
  });
  return { progress: 1, idleAngleRadians: 0, scrollActivity: 0, nodes, edges, projectionLayout: layout, ...(edgeSamples.length ? { edgeSamples } : {}) };
}

const restOf = (profile, layout, index, from, to, s) => evaluateRestEdge({ nodeStyle: profile.nodeStyle, edgeIndex: index, from, to, layout }, s);
const sevenRest = (profile, layout, index, from, to) => Array.from({ length: 7 }, (_, j) => restOf(profile, layout, index, from, to, j / 6));
const pxToAnchorY = (layout, z, px) => px / (layout.height / 2 / (HALF_FOV_TAN * (12 - z)));

/** Bends the interior samples by `pxFor(j)` CSS px in the picture plane; the two ends stay pinned. */
function bentSamples(profile, layout, edgeIndex, pxFor) {
  return ({ index, from, to }) => (index === edgeIndex
    ? sevenRest(profile, layout, index, from, to).map((point, j) => (j === 0 || j === 6 ? point : [point[0], point[1] - pxToAnchorY(layout, point[2], pxFor(j)), point[2]]))
    : undefined);
}

/** The edge's longest rest chord, so a bend is plainly visible. */
function longestEdge(profile) {
  const nodes = new Map(profile.graph.nodes.map((node) => [node.id, node.anchor]));
  let best = 0;
  let bestLength = -1;
  profile.graph.edges.forEach((edge, index) => {
    const from = nodes.get(edge.from);
    const to = nodes.get(edge.to);
    const length = Math.hypot(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
    if (length > bestLength) [best, bestLength] = [index, length];
  });
  return best;
}

/** The centre of tube ring `ring` of an edge's block: the five side vertices average to the centreline point. */
function ringCentre(block, ring) {
  const centre = [0, 0, 0];
  for (let side = 0; side < SIDES; side += 1) {
    for (let axis = 0; axis < 3; axis += 1) centre[axis] += block[(ring * SIDES + side) * 3 + axis] / SIDES;
  }
  return centre;
}

function assertNear(actual, expected, tolerance, label) {
  expected.forEach((value, axis) => assert.ok(Math.abs(actual[axis] - value) <= tolerance, `${label} axis ${axis}: ${actual[axis]} vs ${value} (tolerance ${tolerance})`));
}

/** The worst CSS distance between an edge's drawn ring centres and its rest path at the same parameter. */
function worstDeviationPx(block, profile, layout, pose, edgeIndex) {
  const edge = profile.graph.edges[edgeIndex];
  const from = pose.nodes.find((entry) => entry.id === edge.from).position;
  const to = pose.nodes.find((entry) => entry.id === edge.to).position;
  let worst = 0;
  for (let ring = 0; ring < RING_COUNT; ring += 1) {
    const drawn = ringCentre(block, ring);
    const actual = projectAnchor([drawn[0] / layout.spreadX, drawn[1] / layout.spreadY, drawn[2] / layout.depthScale], layout);
    const rest = projectAnchor(restOf(profile, layout, edgeIndex, from, to, ring / (RING_COUNT - 1)), layout);
    worst = Math.max(worst, Math.hypot(actual.xPx - rest.xPx, actual.yPx - rest.yPx));
  }
  return worst;
}

test('the gated entry reexports the pure profile, interaction and controller factories', () => {
  assert.equal(typeof gatedEntry.createConnectedScene, 'function');
  assert.equal(typeof gatedEntry.getConnectedProfile, 'function');
  assert.equal(typeof gatedEntry.createConnectedInteraction, 'function');
  assert.equal(typeof gatedEntry.createConnectedController, 'function');
  assert.equal(typeof gatedEntry.connectedProfileKit.createInteraction, 'function');
  assert.equal(typeof gatedEntry.connectedProfileKit.computeProjectionLayout, 'function');
  assert.equal(typeof gatedEntry.connectedProfileKit.resolvePosterProjection, 'function');
});

test('a profile scene, and a legacy scene, need no legacy words', () => {
  const { fx, profile, layout } = atlasFixture();
  assert.doesNotThrow(() => fx.handle.render(atlasPose(profile, layout)));
  const legacy = createFixture({ omitWords: true });
  assert.doesNotThrow(() => {
    legacy.handle.resize(legacy.viewport, legacy.graph);
    legacy.handle.render(restPose(legacy.graph, 'wide', 0.5));
  });
});

test('Atlas strings keep both ends on their nodes and pass through the five interior samples', () => {
  const { fx, profile, layout } = atlasFixture();
  const edgeIndex = longestEdge(profile);
  const pose = atlasPose(profile, layout, { samples: bentSamples(profile, layout, edgeIndex, (j) => 5 * (j % 2 ? 1 : -1)) });
  fx.handle.render(pose);
  const block = PATH_BLOCK(drawnByRole(fx).paths)(edgeIndex);
  const edge = profile.graph.edges[edgeIndex];
  const node = (id) => anchorToScene(pose.nodes.find((entry) => entry.id === id).position, layout);
  assertNear(ringCentre(block, 0), node(edge.from), 1e-5, 'ring 0 sits on the from node');
  assertNear(ringCentre(block, RING_COUNT - 1), node(edge.to), 1e-5, 'the last ring sits on the to node');
  const samples = pose.edgeSamples.find((entry) => entry.id === edge.id).points;
  for (let j = 1; j <= 5; j += 1) assertNear(ringCentre(block, 2 * j), anchorToScene(samples[j], layout), 1e-5, `interior sample ${j}`);
  assert.equal(block.length / 3, RING_COUNT * SIDES, 'twelve segments per connection');
});

test('the rendered string never leaves the CSS cap, even where the cubic would overshoot', () => {
  for (const [route, viewport] of [['studio', VIEWPORTS.wide], ['founder', VIEWPORTS.tablet], ['contact', VIEWPORTS.compact], ['contact', VIEWPORTS.wide]]) {
    const { fx, profile, layout } = atlasFixture(route, viewport);
    const cap = profile.input.edgeCapPx;
    const edgeIndex = longestEdge(profile);
    const pose = atlasPose(profile, layout, { samples: bentSamples(profile, layout, edgeIndex, (j) => cap * 3 * (j % 2 ? 1 : -1)) });
    fx.handle.render(pose);
    const worst = worstDeviationPx(PATH_BLOCK(drawnByRole(fx).paths)(edgeIndex), profile, layout, pose, edgeIndex);
    assert.ok(worst <= cap + 0.01, `${route} ${viewport.tier}: ring centres deviate ${worst}px against a ${cap}px cap`);
    assert.ok(worst >= cap * 0.9, `${route} ${viewport.tier}: a push far past the cap is rendered at the cap, got ${worst}px`);
    fx.handle.dispose();
  }
});

test('growth and the tracer ride the deformed string, not the rest path', () => {
  const { fx, profile, layout } = atlasFixture();
  const edgeIndex = longestEdge(profile);
  const pose = atlasPose(profile, layout, {
    growth: (_, index) => (index === edgeIndex ? 0.5 : 1),
    samples: bentSamples(profile, layout, edgeIndex, () => 8),
  });
  fx.handle.render(pose);
  const edge = profile.graph.edges[edgeIndex];
  const block = PATH_BLOCK(drawnByRole(fx).paths)(edgeIndex);
  const samples = pose.edgeSamples.find((entry) => entry.id === edge.id).points;
  const tip = anchorToScene(samples[3], layout);
  assertNear(ringCentre(block, 6), tip, 1e-5, 'the ring at half the length is the middle string sample');
  assertNear(ringCentre(block, 12), tip, 1e-5, 'rings beyond the grown length collapse onto the deformed tip');
  assertNear(ringCentre(block, 4), anchorToScene(samples[2], layout), 1e-5, 'a grown ring is on the deformed string');
  const tracers = sceneByRole(fx, 'tracers');
  assert.equal(tracers.count, 1, 'one connection is mid-growth');
  const matrix = new Matrix4();
  tracers.getMatrixAt(0, matrix);
  assertNear(translationOf(matrix).toArray(), tip, 1e-5, 'the tracer rides the deformed tip');
  const from = pose.nodes.find((entry) => entry.id === edge.from).position;
  const to = pose.nodes.find((entry) => entry.id === edge.to).position;
  const rest = anchorToScene(restOf(profile, layout, edgeIndex, from, to, 0.5), layout);
  assert.ok(Math.hypot(tip[0] - rest[0], tip[1] - rest[1]) > 0.01, 'the fixture really deforms the string');
});

test('coincident endpoints leave every buffer finite', () => {
  const { fx, profile, layout } = atlasFixture();
  const edge = profile.graph.edges[0];
  const target = profile.graph.nodes.find((node) => node.id === edge.from).anchor;
  const positions = new Map([[edge.to, target]]);
  for (const growth of [1, 0.5, 0]) {
    fx.handle.render(atlasPose(profile, layout, { positions, growth, samples: ({ from }) => Array.from({ length: 7 }, () => from) }));
    for (const role of ['paths', 'skeleton', 'nodes', 'rings', 'beads', 'tracers']) {
      const object = sceneByRole(fx, role);
      const values = object.isInstancedMesh ? object.instanceMatrix.array.slice(0, object.count * 16) : object.geometry.getAttribute('position').array;
      assert.ok(Array.from(values).every(Number.isFinite), `${role} stays finite at growth ${growth}`);
    }
  }
});

test('hostile string entries never produce non-finite geometry: NaN, unknown ids and missing points', () => {
  const { fx, profile, layout } = atlasFixture();
  const edges = profile.graph.edges;
  const anchorOf = (id) => profile.graph.nodes.find((node) => node.id === id).anchor;
  const rest = (index) => sevenRest(profile, layout, index, anchorOf(edges[index].from), anchorOf(edges[index].to));
  const hostile = {
    ...atlasPose(profile, layout),
    edgeSamples: [
      { id: edges[0].id, points: rest(0).map((p, j) => (j === 3 ? [Number.NaN, Number.POSITIVE_INFINITY, 0] : p)) },
      { id: 'no-such-edge', points: rest(1) },
      { id: edges[2].id, points: undefined },
    ],
  };
  assert.doesNotThrow(() => fx.handle.render(hostile));
  assert.equal(fx.lost.count, 0, 'a hostile string is not a lost context');
  assert.ok(Array.from(drawnByRole(fx).paths.geometry.getAttribute('position').array).every(Number.isFinite));
});

test('legacy connections without strings are exactly the SPF quadratic rest curve', () => {
  const fx = drawFixture(VIEWPORTS.wide, 1);
  fx.handle.render(movedPose(restPose(fx.graph, 'wide', 1), fx.graph.nodes[3].id, [0.5, -0.3, 0.2]));
  const nodes = drawnByRole(fx).nodes;
  const matrix = new Matrix4();
  const scenePosition = fx.graph.nodes.map((_, index) => (nodes.getMatrixAt(index, matrix), translationOf(matrix)));
  const nodeIndex = new Map(fx.graph.nodes.map((node, index) => [node.id, index]));
  const block = PATH_BLOCK(drawnByRole(fx).paths);
  fx.graph.edges.forEach((edge, index) => {
    const a = scenePosition[nodeIndex.get(edge.from)];
    const b = scenePosition[nodeIndex.get(edge.to)];
    const sign = ((((index + 1) * 2654435761) >>> 0) % 2) === 0 ? 1 : -1;
    const chord = b.clone().sub(a);
    const length = chord.length();
    const normal = new Vector3(-chord.y, chord.x, 0);
    if (normal.lengthSq() < 1e-12) normal.set(0, 1, 0);
    normal.normalize();
    const control = a.clone().add(b).multiplyScalar(0.5).addScaledVector(normal, 0.16 * length * sign);
    control.z += 0.16 * length * 0.35 * sign;
    for (const ring of [0, 3, 6, 9, 12]) {
      const u = ring / 12;
      const expected = a.clone().multiplyScalar((1 - u) ** 2).addScaledVector(control, 2 * (1 - u) * u).addScaledVector(b, u * u);
      assertNear(ringCentre(block(index), ring), expected.toArray(), 1e-4, `edge ${index} ring ${ring}`);
    }
  });
});

test('Atlas rest connections are straight', () => {
  const { fx, profile, layout } = atlasFixture();
  fx.handle.render(atlasPose(profile, layout));
  const block = PATH_BLOCK(drawnByRole(fx).paths);
  profile.graph.edges.forEach((edge, index) => {
    const from = ringCentre(block(index), 0);
    const to = ringCentre(block(index), RING_COUNT - 1);
    for (let ring = 1; ring < RING_COUNT - 1; ring += 1) {
      const u = ring / (RING_COUNT - 1);
      assertNear(ringCentre(block(index), ring), from.map((value, axis) => value + (to[axis] - value) * u), 1e-5, `edge ${index} ring ${ring}`);
    }
  });
});

test('strings reuse the pooled buffers: no new resources, draw calls or buffer objects across many frames', () => {
  const { fx, profile, layout } = atlasFixture();
  const edgeIndex = longestEdge(profile);
  const second = profile.graph.nodes[2];
  const framePose = (frame) => atlasPose(profile, layout, {
    growth: (_, index) => (index % 3 === 0 ? ((frame % 9) + 1) / 10 : 1),
    positions: new Map([[second.id, [second.anchor[0] + 0.01 * frame, second.anchor[1], second.anchor[2]]]]),
    samples: bentSamples(profile, layout, edgeIndex, (j) => 3 * Math.sin(frame + j)),
  });
  fx.handle.render(framePose(0));
  const first = fx.handle.diagnostics();
  const paths = drawnByRole(fx).paths;
  const array = paths.geometry.getAttribute('position').array;
  const sceneChildren = fx.state.lastScene.children.length;
  const gpuSizes = () => Object.fromEntries(Object.entries(fx.state.gpu).map(([kind, set]) => [kind, set.size]));
  const gpu = gpuSizes();
  for (let frame = 1; frame <= 60; frame += 1) fx.handle.render(framePose(frame));
  const last = fx.handle.diagnostics();
  assert.deepEqual(
    { geometries: last.geometries, materials: last.materials, textures: last.textures, drawables: last.drawables },
    { geometries: first.geometries, materials: first.materials, textures: first.textures, drawables: first.drawables },
  );
  assert.equal(last.renderCount, first.renderCount + 60);
  assert.ok(last.drawCalls <= 28, `draw calls stay within 28, got ${last.drawCalls}`);
  assert.ok(Math.abs(last.drawCalls - first.drawCalls) <= 1, 'only the tracer batch may join or leave the draw');
  assert.equal(drawnByRole(fx).paths, paths, 'the same path mesh');
  assert.equal(paths.geometry.getAttribute('position').array, array, 'the same position buffer, rewritten in place');
  assert.equal(fx.state.lastScene.children.length, sceneChildren);
  assert.deepEqual(gpuSizes(), gpu, 'the renderer holds no new GPU resource');
  assert.equal(fx.state.disposeEvents.size, 0, 'nothing was released or rebuilt while drawing');
});

test('repeated resize, render and dispose of an Atlas scene retain only what the scene needs', () => {
  const wide = atlasFixture('studio', VIEWPORTS.wide);
  const { fx } = wide;
  const compactProfile = getConnectedProfile('studio', 'compact', VIEWPORTS.compact);
  const compactLayout = computeProjectionLayout(compactProfile, VIEWPORTS.compact);
  const counts = [];
  for (let cycle = 0; cycle < 8; cycle += 1) {
    fx.handle.resize(VIEWPORTS.compact, compactProfile.graph, compactProfile);
    fx.handle.render(atlasPose(compactProfile, compactLayout));
    fx.handle.resize(VIEWPORTS.wide, wide.profile.graph, wide.profile);
    fx.handle.render(atlasPose(wide.profile, wide.layout));
    const d = fx.handle.diagnostics();
    counts.push({ geometries: d.geometries, materials: d.materials, textures: d.textures, gpu: Object.values(fx.state.gpu).map((set) => set.size).join() });
  }
  assert.deepEqual(counts.at(-1), counts[1], 'the eighth cycle retains exactly what the second did');
  fx.handle.dispose();
  for (const kind of ['geometry', 'material', 'texture', 'instanced']) assert.equal(fx.state.gpu[kind].size, 0, `no ${kind} survives disposal`);
  for (const [resource, events] of fx.state.disposeEvents) assert.equal(events, 1, `${resource.constructor.name} is released once`);
  assert.doesNotThrow(() => fx.handle.dispose());
  assert.doesNotThrow(() => fx.handle.render(atlasPose(wide.profile, wide.layout)));
});

test('a tier change with the new profile follows its CSS cap', () => {
  const wide = atlasFixture('studio', VIEWPORTS.wide);
  const compactProfile = getConnectedProfile('studio', 'compact', VIEWPORTS.compact);
  const compactLayout = computeProjectionLayout(compactProfile, VIEWPORTS.compact);
  wide.fx.handle.resize(VIEWPORTS.compact, compactProfile.graph, compactProfile);
  const edgeIndex = longestEdge(compactProfile);
  const pose = atlasPose(compactProfile, compactLayout, { samples: bentSamples(compactProfile, compactLayout, edgeIndex, (j) => 40 * (j % 2 ? 1 : -1)) });
  wide.fx.handle.render(pose);
  assert.equal(compactProfile.input.edgeCapPx, 6);
  const worst = worstDeviationPx(PATH_BLOCK(drawnByRole(wide.fx).paths)(edgeIndex), compactProfile, compactLayout, pose, edgeIndex);
  assert.ok(worst <= 6.01, `the compact cap of 6px holds, got ${worst}px`);
  assert.ok(worst >= 5.4, `and is reached, got ${worst}px`);
});

test('the renderer draws the frame the controller resolved and never applies a second poster transform', () => {
  const fx = createFixture();
  fx.handle.resize(fx.viewport, fx.graph);
  const native = computeProjectionLayout({ nodeStyle: 'legacy', graph: fx.graph }, fx.viewport);
  const base = restPose(fx.graph, 'wide', 0.6);
  fx.handle.render({ ...base, projectionLayout: native });
  const plain = instancesOf(fx, 'nodes').map((m) => Array.from(m.elements));
  const plainLabels = fx.handle.projectLabels({ ...base, projectionLayout: native });
  fx.handle.render({ ...base, projectionLayout: native, posterBlend: 1 });
  assert.deepEqual(instancesOf(fx, 'nodes').map((m) => Array.from(m.elements)), plain, 'a resolved frame is not blended with the poster again');
  assert.deepEqual(fx.handle.projectLabels({ ...base, projectionLayout: native, posterBlend: 1 }), plainLabels, 'nor are its labels');

  // A resolved frame the runtime could not have derived itself: scaled with a crop, as the poster settle produces.
  const frame = { ...native, width: native.width * 1.25, height: native.height * 1.25, crop: { x: 90, y: 40, width: native.width, height: native.height } };
  fx.handle.render({ ...base, projectionLayout: frame });
  instancesOf(fx, 'nodes').forEach((matrix, index) => {
    const wanted = projectAnchor(base.nodes[index].position, frame);
    const drawn = screenPoint(fx, translationOf(matrix));
    assert.ok(Math.hypot(drawn.x - wanted.xPx, drawn.y - wanted.yPx) < 0.01, `node ${index} is drawn where the resolved frame puts it`);
  });
  fx.handle.projectLabels({ ...base, projectionLayout: frame }).forEach((label, index) => {
    const wanted = projectAnchor(base.nodes[index].position, frame);
    assert.ok(Math.abs(label.xPx - wanted.xPx) < 1e-6 && label.yPx > wanted.yPx, `label ${index} follows the resolved frame`);
    assert.equal(label.inView, wanted.inView);
  });
});

test('an Atlas scene draws the specified 18px ring on wide', () => {
  const { fx, profile, layout } = atlasFixture();
  fx.handle.render(atlasPose(profile, layout));
  const rings = instancesOf(fx, 'rings');
  // The node nearest the view axis, where a ring turned to face the camera is least foreshortened.
  const nearest = profile.graph.nodes
    .map((node, index) => {
      const at = projectAnchor(node.anchor, layout);
      return [Math.hypot(at.xPx - layout.width / 2, at.yPx - layout.height / 2), index];
    })
    .sort((a, b) => a[0] - b[0])[0][1];
  const centre = screenPoint(fx, translationOf(rings[nearest]));
  const edge = screenPoint(fx, new Vector3(0.39, 0, 0).applyMatrix4(rings[nearest]));
  const diameter = 2 * Math.hypot(edge.x - centre.x, edge.y - centre.y);
  const expected = (18 * 12) / (12 - profile.graph.nodes[nearest].anchor[2]);
  assert.ok(Math.abs(diameter - expected) < 0.6, `the ring is ${diameter}px across, expected about ${expected}px`);
});

test('a tighter cap for the same graph is applied in place, without rebuilding any resource', () => {
  const { fx, profile, layout } = atlasFixture();
  const edgeIndex = longestEdge(profile);
  const pose = atlasPose(profile, layout, { samples: bentSamples(profile, layout, edgeIndex, (j) => 40 * (j % 2 ? 1 : -1)) });
  fx.handle.render(pose);
  const before = fx.handle.diagnostics();
  const tighter = { ...profile, input: { ...profile.input, edgeCapPx: 4 } };
  fx.handle.resize(VIEWPORTS.wide, profile.graph, tighter);
  fx.handle.render(pose);
  const after = fx.handle.diagnostics();
  assert.deepEqual({ geometries: after.geometries, materials: after.materials, textures: after.textures }, { geometries: before.geometries, materials: before.materials, textures: before.textures });
  assert.equal(fx.state.disposeEvents.size, 0, 'nothing was rebuilt');
  const worst = worstDeviationPx(PATH_BLOCK(drawnByRole(fx).paths)(edgeIndex), profile, layout, pose, edgeIndex);
  assert.ok(worst <= 4.01 && worst >= 3.6, `the 4px cap now holds, got ${worst}px`);
});

test('the faint skeleton follows the deformed string, so no ghost of the rest path is left beside it', () => {
  const { fx, profile, layout } = atlasFixture();
  const edgeIndex = longestEdge(profile);
  const bent = atlasPose(profile, layout, { samples: bentSamples(profile, layout, edgeIndex, () => 12) });
  fx.handle.render(bent);
  const skeleton = drawnByRole(fx).skeleton.geometry.getAttribute('position').array;
  const perEdge = 14 * 2 * 3;
  const midpoint = [skeleton[edgeIndex * perEdge + 7 * 6], skeleton[edgeIndex * perEdge + 7 * 6 + 1], skeleton[edgeIndex * perEdge + 7 * 6 + 2]];
  const samples = bent.edgeSamples.find((entry) => entry.id === profile.graph.edges[edgeIndex].id).points;
  assertNear(midpoint, anchorToScene(samples[3], layout), 1e-5, 'the skeleton passes through the middle string sample');
});
