import type { BufferGeometry, InstancedMesh, Material, Texture, WebGLRenderer } from 'three';

export type ResourceCounts = { geometries: number; materials: number; textures: number };

/**
 * Owns the GPU-backed resources one scope of the scene created. Every resource is registered when
 * it is built; `release()` disposes each exactly once and forgets it, so a repeated release, or a
 * release after a partial build, never frees anything twice. Three's own `dispose()` dispatches its
 * event on every call, so the once-only guarantee has to live here.
 */
export type ResourceTracker = {
  geometry<T extends BufferGeometry>(geometry: T): T;
  material<T extends Material>(material: T): T;
  texture<T extends Texture>(texture: T): T;
  /** An instanced mesh holds its own instance attributes, which only its own `dispose()` frees. */
  instanced<T extends InstancedMesh>(mesh: T): T;
  counts(): ResourceCounts;
  release(): void;
};

type Disposable = { dispose(): void };

function disposeQuietly(resource: Disposable): void {
  try {
    resource.dispose();
  } catch {
    // One resource failing to free must never keep the rest alive or surface to the reader.
  }
}

export function createResourceTracker(): ResourceTracker {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  const instanced = new Set<InstancedMesh>();
  return {
    geometry: (geometry) => (geometries.add(geometry), geometry),
    material: (material) => (materials.add(material), material),
    texture: (texture) => (textures.add(texture), texture),
    instanced: (mesh) => (instanced.add(mesh), mesh),
    counts: () => ({ geometries: geometries.size, materials: materials.size, textures: textures.size }),
    release() {
      for (const group of [instanced, textures, materials, geometries] as Set<Disposable>[]) {
        const pending = [...group];
        group.clear();
        pending.forEach(disposeQuietly);
      }
    },
  };
}

export type DisposableScene = {
  renderer: Pick<WebGLRenderer, 'dispose' | 'forceContextLoss'> & { renderLists: { dispose(): void } };
  canvas: { remove(): void };
  tracker: ResourceTracker;
  /** Called first, so no listener or scene reference outlives the resources it points at. */
  detach(): void;
};

/**
 * Releases everything one connected scene owns, in an order that never leaves a dangling owner:
 * listeners and the scene graph first, then every tracked resource, then the render lists, the
 * renderer and its context, and last the canvas. Each step is isolated, so a renderer that is
 * already lost or half-built cannot stop the rest, and nothing here throws into the reading UI.
 */
export function disposeConnectedScene({ renderer, canvas, tracker, detach }: DisposableScene): void {
  const steps: (() => void)[] = [
    detach,
    () => tracker.release(),
    () => renderer.renderLists.dispose(),
    () => renderer.dispose(),
    () => renderer.forceContextLoss(),
    () => canvas.remove(),
  ];
  for (const step of steps) {
    try {
      step();
    } catch {
      // Keep releasing: each remaining step is independent.
    }
  }
}
