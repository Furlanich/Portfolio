import { PrivacyPage } from '@/components/privacy/PrivacyPage';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { contactContent } from '../_content/contact';
import { founderContent } from '../_content/founder';
import { privacyContent } from '../_content/privacy';

const route = { locale: 'en' as const, routeId: 'privacy' as const };
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
          process: 'Process',
          studio: 'About',
          contact: 'Contact',
          primaryAction: 'Tell us about your project',
          languageSwitch: 'View site in Spanish',
        }}
      />
      <PrivacyPage content={privacyContent} />
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
          privacy: 'Privacy',
          directContact: 'Direct contact',
          professional: 'Professional links',
          location: contactContent.location,
        }}
      />
    </>
  );
}
