import { Color, LineBasicMaterial, MeshLambertMaterial, DoubleSide } from 'three';

// VISUAL-IDENTITY-V1 roles. The lit Azure material may vary tonally inside the scene
// (DESIGN-VISUAL permits physical material variation) without becoming a UI gradient.
export const INSTRUMENT_COLORS = {
  bone: 0xf9f6ee,
  azure: 0x004589,
  ink: 0x09243d,
  rule: 0xd3d4d2,
} as const;

export function createInstrumentMaterials() {
  return {
    background: new Color(INSTRUMENT_COLORS.bone),
    slab: new MeshLambertMaterial({ color: INSTRUMENT_COLORS.azure, side: DoubleSide }),
    signal: new MeshLambertMaterial({ color: INSTRUMENT_COLORS.ink, side: DoubleSide }),
    route: new LineBasicMaterial({ color: INSTRUMENT_COLORS.azure, transparent: true, opacity: 0 }),
  };
}

export type InstrumentMaterials = ReturnType<typeof createInstrumentMaterials>;
