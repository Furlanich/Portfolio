import { resolveActionLink } from '@/components/foundation/content-types';
import type { StudioPageContent } from './content-types';
import { StudioAccountability } from './StudioAccountability';
import { StudioFinalCta } from './StudioFinalCta';
import { StudioFounderBridge } from './StudioFounderBridge';
import { StudioIntroduction } from './StudioIntroduction';
import { StudioPrinciples } from './StudioPrinciples';

interface StudioPageProps {
  content: StudioPageContent;
}

export function StudioPage({ content }: StudioPageProps) {
  const primaryAction = resolveActionLink(content.intro.primaryAction, content.locale);
  const secondaryAction = resolveActionLink(content.intro.secondaryAction, content.locale);
  const founderAction = resolveActionLink(content.founderBridge.action, content.locale);
  const finalAction = resolveActionLink(content.finalCta.action, content.locale);

  return (
    <main>
      <StudioIntroduction
        content={content.intro}
        operatingModel={content.operatingModel}
        primaryActionHref={primaryAction.href}
        secondaryActionHref={secondaryAction.href}
      />
      <StudioAccountability
        accountability={content.accountability}
        collaboratorModel={content.collaboratorModel}
      />
      <StudioPrinciples content={content.principles} />
      <section aria-labelledby="studio-location-heading" className="border-y border-foundation-border bg-foundation-surface py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          <h2 id="studio-location-heading" className="max-w-[28ch] text-2xl font-bold leading-8 text-foundation-ink md:text-3xl md:leading-10">
            {content.location.heading}
          </h2>
          <p className="mt-4 max-w-[68ch] text-base leading-7 text-foundation-muted">{content.location.description}</p>
        </div>
      </section>
      <StudioFounderBridge content={content.founderBridge} actionHref={founderAction.href} />
      <StudioFinalCta content={content.finalCta} actionHref={finalAction.href} />
    </main>
  );
}
