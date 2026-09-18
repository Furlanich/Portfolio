import { FounderPage } from '@/components/founder/FounderPage';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { contactContent } from '../../_content/contact';
import { founderContent } from '../../_content/founder';

const route = { locale: 'en' as const, routeId: 'founder' as const };
const paths = getFoundationNavigationPaths(route.locale, route.routeId);

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
          process: 'How we work',
          studio: 'About',
          primaryAction: 'Contact options',
          languageSwitch: 'View site in Spanish',
        }}
      />
      <FounderPage content={founderContent} />
      <SiteFooter
        paths={paths}
        contactActions={contactContent.actions}
        founderLinks={[founderContent.professionalLinks.linkedin, founderContent.professionalLinks.github]}
        labels={{
          navigation: 'Navigation',
          services: 'Services',
          projects: 'Work',
          process: 'How we work',
          studio: 'About',
          founder: 'Samuel Furlanich',
          contact: 'Contact',
          directContact: 'Direct contact',
          privacy: 'Privacy',
          professional: 'Professional links',
          location: contactContent.location,
          languageSwitch: 'View site in Spanish',
        }}
      />
    </>
  );
}
