import Link from 'next/link';
import type { HomeProblemsContent } from './content-types';
import { CommercialContentCard } from '../commercial/CommercialContentCard';
import { CommercialSectionHeading } from '../commercial/CommercialSectionHeading';

interface HomeProblemsProps {
  content: HomeProblemsContent;
  actionHref: string;
}

const actionClassName =
  'inline-flex min-h-12 w-auto items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong max-[479px]:w-full';

export function HomeProblems({ content, actionHref }: HomeProblemsProps) {
  return (
    <section id="problems" aria-labelledby="problems-heading" className="bg-foundation-surface py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <CommercialSectionHeading headingId="problems-heading" heading={content.heading} intro={content.introduction} />
        <ul className="mt-8 grid list-none gap-6 md:grid-cols-2">
          {content.situations.map((item) => (
            <li key={item.title}>
              <CommercialContentCard title={item.title} description={item.description} />
            </li>
          ))}
        </ul>
        <Link href={actionHref} className={`${actionClassName} mt-8`}>
          {content.action.label}
        </Link>
      </div>
    </section>
  );
}
