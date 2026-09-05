import Link from 'next/link';
import type { HomeProofContent } from './content-types';
import { CommercialSectionHeading } from '../commercial/CommercialSectionHeading';

interface HomeProofProps {
  content: HomeProofContent;
  actionHref: string;
}

export function HomeProof({ content, actionHref }: HomeProofProps) {
  return (
    <section id="proof" aria-labelledby="proof-heading" className="bg-foundation-canvas py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <CommercialSectionHeading headingId="proof-heading" heading={content.heading} />
        <div className="mt-8 max-w-[1000px] rounded-[16px] border border-foundation-border bg-foundation-surface p-6 md:p-8">
          <p className="max-w-[68ch] text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">{content.introduction}</p>
          <ul className="mt-8 grid list-none gap-6 md:grid-cols-3">
            {content.commitments.map((item) => (
              <li key={item.title}>
                <h3 className="text-xl font-bold leading-7 text-foundation-ink">{item.title}</h3>
                <p className="mt-3 text-base leading-[26px] text-foundation-muted">{item.description}</p>
              </li>
            ))}
          </ul>
          <Link href={actionHref} className="mt-8 inline-flex min-h-12 w-auto items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong max-[479px]:w-full">
            {content.action.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
