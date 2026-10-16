import Link from 'next/link';
import { AtlasPlate } from '@/components/surfaces/AtlasPlate';
import { AtlasScrim } from '@/components/surfaces/AtlasScrim';
import type { StudioPageContent } from './content-types';
import styles from './studio.module.css';

interface StudioIntroductionProps {
  content: StudioPageContent['intro'];
  sceneCaption: StudioPageContent['sceneCaption'];
  primaryActionHref: string;
  secondaryActionHref: string;
  /** The quiet "static background" label shown in the reserved Pause slot until a live control replaces it. */
  staticLabel: string;
}

/**
 * Identity: the one H1, the shortened positioning and both introduction actions on an opaque editorial plate,
 * with the reserved 44px Pause slot 12px after the actions, and the open chart caption beside it (below it
 * when compact). The slot is `connected-pause-studio`, which the connected host portals its control into.
 */
export function StudioIntroduction({
  content,
  sceneCaption,
  primaryActionHref,
  secondaryActionHref,
  staticLabel,
}: StudioIntroductionProps) {
  return (
    <section aria-labelledby="studio-introduction-heading" className={styles.intro}>
      <AtlasPlate variant="editorial-opaque">
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h1 id="studio-introduction-heading" className={styles.heroHeading}>
          {content.heading}
        </h1>
        <p className={styles.lead}>{content.positioning}</p>
        <div className={styles.actions}>
          <Link href={primaryActionHref} className={`${styles.action} ${styles.actionPrimary}`}>
            {content.primaryAction.label}
          </Link>
          <Link href={secondaryActionHref} className={`${styles.action} ${styles.actionSecondary}`}>
            {content.secondaryAction.label}
          </Link>
        </div>
        <div id="connected-pause-studio" data-connected-pause-slot className={styles.pauseSlot}>
          <span data-connected-static-label className={styles.staticLabel}>
            {staticLabel}
          </span>
        </div>
      </AtlasPlate>

      <AtlasScrim clearance={24} className={styles.caption}>
        <p className={styles.captionText}>{sceneCaption}</p>
      </AtlasScrim>
    </section>
  );
}
