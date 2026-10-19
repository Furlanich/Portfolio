import type { FounderPageContent } from './content-types';
import styles from './founder.module.css';

interface FounderCapabilitiesProps {
  content: FounderPageContent['capabilities'];
}

export function FounderCapabilities({ content }: FounderCapabilitiesProps) {
  return (
    <section aria-labelledby="founder-capabilities-heading" className={styles.section}>
      <h2 id="founder-capabilities-heading" className={styles.sectionHeading}>{content.heading}</h2>
      <p className={`${styles.body} ${styles.capabilitiesIntroduction}`}>{content.introduction}</p>
      <div className={styles.capabilityGroups}>
        {content.groups.map((group) => (
          <section data-founder-capability-group key={group.id} aria-labelledby={'founder-capability-' + group.id}>
            <h3 id={'founder-capability-' + group.id} className={styles.subsectionHeading}>{group.title}</h3>
            <ul className={styles.capabilityItems}>
              {group.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
