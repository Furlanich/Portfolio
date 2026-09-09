import Link from 'next/link';
import type { StudioPageContent } from './content-types';

interface StudioFounderBridgeProps {
  content: StudioPageContent['founderBridge'];
  actionHref: string;
}

export function StudioFounderBridge({ content, actionHref }: StudioFounderBridgeProps) {
  return (
    <section aria-labelledby="studio-founder-heading" className="bg-foundation-canvas py-16 md:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 md:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
        <div className="min-w-0 lg:col-span-8">
          <h2
            id="studio-founder-heading"
            className="max-w-[20ch] text-[32px] font-bold leading-[38px] tracking-[-0.015em] text-foundation-ink md:text-[40px] md:leading-[48px]"
          >
            {content.heading}
          </h2>
          <p className="mt-6 max-w-[68ch] text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">
            {content.description}
          </p>
        </div>
        <div className="flex min-w-0 items-end lg:col-span-4">
          <Link
            href={actionHref}
            className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-surface focus-visible:ring-offset-[3px] focus-visible:ring-offset-foundation-action-strong max-[479px]:w-full"
          >
            {content.action.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
