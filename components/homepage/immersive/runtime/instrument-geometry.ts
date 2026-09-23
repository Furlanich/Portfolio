import { BufferGeometry, Float32BufferAttribute } from 'three';

type Point = readonly [number, number];

/**
 * Extrudes a closed 2D profile (listed clockwise or counter-clockwise) into a flat-shaded
 * prism. Front faces are supplied as triangles over the profile indices because the
 * chevron profile is concave.
 */
function extrudeProfile(profile: readonly Point[], faceTriangles: readonly (readonly [number, number, number])[], depth: number) {
  const front = depth / 2;
  const back = -depth / 2;
  const positions: number[] = [];
  const push = (point: Point, z: number) => positions.push(point[0], point[1], z);

  for (const [a, b, c] of faceTriangles) {
    push(profile[a], front); push(profile[b], front); push(profile[c], front);
    push(profile[c], back); push(profile[b], back); push(profile[a], back);
  }
  for (let index = 0; index < profile.length; index += 1) {
    const current = profile[index];
    const next = profile[(index + 1) % profile.length];
    push(current, front); push(next, front); push(next, back);
    push(current, front); push(next, back); push(current, back);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * The derived sculpture layer: a vertical-thickness chevron band. It relates to the protected
 * Contained Master (layer, apex, axis) without reproducing its stroke construction.
 */
export function createChevronSlabGeometry(half = 1.05, rise = 0.74, band = 0.22, depth = 0.22) {
  const profile: Point[] = [
    [-half, -rise], [0, 0], [half, -rise],
    [half, -rise - band], [0, -band], [-half, -rise - band],
  ];
  return extrudeProfile(profile, [[0, 1, 4], [0, 4, 5], [1, 2, 3], [1, 3, 4]], depth);
}

/** A small channel block (order, booking, message or task) rendered as an abstract tile. */
export function createSignalGeometry(width: number, height: number, depth = 0.06) {
  const x = width / 2;
  const y = height / 2;
  return extrudeProfile([[-x, -y], [x, -y], [x, y], [-x, y]], [[0, 1, 2], [0, 2, 3]], depth);
}
