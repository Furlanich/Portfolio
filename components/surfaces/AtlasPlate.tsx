import type { ReactNode } from 'react';
import styles from './surfaces.module.css';

interface AtlasPlateProps {
  as?: 'article' | 'div' | 'li' | 'section';
  plateNumber?: string;
  blur?: boolean;
  /**
   * `default` is the SKY-CHART-V2 translucent chart plate. `editorial-opaque` is the PLAN-SFC-V1 reading
   * surface for Studio, Founder, Contact and legal pages: opaque Deep fill, 1px border, 16px radius, no
   * blur, shadow or registration ticks (DESIGN-SFC-V1, "Visual system and dimensions").
   */
  variant?: 'default' | 'editorial-opaque';
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
  variant = 'default',
  className,
  children,
}: AtlasPlateProps) {
  if (variant === 'editorial-opaque') {
    // Marked so the connected host can treat the plate as an opaque reading box (+8px) when it
    // decides where pointer excitation is eligible.
    return (
      <Component className={[styles.editorialPlate, className].filter(Boolean).join(' ')} data-connected-opaque-plate="">
        {children}
      </Component>
    );
  }

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
