import Link from 'next/link';
import { PlottingSheet } from '../surfaces/PlottingSheet';
import type { HomeProblemsContent, HomeReadoutContent } from './content-types';
import {
  HomeSection,
  ghostActionOnDarkClassName,
  homeHeadingClassName,
  homeIntroClassName,
  homeKickerClassName,
} from './HomeSection';

interface HomeProblemsProps {
  content: HomeProblemsContent;
  readout: HomeReadoutContent['problems'];
  actionHref: string;
}

/**
 * SKY-CHART-V2 D-13 Problems: a plotting-sheet cascade. Appendix C's three cocked-hat
 * glyphs (Greek letters alpha/beta/gamma), each paired with a bearing, one per situation
 * in the approved fixed order.
 */
const CASCADE_SHEETS = [
  {
    letter: 'α',
    bearing: '042°',
    linesPath: 'M6 44 50 20M10 12l32 38M4 30h48',
    trianglePath: 'M21 30 31 25 27 36Z',
    offsetClassName: '',
    zIndexClassName: 'z-[1]',
  },
  {
    letter: 'β',
    bearing: '117°',
    linesPath: 'M4 40 52 24M14 6l24 46M8 14l40 30',
    trianglePath: 'M22 34 30 28 30 38Z',
    offsetClassName: 'lg:ml-14',
    zIndexClassName: 'z-[2]',
  },
  {
    letter: 'γ',
    bearing: '236°',
    linesPath: 'M4 22h48M20 4l14 48M6 50 48 8',
    trianglePath: 'M24 22 29 22 26 31Z',
    offsetClassName: 'lg:ml-28',
    zIndexClassName: 'z-[3]',
  },
] as const;

function CockedHatGlyph({ linesPath, trianglePath }: { linesPath: string; trianglePath: string }) {
  return (
    <svg viewBox="0 0 56 56" aria-hidden="true" className="h-14 w-14">
      <g fill="none" stroke="#004589" strokeWidth={1.5}>
        <path d={linesPath} />
        <path d={trianglePath} fill="rgba(0,69,137,.14)" />
      </g>
    </svg>
  );
}

export function HomeProblems({ content, readout, actionHref }: HomeProblemsProps) {
  return (
    <HomeSection id="problems" ariaLabelledBy="problems-heading" readout={readout}>
      <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-start lg:gap-12">
        <div className="lg:sticky lg:top-[calc(var(--app-bar-height)+36px)]">
          <p className={homeKickerClassName}>{content.introduction}</p>
          <h2 id="problems-heading" className={`${homeHeadingClassName} text-white`}>
            {content.heading}
          </h2>
          <p className={`${homeIntroClassName} text-sky-text-2`}>{content.audienceStatement}</p>
          <Link href={actionHref} className={`${ghostActionOnDarkClassName} mt-8`}>
            {content.action.label}
          </Link>
        </div>
        <ul className="m-0 grid list-none p-0" role="list">
          {content.situations.map((situation, index) => {
            const sheet = CASCADE_SHEETS[index];
            if (!sheet) return null;
            return (
              <PlottingSheet
                key={situation}
                as="li"
                bearing={sheet.bearing}
                className={`grid grid-cols-[56px_1fr] items-center gap-[18px] ${index === 0 ? '' : '-mt-3.5'} ${sheet.offsetClassName} ${sheet.zIndexClassName}`}
              >
                <CockedHatGlyph linesPath={sheet.linesPath} trianglePath={sheet.trianglePath} />
                <div>
                  <span aria-hidden="true" data-bayer-letter className="font-[Georgia,'Times_New_Roman','Noto_Serif',serif] text-[17px] leading-none text-foundation-action">
                    {sheet.letter}
                  </span>
                  <p className="mt-1.5 text-[clamp(19px,1.7vw,23px)] leading-[1.35] text-foundation-ink">{situation}</p>
                </div>
              </PlottingSheet>
            );
          })}
        </ul>
      </div>
    </HomeSection>
  );
}
