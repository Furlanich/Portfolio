import { PrivacyPage } from '@/components/privacy/PrivacyPage';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { contactContent } from '../_content/contact';
import { founderContent } from '../_content/founder';
import { privacyContent } from '../_content/privacy';

const route = { locale: 'es' as const, routeId: 'privacy' as const };
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
          studio: 'El estudio',
          contact: 'Contacto',
          primaryAction: 'Contanos sobre tu proyecto',
          languageSwitch: 'Ver sitio en inglés',
        }}
      />
      <PrivacyPage content={privacyContent} />
      <SiteFooter
        paths={paths}
        contactActions={contactContent.actions}
        founderLinks={[founderContent.professionalLinks.linkedin, founderContent.professionalLinks.github]}
        labels={{
          navigation: 'Navegación',
          services: 'Servicios',
          projects: 'Proyectos',
          process: 'Proceso',
          studio: 'El estudio',
          founder: 'Samuel Furlanich',
          contact: 'Contacto',
          privacy: 'Privacidad',
          directContact: 'Contacto directo',
          professional: 'Enlaces profesionales',
          location: contactContent.location,
        }}
      />
    </>
  );
}
