import type { ReactNode } from 'react';
import styles from './surfaces.module.css';

interface PlottingSheetProps {
  as?: 'article' | 'div' | 'li' | 'section';
  bearing?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * SKY-CHART-V2 D-06 plotting sheet. A translucent bone vellum with a plotting grid, an
 * optional bearing label and a corner crease line. Server-only: never interactive (no
 * hover, cursor or focus styling of its own).
 */
export function PlottingSheet({
  as: Component = 'div',
  bearing,
  className,
  children,
}: PlottingSheetProps) {
  const classes = [styles.plottingSheet, 'sky-sheet-material', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes}>
      <span className={styles.plottingSheetCrease} aria-hidden="true" />
      {bearing ? (
        <span className={styles.plottingSheetBearing} aria-hidden="true">
          {bearing}
        </span>
      ) : null}
      {children}
    </Component>
  );
}
