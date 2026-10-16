import { AtlasPlate } from '@/components/surfaces/AtlasPlate';
import { AtlasScrim } from '@/components/surfaces/AtlasScrim';
import type { StudioPageContent } from './content-types';
import styles from './studio.module.css';

interface StudioAccountabilityProps {
  accountability: StudioPageContent['accountability'];
  collaboratorModel: StudioPageContent['collaboratorModel'];
}

/**
 * Accountability and collaborators: the section heading in about five columns and one seven-column plate
 * holding the complete accountability paragraph and the collaborator subsection. No operating-model checklist.
 */
export function StudioAccountability({ accountability, collaboratorModel }: StudioAccountabilityProps) {
  return (
    <section aria-labelledby="studio-accountability-heading" className={styles.accountability}>
      <AtlasScrim clearance={24} className={styles.textBlock}>
        <h2 id="studio-accountability-heading" className={styles.sectionHeading}>
          {accountability.heading}
        </h2>
      </AtlasScrim>

      <AtlasPlate variant="editorial-opaque">
        {accountability.paragraphs.map((paragraph) => (
          <p key={paragraph} className={styles.body}>
            {paragraph}
          </p>
        ))}
        <div className={styles.subsection}>
          <h3 className={styles.subHeading}>{collaboratorModel.heading}</h3>
          {collaboratorModel.paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.body}>
              {paragraph}
            </p>
          ))}
        </div>
      </AtlasPlate>
    </section>
  );
}
