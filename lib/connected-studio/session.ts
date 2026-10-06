// Browsing-session state for the connected routes (Services and Projects): Pause persists across
// routes and locales, and a WebGL context loss suppresses the scene for the rest of the session.
// This file holds the only guarded storage boundary in `lib/connected-studio`; the functions take
// an injectable, nullable storage so they stay pure under test.

export type ConnectedSession = { paused: boolean; contextLost: boolean };
export type SessionStorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export const CONNECTED_SESSION_KEYS = {
  paused: 'furlanich:connected-studio-paused',
  contextLost: 'furlanich:connected-studio-context-lost',
} as const;

/** Home's own flag (PC-5): connected routes only read it. A Home loss suppresses their activation. */
const HOME_CONTEXT_LOST_KEY = 'furlanich:sky-chart-context-lost';

// What this page's JavaScript has itself decided, which spans client-side route and locale changes.
// It is the fallback when storage is denied or throws, and it outranks stored Pause once this page
// has set it: a write that failed leaves the stored value stale, and a stale value must never
// override the visitor's latest choice. `paused` is undefined until the page sets it, so a fresh
// page still starts from storage. A context loss only ever turns on, so it needs no such rule.
const memory: { paused: boolean | undefined; contextLost: boolean } = { paused: undefined, contextLost: false };

function resolveStorage(storage: SessionStorageLike | null | undefined): SessionStorageLike | null {
  if (storage !== undefined) return storage;
  try {
    return globalThis.sessionStorage ?? null;
  } catch {
    return null;
  }
}

function read(storage: SessionStorageLike | null, key: string): string | null {
  try {
    return storage ? storage.getItem(key) : null;
  } catch {
    return null;
  }
}

function write(storage: SessionStorageLike | null, key: string, value: string): void {
  try {
    storage?.setItem(key, value);
  } catch {
    // The memory store above still carries the state for this page.
  }
}

export function readConnectedSession(storage?: SessionStorageLike | null): ConnectedSession {
  const target = resolveStorage(storage);
  const storedPause = read(target, CONNECTED_SESSION_KEYS.paused);
  return {
    paused: memory.paused ?? storedPause === '1',
    contextLost:
      memory.contextLost ||
      read(target, CONNECTED_SESSION_KEYS.contextLost) === '1' ||
      read(target, HOME_CONTEXT_LOST_KEY) === '1',
  };
}

export function setConnectedPaused(paused: boolean, storage?: SessionStorageLike | null): ConnectedSession {
  memory.paused = paused;
  write(resolveStorage(storage), CONNECTED_SESSION_KEYS.paused, paused ? '1' : '0');
  return readConnectedSession(storage);
}

export function markConnectedContextLost(storage?: SessionStorageLike | null): ConnectedSession {
  memory.contextLost = true;
  write(resolveStorage(storage), CONNECTED_SESSION_KEYS.contextLost, '1');
  return readConnectedSession(storage);
}
