import type { FounderPageContent } from './content-types';
import styles from './founder.module.css';

interface FounderHeaderProps {
  header: FounderPageContent['header'];
  biography: FounderPageContent['biography'];
}

export function FounderHeader({ header, biography }: FounderHeaderProps) {
  return (
    <header className={styles.header} aria-labelledby="founder-heading">
      <p className={styles.eyebrow}>{header.context}</p>
      <h1 id="founder-heading" className={styles.name}>{header.name}</h1>
      <section data-founder-biography aria-labelledby="founder-biography-heading" className={styles.biographySection}>
        <h2 id="founder-biography-heading" className={styles.sectionHeading}>{biography.heading}</h2>
        <div className={styles.biographyCopy}>
          {biography.paragraphs.map((paragraph) => (
            <p data-founder-biography-paragraph key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    </header>
  );
}
