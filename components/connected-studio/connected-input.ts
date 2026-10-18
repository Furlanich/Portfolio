// PLAN-SFC-V1 Task 11: the host's cached input model. Pure functions and small stateful helpers with no DOM
// globals and no imports, so the always-loaded host script stays small and Node can test the whole contract.
// Nothing here reads layout: the host measures the boxes once in its batched pass and passes numbers in.

/** A cached document-space box of a foreground block the scene must stay clear of. */
export type ConnectedBox = {
  readonly kind: 'plate' | 'scrim' | 'legacy';
  readonly left: number;
  readonly docTop: number;
  readonly width: number;
  readonly height: number;
  /** CSS px the opaque backing extends beyond a scrim's text on every side (24, or 32 on the Contact introduction). */
  readonly clearance: number;
};

export type ViewportRect = { readonly left: number; readonly top: number; readonly width: number; readonly height: number };

/** Opaque plates and reading text also keep this much distance from new excitation (DESIGN-SFC-V1 review clarification). */
export const EXCLUSION_MARGIN_PX = 8;

function usable(box: ConnectedBox): boolean {
  return (
    Number.isFinite(box.left) &&
    Number.isFinite(box.docTop) &&
    Number.isFinite(box.width) &&
    Number.isFinite(box.height) &&
    box.width > 0 &&
    box.height > 0
  );
}

function grown(box: ConnectedBox, scrollY: number, extra: number): ViewportRect {
  return { left: box.left - extra, top: box.docTop - scrollY - extra, width: box.width + extra * 2, height: box.height + extra * 2 };
}

/** The area a label must stay out of: a plate as drawn, a scrim with its opaque backing, a legacy mask as measured. */
export function labelOccluders(boxes: readonly ConnectedBox[], scrollY: number): ViewportRect[] {
  return boxes.filter(usable).map((box) => grown(box, scrollY, box.clearance));
}

/** The area that takes no new excitation: the occluder plus the pointer margin. */
export function exclusionRects(boxes: readonly ConnectedBox[], scrollY: number): ViewportRect[] {
  return boxes.filter(usable).map((box) => grown(box, scrollY, box.clearance + EXCLUSION_MARGIN_PX));
}

export function isExcluded(x: number, y: number, rects: readonly ViewportRect[]): boolean {
  return rects.some((rect) => x >= rect.left && x <= rect.left + rect.width && y >= rect.top && y <= rect.top + rect.height);
}

export type PointerSample = { readonly x: number; readonly y: number; readonly vx: number; readonly vy: number };

export type PointerSampler = {
  /** The pointer's CSS position and velocity, or null for a sample that carries no usable position or time. */
  sample(input: { x: number; y: number; timeStampMs: number }): PointerSample | null;
  /** Forget the previous sample: the next one is a first entry and carries no velocity. */
  reset(): void;
};

/** Velocity is measured over windows of at least this long, so a 1000Hz mouse and a 60Hz one report the same speed. */
const VELOCITY_WINDOW_MS = 8;
/** A gap this long means the pointer was not observed: no speed is carried across it. */
const VELOCITY_GAP_MS = 100;

export function createPointerSampler(): PointerSampler {
  let anchor: { x: number; y: number; t: number } | null = null;
  let vx = 0;
  let vy = 0;
  return {
    sample({ x, y, timeStampMs }) {
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(timeStampMs)) return null;
      if (!anchor || timeStampMs <= anchor.t || timeStampMs - anchor.t > VELOCITY_GAP_MS) {
        anchor = { x, y, t: timeStampMs };
        vx = 0;
        vy = 0;
      } else if (timeStampMs - anchor.t >= VELOCITY_WINDOW_MS) {
        const seconds = (timeStampMs - anchor.t) / 1000;
        vx = (x - anchor.x) / seconds;
        vy = (y - anchor.y) / seconds;
        anchor = { x, y, t: timeStampMs };
      }
      return { x, y, vx, vy };
    },
    reset() {
      anchor = null;
      vx = 0;
      vy = 0;
    },
  };
}

