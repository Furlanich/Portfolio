import type { Metadata } from 'next';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { StudioPage } from '@/components/studio/StudioPage';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { contactContent } from '../_content/contact';
import { founderContent } from '../_content/founder';
import { studioPageContent } from '../_content/studio';

const route = { locale: 'en' as const, routeId: 'studio' as const };
const paths = getFoundationNavigationPaths(route.locale, route.routeId);

export const metadata: Metadata = {
  title: 'About | FURLANICH',
  description: studioPageContent.intro.positioning,
};

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
          studio: 'About',
          contact: 'Contact',
          primaryAction: studioPageContent.intro.primaryAction.label,
          languageSwitch: 'View site in Spanish',
        }}
      />
      <StudioPage content={studioPageContent} />
      <SiteFooter
        paths={paths}
        contactActions={contactContent.actions}
        founderLinks={[founderContent.professionalLinks.linkedin, founderContent.professionalLinks.github]}
        labels={{
          navigation: 'Navigation',
          services: 'Services',
          projects: 'Work',
          process: 'Process',
          studio: 'About',
          founder: 'Samuel Furlanich',
          contact: 'Contact',
          directContact: 'Direct contact',
          professional: 'Professional links',
          location: contactContent.location,
        }}
      />
    </>
  );
}
