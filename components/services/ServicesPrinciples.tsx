import { CommercialSectionHeading } from '@/components/commercial/CommercialSectionHeading';
import type { ServicesPageContent } from './content-types';

interface ServicesPrinciplesProps {
  content: ServicesPageContent['principles'];
  commercialBoundaries: ServicesPageContent['commercialBoundaries'];
  aiNote: ServicesPageContent['aiNote'];
  anchor: string;
}

const groupHeadingClassName = 'text-xl font-bold leading-7 text-foundation-ink';
const bodyClassName = 'mt-4 max-w-[78ch] text-base leading-7 text-foundation-muted';

export function ServicesPrinciples({ content, commercialBoundaries, aiNote, anchor }: ServicesPrinciplesProps) {
  return (
    <section id={anchor} aria-labelledby="principles-heading" className="bg-foundation-canvas py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <CommercialSectionHeading headingId="principles-heading" heading={content.heading} intro={content.introduction} />

        <div className="mt-10 grid gap-10 border-t border-foundation-border pt-8 md:mt-12 md:gap-12 md:pt-10">
          <div className="max-w-[78ch]">
            <h3 className={groupHeadingClassName}>{content.workingHeading}</h3>
            <p className={bodyClassName}>{content.workingAgreement}</p>
          </div>

          <div className="max-w-[78ch]">
            <h3 className={groupHeadingClassName}>{commercialBoundaries.heading}</h3>
            <p className={bodyClassName}>{commercialBoundaries.description}</p>
            <ul className={'mt-4 ' + bodyClassName + ' list-disc pl-5'}>
              {commercialBoundaries.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="max-w-[78ch]">
            <h3 className={groupHeadingClassName}>{aiNote.heading}</h3>
            <p className={bodyClassName}>{aiNote.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