export type ScrollClassifier = {
  /** A wheel, touch or scroll-key gesture happened. */
  noteGesture(nowMs: number): void;
  /** Navigation, anchor, history restore, page show or resize moved the document: not a gesture to replay. */
  noteJump(nowMs: number): void;
  /** The distance to feed the interaction for a scroll event: the delta of an ordinary scroll, otherwise zero. */
  classify(nowMs: number, deltaPx: number): number;
};

/** A scroll counts as the visitor's own for this long after their last gesture. */
const GESTURE_WINDOW_MS = 400;
/** One scroll event this long is a jump, never an ordinary notch (a wheel notch is about 100, the model clamps at 120). */
const JUMP_DELTA_PX = 480;

export function createScrollClassifier(): ScrollClassifier {
  let gestureAt = Number.NEGATIVE_INFINITY;
  return {
    noteGesture(nowMs) {
      gestureAt = nowMs;
    },
    noteJump() {
      gestureAt = Number.NEGATIVE_INFINITY;
    },
    classify(nowMs, deltaPx) {
      if (!Number.isFinite(deltaPx) || Math.abs(deltaPx) > JUMP_DELTA_PX) return 0;
      return nowMs - gestureAt <= GESTURE_WINDOW_MS ? deltaPx : 0;
    },
  };
}

export type FormSuspension = {
  focusChanged(insideForm: boolean): void;
  phaseChanged(phase: string | null): void;
  /** An eligible background input arrived (a mouse move outside every exclusion, or an ordinary scroll). Returns whether it lifted the suspension. */
  backgroundInput(): boolean;
  /**
   * The visitor pressed Resume on the Pause control. A deliberate request for the background is at least as eligible as a
   * mouse move: it lifts the waiting state, so the control never reads "Pause background" over a scene it left frozen.
   * A focus inside the form and a submission in flight still hold. Returns whether it lifted the suspension.
   */
  deliberateResume(): boolean;
  suspended(): boolean;
};

/**
 * Focus in the inquiry form, or a submission in flight, suspends the decorative drawing. It does not lift when
 * focus leaves: the next eligible background input does, so a visitor who is still typing elsewhere is not met by
 * a graph that springs back on its own.
 */
export function createFormSuspension(): FormSuspension {
  let focusInside = false;
  let submitting = false;
  let waiting = false;
  const lift = () => {
    if (focusInside || submitting || !waiting) return false;
    waiting = false;
    return true;
  };
  return {
    focusChanged(insideForm) {
      focusInside = insideForm;
      if (insideForm) waiting = true;
    },
    phaseChanged(phase) {
      submitting = phase === 'submitting';
      if (submitting) waiting = true;
    },
    backgroundInput: lift,
    deliberateResume: lift,
    suspended: () => focusInside || submitting || waiting,
  };
}

/** Elements that take the pointer for themselves: entering one removes new excitation. */
export const INTERACTIVE_SELECTOR =
  'a[href],button,summary,input,select,textarea,label,form,[role="button"],[role="link"],[contenteditable]:not([contenteditable="false"])';

const EDITABLE_SELECTOR = 'input,select,textarea,[contenteditable]:not([contenteditable="false"])';

function closestMatch(target: EventTarget | null, selector: string): boolean {
  const closest = (target as { closest?: (selector: string) => unknown } | null)?.closest;
  return typeof closest === 'function' && closest.call(target, selector) != null;
}

export function isInteractiveTarget(target: EventTarget | null): boolean {
  return closestMatch(target, INTERACTIVE_SELECTOR);
}

/** Editable surfaces: typing, selecting and scrolling inside them never excites the graph. */
export function isEditableTarget(target: EventTarget | null): boolean {
  return closestMatch(target, EDITABLE_SELECTOR);
}
