import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import type { ResolvedProjectDetail } from './content-types';

export type ProjectDetailLabels = {
  evidenceHeading: string;
  contextHeading: string;
  problemHeading: string;
  scopeHeading: string;
  capabilitiesHeading: string;
  resultHeading: string;
  evidenceLinkLabel: string;
  limitationsHeading: string;
  relatedServiceHeading: string;
  finalHeading: string;
  finalDescription: string;
  finalAction: string;
  sourceLinkSuffix: string;
};

interface ProjectDetailPageProps {
  detail: ResolvedProjectDetail;
  locale: Locale;
  labels: ProjectDetailLabels;
  contactHref: string;
}

export function ProjectDetailPage({ detail, locale, labels, contactHref }: ProjectDetailPageProps) {
  const imageSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${detail.visual.src}`;

  return (
    <main>
      <section className="border-b border-foundation-border bg-foundation-canvas">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-24">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold text-foundation-muted">
              <span>{detail.maturityLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{detail.publicationScope === 'limited' ? (locale === 'es' ? 'Alcance limitado' : 'Limited scope') : detail.publicationScope}</span>
            </div>
            <h1 className="mt-5 max-w-[52rem] text-4xl font-semibold tracking-[-0.03em] text-foundation-ink md:text-6xl">
              {detail.title}
            </h1>
            <p className="mt-6 max-w-[48rem] text-xl leading-8 text-foundation-ink md:text-2xl md:leading-9">
              {detail.headerSummary}
            </p>
            <p className="mt-6 max-w-[48rem] text-base leading-7 text-foundation-muted">
              {detail.evidenceStatement}
            </p>
          </div>
          <figure className="lg:col-span-5">
            <div className="overflow-hidden rounded-[16px] border border-foundation-border bg-foundation-surface">
              <Image
                src={imageSrc}
                alt={detail.visual.alt}
                width={detail.visual.width}
                height={detail.visual.height}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-3 text-sm leading-6 text-foundation-muted">{detail.visual.label}</figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-foundation-surface" aria-labelledby="detail-evidence-heading">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-12 lg:px-12">
          <div className="lg:col-span-8">
            <h2 id="detail-evidence-heading" className="text-3xl font-semibold text-foundation-ink">{labels.evidenceHeading}</h2>
            <div className="mt-8 grid gap-8">
              <section aria-labelledby="detail-context-heading">
                <h3 id="detail-context-heading" className="text-xl font-semibold text-foundation-ink">{labels.contextHeading}</h3>
                <p className="mt-3 text-base leading-7 text-foundation-muted">{detail.context}</p>
              </section>
              <section aria-labelledby="detail-problem-heading">
                <h3 id="detail-problem-heading" className="text-xl font-semibold text-foundation-ink">{labels.problemHeading}</h3>
                <p className="mt-3 text-base leading-7 text-foundation-muted">{detail.problem}</p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-foundation-canvas" aria-labelledby="detail-scope-heading">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-12 lg:px-12">
          <div className="lg:col-span-8">
            <h2 id="detail-scope-heading" className="text-3xl font-semibold text-foundation-ink">{labels.scopeHeading}</h2>
            <ul className="mt-6 grid gap-3 text-base leading-7 text-foundation-muted">
              {detail.deliveredScope.map((item) => <li key={item} className="border-l-2 border-foundation-action pl-4">{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-foundation-surface" aria-labelledby="detail-capabilities-heading">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-12 lg:px-12">
          <div className="lg:col-span-8">
            <h2 id="detail-capabilities-heading" className="text-3xl font-semibold text-foundation-ink">{labels.capabilitiesHeading}</h2>
            <ul className="mt-6 grid gap-3 md:grid-cols-3">
              {detail.capabilities.map((item) => <li key={item} className="rounded-[12px] border border-foundation-border p-4 text-base font-semibold text-foundation-ink">{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-foundation-canvas" aria-labelledby="detail-result-heading">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-12 lg:px-12">
          <div className="lg:col-span-8">
            <h2 id="detail-result-heading" className="text-3xl font-semibold text-foundation-ink">{labels.resultHeading}</h2>
            <p className="mt-4 text-base leading-7 text-foundation-muted">{detail.result}</p>
          </div>
        </div>
      </section>

      <section className="bg-foundation-surface" aria-labelledby="detail-links-heading">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-12 lg:px-12">
          <div className="lg:col-span-8">
            <h2 id="detail-links-heading" className="text-3xl font-semibold text-foundation-ink">{labels.evidenceLinkLabel}</h2>
            <ul className="mt-6 grid gap-3">
              {detail.evidence.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center font-semibold text-foundation-action underline decoration-foundation-action/40 underline-offset-4 transition-colors duration-[160ms] ease-out hover:text-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-action focus-visible:ring-offset-4"
                  >
                    {link.label} <span className="ml-1">{labels.sourceLinkSuffix}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-foundation-border bg-foundation-canvas" aria-labelledby="detail-limitations-heading">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-8 md:py-16 lg:px-12">
          <h2 id="detail-limitations-heading" className="text-2xl font-semibold text-foundation-ink">{labels.limitationsHeading}</h2>
          <p className="mt-3 max-w-[52rem] text-base leading-7 text-foundation-muted">{detail.limitations}</p>
          <p className="mt-4 max-w-[52rem] text-base leading-7 text-foundation-muted">{detail.publicationScope}</p>
        </div>
      </section>

      <section className="bg-foundation-surface" aria-labelledby="detail-related-service-heading">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-8 md:py-16 lg:px-12">
          <h2 id="detail-related-service-heading" className="text-2xl font-semibold text-foundation-ink">{labels.relatedServiceHeading}</h2>
          <Link
            href={detail.relatedServiceHref}
            className="mt-4 inline-flex min-h-11 items-center font-semibold text-foundation-action underline decoration-foundation-action/40 underline-offset-4 hover:text-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-action focus-visible:ring-offset-4"
          >
            {detail.relatedService.label}
          </Link>
        </div>
      </section>

      <section className="bg-foundation-action px-5 py-16 text-white md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto w-full max-w-[1200px]">
          <h2 className="max-w-[42rem] text-3xl font-semibold tracking-[-0.02em] md:text-5xl">{labels.finalHeading}</h2>
          <p className="mt-5 max-w-[42rem] text-base leading-7 text-white/85 md:text-lg md:leading-8">{labels.finalDescription}</p>
          <Link
            href={contactHref}
            className="mt-8 inline-flex min-h-12 items-center rounded-[10px] bg-white px-6 font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-foundation-action"
          >
            {labels.finalAction}
          </Link>
        </div>
      </section>
    </main>
  );
}
