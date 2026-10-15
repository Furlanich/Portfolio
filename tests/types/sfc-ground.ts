// PLAN-SFC-V1 Task 2: compile-time contract for the frozen W1 seams. This file is type-checked by
// `npm run typecheck` and never executed: it passes only when the declared interfaces exist with the
// stated shapes, and each `@ts-expect-error` line fails the build if its misuse ever starts to compile.
import type { ComponentProps } from 'react';
import type { ConnectedStudioGround } from '@/components/connected-studio/ConnectedStudioGround';
import type { AtlasEditorialContainer } from '@/components/surfaces/AtlasEditorialContainer';
import type { AtlasPlate } from '@/components/surfaces/AtlasPlate';
import type { AtlasScrim } from '@/components/surfaces/AtlasScrim';
import type {
  CapabilityWords,
  ConnectedRoute,
  ConnectedWordBinding,
  GraphNode,
  LabelProjection,
} from '@/lib/connected-studio/types';

type GroundProps = ComponentProps<typeof ConnectedStudioGround>;

const words: CapabilityWords = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const bindings: readonly ConnectedWordBinding[] = [{ nodeId: 'n0', word: 'Contexto' }];

// ConnectedRoute covers all five connected pages.
export const routes: readonly ConnectedRoute[] = ['services', 'projects', 'studio', 'founder', 'contact'];

// Legacy routes keep the eight-word capability tuple.
export const legacyGround: GroundProps = { route: 'services', locale: 'es', capabilityWords: words };
export const legacyProjectsGround: GroundProps = { route: 'projects', locale: 'en', capabilityWords: words };

// New routes take readonly word bindings and never fabricate eight services.
export const studioGround: GroundProps = { route: 'studio', locale: 'es', wordBindings: bindings };
export const founderGround: GroundProps = { route: 'founder', locale: 'en', wordBindings: bindings };
export const contactGround: GroundProps = { route: 'contact', locale: 'en', wordBindings: [] };

// @ts-expect-error a legacy route must not take word bindings
export const badLegacy: GroundProps = { route: 'services', locale: 'es', wordBindings: bindings };
// @ts-expect-error a new route must not take the eight-word capability tuple
export const badNew: GroundProps = { route: 'studio', locale: 'es', capabilityWords: words };
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
