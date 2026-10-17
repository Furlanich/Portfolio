import { ContactPage } from '@/components/contact/ContactPage';
import { selectContactPageContent } from '@/components/contact/content-types';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationNavigationPaths } from '@/lib/foundation-navigation';
import { INQUIRY_RELEASE } from '@/lib/inquiry/release';
import { contactContent as demonstrationContactContent } from '../_content/contact';
import { commercialContactContent } from '../_content/commercial/contact';
import { founderContent } from '../_content/founder';

const route = { locale: 'es' as const, routeId: 'contact' as const };
const mode = INQUIRY_RELEASE.mode;
const content = selectContactPageContent(mode, demonstrationContactContent, commercialContactContent);
const paths = getFoundationNavigationPaths(route.locale, route.routeId);

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
      <ContactPage content={content} locale={route.locale} />
      <SiteFooter
        paths={paths}
        contactActions={content.actions}
        founderLinks={[founderContent.professionalLinks.linkedin, founderContent.professionalLinks.github]}
        labels={{
          navigation: 'Navegación',
          services: 'Servicios',
          projects: 'Proyectos',
          process: 'Cómo trabajamos',
          studio: 'El estudio',
          founder: 'Samuel Furlanich',
          contact: 'Contacto',
          directContact: 'Contacto directo',
          privacy: 'Privacidad',
          professional: 'Enlaces profesionales',
          location: content.location,
          languageSwitch: 'Ver sitio en inglés',
        }}
      />
    </>
  );
}
