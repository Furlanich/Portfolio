import {
  LineSegments,
  PerspectiveCamera,
  Points,
  Scene,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type CanvasTexture,
  type Material,
  type Sprite,
  type SpriteMaterial,
  type Texture,
} from 'three';
import {
  SKY_CHART_NODES,
  type SkyChartFrame,
  type SkyChartNodeDefinition,
} from '@/lib/immersive-home/sky-chart-model';
import type { SkyChartNodeId } from '@/lib/immersive-home/types';
import type { RenderQuality } from '@/lib/immersive-home/capability';
import { disposeSkyChartScene } from './dispose-sky-chart-scene';
import {
  createFieldStarsGeometry,
  createFieldStarsMaterial,
  createGraticuleGeometry,
  createGraticuleMaterial,
  createLinkMaterial,
  createLinkSegmentsGeometry,
  directionFromDegrees,
} from './sky-chart-geometry';
import { createLabelSprite, loadSkyChartFonts } from './sky-chart-labels';

export type HeroExclusionRect = { left: number; top: number; right: number; bottom: number };

export type SkyChartDebugInfo = {
  drawCalls: number;
  pixelRatio: number;
  labelTextureSizes: readonly [number, number][];
  labelOpacities: Record<string, number>;
};

export type SkyChartSceneHandle = {
  canvas: HTMLCanvasElement;
  /** Awaits label fonts (T-03), builds label sprites, then compiles shaders without blocking. */
  prepare(): Promise<void>;
  resize(width: number, height: number): void;
  render(frame: SkyChartFrame): void;
  /** Rescales every label sprite's current opacity by `multiplier` (D-24 recede) and renders once. */
  setLabelOpacity(multiplier: number): void;
  /** N14: tier-2 labels whose projected screen position falls inside `rect` fade to 0 while
   * `active` (>=768px and the hero is in view). `null` rect or `active=false` clears it. */
  setHeroExclusion(rect: HeroExclusionRect | null, active: boolean): void;
  /** N7: draw calls, pixel ratio and label-texture sizes for the debug hook and its tests. */
  getDebugInfo(): SkyChartDebugInfo;
  dispose(): void;
};

type CreateOptions = {
  quality: RenderQuality;
  locale: string;
  nodeLabels: Record<SkyChartNodeId, string>;
  onContextLost(): void;
};

type LabelEntry = {
  node: SkyChartNodeDefinition;
  sprite: Sprite;
  material: SpriteMaterial;
  texture: CanvasTexture;
};

const NODE_RADIUS = 40;
const WIDE_MIN_WIDTH = 1024;
const FOV_WIDE = 55;
const FOV_COMPACT = 70;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 200;
const TIER_3_OPACITY_FACTOR = 0.8;
const HERO_EXCLUSION_TIER = 2;

function opacityFor(node: SkyChartNodeDefinition, frame: SkyChartFrame): number {
  const base = node.group === 'inputs' ? frame.inputOpacity : frame.groupOpacity[node.group];
  return node.tier === 3 ? base * TIER_3_OPACITY_FACTOR : base;
}

/**
 * Creates the demand-rendered Sky Chart environment (plan section 10). Nodes, the graticule and
 * field stars are fixed in space at creation; only the camera's look direction, link draw range
 * and label opacity change per frame. Never runs an idle loop -- callers render only when the
 * mapped frame changes, and it never registers a renderer animation-loop callback.
 *
 * N5: this factory creates the WebGL2 context itself (rather than letting `WebGLRenderer` try
 * and fail internally, which logs `THREE.WebGLRenderer: Error creating WebGL context.` via
 * `console.error`) and passes it to `WebGLRenderer`'s `context` option. When the context cannot
 * be created, it throws a plain `Error` with no console side effect, matching the prior
 * instrument runtime's fail-closed contract -- the caller's try/catch returns quietly to static.
 */
