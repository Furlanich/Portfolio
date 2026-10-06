import { ConnectedStudioGround } from '@/components/connected-studio/ConnectedStudioGround';
import { resolveActionLink } from '@/components/foundation/content-types';
import { CONNECTED_CAPABILITY_WORDS, formatCapabilityLegend } from '@/lib/connected-studio/content';
import type { ProjectsPageContent, ResolvedProjectDossier } from './content-types';
import { ProjectDossier } from './ProjectDossier';
import styles from './projects.module.css';

interface ProjectsPageProps {
  content: ProjectsPageContent;
  dossiers: ResolvedProjectDossier[];
}

/**
 * The Projects index (DESIGN-SPF-V1, "Projects: complete inline dossiers"): introduction, two jump
 * links, the GRS dossier, the The-System Lab dossier and the publication note, over the connected
 * ground. Everything meaningful is server HTML; the ground, the poster and the optional live scene
 * are decorative and sit behind these plates. `main` carries the connected-page contract Task 7 reads.
 */
export function ProjectsPage({ content, dossiers }: ProjectsPageProps) {
  const founderAction = resolveActionLink(content.founderAction, content.locale);
  const capabilityWords = CONNECTED_CAPABILITY_WORDS[content.locale];

  return (
    <main
      data-connected-page
      data-connected-route="projects"
      data-connected-locale={content.locale}
      className={styles.page}
    >
      <ConnectedStudioGround route="projects" locale={content.locale} capabilityWords={capabilityWords} />

      <div className="mx-auto w-full max-w-[1264px] px-5 pb-16 pt-8 md:px-8 md:pb-24 md:pt-12">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div
            data-connected-reading-mask
            data-connected-chapter="introduction"
            className={`${styles.plate} p-5 md:p-10 lg:col-span-7`}
          >
            <h1 className="max-w-[15ch] text-[44px] font-bold leading-[1.02] tracking-[-0.03em] text-identity-bone md:text-[56px] lg:text-[72px]">
              {content.heading}
            </h1>
            <p className="mt-6 max-w-[56ch] text-lg leading-8 text-sky-text-2 lg:text-xl">
              {content.introduction}
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-1">
              {dossiers.map((dossier) => (
                <li key={dossier.slug}>
                  <a href={`#${dossier.slug}`} className={styles.link}>
                    {dossier.jumpLabel}
                  </a>
                </li>
              ))}
            </ul>
            <div id="connected-pause-projects" data-connected-pause-slot className={`${styles.pauseSlot} mt-6`} />
          </div>

          <div data-connected-reading-mask className={`${styles.plate} p-5 lg:col-span-4 lg:col-start-9`}>
            <p className="text-sm font-semibold leading-6 text-identity-bone">{content.sceneCaption}</p>
            <p className="mt-2 text-sm leading-6 text-sky-text-2">{formatCapabilityLegend(capabilityWords)}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:mt-14">
          {dossiers.map((dossier) => (
            <ProjectDossier
              key={dossier.slug}
              dossier={dossier}
              labels={{
                source: content.sourceAction,
                relatedService: content.relatedServiceAction,
                founder: founderAction.label,
              }}
            />
          ))}
        </div>

        <section
          aria-labelledby="projects-context-heading"
          data-connected-reading-mask
          data-connected-chapter="context"
          className={`${styles.plate} mt-8 p-5 md:p-10`}
        >
          <h2 id="projects-context-heading" className="text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-identity-bone md:text-[32px]">
            {content.disclosure.heading}
          </h2>
          <p className="mt-4 max-w-[68ch] text-base leading-7 text-sky-text-2 md:text-lg md:leading-8">
            {content.disclosure.description}
          </p>
        </section>
      </div>
    </main>
  );
}
