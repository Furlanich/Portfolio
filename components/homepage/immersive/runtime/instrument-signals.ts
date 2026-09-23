export type Vector3Tuple = [number, number, number];

export type SignalLayout = {
  scattered: Vector3Tuple;
  routed: Vector3Tuple;
  aligned: Vector3Tuple;
  kind: 0 | 1 | 2 | 3;
};

// Deterministic pseudo-random sequence so every visit composes the same fragmentation.
function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

/**
 * Operational channels: scattered and repeated in Fragmentation, routed on four spokes in
 * Connection, and ordered on one line beneath the sculpture in Coordination.
 */
export function createSignalLayouts(count: number): SignalLayout[] {
  const random = seeded(4099);
  return Array.from({ length: count }, (_, index) => {
    const kind = (index % 4) as SignalLayout['kind'];
    const angle = (index / count) * Math.PI * 2 + random() * 0.6;
    const radius = 1.45 + random() * 0.4;
    const spoke = (kind / 4) * Math.PI * 2 + Math.PI / 4;
    const spokeRadius = 1.75 + Math.floor(index / 4) * 0.2;
    const column = index - (count - 1) / 2;
    return {
      kind,
      scattered: [Math.cos(angle) * radius, Math.sin(angle) * radius, (random() - 0.5) * 0.9],
      routed: [Math.cos(spoke) * spokeRadius, Math.sin(spoke) * spokeRadius * 0.9, 0],
      aligned: [column * (2.8 / Math.max(1, count - 1)), -1.75, 0],
    };
  });
}

export function mix(a: Vector3Tuple, b: Vector3Tuple, amount: number): Vector3Tuple {
  return [a[0] + (b[0] - a[0]) * amount, a[1] + (b[1] - a[1]) * amount, a[2] + (b[2] - a[2]) * amount];
}
