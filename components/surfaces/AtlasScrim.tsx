import type { CSSProperties, ReactNode } from 'react';
import styles from './surfaces.module.css';

interface AtlasScrimProps {
  /** CSS px the opaque backing extends beyond the text on every side: 24, or 32 for the Contact introduction. */
  clearance: 24 | 32;
  className?: string;
  children?: ReactNode;
}

/**
 * PLAN-SFC-V1 reading scrim: an opaque Abyss backing, 8px radius, with no border, shadow or feather, behind
 * text that would otherwise cross the connected graph. The backing is a decorative pseudo-element, so it
 * adds no layout and blocks no pointer event. The element exposes its clearance so the connected host's
 * cached rectangles can exclude the whole backed area. Server-only and never interactive.
 */
export function AtlasScrim({ clearance, className, children }: AtlasScrimProps) {
  return (
    <div
      className={[styles.scrim, className].filter(Boolean).join(' ')}
      style={{ '--atlas-scrim-clearance': `${clearance}px` } as CSSProperties}
      data-connected-reading-mask=""
      data-connected-clearance={String(clearance)}
    >
      {children}
    </div>
  );
}
