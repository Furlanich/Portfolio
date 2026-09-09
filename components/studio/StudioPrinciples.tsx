import { CommercialSectionHeading } from '@/components/commercial/CommercialSectionHeading';
import type { StudioPageContent } from './content-types';

interface StudioPrinciplesProps {
  content: StudioPageContent['principles'];
}

export function StudioPrinciples({ content }: StudioPrinciplesProps) {
  return (
    <section aria-labelledby="studio-principles-heading" className="bg-foundation-canvas py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <CommercialSectionHeading
          headingId="studio-principles-heading"
          heading={content.heading}
          intro={content.introduction}
        />
        <ul className="mt-10 grid list-none gap-x-10 gap-y-8 md:grid-cols-2">
          {content.items.map((item) => (
            <li key={item.title} className="border-t border-foundation-border pt-6">
              <h3 className="text-xl font-bold leading-7 text-foundation-ink">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-foundation-muted">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
