import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { ProjectsPage } from '@/components/projects/ProjectsPage';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { getPublishedProjectCards, validateProjectContent } from '@/lib/projects/publication';
import { contactContent } from '../_content/contact';
import { founderContent } from '../_content/founder';
import { projectPageContent } from '../_content/projects';

const route = { locale: 'en' as const, routeId: 'projects' as const };
const paths = getFoundationNavigationPaths(route.locale, route.routeId);
validateProjectContent(projectPageContent, route.locale);

export default function Page() {
  return (
    <>
      <SiteHeader
        locale={route.locale}
        paths={paths}
        labels={{
          navigation: 'Primary navigation',
          menu: 'Open primary navigation',
          services: 'Services',
          projects: 'Work',
          process: 'Process',
          founder: 'About',
          contact: 'Contact',
          primaryAction: contactContent.actions[0].label,
          languageSwitch: 'View site in Spanish',
        }}
      />
      <ProjectsPage content={projectPageContent} cards={getPublishedProjectCards(projectPageContent, route.locale)} />
      <SiteFooter
        paths={paths}
        contactActions={contactContent.actions}
        founderLinks={[founderContent.linkedin, founderContent.github]}
        labels={{
          navigation: 'Navigation',
          services: 'Services',
          projects: 'Work',
          process: 'Process',
          founder: 'About',
          contact: 'Contact',
          directContact: 'Direct contact',
          professional: 'Professional links',
          location: contactContent.location,
        }}
      />
    </>
  );
}
