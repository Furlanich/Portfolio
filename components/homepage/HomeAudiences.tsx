import Link from 'next/link';
import type { HomeAudiencesContent } from './content-types';
import { HomepageContentCard } from './HomepageContentCard';
import { HomepageSectionHeading } from './HomepageSectionHeading';

interface HomeAudiencesProps {
  content: HomeAudiencesContent;
  actionHref: string;
}

export function HomeAudiences({ content, actionHref }: HomeAudiencesProps) {
  return (
    <section id="audiences" aria-labelledby="audiences-heading" className="bg-foundation-surface py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <HomepageSectionHeading headingId="audiences-heading" heading={content.heading} />
        <ul className="mt-8 grid list-none gap-6 md:grid-cols-2">
          {content.audiences.map((item) => (
            <li key={item.title}>
              <HomepageContentCard title={item.title} description={item.description} />
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[68ch] text-base leading-[26px] text-foundation-muted">{content.closing}</p>
        <Link href={actionHref} className="mt-8 inline-flex min-h-12 w-auto items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong max-[479px]:w-full">
          {content.action.label}
        </Link>
      </div>
    </section>
  );
}
