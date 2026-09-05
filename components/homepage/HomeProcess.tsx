import Link from 'next/link';
import type { HomeProcessContent } from './content-types';
import { CommercialSectionHeading } from '../commercial/CommercialSectionHeading';

interface HomeProcessProps {
  content: HomeProcessContent;
  anchorId: string;
  actionHref: string;
}

export function HomeProcess({ content, anchorId, actionHref }: HomeProcessProps) {
  return (
    <section id={anchorId} aria-labelledby={`${anchorId}-heading`} className="bg-foundation-surface py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <CommercialSectionHeading headingId={`${anchorId}-heading`} heading={content.heading} />
        <ol className="mt-8 grid list-none gap-6 md:grid-cols-2 lg:grid-cols-4">
          {content.steps.map((step, index) => (
            <li key={step.title}>
              <span className="text-2xl font-bold leading-8 text-foundation-action">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 text-xl font-bold leading-7 text-foundation-ink">{step.title}</h3>
              <p className="mt-3 text-base leading-[26px] text-foundation-muted">{step.description}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-[68ch] text-base leading-[26px] text-foundation-muted">{content.qualityStatement}</p>
        <Link href={actionHref} className="mt-8 inline-flex min-h-12 w-auto items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong max-[479px]:w-full">
          {content.action.label}
        </Link>
      </div>
    </section>
  );
}
