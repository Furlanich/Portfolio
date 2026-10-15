// PLAN-SFC-V1 Task 4: immutable route-scene profiles. Declarations first; data and builders follow test-first.
import type { ConnectedQuality, ConnectedRoute, ConnectedTier, GraphDefinition } from './types';

export type ConnectedNodeStyle = 'legacy' | 'atlas';
export type ConnectedAmbientPolicy = 'legacy' | 'sleep';

/** Normalized rest position of an Atlas node: (u, v) from the left/top of the viewport, zScene in scene units. */
export type ConnectedRestAnchor = { readonly id: string; readonly u: number; readonly v: number; readonly zScene: number };

export type ConnectedInputPolicy = {
  /** Nodes yield to the pointer and the scroll impulse. False on Contact: node offsets stay exactly zero. */
  readonly yieldNodes: boolean;
  /** Strings bend near the pointer. */
  readonly bendEdges: boolean;
  readonly radiusPx: number;
  /** Node displacement cap in CSS px. */
  readonly nodeTravelCapPx: number;
  /** Interior string displacement cap in CSS px. */
  readonly edgeCapPx: number;
  /** Multiplier on the scroll impulse (1 wide/tablet, 0.38 compact). */
  readonly scrollStrength: number;
};

export type ConnectedSceneProfile = {
  readonly route: ConnectedRoute;
  readonly tier: ConnectedTier;
  readonly quality: ConnectedQuality;
  readonly graph: GraphDefinition;
  readonly restAnchors?: readonly ConnectedRestAnchor[];
  readonly ambient: ConnectedAmbientPolicy;
  readonly nodeStyle: ConnectedNodeStyle;
  readonly input: ConnectedInputPolicy;
  readonly posterPose: Readonly<{ progress: number; idleAngleRadians: number }>;
};

export function getConnectedProfile(
  route: ConnectedRoute,
  tier: ConnectedTier,
  viewport: { readonly width: number; readonly height: number },
): ConnectedSceneProfile {
  void route;
  void tier;
  void viewport;
  throw new Error('not implemented');
}
