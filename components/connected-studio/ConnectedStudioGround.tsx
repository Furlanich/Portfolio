import type { CSSProperties } from 'react';
import { getConnectedPoster } from '@/lib/connected-studio/media-manifest';
import type { CapabilityWords, ConnectedRoute } from '@/lib/connected-studio/types';
import type { Locale } from '@/lib/locales';
import { withBasePath } from '@/lib/paths';
import styles from './connected-studio.module.css';

export type ConnectedStudioGroundProps = {
  route: ConnectedRoute;
  locale: Locale;
  /** The localized eight-word vocabulary, from `lib/connected-studio/content`. */
  capabilityWords: CapabilityWords;
};

/**
 * PLAN-SPF-V1 Task 2: the static, server-rendered ground behind a connected route (Services or
 * Projects), and the reserved mount for the optional live scene. Everything here is decorative and
 * complete without JavaScript: the Abyss ground, the low-contrast chart grid and a few distant
 * points are pure CSS, and the matched poster joins them only once Task 8 publishes it. There is no
 * engine, no client boundary and no animation in this file.
 *
 * One fixed, `aria-hidden`, pointer-inert layer with no wrapping element above it, so it cannot
 * become a stacking-context ancestor for the canvas Task 7 attaches inside `data-connected-mount`.
 * Meaningful content (the semantic capability legend, the Pause control and every reading plate)
 * belongs to the page, not to this layer.
 */
export function ConnectedStudioGround({ route, locale, capabilityWords }: ConnectedStudioGroundProps) {
  const wide = getConnectedPoster(route, 'wide');
  const compact = getConnectedPoster(route, 'compact');
  // The poster URLs arrive as custom properties so they carry the deployment base path, which a
  // root-relative `url()` in a CSS module would not. Unpublished posters set nothing, so the layer
  // never requests a missing file and the CSS chart stays the whole static background.
  const posterStyle: Record<string, string> = {};
  if (wide.published) posterStyle['--connected-poster-wide'] = `url("${withBasePath(wide.src)}")`;
  if (compact.published) posterStyle['--connected-poster-compact'] = `url("${withBasePath(compact.src)}")`;

  return (
    <div
      data-connected-ground
      data-connected-route={route}
      data-connected-locale={locale}
      aria-hidden="true"
      className={styles.ground}
      style={posterStyle as CSSProperties}
    >
      <div data-connected-poster className={styles.poster} />
      <div data-connected-mount data-capability-words={JSON.stringify(capabilityWords)} className={styles.mount} />
    </div>
  );
}
