import { ContactPage } from '@/components/contact/ContactPage';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { contactContent as content } from '../_content/contact';
import { founderContent } from '../_content/founder';

const route = { locale: 'en' as const, routeId: 'contact' as const };
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
      <ContactPage content={content} locale={route.locale} />
      <SiteFooter
        paths={paths}
        contactActions={content.actions}
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
          location: content.location,
          languageSwitch: 'View site in Spanish',
        }}
      />
    </>
  );
}
