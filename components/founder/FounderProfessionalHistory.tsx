import type { FounderPageContent } from './content-types';
import styles from './founder.module.css';

interface FounderProfessionalHistoryProps {
  experience: FounderPageContent['experience'];
  education: FounderPageContent['education'];
}

export function FounderProfessionalHistory({ experience, education }: FounderProfessionalHistoryProps) {
  return (
    <>
      <section aria-labelledby="founder-experience-heading" className={styles.section}>
        <h2 id="founder-experience-heading" className={styles.sectionHeading}>{experience.heading}</h2>
        <ol className={styles.experienceList}>
          {experience.entries.map((entry) => (
            <li data-founder-experience-entry key={entry.period + '-' + entry.role} className={styles.experienceEntry}>
              <p data-founder-period className={styles.period}>{entry.period}</p>
              <div className={styles.experienceDetails}>
                <h3 className={styles.subsectionHeading}>{entry.role}</h3>
                <p className={styles.context}>{entry.context}</p>
                <p className={styles.body}>{entry.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="founder-education-heading" className={styles.section}>
        <h2 id="founder-education-heading" className={styles.sectionHeading}>{education.heading}</h2>
        <ul className={styles.educationList}>
          {education.entries.map((entry) => (
            <li key={entry.institution} className={styles.educationEntry}>
              <h3 className={styles.subsectionHeading}>{entry.title}</h3>
              <p className={styles.body}>{entry.institution}</p>
              <p className={styles.metadata}>{entry.status}</p>
            </li>
          ))}
          <li data-founder-education-project className={`${styles.educationEntry} ${styles.educationProject}`}>
            <h3 className={styles.subsectionHeading}>{education.project.title}</h3>
            <p className={styles.metadata}>{education.project.context}</p>
            <p className={styles.body}>{education.project.summary}</p>
            <p className={styles.body}>{education.project.relationship}</p>
            <p className={styles.limit}>{education.project.limitation}</p>
            <a href={education.project.sourceHref} target="_blank" rel="noreferrer" className={styles.textAction}>
              {education.project.actionLabel}
            </a>
          </li>
        </ul>
      </section>
    </>
  );
}
