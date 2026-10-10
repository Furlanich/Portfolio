import type { ReactNode } from 'react';
import Link from 'next/link';
import type { ServicesSectionContent } from './content-types';
import styles from './services.module.css';

interface ServiceSectionProps {
  content: ServicesSectionContent;
  anchor: string;
  sequence: string;
  actionHref: string;
  evidenceHref?: string;
  boundariesHref: string;
  boundariesLabel: string;
  alternate: boolean;
}

const BODY = 'mt-3 max-w-[62ch] text-base leading-7 text-sky-text-2';
const ROW_HEADING = 'text-lg font-bold leading-7 text-identity-bone';

function FactRow({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className={styles.factRow}>
      <h3 className={ROW_HEADING}>{heading}</h3>
      {children}
    </div>
  );
}

/**
 * One service chapter (DESIGN-SPF-V1, "Services hierarchy and wording"): the category and the
 * problem/outcome headline, what the buyer receives, the engagement facts, the approved compressed
 * boundary with a same-page working-boundaries link, the evidence status and the Contact action, in
 * that reading order. It is an opaque plate. Nothing is collapsed or revealed, and the chapter id is
 * the stable service fragment.
 */
export function ServiceSection({
  content,
  anchor,
  sequence,
  actionHref,
  evidenceHref,
  boundariesHref,
  boundariesLabel,
  alternate,
}: ServiceSectionProps) {
  const headingId = `${anchor}-heading`;

  return (
    <section
      id={anchor}
      aria-labelledby={headingId}
      data-connected-reading-mask
      data-connected-chapter={content.id}
      className={`${styles.plate} ${styles.chapter} ${alternate ? styles.chapterAlt : ''} p-5 md:p-8 lg:p-10`}
    >
      <div className={styles.chapterGrid}>
        <div className={styles.chapterLead}>
          <p className="flex items-center gap-3 text-base font-semibold leading-6 text-sky-glow">
            <span aria-hidden="true" data-sequence className={styles.sequence}>{sequence}</span>
            <span>{content.family}</span>
          </p>
          <h2
            id={headingId}
            className="mt-4 text-[32px] font-bold leading-[1.06] tracking-[-0.025em] text-identity-bone md:text-[40px] lg:text-[44px]"
          >
            {content.headline}
          </h2>
          <p className="mt-5 max-w-[34ch] text-xl leading-8 text-identity-bone lg:text-[22px] lg:leading-9">{content.outcome}</p>
          <div className={`${styles.delivery} mt-8`}>
            <h3 className={ROW_HEADING}>{content.deliveryHeading}</h3>
            <p className={BODY}>{content.delivery}</p>
          </div>
        </div>

        <div className={styles.chapterFacts}>
          <FactRow heading={content.situationsHeading}>
            <p className={BODY}>{content.situations}</p>
          </FactRow>
          <FactRow heading={content.startingHeading}>
            <p className={BODY}>{content.startingPoint}</p>
          </FactRow>
          <FactRow heading={content.scopeHeading}>
            <p className={BODY}>{content.scope}</p>
          </FactRow>
          <FactRow heading={content.boundariesHeading}>
            <p className={BODY}>{content.boundaries}</p>
            <a href={boundariesHref} className={`${styles.link} mt-2`}>{boundariesLabel}</a>
          </FactRow>
          <FactRow heading={content.evidenceHeading}>
            <p className={BODY}>{content.evidence}</p>
            {content.evidenceLink && evidenceHref ? (
              <Link href={evidenceHref} className={`${styles.link} mt-2`}>{content.evidenceLink.label}</Link>
            ) : null}
          </FactRow>
          <div className={styles.factRow}>
            <Link
              href={actionHref}
              className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-identity-azure px-6 text-base font-semibold text-identity-bone transition-colors duration-[160ms] ease-out hover:bg-sky-lit hover:text-identity-ink focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-sky-glow max-[479px]:w-full"
            >
              {content.action.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
