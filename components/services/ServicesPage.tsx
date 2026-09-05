import { resolveActionLink } from '@/components/foundation/content-types';
import { getServiceSectionHref, serviceSectionAnchors } from '@/lib/site-routes';
import type { ServicesPageContent } from './content-types';
import { ServicesFinalCta } from './ServicesFinalCta';
import { ServicesIntroduction } from './ServicesIntroduction';
import { ServicesPrinciples } from './ServicesPrinciples';
import { ServiceSection } from './ServiceSection';

interface ServicesPageProps {
  content: ServicesPageContent;
}

export function ServicesPage({ content }: ServicesPageProps) {
  const indexHrefs = Object.fromEntries(
    content.introduction.indexItems.map((item) => [
      item.id,
      getServiceSectionHref(content.locale, item.id),
    ]),
  ) as Record<ServicesPageContent['introduction']['indexItems'][number]['id'], string>;
  const serviceActions = content.services.map((service) => resolveActionLink(service.action, content.locale));
  const finalAction = resolveActionLink(content.finalCta.action, content.locale);

  return (
    <main>
      <ServicesIntroduction content={content.introduction} indexHrefs={indexHrefs} />
      {content.services.map((service, index) => (
        <ServiceSection
          key={service.id}
          content={service}
          anchor={serviceSectionAnchors[service.id][content.locale]}
          actionHref={serviceActions[index].href}
          surface={index % 2 === 0 ? 'surface' : 'canvas'}
        />
      ))}
      <ServicesPrinciples
        content={content.principles}
        commercialBoundaries={content.commercialBoundaries}
        aiNote={content.aiNote}
      />
      <ServicesFinalCta content={content.finalCta} actionHref={finalAction.href} />
    </main>
  );
}
