'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import styles from './position-fix.module.css';

export type PositionFixMode = 'separate' | 'connected';

interface PositionFixToggleProps {
  groupLabel: string;
  separateLabel: string;
  connectedLabel: string;
  /** Template containing a literal "{state}" placeholder. */
  announcementTemplate: string;
  separateContent: ReactNode;
  connectedContent: ReactNode;
}

const CROSSFADE_MS = 240;

/**
 * The mode the toggle selects once it mounts and progressively enhances the
 * figure. Before mount (no JS, or before hydration) there is no selection at
 * all: the initial render has no button element, and both figures stay
 * visible, stacked in source order (separate, then connected), with the
 * source list below them.
 */
const INITIAL_MODE: PositionFixMode = 'separate';

const noopSubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * True once this render is happening on the client, after hydration; false
 * during server rendering and on the very first client render (which must
 * match the server output exactly). This is the standard hydration-safe
 * "has mounted" flag, built on useSyncExternalStore per the React docs,
 * rather than the more common `useState(false)` + `useEffect(() =>
 * setMounted(true), [])` pattern: that pattern calls setState synchronously
 * inside an effect, which react-hooks/set-state-in-effect (correctly) flags,
 * since it forces an extra render. useSyncExternalStore's server/client
 * snapshots give the same before/after-hydration values without ever
 * calling setState.
 */
function useMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, getClientSnapshot, getServerSnapshot);
}

/**
 * Progressively enhances PositionFixFigure: a segmented control that swaps
 * which of the two server-rendered SVGs (small multiples) is visible.
 *
 *   - No JS / pre-hydration (`mounted` is false): no button element at all;
 *     both figures render stacked and visible, in source order, with the
 *     source list below.
 *   - After mount (`mounted` is true): the segmented control appears with
 *     "separate" selected (aria-pressed matches `selected` directly) and
 *     the connected figure gets the native `hidden` attribute, so the
 *     pressed state always matches what is visible.
 */
export function PositionFixToggle({
  groupLabel,
  separateLabel,
  connectedLabel,
  announcementTemplate,
  separateContent,
  connectedContent,
}: PositionFixToggleProps) {
  const mounted = useMounted();
  const [selected, setSelected] = useState<PositionFixMode>(INITIAL_MODE);
  const [hiddenLayer, setHiddenLayer] = useState<PositionFixMode | null>(null);
  // N-S1 (independent review round 2): starts empty, and only select() ever
  // sets it, so a screen reader never announces anything on page load --
  // only in response to an actual click.
  const [announcement, setAnnouncement] = useState('');
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(
    () => () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    },
    [],
  );

  function select(mode: PositionFixMode) {
    if (selected === mode) return;

    setSelected(mode);
    setAnnouncement(announcementTemplate.replace('{state}', mode === 'separate' ? separateLabel : connectedLabel));
    // Reveal both layers immediately: the incoming one starts from the
    // faded-out/blurred point declared by the @starting-style rule in
    // position-fix.module.css (it was `hidden`, i.e. not rendered at all,
    // the moment before) and transitions in once `data-fade` becomes "in";
    // the outgoing one was already visible, so it transitions out from its
    // current opacity in the same tick.
    setHiddenLayer(null);

    if (hideTimeout.current) clearTimeout(hideTimeout.current);

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const outgoing: PositionFixMode = mode === 'separate' ? 'connected' : 'separate';

    hideTimeout.current = setTimeout(
      () => setHiddenLayer(outgoing),
      prefersReducedMotion ? 0 : CROSSFADE_MS,
    );
  }

  // Before mount, nothing is hidden (both figures render stacked and visible
  // without JS). Once mounted, if no click has run yet (hiddenLayer is still
  // its initial null), the non-selected layer is hidden by default — this is
  // what "applies the initial selection on mount" without ever calling
  // setState inside an effect: it falls out of `mounted` alone.
  const effectiveHiddenLayer: PositionFixMode | null = !mounted
    ? null
    : (hiddenLayer ?? (selected === 'separate' ? 'connected' : 'separate'));

  return (
    <>
      {mounted && (
        <div role="group" aria-label={groupLabel} className={styles.seg}>
          <button
            type="button"
            aria-pressed={selected === 'separate'}
            className={styles.segButton}
            onClick={() => select('separate')}
          >
            {separateLabel}
          </button>
          <button
            type="button"
            aria-pressed={selected === 'connected'}
            className={styles.segButton}
            onClick={() => select('connected')}
          >
            {connectedLabel}
          </button>
        </div>
      )}

      {/* N-B1 (independent review round 2): data-enhanced only appears once
          mounted, so a no-JS/pre-hydration render keeps the CSS default
          (both layers flow vertically, in source order) instead of the
          enhanced single-grid-cell crossfade stacking, which would overlap
          the two SVGs (and their captions) before any JS has run. */}
      <div className={styles.layerStack} data-enhanced={mounted || undefined}>
        <div
          className={styles.layer}
          data-fade={!mounted ? undefined : selected === 'separate' ? 'in' : 'out'}
          hidden={effectiveHiddenLayer === 'separate'}
        >
          {separateContent}
        </div>
        <div
          className={styles.layer}
          data-fade={!mounted ? undefined : selected === 'connected' ? 'in' : 'out'}
          hidden={effectiveHiddenLayer === 'connected'}
        >
          {connectedContent}
        </div>
      </div>

      <p aria-live="polite" className={styles.liveRegion}>
        {announcement}
      </p>
    </>
  );
}
