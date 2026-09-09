import Link from 'next/link';
import type { StudioPageContent } from './content-types';

interface StudioIntroductionProps {
  content: StudioPageContent['intro'];
  operatingModel: StudioPageContent['operatingModel'];
  primaryActionHref: string;
  secondaryActionHref: string;
}

export function StudioIntroduction({
  content,
  operatingModel,
  primaryActionHref,
  secondaryActionHref,
}: StudioIntroductionProps) {
  return (
    <section aria-labelledby="studio-introduction-heading" className="bg-foundation-canvas py-16 md:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 md:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12">
        <div className="min-w-0 lg:col-span-7">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-foundation-action">{content.eyebrow}</p>
          <h1
            id="studio-introduction-heading"
            className="mt-5 max-w-[18ch] text-[36px] font-bold leading-10 tracking-[-0.02em] text-foundation-ink md:text-[48px] md:leading-[52px]"
          >
            {content.heading}
          </h1>
          <p className="mt-6 max-w-[68ch] text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">
            {content.positioning}
          </p>
          <p className="mt-6 max-w-[64ch] text-base leading-7 text-foundation-ink">
            {content.supportingStatement}
          </p>
          <div className="mt-8 flex flex-wrap gap-4 max-[479px]:flex-col">
            <Link
              href={primaryActionHref}
              className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-surface focus-visible:ring-offset-[3px] focus-visible:ring-offset-foundation-action-strong max-[479px]:w-full"
            >
              {content.primaryAction.label}
            </Link>
            <Link
              href={secondaryActionHref}
              className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-surface focus-visible:ring-offset-[3px] focus-visible:ring-offset-foundation-action-strong max-[479px]:w-full"
            >
              {content.secondaryAction.label}
            </Link>
          </div>
        </div>

        <aside
          aria-labelledby="studio-operating-model-heading"
          className="min-w-0 rounded-[16px] border border-foundation-border bg-foundation-surface p-6 md:p-8 lg:col-span-5 lg:self-start"
        >
          <h2 id="studio-operating-model-heading" className="text-xl font-bold leading-7 text-foundation-ink">
            {operatingModel.label}
          </h2>
          <ul className="mt-5 grid list-none divide-y divide-foundation-border text-base leading-7 text-foundation-muted">
            {operatingModel.items.map((item) => (
              <li key={item} className="py-3 first:pt-0 last:pb-0">{item}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
