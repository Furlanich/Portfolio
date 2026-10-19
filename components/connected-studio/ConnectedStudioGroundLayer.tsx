import type { CSSProperties, ReactNode } from 'react';
import { CONNECTED_POSTER_CAPTURE, getConnectedPoster } from '@/lib/connected-studio/media-manifest';
import type { ConnectedRoute } from '@/lib/connected-studio/types';
import type { Locale } from '@/lib/locales';
import { withBasePath } from '@/lib/paths';
import styles from './connected-studio.module.css';

type ConnectedStudioGroundLayerProps = {
  route: ConnectedRoute;
  locale: Locale;
  /** The data attribute that carries the route's decorative words (`data-capability-words` or `data-word-bindings`). */
  mountAttribute: Record<string, string>;
  /** The optional live leaf, placed after the mount point. */
  children?: ReactNode;
};

/**
 * PLAN-SPF-V1 Task 2 / PLAN-SFC-V1 Tasks 2, 14 and 16: the static, server-rendered ground behind a connected
 * route, and the reserved mount for the optional live scene. Everything here is decorative and complete
 * without JavaScript: the Abyss ground, the low-contrast chart grid, a few distant points and the matched
 * poster are pure CSS. There is no engine, no client boundary, no animation and, deliberately, no import of
 * the live host: a page that imports this module must not be able to reach the host's chunk.
 *
 * One fixed, `aria-hidden`, pointer-inert layer with no wrapping element above it, so it cannot become a
 * stacking-context ancestor for the canvas attached inside `data-connected-mount`. Meaningful content (the
 * semantic capability legend, the Pause control and every reading plate) belongs to the page, not to this layer.
 */
export function ConnectedStudioGroundLayer({ route, locale, mountAttribute, children }: ConnectedStudioGroundLayerProps) {
  const wide = getConnectedPoster(route, 'wide');
  const compact = getConnectedPoster(route, 'compact');
  // The poster URLs arrive as custom properties so they carry the deployment base path, which a
  // root-relative `url()` in a CSS module would not. Unpublished posters set nothing, so the layer
  // never requests a missing file and the CSS chart stays the whole static background.
  const posterStyle: Record<string, string> = {
    '--connected-poster-position': `${CONNECTED_POSTER_CAPTURE.position.x * 100}% ${CONNECTED_POSTER_CAPTURE.position.y * 100}%`,
  };
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
      <div data-connected-mount {...mountAttribute} className={styles.mount} />
      {children}
    </div>
  );
}
