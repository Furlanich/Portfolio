// PLAN-SFC-V1 Task 4: deterministic pointer and scroll interaction for the connected scene (DESIGN-SFC-V1, "Pointer and
// node behavior" and "Flexible edges"). A pure function of elapsed time, CSS pointer samples and ordinary scroll
// distance: no DOM, no Three, no clock of its own. Nodes yield to the pointer with a damped spring and keep momentum;
// strings are seven pinned samples with tension; everything is capped in CSS px inside the resolved frame, so the
// device pixel ratio never matters. Equivalent 60 Hz and 120 Hz streams agree because impulses are integrated over
// elapsed time and the pointer is interpolated along its path between samples.
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { anchorToScene, projectAnchor, unprojectCss } from './projection.ts';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { evaluateRestEdge } from './rest-path.ts';
import type { ConnectedProjectionLayout, EdgeSamplePoints, ScenePose, Vec3 } from './types';
import type { ConnectedSceneProfile } from './profiles';

/** CSS px position and px/s velocity of the pointer; `ageSeconds` is the time since it last moved. */
export type ConnectedPointer = {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly ageSeconds: number;
};

export type InteractionStepInput = {
  readonly nowMs: number;
  readonly deltaMs: number;
  /** The base pose, already expressed in `layout`'s frame (native or poster). */
  readonly base: ScenePose;
  readonly layout: ConnectedProjectionLayout;
  readonly pointer: ConnectedPointer | null;
  /** Classified ordinary scroll distance since the previous step, in CSS px. */
  readonly scrollDeltaPx: number;
};

export type ConnectedInteraction = {
  step(input: InteractionStepInput): ScenePose;
  /** Hard reset: every offset, velocity and excitation returns to rest at once. */
  clear(): void;
  isSettled(): boolean;
};

// --- DESIGN-SFC-V1 constants -------------------------------------------------------------------------------------
/** Integration steps are at most 1/120 s, and at most 50 ms of a gap is integrated (hidden time is discarded). */
const MAX_SUBSTEP_SECONDS = 1 / 120;
const MAX_GAP_SECONDS = 0.05;

const NEAREST_NODES = 5;
/** Yield target away from the pointer: 0.85 x travel cap x squared falloff x pressure. */
const YIELD_GAIN = 0.85;
/** Stationary pressure: 0.16 + 0.84 exp(-age / 0.28 s). */
const NODE_PRESSURE_FLOOR = 0.16;
const NODE_PRESSURE_DECAY_SECONDS = 0.28;
/** One non-recursive share of the original target for each connected neighbor. */
const NEIGHBOR_SHARE = 0.1;
const NODE_STIFFNESS = 42;
const NODE_DAMPING = 10;
/** Momentum: 0.038 x clamped pointer velocity x weight per 1/60 s of pointer travel. */
const MOMENTUM_GAIN = 0.038;
const MOMENTUM_REFERENCE_SECONDS = 1 / 60;
const POINTER_VELOCITY_CLAMP = 1400;
/** New-profile scroll impulse: clamped delta of 120 px, gain 0.18, alternating local directions. */
const SCROLL_CLAMP_PX = 120;
const SCROLL_GAIN = 0.18;

const INTERIOR_SAMPLES = 5;
const STRING_SEGMENTS = INTERIOR_SAMPLES + 1;
const EDGE_RADIUS_LIMIT_PX = 150;
/** String pressure: 0.12 + 0.88 exp(-age / 0.35 s). */
const EDGE_PRESSURE_FLOOR = 0.12;
const EDGE_PRESSURE_DECAY_SECONDS = 0.35;
/**
 * The specification fixes the string's pressure, radius, tension, stiffness, damping and caps but not its drive
 * amplitude. Tension spreads a local push over neighboring samples, so the drive is 1.5 x the cap (the target is
 * still clamped to the cap): a held pointer beside a short string bends it to roughly half its cap. Sonnet tuning
 * ruling (Task 4 receipt), accepted only through owner review of the rendered scene.
 */
const EDGE_DRIVE_GAIN = 1.5;
const EDGE_TENSION = 90;
const EDGE_STIFFNESS = 32;
const EDGE_DAMPING = 7;
/** Endpoint transverse velocity lags the string: -0.06 x velocity x sin(pi s). */
const ENDPOINT_LAG = 0.06;

