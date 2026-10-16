import Link from 'next/link';
import { AtlasScrim } from '@/components/surfaces/AtlasScrim';
import type { StudioPageContent } from './content-types';
import styles from './studio.module.css';

interface StudioFinalCtaProps {
  content: StudioPageContent['finalCta'];
  actionHref: string;
}

/** The closing heading and the primary localized Contact action, in ordinary flow before the shared Footer. */
export function StudioFinalCta({ content, actionHref }: StudioFinalCtaProps) {
  return (
    <section aria-labelledby="studio-cta-heading">
      <AtlasScrim clearance={24} className={styles.textBlock}>
        <h2 id="studio-cta-heading" className={styles.sectionHeading}>
          {content.heading}
        </h2>
        <p className={styles.body}>{content.description}</p>
        <Link href={actionHref} className={`${styles.action} ${styles.actionPrimary} ${styles.sectionAction}`}>
          {content.action.label}
        </Link>
      </AtlasScrim>
    </section>
  );
}
