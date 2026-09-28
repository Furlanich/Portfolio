import Link from 'next/link';
import { AtlasPlate } from '../surfaces/AtlasPlate';
import type { HomeProcessContent, HomeReadoutContent } from './content-types';
import { HomeSection, homeHeadingClassName, homeKickerClassName, primaryActionOnDarkClassName } from './HomeSection';

interface HomeProcessProps {
  content: HomeProcessContent;
  anchorId: string;
  readout: HomeReadoutContent['process'];
  actionHref: string;
}

/** D-17: top offsets 96/36/36/96px at >=1024, matching the reference ecliptic arc. */
const STEP_TOP_OFFSET_CLASSNAME = ['lg:mt-24', 'lg:mt-9', 'lg:mt-9', 'lg:mt-24'];

/**
 * SKY-CHART-V2 D-17 Process: the ecliptic. A decorative dashed arc (visible only at
 * >=1024, `aria-hidden`) sits above the four-step `<ol>`. Each step is an
 * `AtlasPlate blur={false}` (D-08's blur budget), and below 1024 they form one column
 * with a left rule instead of the arc.
 */
export function HomeProcess({ content, anchorId, readout, actionHref }: HomeProcessProps) {
  const headingId = `${anchorId}-heading`;

  return (
    <HomeSection id={anchorId} ariaLabelledBy={headingId} readout={readout} kicker={content.kicker}>
      <h2 id={headingId} className={`${homeHeadingClassName} text-white`}>
        {content.heading}
      </h2>
      <div className="relative mt-14">
        <svg
          className="absolute inset-x-0 -top-[18px] hidden h-40 w-full lg:block"
          viewBox="0 0 1000 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M20 140 C 300 -20, 700 -20, 980 140" fill="none" stroke="rgba(156,196,236,.45)" strokeDasharray="2 6" />
        </svg>
        <ol className="relative m-0 grid list-none gap-4 p-0 max-lg:border-l max-lg:border-[rgba(156,196,236,.35)] max-lg:pl-6 lg:grid-cols-4">
          {content.steps.map((step, index) => (
            <AtlasPlate key={step.title} as="li" blur={false} className={`p-6 ${STEP_TOP_OFFSET_CLASSNAME[index] ?? ''}`}>
              <span className={homeKickerClassName}>{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mt-2.5 text-xl font-bold text-white">{step.title}</h3>
              <p className="mt-2 leading-[1.55] text-sky-text-2">{step.description}</p>
            </AtlasPlate>
          ))}
        </ol>
      </div>
      <p className="mt-8 max-w-[68ch] leading-[1.6] text-sky-text-2">{content.qualityStatement}</p>
      <Link href={actionHref} className={`${primaryActionOnDarkClassName} mt-8`}>
        {content.action.label}
      </Link>
    </HomeSection>
  );
}
