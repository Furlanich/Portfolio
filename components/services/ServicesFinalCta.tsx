import Link from 'next/link';
import type { ServicesPageContent } from './content-types';

interface ServicesFinalCtaProps {
  content: ServicesPageContent['finalCta'];
  actionHref: string;
}

export function ServicesFinalCta({ content, actionHref }: ServicesFinalCtaProps) {
  return (
    <section id="cta" aria-labelledby="services-cta-heading" className="bg-foundation-tint py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="max-w-[68ch]">
          <h2
            id="services-cta-heading"
            className="max-w-[20ch] text-[32px] font-bold leading-[38px] tracking-[-0.015em] text-foundation-ink md:text-[40px] md:leading-[48px]"
          >
            {content.heading}
          </h2>
          <p className="mt-6 text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">{content.description}</p>
          <p className="mt-6 text-base leading-7 text-foundation-ink">{content.responseStatement}</p>
          <Link
            href={actionHref}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong max-[479px]:w-full"
          >
            {content.action.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
