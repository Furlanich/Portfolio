// PLAN-SPF-V1 Task 2: the connected-scene contract frozen at W1. Declarations only: no runtime,
// no browser globals, no 3D library. Units: anchors, positions and rotations use scene units and
// radians; label projections and boxes use CSS pixels; progress, edge growth and reveal bounds
// are finite and normalized to 0..1; velocity is pixels per second; elapsed pose time is seconds.

export type Vec3 = readonly [number, number, number];

export type ConnectedRoute = 'services' | 'projects';
/** Graph topology: 16 nodes/33 edges (wide) or 8 nodes/13 edges (compact). */
export type ConnectedQuality = 'wide' | 'compact';
/** Wide >= 1024, tablet 768-1023, compact < 768 CSS px. */
export type ConnectedTier = 'wide' | 'tablet' | 'compact';
/** `wide` covers the wide and tablet tiers. */
export type ConnectedLivePolicy = { readonly wide: boolean; readonly compact: boolean };

export type CapabilityIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type CapabilityWords = readonly [string, string, string, string, string, string, string, string];

export type GraphNode = {
  readonly id: string;
  readonly capabilityIndex: CapabilityIndex;
  readonly anchor: Vec3;
  readonly seed: number;
  readonly depthScale: number;
};

export type GraphEdge = {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly revealStart: number;
  readonly revealEnd: number;
};

export type GraphDefinition = {
  readonly quality: ConnectedQuality;
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
};

export type ScenePose = {
  readonly progress: number;
  readonly idleAngleRadians: number;
  readonly scrollActivity: number;
  readonly nodes: readonly { readonly id: string; readonly position: Vec3; readonly rotation: Vec3; readonly scale: number }[];
  readonly edges: readonly { readonly id: string; readonly growth: number }[];
};

export type SceneGateInput = {
  readonly reducedMotion: boolean;
  readonly saveData: boolean;
  readonly webgl2: boolean;
  readonly softwareRenderer: boolean;
  readonly sessionContextLost: boolean;
  readonly loaded: boolean;
  readonly visible: boolean;
  readonly tier: ConnectedTier;
  readonly livePolicy: ConnectedLivePolicy;
};

export type ConnectedMode = 'static' | 'webgl';

export type SceneSnapshot = {
  readonly state: 'static' | 'live' | 'paused' | 'suspended' | 'disposed';
  readonly pose: ScenePose;
  readonly pendingCallbacks: number;
  readonly renderCount: number;
  /** 0 when stopped; ambient cap 30 wide/tablet and 20 compact; active cadence <= 60 (PC-6). */
  readonly targetFps: number;
};

export type SceneLayout = {
  readonly footerDocumentTop: number;
  readonly viewportWidth: number;
  readonly viewportHeight: number;
};

export type SceneUpdate = {
  readonly graph: GraphDefinition;
  readonly tier: ConnectedTier;
  readonly scrollY: number;
  readonly velocityPxPerSecond: number;
  readonly visible: boolean;
  readonly footerDominant: boolean;
};

export type SceneViewport = {
  readonly width: number;
  readonly height: number;
  readonly pixelRatio: number;
  readonly tier: ConnectedTier;
};

export type LabelProjection = {
  readonly id: string;
  readonly capabilityIndex: CapabilityIndex;
  readonly xPx: number;
  readonly yPx: number;
  readonly depthScale: number;
  readonly inView: boolean;
};

export type LabelBox = {
  readonly id: string;
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly depthScale: number;
};

export type OccluderRect = {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
};

export type LabelVisibility = {
  readonly id: string;
  readonly visible: boolean;
  readonly left: number;
  readonly top: number;
};

export type SceneDiagnostics = {
  readonly drawCalls: number;
  readonly renderCount: number;
  readonly pixelRatio: number;
  readonly geometries: number;
  readonly materials: number;
  readonly textures: number;
  readonly drawables: number;
  readonly disposed: boolean;
};

export type SceneHandle = {
  render(pose: ScenePose): void;
  resize(viewport: SceneViewport, graph: GraphDefinition): void;
  projectLabels(pose: ScenePose): readonly LabelProjection[];
  diagnostics(): SceneDiagnostics;
  dispose(): void;
};

export type ControllerOptions = {
  /** Monotonic milliseconds. */
  readonly clock: { now(): number };
  readonly scheduler: { schedule(callback: () => void, delayMs: number): number; cancel(id: number): void };
  render(pose: ScenePose): void;
  getLayout(): SceneLayout;
};

export type ConnectedController = {
  update(input: SceneUpdate): void;
  pause(): void;
  resume(): void;
  snapshot(): SceneSnapshot;
  dispose(): void;
};
