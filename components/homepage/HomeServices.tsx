import Link from 'next/link';
import type { HomeServicesSectionContent } from './content-types';
import { HomepageContentCard } from './HomepageContentCard';
import { HomepageSectionHeading } from './HomepageSectionHeading';

interface HomeServicesProps {
  content: HomeServicesSectionContent;
  actionHref: string;
}

export function HomeServices({ content, actionHref }: HomeServicesProps) {
  return (
    <section id="services" aria-labelledby="services-heading" className="bg-foundation-canvas py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <HomepageSectionHeading headingId="services-heading" heading={content.heading} intro={content.introduction} />
        <ul className="mt-8 grid list-none gap-6 lg:grid-cols-3">
          {content.services.map((item) => (
            <li key={item.title}>
              <HomepageContentCard title={item.title} description={item.description} />
            </li>
          ))}
        </ul>
        <Link href={actionHref} className="mt-8 inline-flex min-h-12 w-auto items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong max-[479px]:w-full">
          {content.action.label}
        </Link>
      </div>
    </section>
  );
}
