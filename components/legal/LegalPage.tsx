import type { LegalPageContent } from './content-types';
import styles from './legal.module.css';

interface LegalPageProps {
  content: LegalPageContent;
}

export function LegalPage({ content }: LegalPageProps) {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{content.heading}</h1>
          {content.introduction ? <p className={styles.introduction}>{content.introduction}</p> : null}
          {content.scope || (content.updatedLabel && content.updatedAt) ? (
            <dl className={styles.metadata}>
              {content.scope ? (
                <div>
                  <dt>{content.locale === 'es' ? 'Alcance' : 'Scope'}</dt>
                  <dd>{content.scope}</dd>
                </div>
              ) : null}
              {content.updatedLabel && content.updatedAt ? (
                <div>
                  <dt>{content.updatedLabel}</dt>
                  <dd>{content.updatedAt}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </header>

        <nav aria-label={content.contentsLabel} className={styles.contents}>
          <h2 className={styles.contentsHeading}>{content.contentsLabel}</h2>
          <ol className={styles.contentsList}>
            {content.sections.map((section) => (
              <li key={section.id}>
                <a href={'#' + section.id}>{section.heading}</a>
              </li>
            ))}
          </ol>
        </nav>

        <article className={styles.article}>
          {content.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={section.id + '-heading'} className={styles.section}>
              <h2 id={section.id + '-heading'} className={styles.sectionHeading}>{section.heading}</h2>
              <div className={styles.paragraphs}>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={section.id + '-' + index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          {content.links?.length ? (
            <ul className={styles.links}>
              {content.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      </div>
    </main>
  );
}
