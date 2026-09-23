import {
  AmbientLight,
  BufferGeometry,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  LineSegments,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import type { InstrumentState } from '@/lib/immersive-home/state';
import type { RenderQuality } from '@/lib/immersive-home/capability';
import { disposeInstrumentScene } from './dispose-instrument-scene';
import { createChevronSlabGeometry, createSignalGeometry } from './instrument-geometry';
import { createInstrumentMaterials } from './instrument-materials';
import { createSignalLayouts, mix } from './instrument-signals';

export type InstrumentSceneHandle = {
  canvas: HTMLCanvasElement;
  /** Compiles shaders without blocking where parallel compilation is available. */
  prepare(): Promise<void>;
  resize(width: number, height: number): void;
  render(state: InstrumentState, progress: number): void;
  dispose(): void;
};

type CreateOptions = {
  quality: RenderQuality;
  onContextLost(): void;
};

const SLAB_BASE_Y = [0.62, 0.02, -0.58];
const SPREAD_X = [-0.5, 0.42, -0.12];
const SPREAD_Y = [0.42, 0, -0.42];
const SPREAD_TILT = [0.09, -0.07, 0.05];
const SIGNAL_SIZES: readonly [number, number][] = [[0.15, 0.19], [0.19, 0.17], [0.2, 0.13], [0.16, 0.19]];
// Content extent in scene units; the camera distance keeps it whole at any frame aspect.
const FIT_WIDTH = 4.6;
const FIT_HEIGHT = 4.8;
const HALF_FOV_TANGENT = Math.tan((32 / 2) * (Math.PI / 180));
const ROUTE_TARGET: [number, number, number] = [0, -0.72, 0];

/**
 * Creates the demand-rendered derived-sculpture scene. It never runs an idle loop: callers
 * render only when the mapped state changes. Throws when WebGL cannot be initialized.
 */
export function createInstrumentScene({ quality, onContextLost }: CreateOptions): InstrumentSceneHandle {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.tabIndex = -1;
  canvas.dataset.instrumentCanvas = '';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;';

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(quality.pixelRatio);

  const materials = createInstrumentMaterials();
  const scene = new Scene();
  scene.background = materials.background;
  const camera = new PerspectiveCamera(32, 4 / 5, 0.1, 50);
  camera.position.set(0, 0, 8.4);

  scene.add(new AmbientLight(0xffffff, 1.9));
  const key = new DirectionalLight(0xffffff, 1.6);
  key.position.set(2.5, 3, 5);
  scene.add(key);

  const sculpture = new Group();
  const slabGeometry = createChevronSlabGeometry();
  const slabs = SLAB_BASE_Y.map((y) => {
    const slab = new Mesh(slabGeometry, materials.slab);
    slab.position.y = y;
    sculpture.add(slab);
    return slab;
  });
  scene.add(sculpture);

  const layouts = createSignalLayouts(quality.signalCount);
  const signalGeometries = SIGNAL_SIZES.map(([width, height]) => createSignalGeometry(width, height));
  const signals = layouts.map((layout) => {
    const signal = new Mesh(signalGeometries[layout.kind], materials.signal);
    scene.add(signal);
    return signal;
  });

  const routeGeometry = new BufferGeometry();
  const routePositions = new Float32BufferAttribute(new Float32Array(layouts.length * 6), 3);
  routeGeometry.setAttribute('position', routePositions);
  const routes = new LineSegments(routeGeometry, materials.route);
  scene.add(routes);

  const handleContextLost = () => onContextLost();
  canvas.addEventListener('webglcontextlost', handleContextLost);

  return {
    canvas,
    async prepare() {
      await renderer.compileAsync(scene, camera);
    },
    resize(width, height) {
      if (width <= 0 || height <= 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = Math.max(FIT_HEIGHT / 2 / HALF_FOV_TANGENT, FIT_WIDTH / 2 / (HALF_FOV_TANGENT * camera.aspect));
      camera.updateProjectionMatrix();
    },
    render(state, progress) {
      const spread = state.layerSpread;
      slabs.forEach((slab, index) => {
        slab.position.set(SPREAD_X[index] * spread, SLAB_BASE_Y[index] + SPREAD_Y[index] * spread, 0);
        slab.rotation.z = SPREAD_TILT[index] * spread;
      });
      // Restrained camera travel and a calmer pose as the system coordinates.
      sculpture.rotation.set(-0.18 + state.coordination * 0.08, 0.42 - state.coordination * 0.24, 0);
      camera.position.x = (progress - 0.5) * 0.6;
      camera.lookAt(0, 0, 0);

      // Channels appear as the system fragments; Recognition shows only the intact sculpture.
      const presence = Math.min(1, state.layerSpread * 1.4 + state.connectionStrength + state.coordination);
      layouts.forEach((layout, index) => {
        const routed = mix(layout.scattered, layout.routed, state.connectionStrength);
        const position = mix(routed, layout.aligned, state.coordination);
        signals[index].position.set(position[0], position[1], position[2]);
        signals[index].scale.setScalar(presence);
        signals[index].visible = presence > 0.01;
        routePositions.setXYZ(index * 2, position[0], position[1], position[2]);
        routePositions.setXYZ(index * 2 + 1, ROUTE_TARGET[0], ROUTE_TARGET[1], ROUTE_TARGET[2]);
      });
      routePositions.needsUpdate = true;
      materials.route.opacity = state.connectionStrength * 0.9;

      renderer.render(scene, camera);
    },
    dispose() {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      disposeInstrumentScene(scene, renderer, signalGeometries);
    },
  };
}
