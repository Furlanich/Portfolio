import { CommercialContentCard } from '@/components/commercial/CommercialContentCard';
import { CommercialSectionHeading } from '@/components/commercial/CommercialSectionHeading';
import type { ServicesPageContent } from './content-types';

interface ServicesPrinciplesProps {
  content: ServicesPageContent['principles'];
  commercialBoundaries: ServicesPageContent['commercialBoundaries'];
  aiNote: ServicesPageContent['aiNote'];
}

export function ServicesPrinciples({ content, commercialBoundaries, aiNote }: ServicesPrinciplesProps) {
  return (
    <section id="principles" aria-labelledby="principles-heading" className="bg-foundation-canvas py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <CommercialSectionHeading headingId="principles-heading" heading={content.heading} intro={content.introduction} />
        <ul className="mt-8 grid list-none gap-6 md:grid-cols-2">
          {content.items.map((item) => (
            <li key={item.title}>
              <CommercialContentCard title={item.title} description={item.description} />
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <h3 className="text-xl font-bold leading-7 text-foundation-ink">{commercialBoundaries.heading}</h3>
            <p className="mt-4 max-w-[68ch] text-base leading-7 text-foundation-muted">{commercialBoundaries.description}</p>
            <ul className="mt-4 grid list-disc gap-3 pl-5 text-base leading-7 text-foundation-muted">
              {commercialBoundaries.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold leading-7 text-foundation-ink">{aiNote.heading}</h3>
            <p className="mt-4 max-w-[68ch] text-base leading-7 text-foundation-muted">{aiNote.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
