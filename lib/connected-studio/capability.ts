// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { getQualityForTier, isConnectedTier } from './model.ts';
import type { ConnectedLivePolicy, ConnectedMode, SceneGateInput } from './types';

/**
 * Per-tier live policy (OD-2/OD-4). `wide` covers the wide and tablet tiers. Every merged build
 * ships both false; only a bounded follow-up PR carrying passing hardware evidence turns a tier on.
 */
export const CONNECTED_LIVE_POLICY: ConnectedLivePolicy = Object.freeze({ wide: false, compact: false });

/**
 * Fail-closed gate: the live scene only runs when every condition is the exact expected boolean.
 * Anything else (a missing field, a truthy non-boolean, an unknown tier or policy) keeps the
 * complete static background, so a malformed input can never enable WebGL by accident.
 */
export function chooseConnectedMode(input: SceneGateInput): ConnectedMode {
  if (typeof input !== 'object' || input === null) return 'static';
  if (!isConnectedTier(input.tier)) return 'static';
  if (typeof input.livePolicy !== 'object' || input.livePolicy === null) return 'static';
  const tierEnabled = input.livePolicy[getQualityForTier(input.tier)] === true;
  return input.reducedMotion === false &&
    input.saveData === false &&
    input.webgl2 === true &&
    input.softwareRenderer === false &&
    input.sessionContextLost === false &&
    input.loaded === true &&
    input.visible === true &&
    tierEnabled
    ? 'webgl'
    : 'static';
}
