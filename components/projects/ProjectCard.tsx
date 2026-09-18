import Link from 'next/link';
import type { ResolvedProjectCard } from './content-types';

interface ProjectCardProps {
  card: ResolvedProjectCard;
  presentation: 'lead' | 'secondary';
}

export function ProjectCard({ card, presentation }: ProjectCardProps) {
  const actionClassName = 'mt-auto inline-flex min-h-11 items-center pt-8 font-semibold text-foundation-action underline decoration-foundation-action/40 underline-offset-4 transition-colors duration-[160ms] ease-out hover:text-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-action focus-visible:ring-offset-4';
  const titleClassName = presentation === 'lead'
    ? 'mt-5 text-2xl font-semibold tracking-[-0.02em] text-foundation-ink md:text-[1.75rem]'
    : 'mt-5 text-xl font-semibold tracking-[-0.02em] text-foundation-ink';

  return (
    <article
      data-project-slug={card.slug}
      data-project-presentation={presentation}
      className="flex h-full flex-col rounded-[16px] border border-foundation-border bg-foundation-surface p-6 md:p-8"
    >
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold text-foundation-muted">
        <span>{card.maturityLabel}</span>
        <span aria-hidden="true">·</span>
        <span>{card.context}</span>
        <span aria-hidden="true">·</span>
        <span>{card.evidenceSignal}</span>
      </div>
      <h2 className={titleClassName}>
        {card.title}
      </h2>
      <p className="mt-4 text-base leading-7 text-foundation-muted">{card.summary}</p>
      <p data-project-relationship className="mt-4 text-sm leading-6 text-foundation-muted">{card.relationship}</p>
      <p data-project-limitation className="mt-3 text-sm leading-6 text-foundation-muted">{card.limitation}</p>
      <ul className="mt-6 flex flex-wrap gap-2" aria-label={card.title}>
        {card.capabilities.map((capability) => (
          <li
            key={capability}
            className="rounded-full border border-foundation-border px-3 py-1.5 text-sm text-foundation-muted"
          >
            {capability}
          </li>
        ))}
      </ul>
      {card.action.external ? (
        <a
          href={card.action.href}
          target="_blank"
          rel="noreferrer"
          className={actionClassName}
        >
          {card.actionLabel}
        </a>
      ) : (
        <Link href={card.action.href} className={actionClassName}>
          {card.actionLabel}
        </Link>
      )}
    </article>
  );
}
