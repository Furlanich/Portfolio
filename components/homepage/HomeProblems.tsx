import Link from 'next/link';
import type { HomeProblemsContent } from './content-types';
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
        <p className="mt-6 max-w-[68ch] text-lg leading-7 text-foundation-ink lg:text-xl lg:leading-8">
          {content.audienceStatement}
        </p>
        <ul className="mt-8 divide-y divide-foundation-border border-y border-foundation-border">
          {content.situations.map((situation) => (
            <li key={situation} className="py-5 text-lg leading-7 text-foundation-ink first:pt-0 last:pb-0 lg:text-xl lg:leading-8">
              {situation}
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
