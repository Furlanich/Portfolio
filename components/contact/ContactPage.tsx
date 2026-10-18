import Link from 'next/link';
import { ConnectedStudioGround } from '@/components/connected-studio/ConnectedStudioGround';
import type { ContactPageContent } from './content-types';
import type { Locale } from '@/lib/locales';
import { resolveActionLink } from '@/components/foundation/content-types';
import { getFoundationPageLinkHref } from '@/lib/foundation-navigation';
import { AtlasEditorialContainer } from '@/components/surfaces/AtlasEditorialContainer';
import { AtlasScrim } from '@/components/surfaces/AtlasScrim';
import { CONNECTED_CONTROL_LABELS } from '@/lib/connected-studio/content';
import { ContactChannelIcon } from './ContactChannelIcon';
import styles from './contact.module.css';

type ContactPageProps = {
  content: ContactPageContent;
  locale: Locale;
};

export function ContactPage({ content, locale }: ContactPageProps) {
  const founderLink = resolveActionLink(content.founderContextAction, locale);
  const alternativesHeadingId = 'contact-' + locale + '-alternatives-heading';
  const privacyHref = getFoundationPageLinkHref('privacy', locale);

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

          <section aria-labelledby={alternativesHeadingId} className={styles.contactSurface} data-contact-channels data-connected-opaque-plate="">
            <div>
              <h2 id={alternativesHeadingId} className={styles.channelsHeading}>{content.channels.heading}</h2>
              <p className={styles.channelsNote}>{content.channels.note}</p>
              <p className={styles.location}>{content.location}</p>
            </div>
            <div>
              <ul className={styles.channelsList}>
                {content.actions.map((action) => (
                  <li key={action.kind}>
                    <a href={action.href} className={styles.channelAction}>
                      <ContactChannelIcon kind={action.kind} className={styles.channelIcon} />
                      <span className={styles.channelLabel}>{action.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className={styles.privacyContext}>
                {content.channels.privacyContext}{' '}
                <Link href={privacyHref} className={styles.inlineLink}>{content.privacyLabel}</Link>
              </p>
            </div>
          </section>

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
