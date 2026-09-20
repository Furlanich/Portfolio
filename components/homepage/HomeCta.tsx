import Link from 'next/link';
import type { HomeCtaContent } from './content-types';

interface HomeCtaProps {
  content: HomeCtaContent;
  actionHref: string;
}

export function HomeCta({ content, actionHref }: HomeCtaProps) {
  return (
    <section id="cta" aria-labelledby="cta-heading" className="bg-foundation-tint py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[760px] px-5 md:px-8 lg:px-12">
        <h2 id="cta-heading" className="max-w-[20ch] text-[32px] font-bold leading-[38px] tracking-[-0.015em] text-foundation-ink md:text-[40px] md:leading-[48px]">
          {content.heading}
        </h2>
        <p className="mt-6 max-w-[60ch] text-base leading-[26px] text-foundation-muted">{content.demoStatement}</p>
        <div className="mt-8 flex flex-wrap justify-start gap-4 max-[479px]:flex-col">
          <Link href={actionHref} className="inline-flex min-h-12 w-auto items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong max-[479px]:w-full">
            {content.primaryAction.label}
          </Link>
          <a href={content.secondaryAction.href} className="inline-flex min-h-12 w-auto items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong max-[479px]:w-full">
            {content.secondaryAction.label}
          </a>
        </div>
      </div>
    </section>
  );
}
