import Link from 'next/link';
import type { ServicesPageContent } from './content-types';

interface ServicesIntroductionProps {
  content: ServicesPageContent['introduction'];
  indexHrefs: Record<ServicesPageContent['introduction']['indexItems'][number]['id'], string>;
}

export function ServicesIntroduction({ content, indexHrefs }: ServicesIntroductionProps) {
  return (
    <section aria-labelledby="services-introduction-heading" className="bg-foundation-canvas py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="max-w-[68ch]">
          <h1
            id="services-introduction-heading"
            className="max-w-[18ch] text-[36px] font-bold leading-10 tracking-[-0.02em] text-foundation-ink md:text-[48px] md:leading-[52px]"
          >
            {content.heading}
          </h1>
          <p className="mt-6 text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">
            {content.description}
          </p>
        </div>

        <div className="mt-8 border-y border-foundation-border py-4 md:py-5">
          <nav aria-label={content.indexLabel}>
            <ul className="flex list-none flex-wrap gap-x-6 gap-y-3">
              {content.indexItems.map((item, index) => (
                <li key={item.id}>
                  <Link
                    href={indexHrefs[item.id]}
                    className="group inline-flex min-h-11 items-center gap-3 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:text-foundation-action-strong"
                  >
                    <span aria-hidden="true" className="font-mono text-sm font-semibold text-foundation-muted">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="underline decoration-foundation-action/40 underline-offset-4 group-hover:decoration-foundation-action-strong">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
