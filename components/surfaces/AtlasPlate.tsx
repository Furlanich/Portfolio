import type { ReactNode } from 'react';
import styles from './surfaces.module.css';

interface AtlasPlateProps {
  as?: 'article' | 'div' | 'li' | 'section';
  plateNumber?: string;
  blur?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * SKY-CHART-V2 D-05 atlas plate. A dark translucent chart surface with registration
 * corner ticks and an optional plate number. Server-only: never interactive (no hover,
 * cursor or focus styling), so it stays safe to nest inside an actionable ancestor.
 */
export function AtlasPlate({
  as: Component = 'div',
  plateNumber,
  blur = true,
  className,
  children,
}: AtlasPlateProps) {
  const classes = [
    styles.atlasPlate,
    blur ? 'sky-plate-material' : 'sky-plate-material-solid',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes}>
      <span className={styles.atlasPlateTick} aria-hidden="true" />
      <span className={`${styles.atlasPlateTick} ${styles.atlasPlateTickEnd}`} aria-hidden="true" />
      {plateNumber ? (
        <span className={styles.atlasPlateNumber} aria-hidden="true">
          {plateNumber}
        </span>
      ) : null}
      {children}
    </Component>
  );
}
