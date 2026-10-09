import Link from 'next/link';
import type { FoundationNavigationPaths } from '@/lib/foundation-navigation';
import { FooterBrandSignature, FooterMarkStrokes } from '@/components/foundation/FooterBrandSignature';
import { LanguageSwitch } from '@/components/foundation/LanguageSwitch';
import {
  getDirectChannelText,
  getFooterConclusionContent,
  resolveFooterLocale,
} from '@/components/foundation/footer-content';
import styles from '@/components/foundation/site-footer.module.css';
import type {
  ContactAction,
  ExternalLink,
  SiteFooterLabels,
} from '@/components/foundation/content-types';

interface SiteFooterProps {
  contactActions: ContactAction[];
  founderLinks: ExternalLink[];
  labels: SiteFooterLabels;
  paths: FoundationNavigationPaths;
}

// PLAN-SPF-V1 Task 4 / PC-4: the shared Azure conclusion, in DOM and visual order -- signature,
// invitation, direct contact, a divider, Explore and direct accountability, a divider, the utility row.
// The props are the ones every route page already passes: destination labels and hrefs come from them,
// the approved conclusion copy from footer-content.ts, and the locale from the typed alternate one.
export function SiteFooter({ contactActions, founderLinks, labels, paths }: SiteFooterProps) {
  const copyrightYear = new Date().getFullYear();
  const content = getFooterConclusionContent(resolveFooterLocale(paths.alternateLocale));
  const whatsapp = contactActions.find((action) => action.kind === 'whatsapp');
  const directChannels = contactActions.filter((action) => action.kind !== 'whatsapp');

  return (
    <footer data-site-footer className={styles.footer}>
      <div className={styles.inner}>
        <FooterBrandSignature href={paths.home} />

        <div className={styles.conclusion}>
          <div className={styles.invitation}>
            <h2 className={styles.headline}>{content.headline}</h2>
            <p className={styles.introduction}>{content.introduction}</p>
            {whatsapp ? (
              <a href={whatsapp.href} className={styles.primaryAction}>{content.whatsappAction}</a>
            ) : null}
          </div>

          <div className={styles.direct}>
            {/* The complete static watermark, behind the right-hand groups. Decorative: hidden from
                assistive technology, pointer-inert and never animated. */}
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 256 256"
              data-footer-watermark
              className={styles.watermark}
            >
              <FooterMarkStrokes />
            </svg>
            <h3 className={styles.groupHeading}>{content.directContactHeading}</h3>
            <ul className={styles.list}>
              {directChannels.map((action) => (
                <li key={action.kind}>
                  <a href={action.href} className={`${styles.link} ${styles.channel}`}>{getDirectChannelText(action)}</a>
                </li>
              ))}
              <li>
                <Link href={paths.contact} className={`${styles.link} ${styles.channel}`}>{content.contactRouteAction}</Link>
              </li>
            </ul>
            <p className={styles.location}>{content.locationAccountability}</p>
          </div>
        </div>

        <div className={styles.directory}>
          <nav aria-labelledby="site-footer-explore">
            <h3 id="site-footer-explore" className={`${styles.groupHeading} ${styles.directoryHeading}`}>{content.exploreHeading}</h3>
            <ul className={`${styles.list} ${styles.inline}`}>
              <li><Link href={paths.services} className={styles.link}>{labels.services}</Link></li>
              <li><Link href={paths.projects} className={styles.link}>{labels.projects}</Link></li>
              <li><Link href={paths.process} className={styles.link}>{labels.process}</Link></li>
              <li><Link href={paths.studio} className={styles.link}>{labels.studio}</Link></li>
            </ul>
          </nav>

          <div>
            <h3 className={`${styles.groupHeading} ${styles.directoryHeading}`}>{content.accountabilityHeading}</h3>
            <ul className={`${styles.list} ${styles.inline}`}>
              <li><Link href={paths.founder} className={styles.link}>{labels.founder}</Link></li>
              {founderLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={styles.link}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.utility}>
          <p className={styles.copyright}>© {copyrightYear} FURLANICH</p>
          <Link href={paths.privacy} className={styles.link}>{labels.privacy}</Link>
          <LanguageSwitch
            alternateHref={paths.alternateHref}
            alternateLocale={paths.alternateLocale}
            label={labels.languageSwitch}
          />
        </div>
      </div>
    </footer>
  );
}
