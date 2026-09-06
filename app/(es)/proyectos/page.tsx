import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { ProjectsPage } from '@/components/projects/ProjectsPage';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { getPublishedProjectCards, validateProjectContent } from '@/lib/projects/publication';
import { contactContent } from '../_content/contact';
import { founderContent } from '../_content/founder';
import { projectPageContent } from '../_content/projects';

const route = { locale: 'es' as const, routeId: 'projects' as const };
const paths = getFoundationNavigationPaths(route.locale, route.routeId);
validateProjectContent(projectPageContent, route.locale);

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
          primaryAction: contactContent.actions[0].label,
          languageSwitch: 'Ver sitio en inglés',
        }}
      />
      <ProjectsPage content={projectPageContent} cards={getPublishedProjectCards(projectPageContent, route.locale)} />
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
