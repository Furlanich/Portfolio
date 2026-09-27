import type { BufferGeometry, Material, Texture, WebGLRenderer } from 'three';

export type SkyChartDisposables = {
  renderer: WebGLRenderer;
  geometries: readonly BufferGeometry[];
  materials: readonly Material[];
  textures: readonly Texture[];
};

/**
 * Releases every GPU resource the sky-chart scene created: label textures, sprite/line/point
 * materials, the graticule/star/link geometries, and the renderer itself. `forceContextLoss`
 * additionally releases the underlying WebGL context so a disposed scene never keeps a context
 * alive for the rest of the session (ADR dispose contract).
 */
export function disposeSkyChartScene({ renderer, geometries, materials, textures }: SkyChartDisposables): void {
  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
  renderer.renderLists.dispose();
  renderer.dispose();
  renderer.forceContextLoss();
  renderer.domElement.remove();
}
