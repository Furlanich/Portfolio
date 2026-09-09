import type { Metadata } from 'next';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { StudioPage } from '@/components/studio/StudioPage';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { contactContent } from '../_content/contact';
import { founderContent } from '../_content/founder';
import { studioPageContent } from '../_content/studio';

const route = { locale: 'es' as const, routeId: 'studio' as const };
const paths = getFoundationNavigationPaths(route.locale, route.routeId);

export const metadata: Metadata = {
  title: 'El estudio | FURLANICH',
  description: studioPageContent.intro.positioning,
};

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
          primaryAction: studioPageContent.intro.primaryAction.label,
          languageSwitch: 'Ver sitio en inglés',
        }}
      />
      <StudioPage content={studioPageContent} />
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
          directContact: 'Contacto directo',
          professional: 'Enlaces profesionales',
          location: contactContent.location,
        }}
      />
    </>
  );
}
