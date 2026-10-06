import Image from 'next/image';
import Link from 'next/link';
import { withBasePath } from '@/lib/paths';
import type { ResolvedProjectDossier } from './content-types';
import styles from './projects.module.css';

interface ProjectDossierProps {
  dossier: ResolvedProjectDossier;
  labels: {
    source: string;
    relatedService: string;
    founder: string;
  };
}

const SECTION_HEADING = 'text-xl font-bold leading-7 tracking-[-0.01em] text-identity-bone';
const SECTION_TEXT = 'mt-3 max-w-[62ch] text-base leading-7 text-sky-text-2';

/**
 * One complete project dossier (DESIGN-SPF-V1, "Projects: complete inline dossiers"): the cover
 * (maturity, title, summary, relationship, and the conceptual illustration with its caption), then
 * the modeled opportunity, implemented scope, evidence and limits, and the source, related-service
 * and Founder-context actions. All of it is ordinary server HTML: there is no accordion, no hover
 * state that hides content, and no per-project destination.
 */
export function ProjectDossier({ dossier, labels }: ProjectDossierProps) {
  const titleId = `${dossier.slug}-title`;
  const { visual } = dossier;

  return (
    <article
      id={dossier.slug}
      aria-labelledby={titleId}
      data-project-slug={dossier.slug}
      data-connected-chapter={dossier.slug}
      data-connected-reading-mask
      className={`${styles.plate} ${styles.dossier} p-5 md:p-8 lg:p-10`}
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
        <header>
          <p data-project-meta className={styles.chip}>{dossier.maturityLabel}</p>
          <h2
            id={titleId}
            className="mt-6 text-[32px] font-bold leading-[1.06] tracking-[-0.025em] text-identity-bone md:text-[40px] lg:text-[44px]"
          >
            {dossier.title}
          </h2>
          <p className="mt-6 max-w-[34ch] text-xl leading-8 text-identity-bone lg:text-[22px] lg:leading-9">
            {dossier.summary}
          </p>
          <p className="mt-6 max-w-[52ch] text-sm leading-6 text-sky-text-2 md:text-base md:leading-7">
            {dossier.relationship}
          </p>
        </header>

        <figure className={styles.figure}>
          <div className={styles.artFrame}>
            <Image
              src={withBasePath(visual.src)}
              alt={visual.alt}
              width={visual.width}
              height={visual.height}
              sizes="(min-width: 1264px) 540px, (min-width: 1024px) 44vw, calc(100vw - 42px)"
              loading="lazy"
              className={styles.artImage}
            />
          </div>
          <figcaption className={styles.caption}>{visual.caption}</figcaption>
        </figure>
      </div>

      <div className="mt-10 grid gap-x-12 gap-y-8 border-t border-[#36536C] pt-10 lg:grid-cols-2">
        <div>
          <h3 className={SECTION_HEADING}>{dossier.opportunity.heading}</h3>
          <p className={SECTION_TEXT}>{dossier.opportunity.content}</p>
        </div>
        <div>
          <h3 className={SECTION_HEADING}>{dossier.scope.heading}</h3>
          <ul className="mt-3 grid max-w-[62ch] list-disc gap-2 pl-5 text-base leading-7 text-sky-text-2 marker:text-sky-lit">
            {dossier.scope.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h3 className={SECTION_HEADING}>{dossier.evidence.heading}</h3>
          <p className={SECTION_TEXT}>{dossier.evidence.content}</p>
        </div>
        <div data-dossier-limits className={styles.limits}>
          <h3 className={SECTION_HEADING}>{dossier.limits.heading}</h3>
          <p className={SECTION_TEXT}>{dossier.limits.content}</p>
        </div>
      </div>

      <div data-dossier-actions className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-1 border-t border-[#36536C] pt-6">
        <a
          href={dossier.sourceHref}
          target="_blank"
          rel="noreferrer"
          aria-describedby={titleId}
          className={styles.link}
        >
          {labels.source}
        </a>
        <Link href={dossier.relatedServiceHref} className={styles.link}>
          {labels.relatedService}
        </Link>
        <Link href={dossier.founderHref} className={styles.link}>
          {labels.founder}
        </Link>
      </div>
    </article>
  );
}
