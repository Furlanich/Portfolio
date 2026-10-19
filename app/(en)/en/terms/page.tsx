import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { withBasePath } from '@/lib/paths';
import { contactContent } from '../_content/contact';
import { legalContent } from '../_content/commercial/terms';
import { founderContent } from '../_content/founder';

const route = { locale: 'en' as const, routeId: 'terms' as const };
const paths = getFoundationNavigationPaths(route.locale, route.routeId);

export const metadata: Metadata = {
  title: legalContent.metadata.title,
  description: legalContent.metadata.description,
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
          process: 'How we work',
          studio: 'About',
          primaryAction: 'Contact options',
          languageSwitch: 'View site in Spanish',
        }}
      />
      <LegalPage
        content={{
          locale: route.locale,
          heading: legalContent.title,
          updatedLabel: legalContent.chrome.updateLabel,
          updatedAt: 'October 18, 2026',
          contentsLabel: legalContent.chrome.contentsLabel,
          sections: legalContent.sections,
          links: [{ label: legalContent.chrome.reciprocalLabel, href: withBasePath(legalContent.chrome.reciprocalHref) }],
        }}
      />
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
          privacy: 'Privacy',
          directContact: 'Direct contact',
          professional: 'Professional links',
          location: contactContent.location,
          languageSwitch: 'View site in Spanish',
        }}
      />
    </>
  );
}
