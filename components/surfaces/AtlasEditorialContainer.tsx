import type { ReactNode } from 'react';
import styles from './surfaces.module.css';

interface AtlasEditorialContainerProps {
  children?: ReactNode;
}

/**
 * PLAN-SFC-V1 editorial measure for Studio, Founder, Contact and legal pages: a centered column with a
 * 1180px inner width, 32px gutters from 768px and 20px below. It deliberately differs from the Services
 * and Projects catalogue grid, which keeps its own 1200px inner width. Server-only, no state.
 */
export function AtlasEditorialContainer({ children }: AtlasEditorialContainerProps) {
  return <div className={styles.editorialContainer}>{children}</div>;
}
