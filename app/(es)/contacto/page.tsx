import { ContactPage } from '@/components/contact/ContactPage';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { contactContent as content } from '../_content/contact';
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
          menu: 'Abrir navegación principal',
          services: 'Servicios',
          projects: 'Proyectos',
          process: 'Cómo trabajamos',
          studio: 'El estudio',
          primaryAction: 'Ver contacto',
          languageSwitch: 'Ver sitio en inglés',
        }}
      />
      <ContactPage content={content} locale={route.locale} />
      <SiteFooter
        paths={paths}
        contactActions={content.actions}
        founderLinks={[founderContent.professionalLinks.linkedin, founderContent.professionalLinks.github]}
        labels={{
          navigation: 'Navegación',
          services: 'Servicios',
          projects: 'Proyectos',
          process: 'Cómo trabajamos',
          studio: 'El estudio',
          founder: 'Samuel Furlanich',
          contact: 'Contacto',
          directContact: 'Contacto directo',
          privacy: 'Privacidad',
          professional: 'Enlaces profesionales',
          location: content.location,
          languageSwitch: 'Ver sitio en inglés',
        }}
      />
    </>
  );
}
