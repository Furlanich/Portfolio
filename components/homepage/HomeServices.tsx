import Link from 'next/link';
import { AtlasPlate } from '../surfaces/AtlasPlate';
import type { HomeReadoutContent, HomeServicesSectionContent } from './content-types';
import { HomeSection, ghostActionOnDarkClassName, homeHeadingClassName, homeIntroClassName } from './HomeSection';

interface HomeServicesProps {
  content: HomeServicesSectionContent;
  readout: HomeReadoutContent['services'];
  actionHref: string;
}

/**
 * SKY-CHART-V2 D-14 Services: a catalogue of atlas plates. The first (lead) plate spans
 * two rows and bottom-aligns its content in a 7fr/5fr grid at >=1024; below that the
 * plates form a single column.
 */
export function HomeServices({ content, readout, actionHref }: HomeServicesProps) {
  return (
    <HomeSection id="services" ariaLabelledBy="services-heading" readout={readout} kicker={content.kicker}>
      <h2 id="services-heading" className={`${homeHeadingClassName} text-white`}>
        {content.heading}
      </h2>
      <p className={`${homeIntroClassName} text-sky-text-2`}>{content.introduction}</p>
      <div className="mt-12 grid gap-5 lg:grid-cols-[7fr_5fr]">
        {content.services.map((item, index) => {
          const isLead = index === 0;
          return (
            <AtlasPlate
              key={item.title}
              as="article"
              plateNumber={`Cat. S·0${index + 1}`}
              className={isLead ? 'flex flex-col justify-end lg:row-span-2 lg:min-h-[420px]' : ''}
            >
              <p className="font-mono text-label uppercase text-sky-lit">{item.category}</p>
              <h3
                className={`mt-8 max-w-[20ch] font-bold leading-[1.15] text-white ${
                  isLead ? 'text-[clamp(28px,3.2vw,44px)]' : 'text-[clamp(22px,2.2vw,30px)]'
                }`}
              >
                {item.title}
              </h3>
              <p className="mt-3 leading-[1.6] text-sky-text-2">{item.description}</p>
            </AtlasPlate>
          );
        })}
      </div>
      <Link href={actionHref} className={`${ghostActionOnDarkClassName} mt-8`}>
        {content.action.label}
      </Link>
    </HomeSection>
  );
}
