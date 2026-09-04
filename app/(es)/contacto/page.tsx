import { MinimumDestination } from '@/components/foundation/MinimumDestination';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { contactContent } from '../_content/contact';
import { founderContent } from '../_content/founder';

const route = { locale: 'es' as const, routeId: 'contact' as const };
const paths = getFoundationNavigationPaths(route.locale, route.routeId);

export default function Page() {
  return (
    <>
      <SiteHeader
        locale={route.locale}
        paths={paths}
        labels={{
          navigation: 'Navegación principal',
          services: 'Servicios',
          founder: 'El estudio',
          contact: 'Contacto',
          primaryAction: 'Contanos sobre tu proyecto',
          languageSwitch: 'Ver sitio en inglés',
        }}
      />
      <MinimumDestination
        contactActions={contactContent.actions}
        heading={contactContent.heading}
        introduction={contactContent.introduction}
        locale={route.locale}
        location={contactContent.location}
        responseExpectation={contactContent.responseExpectation}
      />
      <SiteFooter
        paths={paths}
        contactActions={contactContent.actions}
        founderLinks={[founderContent.linkedin, founderContent.github]}
        labels={{
          navigation: 'Navegación',
          services: 'Servicios',
          founder: 'El estudio',
          contact: 'Contacto',
          directContact: 'Contacto directo',
          professional: 'Enlaces profesionales',
          location: contactContent.location,
        }}
      />
    </>
  );
}
