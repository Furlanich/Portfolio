import { withBasePath } from '@/lib/paths';
import type { FounderPageContent } from './content-types';
import styles from './founder.module.css';

interface FounderProfessionalLinksProps {
  content: FounderPageContent['professionalLinks'];
}

export function FounderProfessionalLinks({ content }: FounderProfessionalLinksProps) {
  return (
    <section aria-labelledby="founder-professional-links-heading" className={styles.profile}>
      <h2 id="founder-professional-links-heading" className={styles.subsectionHeading}>{content.heading}</h2>
      <ul className={styles.profileLinks}>
        <li>
          <a
            href={withBasePath(content.cv.path)}
            download="Samuel-Furlanich-CV.pdf"
            className={styles.textAction}
          >
            {content.cv.label}
          </a>
        </li>
        {[content.linkedin, content.github].map((link) => (
          <li key={link.href}>
            <a href={link.href} className={styles.textAction}>{link.label}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
