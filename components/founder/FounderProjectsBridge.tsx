import Link from 'next/link';
import type { FounderPageContent } from './content-types';

interface FounderProjectsBridgeProps {
  content: FounderPageContent['projectsBridge'];
  actionHref: string;
}

export function FounderProjectsBridge({ content, actionHref }: FounderProjectsBridgeProps) {
  return (
    <section aria-labelledby="founder-projects-heading" className="bg-foundation-surface py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="max-w-[68ch]">
          <h2 id="founder-projects-heading" className="text-2xl font-bold leading-8 text-foundation-ink md:text-3xl">
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-7 text-foundation-muted">{content.description}</p>
          <Link
            href={actionHref}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong max-[479px]:w-full"
          >
            {content.action.label}
          </Link>
        </div>
      </div>
    </section>
  );
}