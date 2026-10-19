import Link from 'next/link';
import { AtlasScrim } from '@/components/surfaces/AtlasScrim';
import type { FounderPageContent } from './content-types';
import styles from './founder.module.css';

interface FounderFinalCtaProps {
  content: FounderPageContent['finalCta'];
  actionHref: string;
}

export function FounderFinalCta({ content, actionHref }: FounderFinalCtaProps) {
  return (
    <section aria-labelledby="founder-final-cta-heading" className={styles.finalCta}>
      <AtlasScrim clearance={24} className={styles.finalCtaScrim}>
        <h2 id="founder-final-cta-heading" className={styles.sectionHeading}>{content.heading}</h2>
        <p className={`${styles.body} ${styles.finalCtaDescription}`}>{content.description}</p>
        <Link href={actionHref} className={styles.finalAction}>{content.action.label}</Link>
      </AtlasScrim>
    </section>
  );
}
