import { Color, DirectionalLight, Fog, HemisphereLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { CAMERA_FAR, CAMERA_FOV_DEGREES, CAMERA_NEAR, CAMERA_Z, computeConnectedLayout, createGraphBatch } from './connected-geometry.ts';
import type { ConnectedGraphBatch } from './connected-geometry';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { projectConnectedLabels } from './connected-labels.ts';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { createResourceTracker, disposeConnectedScene } from './dispose-connected-scene.ts';
import type { ResourceTracker } from './dispose-connected-scene';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { getQualityForTier, isConnectedTier } from '../../../lib/connected-studio/model.ts';
import type {
  CapabilityWords,
  ConnectedQuality,
  ConnectedTier,
  GraphDefinition,
  LabelProjection,
  SceneDiagnostics,
  SceneHandle,
  ScenePose,
  SceneViewport,
} from '../../../lib/connected-studio/types';

export type ConnectedSceneMount = Pick<HTMLElement, 'appendChild'>;

export type ConnectedSceneOptions = {
  mount: ConnectedSceneMount;
  graph: GraphDefinition;
  quality: ConnectedQuality;
  tier: ConnectedTier;
  words: CapabilityWords;
  onContextLost(): void;
};

export type ConnectedRendererLike = Pick<
  WebGLRenderer,
  'domElement' | 'setPixelRatio' | 'getPixelRatio' | 'setSize' | 'render' | 'dispose' | 'forceContextLoss'
> & {
  renderLists: { dispose(): void };
  info: { render: { calls: number } };
};

export type ConnectedSceneFactories = {
  createCanvas(): HTMLCanvasElement;
  createRenderer(canvas: HTMLCanvasElement): ConnectedRendererLike;
};

const defaultFactories: ConnectedSceneFactories = {
  createCanvas: () => document.createElement('canvas'),
  createRenderer(canvas) {
    const context = canvas.getContext('webgl2', { antialias: true, alpha: true, powerPreference: 'low-power' });
    if (!context) throw new Error('connected-studio: WebGL2 context unavailable');
    return new WebGLRenderer({ canvas, context, antialias: true, alpha: true, powerPreference: 'low-power' });
  },
};

/** Until the host reports its real size, a plausible one per tier keeps every position finite. */
const DEFAULT_VIEWPORT: Record<ConnectedTier, { width: number; height: number; tier: ConnectedTier }> = {
  wide: { width: 1440, height: 900, tier: 'wide' },
  tablet: { width: 900, height: 1180, tier: 'tablet' },
  compact: { width: 390, height: 844, tier: 'compact' },
};

/** Pixel-ratio ceilings (PLAN-SPF-V1 budgets): 1.5 on wide and tablet, 1.25 on compact. */
const PIXEL_RATIO_CAP: Record<ConnectedTier, number> = { wide: 1.5, tablet: 1.5, compact: 1.25 };

type Scope = { graph: GraphDefinition; batch: ConnectedGraphBatch; tracker: ResourceTracker };

/** Builds one graph's resources into their own tracker, and releases whatever was built if it fails part-way. */
function buildScope(graph: GraphDefinition): Scope {
  const tracker = createResourceTracker();
  try {
    return { graph, batch: createGraphBatch(graph, tracker), tracker };
  } catch (error) {
    tracker.release();
    throw error;
  }
}

function usableViewport(viewport: SceneViewport): boolean {
  return (
    isConnectedTier(viewport.tier) &&
    Number.isFinite(viewport.width) &&
    Number.isFinite(viewport.height) &&
    viewport.width > 0 &&
    viewport.height > 0
  );
}

/**
 * Environment (Sonnet tuning, PC-7). Fog pulls the far side of the field toward the ground colour so
 * nearer, larger nodes read in front of smaller distant ones; the key light comes from the upper left
 * so facets read, with a cool hemisphere fill. No shadows, no environment map.
 */
const FOG_COLOR = new Color(0x0a2340);
const FOG_NEAR = 10.8;
const FOG_FAR = 19;

function createEnvironment(scene: Scene): void {
  scene.fog = new Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);
  scene.add(new HemisphereLight(0x8fbbe6, 0x0b2a4a, 1.6));
  const key = new DirectionalLight(0xe4eefa, 3.6);
  key.position.set(-3.5, 4.5, 7);
  scene.add(key);
}

function initError(reason: string, cause?: unknown): Error {
  return new Error(`connected-studio: scene initialization failed (${reason})`, { cause });
}

