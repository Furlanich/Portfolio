import { AtlasPlate } from '@/components/surfaces/AtlasPlate';
import type { StudioPageContent } from './content-types';
import styles from './studio.module.css';

interface StudioPrinciplesProps {
  content: StudioPageContent['principles'];
}

/** One continuous plate: the heading, its introduction and four complete principles as a semantic list. */
export function StudioPrinciples({ content }: StudioPrinciplesProps) {
  return (
    <section aria-labelledby="studio-principles-heading">
      <AtlasPlate variant="editorial-opaque">
        <h2 id="studio-principles-heading" className={styles.sectionHeading}>
          {content.heading}
        </h2>
        <p className={`${styles.body} ${styles.introduction}`}>{content.introduction}</p>
        <ul className={styles.principleList}>
          {content.items.map((item) => (
            <li key={item.title} className={styles.principle}>
              <h3 className={styles.subHeading}>{item.title}</h3>
              <p className={styles.body}>{item.description}</p>
            </li>
          ))}
        </ul>
      </AtlasPlate>
    </section>
  );
}
