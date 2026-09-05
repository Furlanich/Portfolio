import { CommercialHomepage } from '@/components/homepage/CommercialHomepage';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { contactContent } from './_content/contact';
import { founderContent } from './_content/founder';
import { homeContent } from './_content/home';

const route = { locale: 'en' as const, routeId: 'home' as const };
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
          primaryAction: homeContent.primaryAction.label,
          languageSwitch: 'View site in Spanish',
        }}
      />
      <main>
        <CommercialHomepage content={homeContent} paths={paths} />
      </main>
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
