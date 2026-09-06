import { FounderProfile } from '@/components/foundation/FounderProfile';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { contactContent } from '../../_content/contact';
import { founderContent } from '../../_content/founder';

const route = { locale: 'es' as const, routeId: 'founder' as const };
const paths = getFoundationNavigationPaths(route.locale, route.routeId);

export default function Page() {
  return (
    <>
      <SiteHeader
        locale={route.locale}
        paths={paths}
        labels={{
          navigation: 'Navegación principal',
          menu: 'Abrir navegación principal',
          services: 'Servicios',
          projects: 'Proyectos',
          process: 'Proceso',
          founder: 'El estudio',
          contact: 'Contacto',
          primaryAction: founderContent.contactAction.label,
          languageSwitch: 'Ver sitio en inglés',
        }}
      />
      <FounderProfile content={founderContent} paths={paths} />
      <SiteFooter
        paths={paths}
        contactActions={contactContent.actions}
        founderLinks={[founderContent.linkedin, founderContent.github]}
        labels={{
          navigation: 'Navegación',
          services: 'Servicios',
          projects: 'Proyectos',
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
