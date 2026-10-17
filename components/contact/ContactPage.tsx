import Link from 'next/link';
import { ConnectedStudioGround } from '@/components/connected-studio/ConnectedStudioGround';
import { ContactForm } from './ContactForm';
import type { ContactPageContent } from './content-types';
import type { Locale } from '@/lib/locales';
import { resolveActionLink } from '@/components/foundation/content-types';
import { AtlasEditorialContainer } from '@/components/surfaces/AtlasEditorialContainer';
import { AtlasScrim } from '@/components/surfaces/AtlasScrim';
import { CONNECTED_CONTROL_LABELS } from '@/lib/connected-studio/content';
import styles from './contact.module.css';

type ContactPageProps = {
  content: ContactPageContent;
  locale: Locale;
};

export function ContactPage({ content, locale }: ContactPageProps) {
  const founderLink = resolveActionLink(content.founderContextAction, locale);
  const alternativesHeadingId = 'contact-' + locale + '-alternatives-heading';
  const formHeadingId = 'contact-' + locale + '-form-heading';

  return (
    <main
      data-connected-page
      data-connected-route="contact"
      data-connected-locale={locale}
      className={styles.page}
    >
      <ConnectedStudioGround route="contact" locale={locale} wordBindings={content.wordBindings} />
      <AtlasEditorialContainer>
        <div className={styles.stack}>
          <header className={styles.introduction}>
            <AtlasScrim clearance={32} className={styles.introScrim}>
              <h1 className={styles.pageHeading}>{content.heading}</h1>
              <p className={styles.introBody}>{content.introduction}</p>
              <p className={styles.responseExpectation}>{content.responseExpectation}</p>
            </AtlasScrim>
            <div id="connected-pause-contact" data-connected-pause-slot className={styles.pauseSlot}>
              <span data-connected-static-label className={styles.staticLabel}>
                {CONNECTED_CONTROL_LABELS[locale].staticBackground}
              </span>
            </div>
          </header>

          <div className={styles.intakeSurface} data-connected-opaque-plate="">
            <section aria-labelledby={formHeadingId} className={styles.formPanel}>
              <ContactForm content={content} locale={locale} />
            </section>
            <aside className={styles.alternativesPanel}>
              <section aria-labelledby={alternativesHeadingId}>
                <h2 id={alternativesHeadingId} className={styles.alternativesHeading}>
                  {content.alternatives.heading}
                </h2>
                <p className={styles.alternativesNote}>{content.alternatives.note}</p>
                <ul className={styles.alternativesList}>
                  {content.alternatives.actions.map((action) => (
                    <li key={action.kind}>
                      <a href={action.href} className={styles.alternativeAction}>
                        {action.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className={styles.location}>{content.location}</p>
              </section>
            </aside>
          </div>

          <div className={styles.founderBridge}>
            <Link href={founderLink.href} className={styles.founderLink}>
              {founderLink.label}
            </Link>
          </div>
        </div>
      </AtlasEditorialContainer>
    </main>
  );
}
