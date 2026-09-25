import styles from './immersive-home.module.css';

/**
 * SKY-CHART-V2 D-01/D-02/D-03/D-23 fixed environment layers behind Home's content.
 *
 * Two independent, `aria-hidden`, fixed-position layers with no wrapping DOM element, so
 * nothing here can accidentally become a stacking-context ancestor for the WebGL canvas
 * that Task 7's runtime portals to `document.body` at z-index -2 (between these two layers).
 *
 * - The ground (z -3) carries the D-02 night gradient and an empty poster slot: Task 10
 *   wires the static WebP background image into the poster element once the D-23 assets
 *   exist. Until then the slot renders the gradient only.
 * - The scrim (z -1) is the D-03 contrast gradient that keeps hero and chapter text legible
 *   over the environment. Its width-based gradient direction is server-rendered here; the
 *   D-24 recede-driven opacity is applied at runtime by Task 7.
 */
export function EnvironmentGround() {
  return (
    <>
      <div data-environment-ground aria-hidden="true" className={styles.ground}>
        <div data-environment-poster aria-hidden="true" className={styles.groundPoster} />
      </div>
      <div data-environment-scrim aria-hidden="true" className={styles.scrim} />
    </>
  );
}
