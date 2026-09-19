import Link from 'next/link';
import { CommercialSectionHeading } from '@/components/commercial/CommercialSectionHeading';
import type { ServicesSectionContent } from './content-types';

interface ServiceSectionProps {
  content: ServicesSectionContent;
  anchor: string;
  actionHref: string;
  evidenceHref?: string;
  surface: 'canvas' | 'surface';
}

const listClassName = 'grid list-disc gap-3 pl-5 text-base leading-7 text-foundation-muted';
const groupHeadingClassName = 'text-xl font-bold leading-7 text-foundation-ink';

export function ServiceSection({ content, anchor, actionHref, evidenceHref, surface }: ServiceSectionProps) {
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
        <CommercialSectionHeading headingId={anchor + '-heading'} heading={content.heading} />

        <div className="mt-8 max-w-[68ch]">
          <p className="text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">{content.lead}</p>
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 md:gap-12">
          <div>
            <h3 className={groupHeadingClassName}>{content.workHeading}</h3>
            <ul className={'mt-4 ' + listClassName}>
              {content.work.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="max-w-[68ch]">
              <h3 className={groupHeadingClassName}>{content.startingHeading}</h3>
              <p className="mt-4 text-base leading-7 text-foundation-muted">{content.startingPoint}</p>
            </div>
            <div className="max-w-[68ch]">
              <h3 className={groupHeadingClassName}>{content.fitHeading}</h3>
              <p className="mt-4 text-base leading-7 text-foundation-muted">{content.fit}</p>
            </div>
          </div>

          <div className="max-w-[78ch] border-l-4 border-foundation-border pl-4 md:pl-6">
            <h3 className={groupHeadingClassName}>{content.boundariesHeading}</h3>
            <p className="mt-4 text-base leading-7 text-foundation-muted">{content.boundaries}</p>
          </div>

          <div className="max-w-[78ch] border-l-4 border-foundation-action/40 pl-4 md:pl-6">
            <h3 className={groupHeadingClassName}>{content.evidenceHeading}</h3>
            <p className="mt-4 text-base leading-7 text-foundation-muted">{content.evidence}</p>
            {content.evidenceLink && evidenceHref ? (
              <Link
                href={evidenceHref}
                className="mt-4 inline-flex min-h-11 items-center text-base font-semibold text-foundation-action underline decoration-foundation-action/40 underline-offset-4 transition-colors duration-[160ms] ease-out hover:text-foundation-action-strong hover:decoration-foundation-action-strong"
              >
                {content.evidenceLink.label}
              </Link>
            ) : null}
          </div>

          <div>
            <Link
              href={actionHref}
              className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong max-[479px]:w-full"
            >
              {content.action.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
