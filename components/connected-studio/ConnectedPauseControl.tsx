import type { ConnectedControlLabels } from '@/lib/connected-studio/content';
import styles from './connected-studio.module.css';

type ConnectedPauseControlProps = {
  labels: ConnectedControlLabels;
  paused: boolean;
  /**
   * Set after the live scene fell back to the static background. A control that holds focus then
   * stays in place, reads "Fondo estático" / "Static background" and is `aria-disabled`.
   */
  fallback: boolean;
  onToggle(): void;
  /** The fallback control goes away once it loses focus. */
  onBlur(): void;
};

/**
 * The hero Pause control (DESIGN-SPF-V1, "Motion and interaction contract"): an ordinary button, at
 * least 44px in both directions, portaled by the enhancement into the slot the page reserved. Its
 * visible name states the next action and `aria-pressed` states the current one, as on Home.
 */
export function ConnectedPauseControl({ labels, paused, fallback, onToggle, onBlur }: ConnectedPauseControlProps) {
  return (
    <button
      type="button"
      data-connected-pause
      data-state={fallback ? 'static' : paused ? 'paused' : 'playing'}
      aria-pressed={fallback ? undefined : paused}
      aria-disabled={fallback ? true : undefined}
      onClick={fallback ? undefined : onToggle}
      onBlur={fallback ? onBlur : undefined}
      className={styles.pause}
    >
      {fallback ? labels.staticBackground : paused ? labels.resume : labels.pause}
    </button>
  );
}
