import { CommercialHomepage } from '@/components/homepage/CommercialHomepage';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { contactContent } from './_content/contact';
import { founderContent } from './_content/founder';
import { homeContent } from './_content/home';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';

const route = { locale: 'es' as const, routeId: 'home' as const };
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
          primaryAction: homeContent.primaryAction.label,
          languageSwitch: 'Ver sitio en inglés',
        }}
      />
      <main>
        <CommercialHomepage content={homeContent} paths={paths} />
      </main>
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
