import {
  LineSegments,
  PerspectiveCamera,
  Points,
  Scene,
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

export type SkyChartSceneHandle = {
  canvas: HTMLCanvasElement;
  /** Awaits label fonts (T-03), builds label sprites, then compiles shaders without blocking. */
  prepare(): Promise<void>;
  resize(width: number, height: number): void;
  render(frame: SkyChartFrame): void;
  /** Rescales every label sprite's current opacity by `multiplier` (D-24 recede) and renders once. */
  setLabelOpacity(multiplier: number): void;
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

function opacityFor(node: SkyChartNodeDefinition, frame: SkyChartFrame): number {
  const base = node.group === 'inputs' ? frame.inputOpacity : frame.groupOpacity[node.group];
  return node.tier === 3 ? base * TIER_3_OPACITY_FACTOR : base;
}

/**
 * Creates the demand-rendered Sky Chart environment (plan section 10). Nodes, the graticule and
 * field stars are fixed in space at creation; only the camera's look direction, link draw range
 * and label opacity change per frame. Never runs an idle loop -- callers render only when the
 * mapped frame changes, and it never registers a renderer animation-loop callback. Throws when WebGL cannot be
 * initialized, matching the prior instrument runtime's fail-closed contract.
 */
export function createSkyChartScene({ quality, locale, nodeLabels, onContextLost }: CreateOptions): SkyChartSceneHandle {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.tabIndex = -1;
  canvas.dataset.skyChartCanvas = '';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:-2;display:block;pointer-events:none;transition:opacity 240ms linear;';

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
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

  const handleContextLost = () => onContextLost();
  canvas.addEventListener('webglcontextlost', handleContextLost);

  function applyFrame(frame: SkyChartFrame) {
    const direction = directionFromDegrees(frame.yaw, frame.pitch);
    camera.lookAt(direction.x, direction.y, direction.z);

    const drawCount = Math.floor((linkVertexCount * frame.linkFraction) / 2) * 2;
    links.geometry.setDrawRange(0, drawCount);

    for (const entry of labels) {
      const visible = frame.visibleTiers.includes(entry.node.tier);
      entry.sprite.visible = visible;
      if (visible) entry.material.opacity = opacityFor(entry.node, frame) * labelOpacityScale;
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
    dispose() {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      const geometries: BufferGeometry[] = [graticuleGeometry, starsGeometry, linkGeometry];
      const materials: Material[] = [graticuleMaterial, starsMaterial, linkMaterial, ...labels.map((entry) => entry.material)];
      const textures: Texture[] = labels.map((entry) => entry.texture);
      disposeSkyChartScene({ renderer, geometries, materials, textures });
    },
  };
}
