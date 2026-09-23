import { CommercialSectionHeading } from '@/components/commercial/CommercialSectionHeading';
import type { ServicesPageContent } from './content-types';

interface ServicesPrinciplesProps {
  content: ServicesPageContent['principles'];
  commercialBoundaries: ServicesPageContent['commercialBoundaries'];
  aiNote: ServicesPageContent['aiNote'];
  anchor: string;
}

const rowClassName = 'grid gap-3 border-t border-foundation-border py-6 md:py-8 lg:grid-cols-12 lg:gap-12';
const groupHeadingClassName = 'text-lg font-bold leading-7 text-foundation-ink lg:col-span-4';
const bodyClassName = 'max-w-[68ch] text-base leading-7 text-foundation-muted';

export function ServicesPrinciples({ content, commercialBoundaries, aiNote, anchor }: ServicesPrinciplesProps) {
  return (
    <section id={anchor} aria-labelledby="principles-heading" className="bg-foundation-canvas py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="border-t-2 border-foundation-ink pt-8 md:pt-10">
          <CommercialSectionHeading headingId="principles-heading" heading={content.heading} intro={content.introduction} />
        </div>

        <div className="mt-10 border-b border-foundation-border md:mt-12">
          <div className={rowClassName}>
            <h3 className={groupHeadingClassName}>{content.workingHeading}</h3>
            <p className={bodyClassName + ' lg:col-span-8'}>{content.workingAgreement}</p>
          </div>

          <div className={rowClassName}>
            <h3 className={groupHeadingClassName}>{commercialBoundaries.heading}</h3>
            <div className="max-w-[68ch] lg:col-span-8">
              <p className={bodyClassName}>{commercialBoundaries.description}</p>
              <ul className={'mt-4 list-disc pl-5 marker:text-foundation-action ' + bodyClassName}>
                {commercialBoundaries.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>

          <div className={rowClassName}>
            <h3 className={groupHeadingClassName}>{aiNote.heading}</h3>
            <p className={bodyClassName + ' lg:col-span-8'}>{aiNote.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