export function createSkyChartScene({ quality, locale, nodeLabels, onContextLost }: CreateOptions): SkyChartSceneHandle {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.tabIndex = -1;
  canvas.dataset.skyChartCanvas = '';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:-2;display:block;pointer-events:none;transition:opacity 240ms linear;';

  const context = canvas.getContext('webgl2', { antialias: true, alpha: true, powerPreference: 'low-power' }) as WebGL2RenderingContext | null;
  if (!context) throw new Error('sky-chart: WebGL2 context unavailable');

  const renderer = new WebGLRenderer({ canvas, context, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(quality.pixelRatio);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV_WIDE, 1, CAMERA_NEAR, CAMERA_FAR);
  camera.position.set(0, 0, 0);

  const graticuleGeometry = createGraticuleGeometry();
  const graticuleMaterial = createGraticuleMaterial();
  scene.add(new LineSegments(graticuleGeometry, graticuleMaterial));

  const starsGeometry = createFieldStarsGeometry(quality.starCount);
  const starsMaterial = createFieldStarsMaterial();
  scene.add(new Points(starsGeometry, starsMaterial));

  const { geometry: linkGeometry, vertexCount: linkVertexCount } = createLinkSegmentsGeometry(SKY_CHART_NODES, NODE_RADIUS);
  const linkMaterial = createLinkMaterial();
  const links = new LineSegments(linkGeometry, linkMaterial);
  links.geometry.setDrawRange(0, 0);
  scene.add(links);

  const labels: LabelEntry[] = [];
  let lastFrame: SkyChartFrame | null = null;
  let labelOpacityScale = 1;
  let disposed = false;
  let viewportWidth = 1;
  let viewportHeight = 1;
  let heroRect: HeroExclusionRect | null = null;
  let heroExclusionActive = false;
  const projectionScratch = new Vector3();

  const handleContextLost = () => onContextLost();
  canvas.addEventListener('webglcontextlost', handleContextLost);

  function projectToScreen(position: Vector3): { x: number; y: number } {
    projectionScratch.copy(position).project(camera);
    return {
      x: ((projectionScratch.x + 1) / 2) * viewportWidth,
      y: ((1 - projectionScratch.y) / 2) * viewportHeight,
    };
  }

  function intersectsHero(x: number, y: number): boolean {
    if (!heroRect) return false;
    return x >= heroRect.left && x <= heroRect.right && y >= heroRect.top && y <= heroRect.bottom;
  }

  function applyFrame(frame: SkyChartFrame) {
    const direction = directionFromDegrees(frame.yaw, frame.pitch);
    camera.lookAt(direction.x, direction.y, direction.z);

    const drawCount = Math.floor((linkVertexCount * frame.linkFraction) / 2) * 2;
    links.geometry.setDrawRange(0, drawCount);

    for (const entry of labels) {
      const visible = frame.visibleTiers.includes(entry.node.tier);
      entry.sprite.visible = visible;
      if (!visible) {
        entry.material.opacity = 0;
        continue;
      }
      let opacity = opacityFor(entry.node, frame) * labelOpacityScale;
      // N14: at >=768px, a tier-2 label whose projected position falls over the hero's text
      // column fades to 0 while the hero is in view (extends D-27's mask from "below 768" to
      // "wherever a label would overlap hero text" -- the reference places Messages against
      // the trust row this way).
      if (heroExclusionActive && entry.node.tier === HERO_EXCLUSION_TIER) {
        const screen = projectToScreen(entry.sprite.position);
        if (intersectsHero(screen.x, screen.y)) opacity = 0;
      }
      entry.material.opacity = opacity;
    }
  }

  return {
    canvas,
    async prepare() {
      await loadSkyChartFonts();
      for (const node of SKY_CHART_NODES) {
        const direction = directionFromDegrees(node.yaw, node.pitch);
        const { sprite, material, texture } = createLabelSprite(nodeLabels[node.id], node.tier, locale);
        sprite.position.set(direction.x * NODE_RADIUS, direction.y * NODE_RADIUS, direction.z * NODE_RADIUS);
        sprite.visible = false;
        scene.add(sprite);
        labels.push({ node, sprite, material, texture });
      }
      await renderer.compileAsync(scene, camera);
    },
    resize(width, height) {
      if (width <= 0 || height <= 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = width >= WIDE_MIN_WIDTH ? FOV_WIDE : FOV_COMPACT;
      camera.updateProjectionMatrix();
      viewportWidth = width;
      viewportHeight = height;
    },
    render(frame) {
      lastFrame = frame;
      applyFrame(frame);
      renderer.render(scene, camera);
    },
    setLabelOpacity(multiplier) {
      labelOpacityScale = multiplier;
      if (!lastFrame) return;
      applyFrame(lastFrame);
      renderer.render(scene, camera);
    },
    setHeroExclusion(rect, active) {
      heroRect = rect;
      heroExclusionActive = active;
    },
    getDebugInfo() {
      return {
        drawCalls: renderer.info.render.calls,
        pixelRatio: renderer.getPixelRatio(),
        labelTextureSizes: labels.map((entry) => [entry.texture.image.width as number, entry.texture.image.height as number] as const),
        labelOpacities: Object.fromEntries(labels.map((entry) => [entry.node.id, entry.material.opacity])),
      };
    },
    dispose() {
      // Idempotent: an in-flight activation can race an unmount (the outer React cleanup effect
      // disposes synchronously; the async activation callback then resumes and, seeing
      // `cancelled`, disposes again). A second three.js `renderer.dispose()` on already-freed
      // internal state can throw, which would otherwise cascade into a second, throwing
      // `onContextLost` -> teardown -> dispose call. Guarding here keeps every caller's
      // dispose-on-cancellation logic simple and safe to call more than once.
      if (disposed) return;
      disposed = true;
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      const geometries: BufferGeometry[] = [graticuleGeometry, starsGeometry, linkGeometry];
      const materials: Material[] = [graticuleMaterial, starsMaterial, linkMaterial, ...labels.map((entry) => entry.material)];
      const textures: Texture[] = labels.map((entry) => entry.texture);
      disposeSkyChartScene({ renderer, geometries, materials, textures });
    },
  };
}
