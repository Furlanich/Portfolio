import { counts } from '@/lib/impact/position-fix';
import styles from './position-fix.module.css';

const MAX_COUNT = Math.max(counts.separate, counts.connected);

function barWidth(value: number): string {
  return `${(value / MAX_COUNT) * 100}%`;
}

interface ImpactCountsProps {
  content: {
    counts: {
      title: string;
      separateLabel: string;
      connectedLabel: string;
      caption: string;
    };
  };
}

/**
 * Two-row count comparison. Values always come from lib/impact/position-fix's
 * `counts` (itself computed from SOURCES), never hard-coded, per the honesty
 * rule in plan section 12.
 */
export function ImpactCounts({ content }: ImpactCountsProps) {
  return (
    <div className={styles.counts}>
      <p className={styles.countsTitle}>{content.counts.title}</p>
      <div className={styles.bars}>
        <div className={styles.barRow}>
          <span>{content.counts.separateLabel}</span>
          <span className={styles.track} aria-hidden="true">
            <span
              className={`${styles.barValue} ${styles.barContext}`}
              style={{ width: barWidth(counts.separate) }}
            />
          </span>
          <b>{counts.separate}</b>
        </div>
        <div className={styles.barRow}>
          <span>{content.counts.connectedLabel}</span>
          <span className={styles.track} aria-hidden="true">
            <span
              className={`${styles.barValue} ${styles.barSignal}`}
              style={{ width: barWidth(counts.connected) }}
            />
          </span>
          <b>{counts.connected}</b>
        </div>
      </div>
      <p className={styles.countsCaption}>{content.counts.caption}</p>
    </div>
  );
}
