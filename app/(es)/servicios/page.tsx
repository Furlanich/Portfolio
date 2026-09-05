import { ServicesPage } from '@/components/services/ServicesPage';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { contactContent } from '../_content/contact';
import { founderContent } from '../_content/founder';
import { servicesPageContent } from '../_content/services';

const route = { locale: 'es' as const, routeId: 'services' as const };
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
          process: 'Proceso',
          founder: 'El estudio',
          contact: 'Contacto',
          primaryAction: contactContent.actions[0].label,
          languageSwitch: 'Ver sitio en inglés',
        }}
      />
      <ServicesPage content={servicesPageContent} />
      <SiteFooter
        paths={paths}
        contactActions={contactContent.actions}
        founderLinks={[founderContent.linkedin, founderContent.github]}
        labels={{
          navigation: 'Navegación',
          services: 'Servicios',
          process: 'Proceso',
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
