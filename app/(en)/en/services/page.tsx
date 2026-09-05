import { MinimumDestination } from '@/components/foundation/MinimumDestination';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { contactContent } from '../_content/contact';
import { founderContent } from '../_content/founder';
import { servicesContent } from '../_content/services';

const route = { locale: 'en' as const, routeId: 'services' as const };
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
          process: 'Process',
          founder: 'About',
          contact: 'Contact',
          primaryAction: contactContent.actions[0].label,
          languageSwitch: 'View site in Spanish',
        }}
      />
      <MinimumDestination
        action={servicesContent.action}
        heading={servicesContent.heading}
        introduction={servicesContent.introduction}
        items={servicesContent.services}
        locale={route.locale}
      />
      <SiteFooter
        paths={paths}
        contactActions={contactContent.actions}
        founderLinks={[founderContent.linkedin, founderContent.github]}
        labels={{
          navigation: 'Navigation',
          services: 'Services',
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
