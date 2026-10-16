import Link from 'next/link';
import { AtlasScrim } from '@/components/surfaces/AtlasScrim';
import type { StudioPageContent } from './content-types';
import styles from './studio.module.css';

interface StudioFounderBridgeProps {
  content: StudioPageContent['founderBridge'];
  actionHref: string;
}

/** One short reason to read the founder's background and a single secondary link; no biography is repeated here. */
export function StudioFounderBridge({ content, actionHref }: StudioFounderBridgeProps) {
  return (
    <section aria-labelledby="studio-founder-heading">
      <AtlasScrim clearance={24} className={styles.textBlock}>
        <h2 id="studio-founder-heading" className={styles.sectionHeading}>
          {content.heading}
        </h2>
        <p className={styles.body}>{content.description}</p>
        <Link href={actionHref} className={`${styles.action} ${styles.actionSecondary} ${styles.sectionAction}`}>
          {content.action.label}
        </Link>
      </AtlasScrim>
    </section>
  );
}