/** Excitation decays 0.45 s; the exported node intensity about 0.50 s and edge emphasis about 0.55 s. */
const EXCITATION_DECAY_SECONDS = 0.45;
const NODE_INTENSITY_DECAY_SECONDS = 0.5;
const EDGE_EMPHASIS_DECAY_SECONDS = 0.55;

/** Rest: position error, speed and intensity below these let the field sleep. */
const NODE_REST_ERROR_PX = 0.02;
const NODE_REST_SPEED_PX_S = 0.03;
const INTENSITY_REST = 0.002;
const EDGE_REST_ERROR_PX = 0.015;
const EDGE_REST_SPEED_PX_S = 0.025;

const TIE_EPSILON_PX = 1e-9;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function finiteVec(value: Vec3 | undefined): value is Vec3 {
  return value !== undefined && Number.isFinite(value[0]) && Number.isFinite(value[1]) && Number.isFinite(value[2]);
}

type PosedNode = ScenePose['nodes'][number];

export function createConnectedInteraction(profile: ConnectedSceneProfile): ConnectedInteraction {
  const { graph, input: policy, nodeStyle } = profile;
  const nodeCount = graph.nodes.length;
  const edgeCount = graph.edges.length;
  const nodeIds = graph.nodes.map((node) => node.id);
  const nodeIndex = new Map(nodeIds.map((id, index) => [id, index]));
  const edgeEnds = graph.edges.map((edge) => [nodeIndex.get(edge.from) ?? -1, nodeIndex.get(edge.to) ?? -1] as const);
  const edgeRadius = Math.min(policy.radiusPx, EDGE_RADIUS_LIMIT_PX);

  // Persistent state, CSS px relative to the resolved rest pose.
  const offX = new Float64Array(nodeCount);
  const offY = new Float64Array(nodeCount);
  const velX = new Float64Array(nodeCount);
  const velY = new Float64Array(nodeCount);
  const nodeExcite = new Float64Array(nodeCount);
  const nodeIntensity = new Float64Array(nodeCount);
  const stringD = new Float64Array(edgeCount * INTERIOR_SAMPLES);
  const stringV = new Float64Array(edgeCount * INTERIOR_SAMPLES);
  const edgeExcite = new Float64Array(edgeCount);
  const edgeIntensity = new Float64Array(edgeCount);

  // Per-step scratch, allocated once.
  const valid = new Uint8Array(nodeCount);
  const restX = new Float64Array(nodeCount);
  const restY = new Float64Array(nodeCount);
  const restZ = new Float64Array(nodeCount);
  const basePosition: Vec3[] = new Array(nodeCount);
  const baseNodes: (PosedNode | undefined)[] = new Array(nodeCount);
  const directX = new Float64Array(nodeCount);
  const directY = new Float64Array(nodeCount);
  const weight = new Float64Array(nodeCount);
  const targetX = new Float64Array(nodeCount);
  const targetY = new Float64Array(nodeCount);
  const nodeDrive = new Float64Array(nodeCount);
  const selected = new Int32Array(NEAREST_NODES);
  const selectedDistance = new Float64Array(NEAREST_NODES);
  const normalX = new Float64Array(edgeCount);
  const normalY = new Float64Array(edgeCount);
  const edgeValid = new Uint8Array(edgeCount);
  const sampleX = new Float64Array(edgeCount * INTERIOR_SAMPLES);
  const sampleY = new Float64Array(edgeCount * INTERIOR_SAMPLES);
  const stringTarget = new Float64Array(edgeCount * INTERIOR_SAMPLES);
  const stringWeight = new Float64Array(edgeCount);
  const nextV = new Float64Array(INTERIOR_SAMPLES);
  const finalPosition: (Vec3 | undefined)[] = new Array(nodeCount);

  let lastNowMs: number | undefined;
  let hadPointer = false;
  let previousX = 0;
  let previousY = 0;
  let settled = true;

  function zeroState() {
    for (const array of [offX, offY, velX, velY, nodeExcite, nodeIntensity, stringD, stringV, edgeExcite, edgeIntensity]) array.fill(0);
  }

  function isDirty(): boolean {
    for (const array of [offX, offY, velX, velY, nodeExcite, nodeIntensity, stringD, stringV, edgeExcite, edgeIntensity]) {
      for (let index = 0; index < array.length; index += 1) if (array[index] !== 0) return true;
    }
    return false;
  }

  function resolveNodes(base: ScenePose, layout: ConnectedProjectionLayout) {
    const lookup = (index: number): PosedNode | undefined => {
      const positional = base.nodes[index];
      if (positional?.id === nodeIds[index]) return positional;
      return base.nodes.find((node) => node.id === nodeIds[index]);
    };
    for (let index = 0; index < nodeCount; index += 1) {
      const posed = lookup(index);
      baseNodes[index] = posed;
      let position: Vec3 | undefined = posed?.position;
      if (!finiteVec(position)) position = graph.nodes[index].anchor;
      if (!finiteVec(position)) {
        valid[index] = 0;
        continue;
      }
      const css = projectAnchor(position, layout);
      if (!Number.isFinite(css.xPx) || !Number.isFinite(css.yPx) || !Number.isFinite(anchorToScene(position, layout)[2])) {
        valid[index] = 0;
        continue;
      }
      valid[index] = 1;
      restX[index] = css.xPx;
      restY[index] = css.yPx;
      restZ[index] = anchorToScene(position, layout)[2];
      basePosition[index] = position;
    }
  }

  /** The displaced anchor-space position of a node, derived from its CSS offset in the resolved frame. */
  function displacedPosition(index: number, layout: ConnectedProjectionLayout): Vec3 {
    const cached = finalPosition[index];
    if (cached) return cached;
    const position =
      offX[index] === 0 && offY[index] === 0
        ? basePosition[index]
        : unprojectCss({ xPx: restX[index] + offX[index], yPx: restY[index] + offY[index], zScene: restZ[index] }, layout);
    finalPosition[index] = position;
    return position;
  }

  /** Normals and rest sample positions (CSS px) of every string, from the endpoints' current displaced positions. */
  function prepareStrings(layout: ConnectedProjectionLayout) {
    finalPosition.fill(undefined);
    for (let edge = 0; edge < edgeCount; edge += 1) {
      const [a, b] = edgeEnds[edge];
      if (a < 0 || b < 0 || !valid[a] || !valid[b]) {
        edgeValid[edge] = 0;
        continue;
      }
      edgeValid[edge] = 1;
      const chordX = restX[b] + offX[b] - (restX[a] + offX[a]);
      const chordY = restY[b] + offY[b] - (restY[a] + offY[a]);
      const length = Math.hypot(chordX, chordY);
      normalX[edge] = length > 1e-9 ? -chordY / length : 0;
      normalY[edge] = length > 1e-9 ? chordX / length : 1;
      const from = displacedPosition(a, layout);
      const to = displacedPosition(b, layout);
      for (let sample = 0; sample < INTERIOR_SAMPLES; sample += 1) {
        const rest = evaluateRestEdge({ nodeStyle, edgeIndex: edge, from, to, layout }, (sample + 1) / STRING_SEGMENTS);
        const css = projectAnchor(rest, layout);
        sampleX[edge * INTERIOR_SAMPLES + sample] = Number.isFinite(css.xPx) ? css.xPx : 0;
        sampleY[edge * INTERIOR_SAMPLES + sample] = Number.isFinite(css.yPx) ? css.yPx : 0;
      }
    }
  }

  /** Picks the nearest five nodes inside the radius (stable id tie-break); returns how many were chosen. */
  function selectNearest(pointerX: number, pointerY: number): number {
    let count = 0;
    for (let index = 0; index < nodeCount; index += 1) {
      if (!valid[index]) continue;
      const distance = Math.hypot(restX[index] - pointerX, restY[index] - pointerY);
      if (!(distance < policy.radiusPx)) continue;
      let at = count;
      while (at > 0) {
        const other = selected[at - 1];
        const otherDistance = selectedDistance[at - 1];
        const closer = distance < otherDistance - TIE_EPSILON_PX || (Math.abs(distance - otherDistance) <= TIE_EPSILON_PX && nodeIds[index] < nodeIds[other]);
        if (!closer) break;
        at -= 1;
      }
      if (at >= NEAREST_NODES) continue;
      for (let move = Math.min(count, NEAREST_NODES - 1); move > at; move -= 1) {
        selected[move] = selected[move - 1];
        selectedDistance[move] = selectedDistance[move - 1];
      }
      selected[at] = index;
      selectedDistance[at] = distance;
      if (count < NEAREST_NODES) count += 1;
    }
    return count;
  }

  function step(input: InteractionStepInput): ScenePose {
    const { base, layout } = input;
    let seconds = finite(input.deltaMs) && input.deltaMs > 0 ? input.deltaMs / 1000 : 0;
    seconds = Math.min(seconds, MAX_GAP_SECONDS);
    if (finite(input.nowMs)) {
      if (lastNowMs !== undefined && input.nowMs < lastNowMs) seconds = 0;
      else lastNowMs = input.nowMs;
    }
    const pointer = input.pointer;
    const hasPointer = pointer !== null && finite(pointer.x) && finite(pointer.y);
    const scroll = finite(input.scrollDeltaPx) ? clamp(input.scrollDeltaPx, -SCROLL_CLAMP_PX, SCROLL_CLAMP_PX) : 0;
    const wasPointer = hadPointer;
    const lastX = previousX;
    const lastY = previousY;
    hadPointer = hasPointer;
    if (hasPointer) {
      previousX = pointer.x;
      previousY = pointer.y;
    }
    // Nothing moving, nothing asked of it: the rest pose, without touching the geometry.
    if (settled && !hasPointer && scroll === 0) return { ...base, projectionLayout: layout };

    resolveNodes(base, layout);
    const yields = policy.yieldNodes;
    const bends = policy.bendEdges;
    const age = hasPointer && finite(pointer.ageSeconds) && pointer.ageSeconds >= 0 ? pointer.ageSeconds : 0;
    const nodePressure = NODE_PRESSURE_FLOOR + (1 - NODE_PRESSURE_FLOOR) * Math.exp(-age / NODE_PRESSURE_DECAY_SECONDS);
    const edgePressure = EDGE_PRESSURE_FLOOR + (1 - EDGE_PRESSURE_FLOOR) * Math.exp(-age / EDGE_PRESSURE_DECAY_SECONDS);
    const nodeDriveDecay = Math.exp(-age / NODE_PRESSURE_DECAY_SECONDS);
    const edgeDriveDecay = Math.exp(-age / EDGE_PRESSURE_DECAY_SECONDS);

    // Momentum comes from the path actually travelled since the last sample, so a stationary or freshly entered pointer
    // adds nothing however stale its reported velocity is.
    let momentumX = 0;
    let momentumY = 0;
    if (hasPointer && wasPointer && seconds > 0) {
      const vx = finite(pointer.vx) ? clamp(pointer.vx, -POINTER_VELOCITY_CLAMP, POINTER_VELOCITY_CLAMP) : 0;
      const vy = finite(pointer.vy) ? clamp(pointer.vy, -POINTER_VELOCITY_CLAMP, POINTER_VELOCITY_CLAMP) : 0;
      const speed = Math.hypot(vx, vy);
      if (speed > 0) {
        const travelled = Math.hypot(pointer.x - lastX, pointer.y - lastY) / seconds;
        const share = Math.min(1, travelled / speed);
        momentumX = vx * share;
        momentumY = vy * share;
      }
    }

    if (yields && scroll !== 0) {
      for (let index = 0; index < nodeCount; index += 1) {
        if (!valid[index]) continue;
        velY[index] += scroll * SCROLL_GAIN * policy.scrollStrength * (index % 2 === 0 ? 1 : -1);
      }
    }

    if (bends) prepareStrings(layout);

    const viewportWidth = layout.crop?.width ?? layout.width;
    const viewportHeight = layout.crop?.height ?? layout.height;
    const nodeCap = policy.nodeTravelCapPx;
    const edgeCap = policy.edgeCapPx;
    const substeps = seconds > 0 ? Math.ceil(seconds / MAX_SUBSTEP_SECONDS - 1e-9) : 1;
    const h = seconds / substeps;

    for (let substep = 1; substep <= substeps; substep += 1) {
      const along = substep / substeps;
      const pointerX = hasPointer ? (wasPointer ? lastX + (pointer.x - lastX) * along : pointer.x) : 0;
      const pointerY = hasPointer ? (wasPointer ? lastY + (pointer.y - lastY) * along : pointer.y) : 0;

      targetX.fill(0);
      targetY.fill(0);
      nodeDrive.fill(0);
      if (yields && hasPointer) {
        directX.fill(0);
        directY.fill(0);
        weight.fill(0);
        const chosen = selectNearest(pointerX, pointerY);
        for (let slot = 0; slot < chosen; slot += 1) {
          const index = selected[slot];
          const distance = selectedDistance[slot];
          const falloff = Math.max(0, 1 - distance / policy.radiusPx) ** 2;
          if (falloff <= 0) continue;
          const k = (YIELD_GAIN * nodeCap * falloff * nodePressure) / Math.max(1, distance);
          directX[index] = (restX[index] - pointerX) * k;
          directY[index] = (restY[index] - pointerY) * k;
          weight[index] = falloff;
          nodeDrive[index] = falloff * nodeDriveDecay;
        }
        for (let index = 0; index < nodeCount; index += 1) {
          targetX[index] = directX[index];
          targetY[index] = directY[index];
        }
        for (let edge = 0; edge < edgeCount; edge += 1) {
          const [a, b] = edgeEnds[edge];
          if (a < 0 || b < 0) continue;
          targetX[b] += NEIGHBOR_SHARE * directX[a];
          targetY[b] += NEIGHBOR_SHARE * directY[a];
          targetX[a] += NEIGHBOR_SHARE * directX[b];
          targetY[a] += NEIGHBOR_SHARE * directY[b];
        }
        for (let index = 0; index < nodeCount; index += 1) {
          const size = Math.hypot(targetX[index], targetY[index]);
          if (size > nodeCap) {
            targetX[index] = (targetX[index] * nodeCap) / size;
            targetY[index] = (targetY[index] * nodeCap) / size;
          }
        }
        if (momentumX !== 0 || momentumY !== 0) {
          const scale = MOMENTUM_GAIN * (h / MOMENTUM_REFERENCE_SECONDS);
          for (let index = 0; index < nodeCount; index += 1) {
            if (weight[index] <= 0) continue;
            velX[index] += scale * momentumX * weight[index];
            velY[index] += scale * momentumY * weight[index];
          }
        }
      }

      if (yields) {
        const excitationDecay = Math.exp(-h / EXCITATION_DECAY_SECONDS);
        const intensityDecay = Math.exp(-h / NODE_INTENSITY_DECAY_SECONDS);
        for (let index = 0; index < nodeCount; index += 1) {
          if (!valid[index]) continue;
          const ax = NODE_STIFFNESS * (targetX[index] - offX[index]) - NODE_DAMPING * velX[index];
          const ay = NODE_STIFFNESS * (targetY[index] - offY[index]) - NODE_DAMPING * velY[index];
          velX[index] += ax * h;
          velY[index] += ay * h;
          offX[index] += velX[index] * h;
          offY[index] += velY[index] * h;
          // The travel cap, then the visible safe region; motion pushing outward through either is absorbed.
          const size = Math.hypot(offX[index], offY[index]);
          if (size > nodeCap) {
            offX[index] = (offX[index] * nodeCap) / size;
            offY[index] = (offY[index] * nodeCap) / size;
            const radial = (velX[index] * offX[index] + velY[index] * offY[index]) / nodeCap;
            if (radial > 0) {
              velX[index] -= (radial * offX[index]) / nodeCap;
              velY[index] -= (radial * offY[index]) / nodeCap;
            }
          }
          const minX = Math.min(restX[index], 0);
          const maxX = Math.max(restX[index], viewportWidth);
          const minY = Math.min(restY[index], 0);
          const maxY = Math.max(restY[index], viewportHeight);
          const x = clamp(restX[index] + offX[index], minX, maxX);
          const y = clamp(restY[index] + offY[index], minY, maxY);
          if (x !== restX[index] + offX[index]) {
            offX[index] = x - restX[index];
            if (velX[index] * (x - restX[index]) > 0 && (x === minX || x === maxX)) velX[index] = 0;
          }
          if (y !== restY[index] + offY[index]) {
            offY[index] = y - restY[index];
            if (velY[index] * (y - restY[index]) > 0 && (y === minY || y === maxY)) velY[index] = 0;
          }
          nodeExcite[index] = Math.max(nodeExcite[index] * excitationDecay, nodeDrive[index]);
          nodeIntensity[index] = clamp(Math.max(nodeIntensity[index] * intensityDecay, nodeExcite[index]), 0, 1);
        }
      }

      if (bends) {
        const excitationDecay = Math.exp(-h / EXCITATION_DECAY_SECONDS);
        const emphasisDecay = Math.exp(-h / EDGE_EMPHASIS_DECAY_SECONDS);
        for (let edge = 0; edge < edgeCount; edge += 1) {
          if (!edgeValid[edge]) continue;
          const [a, b] = edgeEnds[edge];
          const nx = normalX[edge];
          const ny = normalY[edge];
          const transverseA = velX[a] * nx + velY[a] * ny;
          const transverseB = velX[b] * nx + velY[b] * ny;
          let reach = 0;
          for (let sample = 0; sample < INTERIOR_SAMPLES; sample += 1) {
            const at = edge * INTERIOR_SAMPLES + sample;
            const s = (sample + 1) / STRING_SEGMENTS;
            let target = -ENDPOINT_LAG * (transverseA * (1 - s) + transverseB * s) * Math.sin(Math.PI * s);
            if (hasPointer) {
              const dx = sampleX[at] - pointerX;
              const dy = sampleY[at] - pointerY;
              const distance = Math.hypot(dx, dy);
              const falloff = Math.max(0, 1 - distance / edgeRadius) ** 2;
              if (falloff > 0) {
                target += (EDGE_DRIVE_GAIN * edgeCap * falloff * edgePressure * (dx * nx + dy * ny)) / Math.max(1, distance);
                reach = Math.max(reach, falloff);
              }
            }
            stringTarget[at] = clamp(target, -edgeCap, edgeCap);
          }
          stringWeight[edge] = reach;
          const base0 = edge * INTERIOR_SAMPLES;
          // Jacobi update: every acceleration uses the displacements and velocities at the start of the step.
          for (let sample = 0; sample < INTERIOR_SAMPLES; sample += 1) {
            const at = base0 + sample;
            const left = sample === 0 ? 0 : stringD[at - 1];
            const right = sample === INTERIOR_SAMPLES - 1 ? 0 : stringD[at + 1];
            const acceleration =
              EDGE_TENSION * (left - 2 * stringD[at] + right) + EDGE_STIFFNESS * (stringTarget[at] - stringD[at]) - EDGE_DAMPING * stringV[at];
            nextV[sample] = stringV[at] + acceleration * h;
          }
          for (let sample = 0; sample < INTERIOR_SAMPLES; sample += 1) {
            const at = base0 + sample;
            stringV[at] = nextV[sample];
            stringD[at] += stringV[at] * h;
            if (Math.abs(stringD[at]) > edgeCap) {
              stringD[at] = Math.sign(stringD[at]) * edgeCap;
              if (stringV[at] * stringD[at] > 0) stringV[at] = 0;
            }
          }
          const drive = Math.max(reach * edgeDriveDecay, 0.5 * Math.max(nodeDrive[a], nodeDrive[b]));
          edgeExcite[edge] = Math.max(edgeExcite[edge] * excitationDecay, drive);
          edgeIntensity[edge] = clamp(Math.max(edgeIntensity[edge] * emphasisDecay, edgeExcite[edge]), 0, 1);
        }
      }
    }

    // Rest: every error against the present target, every speed and every intensity below its threshold.
    let rested = true;
    if (yields) {
      for (let index = 0; index < nodeCount && rested; index += 1) {
        if (!valid[index]) continue;
        rested =
          Math.hypot(targetX[index] - offX[index], targetY[index] - offY[index]) < NODE_REST_ERROR_PX &&
          Math.hypot(velX[index], velY[index]) < NODE_REST_SPEED_PX_S &&
          nodeIntensity[index] < INTENSITY_REST;
      }
    }
    if (bends) {
      for (let edge = 0; edge < edgeCount && rested; edge += 1) {
        if (!edgeValid[edge]) continue;
        rested = edgeIntensity[edge] < INTENSITY_REST;
        for (let sample = 0; sample < INTERIOR_SAMPLES && rested; sample += 1) {
          const at = edge * INTERIOR_SAMPLES + sample;
          // Tension holds a settled string off its own target, so its error is its distance from equilibrium: the net
          // spring and tension force over the stiffness (zero exactly when the string is at rest).
          const left = sample === 0 ? 0 : stringD[at - 1];
          const right = sample === INTERIOR_SAMPLES - 1 ? 0 : stringD[at + 1];
          const unbalanced = EDGE_TENSION * (left - 2 * stringD[at] + right) + EDGE_STIFFNESS * (stringTarget[at] - stringD[at]);
          rested = Math.abs(unbalanced) / EDGE_STIFFNESS < EDGE_REST_ERROR_PX && Math.abs(stringV[at]) < EDGE_REST_SPEED_PX_S;
        }
      }
    }
    settled = rested;
    // A rested field with no pointer is exactly the rest pose: residuals under the thresholds are snapped away.
    if (rested && !hasPointer) {
      zeroState();
      return { ...base, projectionLayout: layout };
    }
    if (!isDirty()) return { ...base, projectionLayout: layout };
    return buildPose(base, layout, yields, bends);
  }

  function buildPose(base: ScenePose, layout: ConnectedProjectionLayout, yields: boolean, bends: boolean): ScenePose {
    finalPosition.fill(undefined);
    const nodes = base.nodes.map((node) => {
      const index = nodeIndex.get(node.id);
      if (index === undefined || !valid[index] || (offX[index] === 0 && offY[index] === 0)) return node;
      return { ...node, position: displacedPosition(index, layout) };
    });
    let edgeSamples: { id: string; points: EdgeSamplePoints }[] | undefined;
    if (bends) {
      edgeSamples = [];
      for (let edge = 0; edge < edgeCount; edge += 1) {
        if (!edgeValid[edge]) continue;
        const [a, b] = edgeEnds[edge];
        const from = displacedPosition(a, layout);
        const to = displacedPosition(b, layout);
        const points: Vec3[] = [from];
        for (let sample = 0; sample < INTERIOR_SAMPLES; sample += 1) {
          const rest = evaluateRestEdge({ nodeStyle, edgeIndex: edge, from, to, layout }, (sample + 1) / STRING_SEGMENTS);
          const displacement = stringD[edge * INTERIOR_SAMPLES + sample];
          if (displacement === 0) {
            points.push(rest);
            continue;
          }
          const css = projectAnchor(rest, layout);
          points.push(
            unprojectCss(
              { xPx: css.xPx + normalX[edge] * displacement, yPx: css.yPx + normalY[edge] * displacement, zScene: anchorToScene(rest, layout)[2] },
              layout,
            ),
          );
        }
        points.push(to);
        edgeSamples.push({ id: graph.edges[edge].id, points: points as unknown as EdgeSamplePoints });
      }
    }
    const excitation: { id: string; value: number }[] = [];
    if (yields) {
      for (let index = 0; index < nodeCount; index += 1) if (nodeIntensity[index] > 1e-9) excitation.push({ id: nodeIds[index], value: nodeIntensity[index] });
    }
    if (bends) {
      for (let edge = 0; edge < edgeCount; edge += 1) if (edgeIntensity[edge] > 1e-9) excitation.push({ id: graph.edges[edge].id, value: edgeIntensity[edge] });
    }
    const pose: ScenePose = { ...base, nodes, projectionLayout: layout };
    return {
      ...pose,
      ...(edgeSamples ? { edgeSamples } : {}),
      ...(excitation.length > 0 ? { excitation } : {}),
    };
  }

  return {
    step,
    clear() {
      zeroState();
      hadPointer = false;
      lastNowMs = undefined;
      settled = true;
    },
    isSettled: () => settled,
  };
}
