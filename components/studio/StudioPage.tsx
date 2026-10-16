import { ConnectedStudioGround } from '@/components/connected-studio/ConnectedStudioGround';
import { resolveActionLink } from '@/components/foundation/content-types';
import { AtlasEditorialContainer } from '@/components/surfaces/AtlasEditorialContainer';
import { AtlasScrim } from '@/components/surfaces/AtlasScrim';
import { CONNECTED_CONTROL_LABELS } from '@/lib/connected-studio/content';
import type { StudioPageContent } from './content-types';
import { StudioAccountability } from './StudioAccountability';
import { StudioFinalCta } from './StudioFinalCta';
import { StudioFounderBridge } from './StudioFounderBridge';
import { StudioIntroduction } from './StudioIntroduction';
import { StudioPrinciples } from './StudioPrinciples';
import styles from './studio.module.css';

interface StudioPageProps {
  content: StudioPageContent;
}

/**
 * The Atlas Studio page (DESIGN-SFC-V1, "Studio"): identity, accountability and collaborators, principles,
 * location, one Founder bridge and the Contact ending, in that order, over the decorative connected ground.
 * Everything meaningful is server HTML; the ground, its poster and the optional live scene are decorative.
 * `main` carries the connected-page contract the host reads.
 */
export function StudioPage({ content }: StudioPageProps) {
  const locale = content.locale;
  const primaryAction = resolveActionLink(content.intro.primaryAction, locale);
  const secondaryAction = resolveActionLink(content.intro.secondaryAction, locale);
  const founderAction = resolveActionLink(content.founderBridge.action, locale);
  const finalAction = resolveActionLink(content.finalCta.action, locale);

  return (
    <main data-connected-page data-connected-route="studio" data-connected-locale={locale} className={styles.page}>
      <ConnectedStudioGround route="studio" locale={locale} wordBindings={content.wordBindings} />
      <AtlasEditorialContainer>
        <div className={styles.stack}>
          <StudioIntroduction
            content={content.intro}
            sceneCaption={content.sceneCaption}
            primaryActionHref={primaryAction.href}
            secondaryActionHref={secondaryAction.href}
            staticLabel={CONNECTED_CONTROL_LABELS[locale].staticBackground}
          />
          <StudioAccountability
            accountability={content.accountability}
            collaboratorModel={content.collaboratorModel}
          />
          <StudioPrinciples content={content.principles} />
          <section aria-labelledby="studio-location-heading">
            <AtlasScrim clearance={24} className={styles.textBlock}>
              <h2 id="studio-location-heading" className={styles.sectionHeading}>
                {content.location.heading}
              </h2>
              <p className={styles.body}>{content.location.description}</p>
            </AtlasScrim>
          </section>
          <StudioFounderBridge content={content.founderBridge} actionHref={founderAction.href} />
          <StudioFinalCta content={content.finalCta} actionHref={finalAction.href} />
        </div>
      </AtlasEditorialContainer>
    </main>
  );
}
