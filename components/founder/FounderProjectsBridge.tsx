import Link from 'next/link';
import type { FounderPageContent } from './content-types';
import styles from './founder.module.css';

interface FounderProjectsBridgeProps {
  content: FounderPageContent['projectsBridge'];
  actionHref: string;
}

export function FounderProjectsBridge({ content, actionHref }: FounderProjectsBridgeProps) {
  return (
    <section aria-labelledby="founder-projects-heading" className={styles.section}>
      <h2 id="founder-projects-heading" className={styles.sectionHeading}>{content.heading}</h2>
      <p className={`${styles.body} ${styles.projectsDescription}`}>{content.description}</p>
      <Link href={actionHref} className={styles.textAction}>{content.action.label}</Link>
    </section>
  );
}
