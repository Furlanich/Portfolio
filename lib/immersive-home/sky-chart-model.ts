// Pure Sky Chart scene model (PLAN-SKY-CHART-HOME-REDESIGN-V2 section 10, D-24, D-27).
// No DOM access. Consumed by the Task 7 runtime and by Task 8/9's static composition.
import type { SkyChartNodeId } from './types';

export type SkyChartGroupId = 'inputs' | 'understand' | 'define' | 'build-review' | 'hand-over';

export type SkyChartTier = 1 | 2 | 3;

export type SkyChartNodeDefinition = {
  id: SkyChartNodeId;
  group: SkyChartGroupId;
  tier: SkyChartTier;
  yaw: number;
  pitch: number;
};

/**
 * Reveal threshold `g` for each group, read by `frameForProgress`: a group's opacity ramps
 * from 0 to 1 across the 0.14-wide window from `t = g - 0.12` to `t = g + 0.02` (plan section 10).
 */
export const GROUP_REVEAL: Record<SkyChartGroupId, number> = {
  inputs: 0,
  understand: 0.22,
  define: 0.4,
  'build-review': 0.58,
  'hand-over': 0.74,
};

// Appendix B: id, group, tier, yaw, pitch, in table order.
export const SKY_CHART_NODES: readonly SkyChartNodeDefinition[] = [
  { id: 'orders', group: 'inputs', tier: 2, yaw: 28, pitch: 14 },
  { id: 'bookings', group: 'inputs', tier: 2, yaw: 40, pitch: -6 },
  { id: 'messages', group: 'inputs', tier: 2, yaw: 18, pitch: -16 },
  { id: 'tasks', group: 'inputs', tier: 2, yaw: 48, pitch: 12 },
  { id: 'understand', group: 'understand', tier: 1, yaw: 78, pitch: 10 },
  { id: 'process', group: 'understand', tier: 3, yaw: 70, pitch: 20 },
  { id: 'constraints', group: 'understand', tier: 3, yaw: 88, pitch: 22 },
  { id: 'diagnosis', group: 'understand', tier: 3, yaw: 84, pitch: -2 },
  { id: 'define', group: 'define', tier: 1, yaw: 112, pitch: 4 },
  { id: 'scope', group: 'define', tier: 3, yaw: 104, pitch: 16 },
  { id: 'responsibilities', group: 'define', tier: 3, yaw: 122, pitch: 14 },
  { id: 'validation-criteria', group: 'define', tier: 3, yaw: 116, pitch: -10 },
  { id: 'build-review', group: 'build-review', tier: 1, yaw: 146, pitch: 8 },
  { id: 'integrate', group: 'build-review', tier: 3, yaw: 138, pitch: 20 },
  { id: 'technical-review', group: 'build-review', tier: 3, yaw: 156, pitch: 20 },
  { id: 'functional-tests', group: 'build-review', tier: 3, yaw: 150, pitch: -6 },
  { id: 'hand-over', group: 'hand-over', tier: 1, yaw: 180, pitch: 2 },
  { id: 'documentation', group: 'hand-over', tier: 3, yaw: 172, pitch: 14 },
  { id: 'journeys-validated', group: 'hand-over', tier: 3, yaw: 190, pitch: 14 },
  { id: 'maintain', group: 'hand-over', tier: 3, yaw: 186, pitch: -10 },
];

export type SkyChartFrame = {
  /** Camera yaw in degrees. */
  yaw: number;
  /** Camera pitch in degrees. */
  pitch: number;
  /** Per-group reveal opacity (0..1), keyed by `SkyChartGroupId`. */
  groupOpacity: Record<SkyChartGroupId, number>;
  /** 0..1 fraction of the link `LineSegments` draw range that is visible. */
  linkFraction: number;
  /** Opacity for tier-2 input labels, already damped by the D-27 hero mask. */
  inputOpacity: number;
  /** Node tiers visible at the current viewport width. */
  visibleTiers: readonly SkyChartTier[];
  /** D-27 compact hero label mask (1 = fully shown, 0 = fully hidden). Always 1 at ≥768px. */
  heroMask: number;
};

