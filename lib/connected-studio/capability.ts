// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { getQualityForTier, isConnectedTier } from './model.ts';
import type { ConnectedLivePolicy, ConnectedMode, SceneGateInput } from './types';

/**
 * Per-tier live policy (OD-2/OD-4). `wide` covers the wide and tablet tiers. A tier is turned on only by a bounded
 * enablement PR that carries its qualification: PLAN-SFC-V1 Task 18 enabled `wide` on the owner's acceptance of the
 * wide tier (docs/reviews/studio-founder-contact-acceptance-v1/task-15.md). PLAN-SFC-V1 Task 25 enabled `compact` on the
 * owner's manual test of the compact live scene on a phone (docs/reviews/studio-founder-contact-acceptance-v1/task-25.md);
 * like the wide tier it is an owner acceptance, not a measured hardware qualification. The remaining gates (reduced
 * motion, Save-Data, WebGL2, software renderer, context loss) still keep a visitor on the complete static page.
 */
export const CONNECTED_LIVE_POLICY: ConnectedLivePolicy = Object.freeze({ wide: true, compact: true });

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
