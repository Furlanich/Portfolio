interface PauseMotionControlProps {
  paused: boolean;
  /** D-25: hidden while the hero has not cleared 60% of the viewport, or once fully receded. */
  hidden: boolean;
  pauseLabel: string;
  resumeLabel: string;
  /** `Plate 0N of 04` readout (statusLabel already interpolated); shown at >=768px only. */
  phaseLabel: string;
  onToggle(): void;
}

/**
 * D-25 Pause control: a fixed plate-material pill, independent of scroll position. Ordinary
 * HTML button -- its visible name states the next action, so assistive technology hears the
 * current state through the label change, and `aria-pressed` states it explicitly too.
 */
export function PauseMotionControl({ paused, hidden, pauseLabel, resumeLabel, phaseLabel, onToggle }: PauseMotionControlProps) {
  return (
    <div
      data-pause-motion-pill
      hidden={hidden}
      className="sky-plate-material-solid pointer-events-none fixed z-40 flex items-center gap-2.5 rounded-xl border border-sky-plate-line py-1.5 pl-3.5 pr-1.5"
      style={{ right: 16, bottom: 'calc(16px + env(safe-area-inset-bottom))' }}
    >
      <span aria-hidden="true" className="hidden font-mono text-xs text-sky-text-2 md:inline">
        {phaseLabel}
      </span>
      <button
        type="button"
        data-pause-motion
        data-state={paused ? 'paused' : 'playing'}
        aria-pressed={paused}
        onClick={onToggle}
        className="pointer-events-auto inline-flex min-h-11 items-center justify-center rounded-[9px] border border-sky-glow/50 bg-transparent px-3.5 text-sm font-semibold text-identity-bone transition-colors duration-[160ms] ease-out hover:bg-sky-lit/10 focus:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-sky-glow"
      >
        {paused ? resumeLabel : pauseLabel}
      </button>
    </div>
  );
}
