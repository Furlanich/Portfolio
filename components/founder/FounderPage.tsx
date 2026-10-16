import { ConnectedStudioGround } from '@/components/connected-studio/ConnectedStudioGround';
import { resolveActionLink } from '@/components/foundation/content-types';
import { AtlasEditorialContainer } from '@/components/surfaces/AtlasEditorialContainer';
import { AtlasPlate } from '@/components/surfaces/AtlasPlate';
import { CONNECTED_CONTROL_LABELS } from '@/lib/connected-studio/content';
import type { FounderPageContent } from './content-types';
import { FounderCapabilities } from './FounderCapabilities';
import { FounderFinalCta } from './FounderFinalCta';
import { FounderHeader } from './FounderHeader';
import { FounderProfessionalHistory } from './FounderProfessionalHistory';
import { FounderProfessionalLinks } from './FounderProfessionalLinks';
import { FounderProjectsBridge } from './FounderProjectsBridge';
import styles from './founder.module.css';

interface FounderPageProps {
  content: FounderPageContent;
}

/** Complete server-rendered professional profile over the static connected ground. */
export function FounderPage({ content }: FounderPageProps) {
  const projectsAction = resolveActionLink(content.projectsBridge.action, content.locale);
  const finalAction = resolveActionLink(content.finalCta.action, content.locale);

  return (
    <main data-connected-page data-connected-route="founder" data-connected-locale={content.locale} className={styles.page}>
      <ConnectedStudioGround route="founder" locale={content.locale} wordBindings={content.wordBindings} />
      <AtlasEditorialContainer>
        <div data-founder-layout className={styles.stack}>
          <div data-founder-intro-plate className={styles.introPlate}>
            <AtlasPlate variant="editorial-opaque" className={styles.plate}>
              <FounderHeader header={content.header} biography={content.biography} />
              <FounderProfessionalLinks content={content.professionalLinks} />
              <div id="connected-pause-founder" data-connected-pause-slot className={styles.pauseSlot}>
                <span data-connected-static-label className={styles.staticLabel}>
                  {CONNECTED_CONTROL_LABELS[content.locale].staticBackground}
                </span>
              </div>
            </AtlasPlate>
          </div>

          <div data-founder-history-plate className={styles.historyPlate}>
            <AtlasPlate variant="editorial-opaque" className={styles.plate}>
              <FounderProfessionalHistory experience={content.experience} education={content.education} />
              <FounderCapabilities content={content.capabilities} />
              <FounderProjectsBridge content={content.projectsBridge} actionHref={projectsAction.href} />
            </AtlasPlate>
          </div>

          <FounderFinalCta content={content.finalCta} actionHref={finalAction.href} />
        </div>
      </AtlasEditorialContainer>
    </main>
  );
}
