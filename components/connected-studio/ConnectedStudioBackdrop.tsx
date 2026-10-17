import styles from './connected-studio.module.css';

/**
 * The shared static Azure chart environment, without a poster or live-scene mount. Legal reading pages use
 * this same CSS ground as Studio while keeping their surface server-rendered and free of connected runtime.
 */
export function ConnectedStudioBackdrop() {
  return <div data-connected-ground aria-hidden="true" className={styles.ground} />;
}