/**
 * Creates the batched connected scene. Failure to initialize throws a plain `Error` and leaves
 * nothing behind: every resource built so far, the renderer, its context and the canvas are
 * released first, so a host's try/catch stays on the static background. Once a handle exists no
 * method throws.
 */
export function createConnectedScene(
  options: ConnectedSceneOptions,
  factories: ConnectedSceneFactories = defaultFactories,
): SceneHandle {
  // Incoherent options fail before any canvas, context or resource exists.
  if (!isConnectedTier(options.tier)) throw initError('unknown tier');
  if (options.graph.quality !== options.quality || options.graph.quality !== getQualityForTier(options.tier)) {
    throw initError('the graph, quality and tier disagree');
  }

  const canvas = factories.createCanvas();
  // Decorative and pointer-inert; the box fills the mount and the pixel ratio only sizes the backing store.
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('tabindex', '-1');
  canvas.setAttribute('data-connected-canvas', '');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;';
  let renderer: ConnectedRendererLike;
  try {
    renderer = factories.createRenderer(canvas);
  } catch (cause) {
    throw initError('no renderer', cause);
  }
  const scene = new Scene();
  const camera = new PerspectiveCamera(CAMERA_FOV_DEGREES, 1, CAMERA_NEAR, CAMERA_FAR);
  camera.position.set(0, 0, CAMERA_Z);
  camera.updateMatrixWorld();
  let disposed = false;
  let lost = false;
  const reportLoss = () => {
    if (lost || disposed) return;
    lost = true;
    try {
      options.onContextLost();
    } catch {
      // The host's reaction is its own business; it must never break the caller.
    }
  };
  const handleContextLost = () => reportLoss();
  let scope: Scope;
  try {
    scope = buildScope(options.graph);
  } catch (cause) {
    disposeConnectedScene({ renderer, canvas, tracker: createResourceTracker(), detach: () => {} });
    throw initError('the graph could not be built', cause);
  }
  createEnvironment(scene);
  scene.add(scope.batch.group);
  canvas.addEventListener('webglcontextlost', handleContextLost);
  options.mount.appendChild(canvas);
  let renderCount = 0;
  let layout = computeConnectedLayout(DEFAULT_VIEWPORT[options.tier], options.graph);
  scope.batch.fit(layout);

  return {
    render(pose: ScenePose) {
      if (disposed || lost) return;
      try {
        scope.batch.update(pose, layout);
        renderer.render(scene, camera);
        renderCount += 1;
      } catch {
        // A renderer that throws is as unusable as a lost context: stop and let the host go static.
        reportLoss();
      }
    },
    resize(viewport: SceneViewport, graph: GraphDefinition) {
      if (disposed || !usableViewport(viewport) || graph.quality !== getQualityForTier(viewport.tier)) return;
      if (graph !== scope.graph) {
        // Build the new graph beside the old one, and swap only once it exists: a failed rebuild
        // leaves the running scene untouched.
        let next: Scope;
        try {
          next = buildScope(graph);
        } catch {
          return;
        }
        scene.remove(scope.batch.group);
        scope.tracker.release();
        scope = next;
        scene.add(scope.batch.group);
      }
      layout = computeConnectedLayout(viewport, graph);
      scope.batch.fit(layout);
      const ratio = Number.isFinite(viewport.pixelRatio) && viewport.pixelRatio > 0 ? viewport.pixelRatio : 1;
      renderer.setPixelRatio(Math.min(PIXEL_RATIO_CAP[viewport.tier], ratio));
      renderer.setSize(viewport.width, viewport.height, false);
      camera.aspect = layout.aspect;
      camera.updateProjectionMatrix();
    },
    projectLabels(pose: ScenePose): readonly LabelProjection[] {
      return projectConnectedLabels(scope.graph, pose, layout);
    },
    diagnostics(): SceneDiagnostics {
      return {
        drawCalls: disposed ? 0 : renderer.info.render.calls,
        renderCount,
        pixelRatio: renderer.getPixelRatio(),
        ...scope.tracker.counts(),
        drawables: disposed
          ? 0
          : scope.batch.drawables.filter((drawable) => drawable.visible && (!('isInstancedMesh' in drawable) || drawable.count > 0)).length,
        disposed,
      };
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      disposeConnectedScene({
        renderer,
        canvas,
        tracker: scope.tracker,
        detach: () => {
          canvas.removeEventListener('webglcontextlost', handleContextLost);
          scene.clear();
        },
      });
    },
  };
}
