import type { BufferGeometry, Material, Object3D, WebGLRenderer } from 'three';

type Disposable = { dispose(): void };

/** Releases every GPU resource the instrument created and detaches the canvas. */
export function disposeInstrumentScene(root: Object3D, renderer: WebGLRenderer, extras: readonly Disposable[] = []) {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  root.traverse((node) => {
    const candidate = node as Object3D & { geometry?: BufferGeometry; material?: Material | Material[] };
    if (candidate.geometry) geometries.add(candidate.geometry);
    if (candidate.material) {
      for (const material of Array.isArray(candidate.material) ? candidate.material : [candidate.material]) materials.add(material);
    }
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  extras.forEach((resource) => resource.dispose());
  root.clear();
  renderer.renderLists.dispose();
  renderer.dispose();
  renderer.domElement.remove();
}
