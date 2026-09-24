import Link from 'next/link';
import type { HomeCtaContent, HomeReadoutContent } from './content-types';
import { HomeSection, ghostActionLightClassName, homeHeadingClassName, homeIntroClassName, primaryActionClassName } from './HomeSection';

interface HomeCtaProps {
  content: HomeCtaContent;
  readout: HomeReadoutContent['contact'];
  actionHref: string;
}

/**
 * SKY-CHART-V2 D-19 Dawn CTA: the opaque Bone panel closing Home. Ink heading, Muted
 * introduction, a primary action plus a ghost-on-light action. The sitewide Ink
 * `:focus-visible` default (app/globals.css) already satisfies D-21 here, so no
 * override is applied.
 */
export function HomeCta({ content, readout, actionHref }: HomeCtaProps) {
  return (
    <HomeSection id="cta" ariaLabelledBy="cta-heading" readout={readout} tone="dawn">
      <h2 id="cta-heading" className={`${homeHeadingClassName} text-foundation-ink`}>
        {content.heading}
      </h2>
      <p className={`${homeIntroClassName} text-foundation-muted`}>{content.demoStatement}</p>
      <div className="mt-8 flex flex-wrap gap-4 max-[479px]:flex-col">
        <Link href={actionHref} className={primaryActionClassName}>
          {content.primaryAction.label}
        </Link>
        <a href={content.secondaryAction.href} className={ghostActionLightClassName}>
          {content.secondaryAction.label}
        </a>
      </div>
    </HomeSection>
  );
}
