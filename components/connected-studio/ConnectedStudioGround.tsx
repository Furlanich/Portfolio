import type { CSSProperties } from 'react';
import { CONNECTED_LIVE_POLICY } from '@/lib/connected-studio/capability';
import { CONNECTED_POSTER_CAPTURE, getConnectedPoster } from '@/lib/connected-studio/media-manifest';
import type {
  CapabilityWords,
  ConnectedWordBinding,
  LegacyConnectedRoute,
  ProfileConnectedRoute,
} from '@/lib/connected-studio/types';
import type { Locale } from '@/lib/locales';
import { withBasePath } from '@/lib/paths';
import { ConnectedStudioEnhancement } from './ConnectedStudioEnhancement';
import styles from './connected-studio.module.css';

/**
 * Services and Projects label their nodes with the localized eight-word capability vocabulary. Studio,
 * Founder and Contact never fabricate eight services: they bind a few decorative words to node ids.
 */
export type ConnectedStudioGroundProps = { locale: Locale } & (
  | { route: LegacyConnectedRoute; capabilityWords: CapabilityWords }
  | { route: ProfileConnectedRoute; wordBindings: readonly ConnectedWordBinding[] }
);

/**
 * PLAN-SPF-V1 Task 2 / PLAN-SFC-V1 Task 2: the static, server-rendered ground behind a connected route,
 * and the reserved mount for the optional live scene. Everything here is decorative and complete without
 * JavaScript: the Abyss ground, the low-contrast chart grid and a few distant points are pure CSS, and the
 * matched poster joins them only once its page packet publishes it. There is no engine, no client boundary
 * and no animation in this file.
 *
 * One fixed, `aria-hidden`, pointer-inert layer with no wrapping element above it, so it cannot
 * become a stacking-context ancestor for the canvas attached inside `data-connected-mount`.
 * Meaningful content (the semantic capability legend, the Pause control and every reading plate)
 * belongs to the page, not to this layer.
 *
 * The client leaf is a policy decision made here on the server. Services and Projects always render it
 * (it gates itself). A profile route renders it only while a live tier is enabled, so a policy-disabled
 * build ships the complete static page without the host ever reaching the client.
 */
export function ConnectedStudioGround(props: ConnectedStudioGroundProps) {
  const { route, locale } = props;
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

  const liveTierEnabled = CONNECTED_LIVE_POLICY.wide || CONNECTED_LIVE_POLICY.compact;

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
      {'capabilityWords' in props ? (
        <>
          <div data-connected-mount data-capability-words={JSON.stringify(props.capabilityWords)} className={styles.mount} />
          <ConnectedStudioEnhancement route={props.route} locale={locale} capabilityWords={props.capabilityWords} />
        </>
      ) : (
        <>
          <div data-connected-mount data-word-bindings={JSON.stringify(props.wordBindings)} className={styles.mount} />
          {liveTierEnabled ? (
            <ConnectedStudioEnhancement route={props.route} locale={locale} wordBindings={props.wordBindings} />
          ) : null}
        </>
      )}
    </div>
  );
}
