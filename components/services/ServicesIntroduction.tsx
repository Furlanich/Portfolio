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
          <p className="mt-6 text-base leading-7 text-foundation-ink">
            {content.qualification}
          </p>
        </div>

        <div className="mt-8 rounded-[16px] border border-foundation-border bg-foundation-surface p-4 md:p-6">
          <nav aria-label={content.indexLabel}>
            <ul className="flex list-none flex-wrap gap-3">
              {content.indexItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={indexHrefs[item.id]}
                    className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-foundation-border px-4 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong"
                  >
                    {item.label}
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
