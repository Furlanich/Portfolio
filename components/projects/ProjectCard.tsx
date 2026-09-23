import Link from 'next/link';
import type { ResolvedProjectCard } from './content-types';

interface ProjectCardProps {
  card: ResolvedProjectCard;
  presentation: 'lead' | 'secondary';
}

// Short evidence metadata: Plex Mono, one span per value, separators trail each value so a
// wrapped line never starts with a dot. Values that already contain ' · ' are split, and a
// value repeated by its neighbour (e.g. a Lab context that restates its maturity) is shown once.
export function ProjectMeta({ values }: { values: string[] }) {
  const parts = values.flatMap((value) => value.split(' · '));
  const unique = parts.filter((value, index) => value !== parts[index - 1]);

  return (
    <p
      data-project-meta
      className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[13px] font-semibold leading-5 text-foundation-muted [&>span:not(:last-child)]:after:ml-2 [&>span:not(:last-child)]:after:content-['·']"
    >
      {unique.map((value) => <span key={value}>{value}</span>)}
    </p>
  );
}

export function ProjectCard({ card, presentation }: ProjectCardProps) {
  const actionClassName = 'mt-auto inline-flex min-h-11 items-center self-start pt-8 font-semibold text-foundation-action underline decoration-foundation-action/40 underline-offset-4 transition-colors duration-[160ms] ease-out hover:text-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-action focus-visible:ring-offset-4';
  const titleClassName = presentation === 'lead'
    ? 'mt-5 max-w-[24ch] text-[28px] font-bold leading-[34px] tracking-[-0.015em] text-foundation-ink md:text-[32px] md:leading-[38px]'
    : 'mt-5 max-w-[24ch] text-xl font-bold leading-7 tracking-[-0.01em] text-foundation-ink';

  return (
    <article
      data-project-slug={card.slug}
      data-project-presentation={presentation}
      className="flex h-full flex-col rounded-[16px] border border-foundation-border bg-foundation-surface p-6 md:p-8"
    >
      <ProjectMeta values={[card.maturityLabel, card.context, card.evidenceSignal]} />
      <h2 className={titleClassName}>
        {card.title}
      </h2>
      <p className="mt-4 max-w-[60ch] text-base leading-7 text-foundation-muted">{card.summary}</p>
      <div className="mt-6 grid gap-2 border-t border-foundation-border pt-4">
        <p data-project-relationship className="text-sm leading-6 text-foundation-ink">{card.relationship}</p>
        <p data-project-limitation className="text-sm leading-6 text-foundation-muted">{card.limitation}</p>
      </div>
      <ul
        className="mt-5 flex flex-wrap gap-x-2 gap-y-1 text-sm leading-6 text-foundation-muted [&>li:not(:last-child)]:after:ml-2 [&>li:not(:last-child)]:after:content-['·']"
        aria-label={card.title}
      >
        {card.capabilities.map((capability) => (
          <li key={capability}>{capability}</li>
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
