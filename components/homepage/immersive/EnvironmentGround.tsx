import type { CSSProperties } from 'react';
import { getEnvironmentPoster } from '@/lib/immersive-home/media-manifest';
import { withBasePath } from '@/lib/paths';
import styles from './immersive-home.module.css';

/**
 * SKY-CHART-V2 D-01/D-02/D-03/D-23 fixed environment layers behind Home's content.
 *
 * Two independent, `aria-hidden`, fixed-position layers with no wrapping DOM element, so
 * nothing here can accidentally become a stacking-context ancestor for the WebGL canvas
 * that Task 7's runtime portals to `document.body` at z-index -2 (between these two layers).
 *
 * - The ground (z -3) carries the D-02 night gradient and the D-23 static poster: a
 *   decorative CSS background (no alt text, never preloaded) that shows in every static path
 *   and hides once the WebGL scene has painted (`data-immersive-mode="webgl"`). The two
 *   poster URLs are set as custom properties so they carry the optional deployment base path,
 *   which a root-relative `url()` in a CSS module would not; the stylesheet picks between them
 *   at 767px.
 * - The scrim (z -1) is the D-03 contrast gradient that keeps hero and chapter text legible
 *   over the environment. Its width-based gradient direction is server-rendered here; the
 *   D-24 recede-driven opacity is applied at runtime by Task 7.
 */
export function EnvironmentGround() {
  const posterStyle = {
    '--environment-poster-wide': `url("${withBasePath(getEnvironmentPoster('environment-wide').src)}")`,
    '--environment-poster-compact': `url("${withBasePath(getEnvironmentPoster('environment-compact').src)}")`,
  } as CSSProperties;

  return (
    <>
      <div data-environment-ground aria-hidden="true" className={styles.ground}>
        <div data-environment-poster aria-hidden="true" className={styles.groundPoster} style={posterStyle} />
      </div>
      <div data-environment-scrim aria-hidden="true" className={styles.scrim} />
    </>
  );
}
