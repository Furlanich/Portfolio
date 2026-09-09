import Link from 'next/link';
import type { StudioPageContent } from './content-types';

interface StudioFinalCtaProps {
  content: StudioPageContent['finalCta'];
  actionHref: string;
}

export function StudioFinalCta({ content, actionHref }: StudioFinalCtaProps) {
  return (
    <section aria-labelledby="studio-cta-heading" className="bg-foundation-tint py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="max-w-[68ch]">
          <h2
            id="studio-cta-heading"
            className="max-w-[20ch] text-[32px] font-bold leading-[38px] tracking-[-0.015em] text-foundation-ink md:text-[40px] md:leading-[48px]"
          >
            {content.heading}
          </h2>
          <p className="mt-6 text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">{content.description}</p>
          <Link
            href={actionHref}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-surface focus-visible:ring-offset-[3px] focus-visible:ring-offset-foundation-action-strong max-[479px]:w-full"
          >
            {content.action.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
