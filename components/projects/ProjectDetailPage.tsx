import Image from 'next/image';
import Link from 'next/link';
import { CommercialSectionHeading } from '@/components/commercial/CommercialSectionHeading';
import { ProjectMeta } from './ProjectCard';
import type { Locale } from '@/lib/locales';
import type { ResolvedProjectDetail } from './content-types';

export type ProjectDetailLabels = {
  contextGroupHeading: string;
  evidenceHeading: string;
  contextHeading: string;
  problemHeading: string;
  scopeHeading: string;
  capabilitiesHeading: string;
  resultHeading: string;
  evidenceLinkLabel: string;
  limitationsHeading: string;
  relatedServiceHeading: string;
  nextStepsHeading: string;
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
      <section className="bg-foundation-canvas">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-24">
          <div className="lg:col-span-7">
            <ProjectMeta
              values={[
                detail.maturityLabel,
                detail.publicationPermission === 'limited'
                  ? (locale === 'es' ? 'Alcance limitado' : 'Limited scope')
                  : detail.publicationPermission,
              ]}
            />
            <h1 className="mt-5 max-w-[20ch] text-[36px] font-bold leading-10 tracking-[-0.02em] text-foundation-ink md:text-[48px] md:leading-[52px]">
              {detail.title}
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-7 text-foundation-ink lg:text-xl lg:leading-8">
              {detail.headerSummary}
            </p>
            <div className="mt-8 grid max-w-[60ch] gap-3 border-t border-foundation-border pt-5">
              <p className="text-base leading-7 text-foundation-muted">{detail.relationship}</p>
              <p className="text-base leading-7 text-foundation-muted">{detail.evidenceStatement}</p>
            </div>
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

      <section data-detail-group="context" className="bg-foundation-surface" aria-labelledby="detail-context-group-heading">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-14 md:px-8 md:py-20 lg:px-12">
          <div className="border-t-2 border-foundation-ink pt-8 md:pt-10">
            <CommercialSectionHeading headingId="detail-context-group-heading" heading={labels.contextGroupHeading} sequence="01" />
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <section aria-labelledby="detail-context-heading">
              <h3 id="detail-context-heading" className="text-lg font-bold leading-7 text-foundation-ink">{labels.contextHeading}</h3>
              <p className="mt-3 max-w-[68ch] text-base leading-7 text-foundation-muted">{detail.context}</p>
            </section>
            <section aria-labelledby="detail-problem-heading">
              <h3 id="detail-problem-heading" className="text-lg font-bold leading-7 text-foundation-ink">{labels.problemHeading}</h3>
              <p className="mt-3 max-w-[68ch] text-base leading-7 text-foundation-muted">{detail.problem}</p>
            </section>
          </div>
        </div>
      </section>

      <section data-detail-group="scope" className="bg-foundation-canvas" aria-labelledby="detail-scope-heading">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-14 md:px-8 md:py-20 lg:px-12">
          <div className="border-t-2 border-foundation-ink pt-8 md:pt-10">
            <CommercialSectionHeading headingId="detail-scope-heading" heading={labels.scopeHeading} sequence="02" />
          </div>
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
            <div>
              <ul className="grid gap-3 text-base leading-7 text-foundation-muted">
                {detail.deliveredScope.map((item) => <li key={item} className="border-l-2 border-foundation-action pl-4">{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold leading-7 text-foundation-ink">{labels.capabilitiesHeading}</h3>
              <ul className="mt-6 grid gap-3 text-base leading-7 text-foundation-muted">
                {detail.capabilities.map((item) => <li key={item} className="border-t border-foundation-border pt-3">{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section data-detail-group="evidence" className="bg-foundation-surface" aria-labelledby="detail-evidence-heading">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-14 md:px-8 md:py-20 lg:px-12">
          <div className="border-t-2 border-foundation-ink pt-8 md:pt-10">
            <CommercialSectionHeading headingId="detail-evidence-heading" heading={labels.evidenceHeading} sequence="03" />
          </div>
          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
            <section aria-labelledby="detail-result-heading">
              <h3 id="detail-result-heading" className="text-lg font-bold leading-7 text-foundation-ink">{labels.resultHeading}</h3>
              <p className="mt-4 max-w-[68ch] text-base leading-7 text-foundation-muted">{detail.result}</p>
            </section>
            <section aria-labelledby="detail-links-heading">
              <h3 id="detail-links-heading" className="text-lg font-bold leading-7 text-foundation-ink">{labels.evidenceLinkLabel}</h3>
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
            </section>
          </div>
          <div data-detail-limitations className="mt-10 rounded-[16px] border border-foundation-border bg-foundation-canvas p-6 md:p-8">
            <h3 id="detail-limitations-heading" className="text-lg font-bold leading-7 text-foundation-ink">{labels.limitationsHeading}</h3>
            <p className="mt-3 max-w-[68ch] text-base leading-7 text-foundation-muted">{detail.limitations}</p>
            <p className="mt-4 max-w-[68ch] text-base leading-7 text-foundation-muted">{detail.publicationScope}</p>
          </div>
        </div>
      </section>

      <section data-detail-group="next-steps" className="bg-foundation-canvas" aria-labelledby="detail-next-steps-heading">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-14 md:px-8 md:py-20 lg:px-12">
          <div className="border-t-2 border-foundation-ink pt-8 md:pt-10">
            <CommercialSectionHeading headingId="detail-next-steps-heading" heading={labels.nextStepsHeading} sequence="04" />
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-5">
            {detail.relatedService.visibility === 'public' ? (
              <div>
                <h3 className="text-lg font-bold leading-7 text-foundation-ink">{labels.relatedServiceHeading}</h3>
                <Link
                  href={detail.relatedServiceHref}
                  className="mt-4 inline-flex min-h-11 items-center font-semibold text-foundation-action underline decoration-foundation-action/40 underline-offset-4 hover:text-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-action focus-visible:ring-offset-4"
                >
                  {detail.relatedService.label}
                </Link>
              </div>
            ) : null}
            {detail.founderAction ? (
              <div>
                <h3 className="text-lg font-bold leading-7 text-foundation-ink">{locale === 'es' ? 'Contexto de Founder' : 'Founder context'}</h3>
                <Link
                  href={detail.founderAction.href}
                  className="mt-4 inline-flex min-h-11 items-center font-semibold text-foundation-muted underline decoration-foundation-border underline-offset-4 transition-colors duration-[160ms] ease-out hover:text-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-action focus-visible:ring-offset-4"
                >
                  {detail.founderAction.label}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section aria-labelledby="detail-cta-heading" className="bg-foundation-tint py-16 md:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          <div className="max-w-[68ch]">
            <h2
              id="detail-cta-heading"
              className="max-w-[20ch] text-[32px] font-bold leading-[38px] tracking-[-0.015em] text-foundation-ink md:text-[40px] md:leading-[48px]"
            >
              {labels.finalHeading}
            </h2>
            <p className="mt-6 text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">{labels.finalDescription}</p>
            <Link
              href={contactHref}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong max-[479px]:w-full"
            >
              {labels.finalAction}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
