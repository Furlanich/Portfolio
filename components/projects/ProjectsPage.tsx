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

  return (
    <main>
      <section className="border-b border-foundation-border bg-foundation-canvas">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-16 md:px-8 md:py-24 lg:px-12">
          <h1 className="max-w-[48rem] text-4xl font-semibold tracking-[-0.03em] text-foundation-ink md:text-6xl">
            {content.heading}
          </h1>
          <p className="mt-6 max-w-[48rem] text-base leading-7 text-foundation-muted md:text-lg md:leading-8">
            {content.introduction}
          </p>
        </div>
      </section>

      <section aria-labelledby="selected-projects-heading" className="bg-foundation-surface">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-16 md:px-8 md:py-24 lg:px-12">
          <h2 id="selected-projects-heading" className="sr-only">
            {content.heading}
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {cards.map((card) => <ProjectCard key={card.id} card={card} />)}
          </div>
        </div>
      </section>

      {hasLimitedPublication && (
        <section className="border-y border-foundation-border bg-foundation-canvas" aria-labelledby="publication-scope-heading">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-8 md:py-16 lg:px-12">
            <h2 id="publication-scope-heading" className="text-2xl font-semibold text-foundation-ink">
              {content.confidentiality.heading}
            </h2>
            <p className="mt-3 max-w-[52rem] text-base leading-7 text-foundation-muted">
              {content.confidentiality.description}
            </p>
          </div>
        </section>
      )}

      <section className="bg-foundation-action px-5 py-16 text-white md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto w-full max-w-[1200px]">
          <h2 className="max-w-[42rem] text-3xl font-semibold tracking-[-0.02em] md:text-5xl">
            {content.finalCta.heading}
          </h2>
          <p className="mt-5 max-w-[42rem] text-base leading-7 text-white/85 md:text-lg md:leading-8">
            {content.finalCta.description}
          </p>
          <Link
            href={finalAction.href}
            className="mt-8 inline-flex min-h-12 items-center rounded-[10px] bg-white px-6 font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-foundation-action"
          >
            {finalAction.label}
          </Link>
        </div>
      </section>
    </main>
  );
}
