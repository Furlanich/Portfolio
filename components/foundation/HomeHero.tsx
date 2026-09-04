import Link from 'next/link';
import type { FoundationNavigationPaths } from '@/lib/foundation-navigation';
import type { HomeHeroContent } from '@/components/foundation/content-types';
import { resolveActionLink } from '@/components/foundation/content-types';

interface HomeHeroProps {
  content: HomeHeroContent;
  paths: FoundationNavigationPaths;
}

export function HomeHero({ content, paths }: HomeHeroProps) {
  const primaryAction = resolveActionLink(content.primaryAction, content.locale);
  const secondaryAction = resolveActionLink(content.secondaryAction, content.locale);

  return (
    <section
      aria-labelledby="home-heading"
      className="bg-foundation-canvas py-20 md:py-24 lg:py-32"
    >
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 px-5 md:px-8 lg:grid-cols-12 lg:px-12">
        <div className="min-w-0 lg:col-span-8">
          <p className="text-sm font-semibold leading-5 text-foundation-action">
            {content.eyebrow}
          </p>
          <h1
            id="home-heading"
            className="mt-6 max-w-[18ch] text-[36px] font-bold leading-[40px] tracking-[-0.02em] text-foundation-ink md:text-[48px] md:leading-[52px] lg:text-[64px] lg:leading-[68px]"
          >
            {content.heading}
          </h1>
          <p className="mt-6 max-w-[68ch] text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">
            {content.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4 max-[479px]:flex-col">
            <Link
              href={primaryAction.href}
              className="inline-flex min-h-12 w-auto items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong max-[479px]:w-full"
            >
              {primaryAction.label}
            </Link>
            <Link
              href={secondaryAction.href}
              className="inline-flex min-h-12 w-auto items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong max-[479px]:w-full"
            >
              {secondaryAction.label}
            </Link>
          </div>
          <div className="mt-8 border-t border-foundation-border pt-6 text-sm leading-5 text-foundation-muted">
            <p>{content.trustLine}</p>
            <p className="mt-2">{content.availability}</p>
          </div>
        </div>
      </div>
      <span className="sr-only">{paths.home}</span>
    </section>
  );
}
