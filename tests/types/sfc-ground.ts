// PLAN-SFC-V1 Task 2: compile-time contract for the frozen W1 seams. This file is type-checked by
// `npm run typecheck` and never executed: it passes only when the declared interfaces exist with the
// stated shapes, and each `@ts-expect-error` line fails the build if its misuse ever starts to compile.
import type { ComponentProps } from 'react';
import type { ConnectedStudioAtlasGround } from '@/components/connected-studio/ConnectedStudioAtlasGround';
import type { ConnectedStudioGround } from '@/components/connected-studio/ConnectedStudioGround';
import type { ConnectedLayout } from '@/components/connected-studio/runtime/connected-geometry';
import type { AtlasEditorialContainer } from '@/components/surfaces/AtlasEditorialContainer';
import type { AtlasPlate } from '@/components/surfaces/AtlasPlate';
import type { AtlasScrim } from '@/components/surfaces/AtlasScrim';
import type {
  CapabilityWords,
  ConnectedProjectionLayout,
  ConnectedRoute,
  ConnectedWordBinding,
  EdgeSamplePoints,
  GraphNode,
  LabelProjection,
  ScenePose,
} from '@/lib/connected-studio/types';

type GroundProps = ComponentProps<typeof ConnectedStudioGround>;
// PLAN-SFC-V1 Task 16: Studio, Founder and Contact use a Ground that cannot reach the live host.
type AtlasGroundProps = ComponentProps<typeof ConnectedStudioAtlasGround>;

const words: CapabilityWords = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const bindings: readonly ConnectedWordBinding[] = [{ nodeId: 'n0', word: 'Contexto' }];

// ConnectedRoute covers all five connected pages.
export const routes: readonly ConnectedRoute[] = ['services', 'projects', 'studio', 'founder', 'contact'];

// Legacy routes keep the eight-word capability tuple.
export const legacyGround: GroundProps = { route: 'services', locale: 'es', capabilityWords: words };
export const legacyProjectsGround: GroundProps = { route: 'projects', locale: 'en', capabilityWords: words };

// New routes take readonly word bindings and never fabricate eight services.
export const studioGround: AtlasGroundProps = { route: 'studio', locale: 'es', wordBindings: bindings };
export const founderGround: AtlasGroundProps = { route: 'founder', locale: 'en', wordBindings: bindings };
export const contactGround: AtlasGroundProps = { route: 'contact', locale: 'en', wordBindings: [] };

// @ts-expect-error a legacy route must not take word bindings
export const badLegacy: GroundProps = { route: 'services', locale: 'es', wordBindings: bindings };
// @ts-expect-error a new route must not take the eight-word capability tuple
export const badNew: AtlasGroundProps = { route: 'studio', locale: 'es', capabilityWords: words };
// @ts-expect-error a legacy route requires its capability words
export const missingWords: GroundProps = { route: 'projects', locale: 'es' };

// Graph nodes and label projections of the new profiles carry no capability index.
export const bareNode: GraphNode = { id: 'n0', anchor: [0, 0, 0], seed: 1, depthScale: 1 };
export const bareLabel: LabelProjection = { id: 'n0', xPx: 0, yPx: 0, depthScale: 1, inView: true };
export const indexedNode: GraphNode = { id: 'n1', capabilityIndex: 3, anchor: [0, 0, 0], seed: 1, depthScale: 1 };

// Shared visual primitives.
export const defaultPlate: ComponentProps<typeof AtlasPlate> = { children: null };
export const editorialPlate: ComponentProps<typeof AtlasPlate> = { variant: 'editorial-opaque', children: null };
export const defaultVariantPlate: ComponentProps<typeof AtlasPlate> = { variant: 'default', blur: false };
// @ts-expect-error only the default and editorial-opaque variants exist
export const badVariant: ComponentProps<typeof AtlasPlate> = { variant: 'glass' };

export const scrim24: ComponentProps<typeof AtlasScrim> = { clearance: 24, children: null };
export const scrim32: ComponentProps<typeof AtlasScrim> = { clearance: 32, children: null };
// @ts-expect-error clearance is exactly 24 or 32 CSS px
export const scrim16: ComponentProps<typeof AtlasScrim> = { clearance: 16, children: null };

export const container: ComponentProps<typeof AtlasEditorialContainer> = { children: null };

// Projection and pose seams frozen at W1 so Task 4 (which cannot edit this module) can return them.
const layout: ConnectedProjectionLayout = {
  width: 1440,
  height: 900,
  tier: 'wide',
  aspect: 1.6,
  spreadX: 1,
  spreadY: 1,
  depthScale: 1,
  nodeScale: 1,
  pathRadius: 0.02,
  tracerRadius: 0.03,
};
export const croppedLayout: ConnectedProjectionLayout = { ...layout, crop: { x: 10, y: 20, width: 1200, height: 700 }, pointScale: 1.2 };
// The runtime's existing layout is assignable to the frozen type, so Task 8 can pass it through unchanged.
export const fromRuntimeLayout = (runtime: ConnectedLayout): ConnectedProjectionLayout => runtime;
// @ts-expect-error a layout without its fit factors is incomplete
export const incompleteLayout: ConnectedProjectionLayout = { width: 1440, height: 900, tier: 'wide', aspect: 1.6 };

const seven = (): EdgeSamplePoints => [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];

// A legacy pose (no new field) still compiles, and the enriched pose carries the resolved frame, the
// ID-keyed seven-point strings and the 0..1 excitation records.
export const legacyPose: ScenePose = { progress: 0.5, idleAngleRadians: 0, scrollActivity: 0, nodes: [], edges: [] };
export const enrichedPose: ScenePose = {
  ...legacyPose,
  projectionLayout: layout,
  edgeSamples: [{ id: 'e0', points: seven() }],
  excitation: [{ id: 'n0', value: 0.25 }],
};
// @ts-expect-error a string is seven points exactly, not six
export const shortString: ScenePose['edgeSamples'] = [{ id: 'e0', points: [[0, 0, 0], [0, 0, 0]] }];
// @ts-expect-error excitation values are numbers
export const badExcitation: ScenePose['excitation'] = [{ id: 'n0', value: 'high' }];
