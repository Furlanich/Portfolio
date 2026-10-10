import Link from 'next/link';
import type { ServiceSectionId, ServicesPageContent } from './content-types';
import styles from './services.module.css';

interface ServiceCatalogueProps {
  introduction: ServicesPageContent['introduction'];
  services: ServicesPageContent['services'];
  hrefs: Record<ServiceSectionId, string>;
}

/**
 * The Atlas catalogue (DESIGN-SPF-V1, "Services hierarchy and wording"): web is the one large card on
 * the left and the other two families are stacked on the right at 1024px and wider. Each card is a
 * native anchor to its chapter, so it works with no JavaScript. There is no filter, no technology
 * wall and no equal-weight grid. Hover and focus are CSS-only (see services.module.css).
 */
export function ServiceCatalogue({ introduction, services, hrefs }: ServiceCatalogueProps) {
  return (
    <nav aria-labelledby="services-catalogue-label">
      <p
        id="services-catalogue-label"
        data-connected-reading-mask
        className={`${styles.plate} ${styles.catalogueLabel} text-sm font-semibold leading-6 text-identity-bone`}
      >
        {introduction.catalogueLabel}
      </p>
      <ul className={`${styles.catalogue} mt-4`}>
        {services.map((service, index) => (
          <li
            key={service.id}
            className={`${styles.catalogueItem} ${index === 0 ? styles.catalogueLead : ''}`}
          >
            <Link
              href={hrefs[service.id]}
              data-connected-reading-mask
              data-catalogue-card={service.id}
              className={`${styles.card} ${index === 0 ? styles.cardLead : ''}`}
            >
              <span aria-hidden="true" className={styles.sequence}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={styles.cardFamily}>{service.family}</span>
              <span className={styles.cardSummary}>{service.catalogueSummary}</span>
              <span className={styles.cardAction}>
                {introduction.catalogueAction}
                <span aria-hidden="true" data-catalogue-arrow className={styles.cardArrow}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" focusable="false">
                    <path d="M3 9h11M10 4.5 14.5 9 10 13.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
