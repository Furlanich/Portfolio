import type { ControllerOptions } from './types';

/** The browser primitives the scheduler needs, injected so a test can drive them with a virtual display. */
export type FrameEnvironment = {
  /** Monotonic milliseconds, the same clock the controller reads. */
  now(): number;
  setTimeout(callback: () => void, delayMs: number): number;
  clearTimeout(id: number): void;
  requestAnimationFrame(callback: () => void): number;
  cancelAnimationFrame(id: number): void;
};

export type FrameScheduler = {
  scheduler: ControllerOptions['scheduler'];
  /** Cancels everything pending: the host calls it when the scene is released. */
  cancelAll(): void;
  /** How many callbacks are pending; zero whenever the scene is stopped. */
  size(): number;
};

/**
 * A wait longer than this sleeps on one timer until about this long before it is due. The last stretch is watched
 * frame by frame, so how late a timer fires can never decide which refresh a frame lands on.
 */
export const TIMER_LEAD_MS = 24;

/**
 * A callback may run this much before its due time. The controller's due time is "last render plus the interval", and
 * on a display whose refresh period equals the interval (60 Hz and 60 fps) the next refresh lands within a fraction of
 * a millisecond of it, either side. Without this slack that refresh is sometimes missed and the frame takes two. It is
 * small enough that no cadence cap is exceeded by more than a vsync's rounding: ambient frames still come 32.3 ms
 * apart at the earliest, active ones 15.7 ms.
 */
export const EARLY_TOLERANCE_MS = 1;

/**
 * The controller's scheduler on the browser clock. The controller asks for a callback after a delay; the host runs it
 * on an animation frame, so a draw always lands on a refresh. A short delay (an active scroll at 60 fps) is watched
 * from the next animation frame on and runs on the first refresh at or just before its due time. A long delay (an
 * ambient frame) sleeps on one timer and then does the same. Nothing waits on a timer for the last stretch, so a late
 * timer cannot push a frame to the following refresh.
 *
 * The due time is absolute, taken when the callback is scheduled: the controller schedules it from the start of the
 * render, so the cost of the render does not move the next frame. Cancelling clears whichever stage is pending.
 */
export function createFrameScheduler(env: FrameEnvironment): FrameScheduler {
  type Entry = { timeout: number | undefined; frame: number | undefined };
  const pending = new Map<number, Entry>();
  let nextId = 1;
  const clear = (entry: Entry) => {
    if (entry.timeout !== undefined) env.clearTimeout(entry.timeout);
    if (entry.frame !== undefined) env.cancelAnimationFrame(entry.frame);
  };
  return {
    scheduler: {
      schedule(callback, delayMs) {
        const id = nextId++;
        const wait = Math.max(0, delayMs);
        const dueAt = env.now() + wait;
        const entry: Entry = { timeout: undefined, frame: undefined };
        const watch = () => {
          entry.frame = env.requestAnimationFrame(() => {
            entry.frame = undefined;
            if (env.now() >= dueAt - EARLY_TOLERANCE_MS) {
              pending.delete(id);
              callback();
            } else {
              watch();
            }
          });
        };
        if (wait > TIMER_LEAD_MS) {
          entry.timeout = env.setTimeout(() => {
            entry.timeout = undefined;
            watch();
          }, wait - TIMER_LEAD_MS);
        } else {
          watch();
        }
        pending.set(id, entry);
        return id;
      },
      cancel(id) {
        const entry = pending.get(id);
        if (!entry) return;
        clear(entry);
        pending.delete(id);
      },
    },
    cancelAll() {
      pending.forEach(clear);
      pending.clear();
    },
    size: () => pending.size,
  };
}
