import Link from 'next/link';
import type { HomeFounderSectionContent } from './content-types';
import { HomepageSectionHeading } from './HomepageSectionHeading';

interface HomeFounderProps {
  content: HomeFounderSectionContent;
  primaryActionHref: string;
  secondaryActionHref: string;
}

export function HomeFounder({ content, primaryActionHref, secondaryActionHref }: HomeFounderProps) {
  return (
    <section id="founder" aria-labelledby="founder-heading" className="bg-foundation-canvas py-16 md:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 md:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
        <div className="min-w-0 lg:col-span-8">
          <HomepageSectionHeading headingId="founder-heading" heading={content.heading} />
          <p className="mt-6 max-w-[68ch] text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">{content.biography}</p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:justify-end">
          <Link href={primaryActionHref} className="inline-flex min-h-12 w-auto items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong max-[479px]:w-full">
            {content.primaryAction.label}
          </Link>
          <Link href={secondaryActionHref} className="inline-flex min-h-12 w-auto items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong max-[479px]:w-full">
            {content.secondaryAction.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
