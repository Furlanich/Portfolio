import { HomeHero } from '@/components/foundation/HomeHero';
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
          founder: 'About',
          contact: 'Contact',
          primaryAction: homeContent.primaryAction.label,
          languageSwitch: 'View site in Spanish',
        }}
      />
      <main>
        <HomeHero content={homeContent} paths={paths} />
      </main>
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
