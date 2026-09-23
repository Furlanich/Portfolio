import type { ReactNode } from 'react';
import Link from 'next/link';
import { CommercialSectionHeading } from '@/components/commercial/CommercialSectionHeading';
import type { ServicesSectionContent } from './content-types';

interface ServiceSectionProps {
  content: ServicesSectionContent;
  anchor: string;
  sequence: string;
  actionHref: string;
  evidenceHref?: string;
  surface: 'canvas' | 'surface';
}

const bodyClassName = 'text-base leading-7 text-foundation-muted';

// One ruled row of the service specification: label column and content column at wide widths.
function ServiceRow({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-t border-foundation-border py-6 md:py-8 lg:grid-cols-12 lg:gap-12">
      <h3 className="text-lg font-bold leading-7 text-foundation-ink lg:col-span-4">{heading}</h3>
      <div className="max-w-[68ch] lg:col-span-8">{children}</div>
    </div>
  );
}

export function ServiceSection({ content, anchor, sequence, actionHref, evidenceHref, surface }: ServiceSectionProps) {
  const sectionClassName =
    'scroll-mt-24 py-16 md:scroll-mt-28 md:py-20 lg:scroll-mt-32 lg:py-24 ' +
    (surface === 'surface' ? 'bg-foundation-surface' : 'bg-foundation-canvas');

  return (
    <section
      id={anchor}
      aria-labelledby={anchor + '-heading'}
      className={sectionClassName}
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="border-t-2 border-foundation-ink pt-8 md:pt-10">
          <CommercialSectionHeading headingId={anchor + '-heading'} heading={content.heading} sequence={sequence} />
          <p className="mt-6 max-w-[68ch] text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">{content.lead}</p>
        </div>

        <div className="mt-10 border-b border-foundation-border md:mt-12">
          <ServiceRow heading={content.workHeading}>
            <ul className={'grid list-disc gap-3 pl-5 marker:text-foundation-action ' + bodyClassName}>
              {content.work.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </ServiceRow>
          <ServiceRow heading={content.startingHeading}>
            <p className={bodyClassName}>{content.startingPoint}</p>
          </ServiceRow>
          <ServiceRow heading={content.fitHeading}>
            <p className={bodyClassName}>{content.fit}</p>
          </ServiceRow>
          <ServiceRow heading={content.boundariesHeading}>
            <p className={bodyClassName}>{content.boundaries}</p>
          </ServiceRow>
          <ServiceRow heading={content.evidenceHeading}>
            <p className={bodyClassName}>{content.evidence}</p>
            {content.evidenceLink && evidenceHref ? (
              <Link
                href={evidenceHref}
                className="mt-4 inline-flex min-h-11 items-center text-base font-semibold text-foundation-action underline decoration-foundation-action/40 underline-offset-4 transition-colors duration-[160ms] ease-out hover:text-foundation-action-strong hover:decoration-foundation-action-strong"
              >
                {content.evidenceLink.label}
              </Link>
            ) : null}
          </ServiceRow>
        </div>

        <div className="mt-10 md:mt-12">
          <Link
            href={actionHref}
            className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong max-[479px]:w-full"
          >
            {content.action.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
