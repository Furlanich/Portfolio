import Link from 'next/link';
import { AtlasPlate } from '../surfaces/AtlasPlate';
import type { HomeFounderSectionContent, HomeReadoutContent } from './content-types';
import {
  HomeSection,
  ghostActionOnDarkClassName,
  homeHeadingClassName,
  homeIntroClassName,
  homeKickerClassName,
} from './HomeSection';

interface HomeFounderProps {
  content: HomeFounderSectionContent;
  readout: HomeReadoutContent['founder'];
  actionHref: string;
}

/**
 * SKY-CHART-V2 D-18 Founder: an editorial split (8fr/4fr grid, end-aligned at >=1024)
 * inside the D-05 atlas-plate material. The plate wraps the whole grid, action included,
 * and carries no plate number (D-18 names none; the D-12 plate numbers belong to the
 * chapters). Owner decision 2026-10-05: add the plate now to complete
 * PLAN-SKY-CHART-HOME-REDESIGN-V2; it is expected to change again under the
 * services-projects-footer-v1 execution plan.
 */
export function HomeFounder({ content, readout, actionHref }: HomeFounderProps) {
  return (
    <HomeSection id="founder" ariaLabelledBy="founder-heading" readout={readout}>
      <AtlasPlate as="div">
        <div className="grid gap-8 lg:grid-cols-[8fr_4fr] lg:items-end">
          <div className="min-w-0">
            <p className={homeKickerClassName}>{content.kicker}</p>
            <h2 id="founder-heading" className={`${homeHeadingClassName} text-white`}>
              {content.heading}
            </h2>
            <p className={`${homeIntroClassName} text-sky-text-2`}>{content.biography}</p>
          </div>
          <div className="flex lg:justify-end">
            <Link href={actionHref} className={`${ghostActionOnDarkClassName}`}>
              {content.action.label}
            </Link>
          </div>
        </div>
      </AtlasPlate>
    </HomeSection>
  );
}