export type FrameOptions = {
  /** Viewport width in CSS pixels. */
  width: number;
  /** Viewport height in CSS pixels, used only by the D-27 hero mask below 768px. */
  vh?: number;
  /**
   * The hero element's bottom edge, in the same pixel space as `vh`. Required: below 768px
   * this drives whether tier-2 input labels are visible (D-27), so a caller that has not
   * measured it yet must not be able to silently unmask them by omission.
   */
  heroBottom: number;
};

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/** Clamps scroll progress to 0..1, treating a non-finite value as 0. */
function safeProgress(value: number): number {
  return Number.isFinite(value) ? clamp(value) : 0;
}

/**
 * D-27: below 768px, tier-2 input labels are masked while the hero still fills most of the
 * viewport, and fade in once its bottom edge crosses 60% of the viewport height.
 *
 * Guards: a non-positive or non-finite `vh` cannot be measured meaningfully, so the mask
 * fails safe to 1 (fully shown) rather than propagate NaN or an inverted ratio. A missing or
 * non-finite `heroBottom` (JS callers are not compile-checked against the required type
 * above) fails safe the other way, to 0 (hidden), so a caller that forgot to measure the
 * hero never accidentally unmasks labels that may still collide with it.
 */
function heroMaskFor(width: number, vh: number, heroBottom: number): number {
  if (width >= 768) return 1;
  if (!Number.isFinite(vh) || vh <= 0) return 1;
  if (!Number.isFinite(heroBottom)) return 0;
  return clamp((0.6 * vh - heroBottom) / (0.2 * vh));
}

/**
 * Pure per-frame mapping from scroll progress `t` (0..1) to the Sky Chart camera and reveal
 * state (plan section 10; D-27 for the compact hero mask).
 */
export function frameForProgress(rawT: number, options: FrameOptions): SkyChartFrame {
  const { width, vh = 800, heroBottom } = options;
  const t = safeProgress(rawT);
  const wide = width >= 1024;

  const yaw = 34 + 146 * t - (wide ? 18 : 0);
  const pitch = 6 + 4 * Math.sin(Math.PI * t);

  const groupOpacity = Object.fromEntries(
    (Object.entries(GROUP_REVEAL) as [SkyChartGroupId, number][]).map(([group, g]) => [
      group,
      clamp((t - g + 0.12) / 0.14),
    ]),
  ) as Record<SkyChartGroupId, number>;

  const linkFraction = clamp((t - 0.3) / 0.55);

  const heroMask = heroMaskFor(width, vh, heroBottom);
  const inputOpacity = Math.max(0.9 - 0.4 * t, 0.5) * heroMask;

  const visibleTiers: readonly SkyChartTier[] = wide ? [1, 2, 3] : width >= 360 ? [1, 2] : [1];

  return { yaw, pitch, groupOpacity, linkFraction, inputOpacity, visibleTiers, heroMask };
}

/**
 * D-24 recede factor: 0 while the chapters are still settled in view, ramping to 1 as their
 * bottom edge rises from 0.55·vh to 0.05·vh. A non-positive or non-finite `vh` cannot be
 * measured meaningfully, so this fails safe to 0 (not receded) rather than propagate NaN or,
 * worse, an inverted ratio from dividing by a zero or negative height.
 */
export function recedeFactor(chaptersBottom: number, vh: number): number {
  if (!Number.isFinite(vh) || vh <= 0) return 0;
  return clamp((0.55 * vh - chaptersBottom) / (0.5 * vh));
}

/** D-24 label opacity multiplier: fades linearly to 0 by `k = 0.5`. */
export function labelOpacityMultiplier(k: number): number {
  return Math.max(0, 1 - 2 * k);
}
