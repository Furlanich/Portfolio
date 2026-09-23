import Link from 'next/link';
import type { HomeHeroContent } from '@/components/foundation/content-types';
import { resolveActionLink } from '@/components/foundation/content-types';

interface ImmersiveEditorialAnchorProps {
  content: HomeHeroContent;
  instrumentLabel: string;
}

// The approved hero proposition and actions, opening the instrument. The protected mark
// identifies the instrument label; the chapter artwork uses separate derived geometry.
export function ImmersiveEditorialAnchor({ content, instrumentLabel }: ImmersiveEditorialAnchorProps) {
  const primaryAction = resolveActionLink(content.primaryAction, content.locale);
  const secondaryAction = resolveActionLink(content.secondaryAction, content.locale);

  return (
    <div className="min-w-0">
      <p className="hidden items-center gap-2 font-mono text-[13px] font-semibold leading-5 text-foundation-muted min-[390px]:flex">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 256 256" width={20} height={20} className="h-5 w-5 shrink-0">
          <g fill="none" stroke="#004589" strokeWidth={30} strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit={4}>
            <polyline points="30,102 128,28 226,102" />
            <polyline points="30,166 128,92 226,166" />
            <polyline points="30,230 128,156 226,230" />
          </g>
        </svg>
        <span>{instrumentLabel}</span>
      </p>
      <p className="mt-6 text-sm font-semibold leading-5 text-foundation-action">
        {content.eyebrow}
      </p>
      <h1
        id="home-heading"
        className="mt-4 max-w-[18ch] text-[36px] font-bold leading-[40px] tracking-[-0.02em] text-foundation-ink md:text-[48px] md:leading-[52px] xl:text-[64px] xl:leading-[68px]"
      >
        {content.heading}
      </h1>
      <p className="mt-6 max-w-[60ch] text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">
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
  );
}
