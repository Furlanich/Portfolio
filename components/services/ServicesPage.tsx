import { ConnectedStudioGround } from '@/components/connected-studio/ConnectedStudioGround';
import { resolveActionLink } from '@/components/foundation/content-types';
import { CONNECTED_CAPABILITY_WORDS } from '@/lib/connected-studio/content';
import { getProjectDossierHref, getServiceSectionHref, serviceSectionAnchors } from '@/lib/site-routes';
import type { ServiceSectionId, ServicesPageContent } from './content-types';
import { ServiceCatalogue } from './ServiceCatalogue';
import { ServicesFinalCta } from './ServicesFinalCta';
import { ServicesIntroduction } from './ServicesIntroduction';
import { ServicesPrinciples } from './ServicesPrinciples';
import { ServiceSection } from './ServiceSection';
import styles from './services.module.css';

interface ServicesPageProps {
  content: ServicesPageContent;
}

/**
 * The Atlas Services page (DESIGN-SPF-V1, "Services hierarchy and wording"): introduction, the
 * web-dominant asymmetric catalogue, three alternating opaque chapters, the complete working
 * boundaries and the final action, over the connected ground. Everything meaningful is server HTML;
 * the ground, the poster and the optional live scene are decorative and sit behind these plates.
 * `main` carries the connected-page contract Task 7 reads. No live engine is attached here.
 */
export function ServicesPage({ content }: ServicesPageProps) {
  const locale = content.locale;
  const capabilityWords = CONNECTED_CAPABILITY_WORDS[locale];
  const hrefs = Object.fromEntries(
    content.services.map((service) => [service.id, getServiceSectionHref(locale, service.id)]),
  ) as Record<ServiceSectionId, string>;
  const boundariesAnchor = locale === 'es' ? 'condiciones' : 'working-boundaries';
  const finalAction = resolveActionLink(content.finalCta.action, locale);

  return (
    <main
      data-connected-page
      data-connected-route="services"
      data-connected-locale={locale}
      className={styles.page}
    >
      <ConnectedStudioGround route="services" locale={locale} capabilityWords={capabilityWords} />

      <div className="mx-auto w-full max-w-[1264px] px-5 pb-16 pt-8 md:px-8 md:pb-24 md:pt-12">
        <ServicesIntroduction
          content={content.introduction}
          sceneCaption={content.sceneCaption}
          capabilityWords={capabilityWords}
        />

        <div className="mt-10 md:mt-14">
          <ServiceCatalogue introduction={content.introduction} services={content.services} hrefs={hrefs} />
        </div>

        <div className="mt-10 grid gap-8 md:mt-14">
          {content.services.map((service, index) => {
            const action = resolveActionLink(service.action, locale);
            const evidenceHref = service.evidenceLink
              ? getProjectDossierHref(locale, service.evidenceLink.slug)
              : undefined;

            return (
              <ServiceSection
                key={service.id}
                content={service}
                anchor={serviceSectionAnchors[service.id][locale]}
                sequence={String(index + 1).padStart(2, '0')}
                actionHref={action.href}
                evidenceHref={evidenceHref}
                boundariesHref={`#${boundariesAnchor}`}
                boundariesLabel={content.workingBoundariesLabel}
                alternate={index % 2 === 1}
              />
            );
          })}

          <ServicesPrinciples
            content={content.principles}
            commercialBoundaries={content.commercialBoundaries}
            aiNote={content.aiNote}
            anchor={boundariesAnchor}
          />
          <ServicesFinalCta content={content.finalCta} actionHref={finalAction.href} />
        </div>
      </div>
    </main>
  );
}
