import Link from 'next/link';
import type { FounderPageContent } from './content-types';

interface FounderProjectsBridgeProps {
  content: FounderPageContent['projectsBridge'];
  actionHref: string;
}

export function FounderProjectsBridge({ content, actionHref }: FounderProjectsBridgeProps) {
  return (
    <section aria-labelledby="founder-projects-heading" className="bg-foundation-canvas py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="border-t-2 border-foundation-ink pt-8 md:pt-10">
          <div className="max-w-[68ch]">
            <h2 id="founder-projects-heading" className="max-w-[24ch] text-[32px] font-bold leading-[38px] tracking-[-0.015em] text-foundation-ink md:text-[40px] md:leading-[48px]">
              {content.heading}
            </h2>
            <p className="mt-6 text-lg leading-7 text-foundation-muted">{content.description}</p>
            <Link
              href={actionHref}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong max-[479px]:w-full"
            >
              {content.action.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
