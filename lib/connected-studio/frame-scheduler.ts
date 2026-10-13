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
 * The controller's scheduler on the browser clock: a timer for the interval, then one animation frame
 * so a draw lands on a frame boundary. Cancelling clears whichever stage is pending.
 */
export function createFrameScheduler(env: FrameEnvironment): FrameScheduler {
  const pending = new Map<number, { timeout: number; frame: number }>();
  let nextId = 1;
  const clear = (entry: { timeout: number; frame: number }) => {
    env.clearTimeout(entry.timeout);
    env.cancelAnimationFrame(entry.frame);
  };
  return {
    scheduler: {
      schedule(callback, delayMs) {
        const id = nextId++;
        const entry = { timeout: 0, frame: 0 };
        entry.timeout = env.setTimeout(() => {
          entry.frame = env.requestAnimationFrame(() => {
            pending.delete(id);
            callback();
          });
        }, delayMs);
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
