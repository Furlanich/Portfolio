import Link from 'next/link';
import { resolveActionLink } from '@/components/foundation/content-types';
import type { ProjectsPageContent, ResolvedProjectCard } from './content-types';
import { ProjectCard } from './ProjectCard';

interface ProjectsPageProps {
  content: ProjectsPageContent;
  cards: ResolvedProjectCard[];
}

export function ProjectsPage({ content, cards }: ProjectsPageProps) {
  const finalAction = resolveActionLink(content.finalCta.action, content.locale);
  const hasLimitedPublication = cards.some((card) => card.publicationScope === 'limited');
  const [leadCard, ...secondaryCards] = cards;

  return (
    <main>
      <section className="bg-foundation-canvas">
        <div className="mx-auto w-full max-w-[1200px] px-5 pb-12 pt-16 md:px-8 md:pb-16 md:pt-20 lg:px-12 lg:pt-24">
          <div className="max-w-[68ch]">
            <h1 className="max-w-[18ch] text-[36px] font-bold leading-10 tracking-[-0.02em] text-foundation-ink md:text-[48px] md:leading-[52px]">
              {content.heading}
            </h1>
            <p className="mt-6 text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">
              {content.introduction}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="selected-projects-heading" className="bg-foundation-canvas">
        <div className="mx-auto w-full max-w-[1200px] px-5 pb-16 md:px-8 md:pb-20 lg:px-12 lg:pb-24">
          <h2 id="selected-projects-heading" className="sr-only">
            {content.heading}
          </h2>
          <div className="border-t-2 border-foundation-ink pt-10 md:pt-12">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {leadCard ? (
                <div className="lg:col-span-7">
                  <ProjectCard card={leadCard} presentation="lead" />
                </div>
              ) : null}
              <div className="grid gap-6 lg:col-span-5">
                {secondaryCards.map((card) => (
                  <ProjectCard key={card.slug} card={card} presentation="secondary" />
                ))}
              </div>
            </div>
          </div>

          {hasLimitedPublication && (
            <section aria-labelledby="publication-scope-heading" className="mt-12 grid gap-3 border-t border-foundation-border pt-6 md:mt-16 lg:grid-cols-12 lg:gap-12">
              <h2 id="publication-scope-heading" className="text-lg font-bold leading-7 text-foundation-ink lg:col-span-4">
                {content.confidentiality.heading}
              </h2>
              <p className="max-w-[68ch] text-base leading-7 text-foundation-muted lg:col-span-8">
                {content.confidentiality.description}
              </p>
            </section>
          )}
        </div>
      </section>

      <section aria-labelledby="projects-cta-heading" className="bg-foundation-tint py-16 md:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          <div className="max-w-[68ch]">
            <h2
              id="projects-cta-heading"
              className="max-w-[20ch] text-[32px] font-bold leading-[38px] tracking-[-0.015em] text-foundation-ink md:text-[40px] md:leading-[48px]"
            >
              {content.finalCta.heading}
            </h2>
            <p className="mt-6 text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">
              {content.finalCta.description}
            </p>
            <Link
              href={finalAction.href}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong max-[479px]:w-full"
            >
              {finalAction.label}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
