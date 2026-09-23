interface PauseMotionControlProps {
  paused: boolean;
  pauseLabel: string;
  resumeLabel: string;
  onToggle(): void;
}

// Ordinary HTML button: its visible name states the next action, so assistive technology
// hears the current state through the label change.
export function PauseMotionControl({ paused, pauseLabel, resumeLabel, onToggle }: PauseMotionControlProps) {
  return (
    <button
      type="button"
      data-pause-motion
      data-state={paused ? 'paused' : 'playing'}
      onClick={onToggle}
      className="pointer-events-auto inline-flex min-h-11 items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-4 text-sm font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-surface focus-visible:ring-offset-[3px] focus-visible:ring-offset-foundation-action-strong"
    >
      {paused ? resumeLabel : pauseLabel}
    </button>
  );
}
