import { MinimumDestination } from '@/components/foundation/MinimumDestination';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { contactContent } from '../_content/contact';
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
          services: 'Services',
          founder: 'About',
          contact: 'Contact',
          primaryAction: 'Tell us about your project',
          languageSwitch: 'View site in Spanish',
        }}
      />
      <MinimumDestination
        contactActions={contactContent.actions}
        heading={contactContent.heading}
        introduction={contactContent.introduction}
        locale={route.locale}
        location={contactContent.location}
        responseExpectation={contactContent.responseExpectation}
      />
      <SiteFooter
        paths={paths}
        contactActions={contactContent.actions}
        founderLinks={[founderContent.linkedin, founderContent.github]}
        labels={{
          navigation: 'Navigation',
          services: 'Services',
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
