import { PlottingSheet } from '../surfaces/PlottingSheet';
import { ImpactCounts } from './impact/ImpactCounts';
import { PositionFixFigure } from './impact/PositionFixFigure';
import positionFixStyles from './impact/position-fix.module.css';
import type { HomeImpactContent, HomeReadoutContent } from './content-types';
import { HomeSection, homeHeadingClassName, homeIntroClassName } from './HomeSection';

interface HomeImpactProps {
  content: HomeImpactContent;
  readout: HomeReadoutContent['impact'];
}

/**
 * SKY-CHART-V2 D-15 Position fix (HOME-IMPACT): the new section between Services and
 * Proof, composing Task 5's PositionFixFigure and ImpactCounts inside their own
 * PlottingSheets. Section 12's honesty rule requires every visual to carry a visible
 * "Illustrative scenario" tag; PositionFixFigure already renders its own, so this
 * section renders the second one next to ImpactCounts (which has no tag of its own),
 * reusing Task 5's exact `.tag` style by importing its CSS module rather than
 * duplicating it.
 */
export function HomeImpact({ content, readout }: HomeImpactProps) {
  return (
    <HomeSection id="impact" ariaLabelledBy="impact-heading" readout={readout} kicker={content.kicker}>
      <h2 id="impact-heading" className={`${homeHeadingClassName} text-white`}>
        {content.heading}
      </h2>
      <p className={`${homeIntroClassName} text-sky-text-2`}>{content.introduction}</p>
      <div className="mt-10 grid gap-5 lg:grid-cols-[7fr_5fr] lg:items-stretch">
        <PlottingSheet as="div">
          <PositionFixFigure content={content} />
        </PlottingSheet>
        <PlottingSheet as="div">
          <span className={positionFixStyles.tag}>{content.illustrativeTag}</span>
          <ImpactCounts content={content} />
        </PlottingSheet>
      </div>
    </HomeSection>
  );
}
