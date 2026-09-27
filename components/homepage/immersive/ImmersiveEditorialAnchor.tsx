import Link from 'next/link';
import type { HomeHeroContent } from '@/components/foundation/content-types';
import { resolveActionLink } from '@/components/foundation/content-types';
import styles from './immersive-home.module.css';

interface ImmersiveEditorialAnchorProps {
  content: HomeHeroContent;
  /** Decorative D-11 coordinate readout, e.g. `34°36'S · 58°22'W`. */
  coordinates: string;
}

/**
 * SKY-CHART-V2 D-11 hero. The approved proposition and actions over the environment
 * ground, in the exact source order the design decision specifies: coordinate line, H1,
 * lede, actions, trust row.
 */
export function ImmersiveEditorialAnchor({ content, coordinates }: ImmersiveEditorialAnchorProps) {
  const primaryAction = resolveActionLink(content.primaryAction, content.locale);
  const secondaryAction = resolveActionLink(content.secondaryAction, content.locale);

  return (
    <div>
      <p className={`${styles.coordinateLine} font-mono text-label uppercase`}>
        <span>{content.eyebrow}</span>
        <span aria-hidden="true">{coordinates}</span>
      </p>
      <h1 id="home-heading" className={`${styles.heroHeading} text-display-1`}>
        {content.heading}
      </h1>
      <p className={`${styles.heroLede} text-lead`}>{content.description}</p>
      <div className={styles.heroActions}>
        <Link href={primaryAction.href} className={styles.primaryAction}>
          {primaryAction.label}
        </Link>
        <Link href={secondaryAction.href} className={styles.ghostAction}>
          {secondaryAction.label}
        </Link>
      </div>
      <div className={styles.trustRow}>
        <p>{content.trustLine}</p>
        <p>{content.availability}</p>
      </div>
    </div>
  );
}
