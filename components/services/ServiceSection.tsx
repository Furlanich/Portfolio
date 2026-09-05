import Link from 'next/link';
import { CommercialContentCard } from '@/components/commercial/CommercialContentCard';
import { CommercialSectionHeading } from '@/components/commercial/CommercialSectionHeading';
import type { ServicesSectionContent } from './content-types';

interface ServiceSectionProps {
  content: ServicesSectionContent;
  anchor: string;
  actionHref: string;
  surface: 'canvas' | 'surface';
}

const listClassName = 'grid list-disc gap-3 pl-5 text-base leading-7 text-foundation-muted';
const groupHeadingClassName = 'text-xl font-bold leading-7 text-foundation-ink';
const panelClassName = 'rounded-[16px] border border-foundation-border bg-foundation-surface p-6 md:p-8';

export function ServiceSection({ content, anchor, actionHref, surface }: ServiceSectionProps) {
  return (
    <section
      id={anchor}
      aria-labelledby={`${anchor}-heading`}
      className={`scroll-mt-24 py-16 md:scroll-mt-28 md:py-20 lg:scroll-mt-32 lg:py-24 ${surface === 'surface' ? 'bg-foundation-surface' : 'bg-foundation-canvas'}`}
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <CommercialSectionHeading headingId={`${anchor}-heading`} heading={content.heading} />

        <div className="mt-8 max-w-[68ch]">
          <p className="text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">{content.situation}</p>
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 md:gap-12">
          <div>
            <h3 className={groupHeadingClassName}>{content.situationsHeading}</h3>
            <ul className={`mt-4 ${listClassName}`}>
              {content.situations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="max-w-[68ch]">
            <h3 className={groupHeadingClassName}>{content.outcomeHeading}</h3>
            <p className="mt-4 text-base leading-7 text-foundation-muted">{content.outcome}</p>
          </div>

          {content.levels.length > 0 && content.levelsHeading ? (
            <div>
              <h3 className={groupHeadingClassName}>{content.levelsHeading}</h3>
              <ul className={`mt-6 grid list-none gap-6 ${content.levels.length === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'}`}>
                {content.levels.map((level) => (
                  <li key={level.title}>
                    <CommercialContentCard title={level.title} description={level.description} />
                  </li>
                ))}
              </ul>
              {content.levelsNote ? <p className="mt-4 text-base leading-7 text-foundation-muted">{content.levelsNote}</p> : null}
            </div>
          ) : null}

          <div>
            <h3 className={groupHeadingClassName}>{content.examplesHeading}</h3>
            <ul className={`mt-4 ${listClassName}`}>
              {content.examples.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className={groupHeadingClassName}>{content.engagementHeading}</h3>
              <ul className={`mt-4 ${listClassName}`}>
                {content.engagement.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className={panelClassName}>
              <h3 className={groupHeadingClassName}>{content.boundariesHeading}</h3>
              <ul className={`mt-4 ${listClassName}`}>
                {content.boundaries.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>

          <div className={panelClassName}>
            <h3 className={groupHeadingClassName}>{content.dependenciesHeading}</h3>
            <p className="mt-4 max-w-[78ch] text-base leading-7 text-foundation-muted">{content.dependencies}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className={panelClassName}>
              <h3 className={groupHeadingClassName}>{content.fitHeading}</h3>
              <p className="mt-4 text-base leading-7 text-foundation-muted">{content.fit}</p>
            </div>
            <div className={panelClassName}>
              <h3 className={groupHeadingClassName}>{content.nonFitHeading}</h3>
              <p className="mt-4 text-base leading-7 text-foundation-muted">{content.nonFit}</p>
            </div>
          </div>

          <div className="max-w-[78ch] border-l-4 border-foundation-border pl-4 md:pl-6">
            <h3 className={groupHeadingClassName}>{content.evidenceHeading}</h3>
            <p className="mt-4 text-base leading-7 text-foundation-muted">{content.evidence}</p>
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
