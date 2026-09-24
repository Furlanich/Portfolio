import Link from 'next/link';
import { AtlasPlate } from '../surfaces/AtlasPlate';
import type { HomeProofContent, HomeReadoutContent } from './content-types';
import {
  HomeSection,
  ghostActionOnDarkClassName,
  homeHeadingClassName,
  homeIntroClassName,
  homeKickerClassName,
} from './HomeSection';

interface HomeProofProps {
  content: HomeProofContent;
  readout: HomeReadoutContent['proof'];
  actionHref: string;
}

/**
 * SKY-CHART-V2 D-16 Proof: a 7fr/5fr grid, end-aligned at >=1024. The left column
 * carries the kicker/heading/introduction/action; the right column is an atlas plate
 * holding the accountability log as a `<ul>` with an accessible name.
 */
export function HomeProof({ content, readout, actionHref }: HomeProofProps) {
  return (
    <HomeSection id="proof" ariaLabelledBy="proof-heading" readout={readout}>
      <div className="grid gap-10 lg:grid-cols-[7fr_5fr] lg:items-end">
        <div>
          <p className={homeKickerClassName}>{content.kicker}</p>
          <h2 id="proof-heading" className={`${homeHeadingClassName} text-white`}>
            {content.heading}
          </h2>
          <p className={`${homeIntroClassName} text-sky-text-2`}>{content.introduction}</p>
          <Link href={actionHref} className={`${ghostActionOnDarkClassName} mt-8`}>
            {content.action.label}
          </Link>
        </div>
        <AtlasPlate as="div" plateNumber="Log">
          <ul aria-label={content.logLabel} role="list" className="m-0 grid list-none gap-0 p-0">
            {content.log.map((entry) => (
              <li
                key={entry.term}
                className="grid grid-cols-[9ch_1fr] gap-2.5 border-t border-sky-plate-line py-2.5 font-mono text-[13px] leading-[1.5] text-sky-text-2"
              >
                <span className="text-sky-lit">{entry.term}</span>
                <span>{entry.text}</span>
              </li>
            ))}
          </ul>
        </AtlasPlate>
      </div>
    </HomeSection>
  );
}
