import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { withBasePath } from '@/lib/paths';
import { contactContent } from '../_content/contact';
import { legalContent } from '../_content/commercial/terms';
import { founderContent } from '../_content/founder';

const route = { locale: 'es' as const, routeId: 'terms' as const };
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
          navigation: 'Navegación principal',
          menu: 'Abrir navegación principal',
          services: 'Servicios',
          projects: 'Proyectos',
          process: 'Cómo trabajamos',
          studio: 'El estudio',
          primaryAction: 'Ver contacto',
          languageSwitch: 'Ver sitio en inglés',
        }}
      />
      <LegalPage
        content={{
          locale: route.locale,
          heading: legalContent.title,
          updatedLabel: legalContent.chrome.updateLabel,
          updatedAt: '18 de octubre de 2026',
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
          navigation: 'Navegación',
          services: 'Servicios',
          projects: 'Proyectos',
          process: 'Cómo trabajamos',
          studio: 'El estudio',
          founder: 'Samuel Furlanich',
          contact: 'Contacto',
          privacy: 'Privacidad',
          directContact: 'Contacto directo',
          professional: 'Enlaces profesionales',
          location: contactContent.location,
          languageSwitch: 'Ver sitio en inglés',
        }}
      />
    </>
  );
}
