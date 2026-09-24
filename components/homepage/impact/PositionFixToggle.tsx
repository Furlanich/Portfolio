'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
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
 * Progressively enhances PositionFixFigure: a segmented control that swaps
 * which of the two server-rendered SVGs (small multiples) is visible.
 *
 * `selected` starts at `null` and the inactive layer only gains the native
 * `hidden` attribute once a click has actually run, so a browser without
 * JavaScript (or before hydration) renders both SVGs stacked and visible,
 * per plan section 12 / Task 5 packet ("Without JS, both SVGs stay visible").
 */
export function PositionFixToggle({
  groupLabel,
  separateLabel,
  connectedLabel,
  announcementTemplate,
  separateContent,
  connectedContent,
}: PositionFixToggleProps) {
  const [selected, setSelected] = useState<PositionFixMode | null>(null);
  const [hiddenLayer, setHiddenLayer] = useState<PositionFixMode | null>(null);
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
    // Reveal both layers immediately so the incoming one can fade in; the
    // outgoing one keeps its own opacity/blur transition running until it
    // finishes, then gets `hidden` so it leaves the accessibility tree.
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

  const announcement = selected
    ? announcementTemplate.replace('{state}', selected === 'separate' ? separateLabel : connectedLabel)
    : '';

  return (
    <>
      <div role="group" aria-label={groupLabel} className={styles.seg}>
        <button
          type="button"
          aria-pressed={selected !== 'connected'}
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

      <div
        className={styles.layer}
        data-fade={selected === null ? undefined : selected === 'separate' ? 'in' : 'out'}
        hidden={hiddenLayer === 'separate'}
      >
        {separateContent}
      </div>
      <div
        className={styles.layer}
        data-fade={selected === null ? undefined : selected === 'connected' ? 'in' : 'out'}
        hidden={hiddenLayer === 'connected'}
      >
        {connectedContent}
      </div>

      <p aria-live="polite" className={styles.liveRegion}>
        {announcement}
      </p>
    </>
  );
}
