import type { Locale } from '../../lib/locales';
import type { ContactAction } from './content-types';

/**
 * PLAN-SPF-V1 Task 4: the shared Footer's conclusion copy. The exact public strings are the APPROVED
 * "Proposed Footer wording" table in docs/product/information-architecture.md (D06-IA, approved
 * 2026-09-30); this module is the only code copy of them. It is plain data: no runtime, window, storage
 * or Three, so the server Footer and the Node tests import it alike.
 *
 * Every route page already passes `SiteFooterLabels`, and those pages are outside this packet, so the
 * Footer takes the destination labels from the existing props and the new conclusion copy from here.
 */
export type FooterConclusionContent = {
  headline: string;
  introduction: string;
  whatsappAction: string;
  directContactHeading: string;
  contactRouteAction: string;
  locationAccountability: string;
  exploreHeading: string;
  accountabilityHeading: string;
};

const footerConclusion: Record<Locale, FooterConclusionContent> = {
  es: {
    headline: 'Dale un próximo paso a tu proyecto.',
    introduction:
      'Contanos qué necesitás construir, conectar o mejorar. Samuel Furlanich es el responsable técnico directo.',
    whatsappAction: 'Escribinos por WhatsApp',
    directContactHeading: 'Contacto directo',
    contactRouteAction: 'Información de contacto',
    locationAccountability: 'Buenos Aires, Argentina · Estudio liderado por su fundador',
    exploreHeading: 'Explorar',
    accountabilityHeading: 'Responsabilidad directa',
  },
  en: {
    headline: 'Give your project a next step.',
    introduction:
      'Tell us what you need to build, connect or improve. Samuel Furlanich is the directly accountable technical lead.',
    whatsappAction: 'Write on WhatsApp',
    directContactHeading: 'Direct contact',
    contactRouteAction: 'Contact information',
    locationAccountability: 'Buenos Aires, Argentina · Founder-led studio',
    exploreHeading: 'Explore',
    accountabilityHeading: 'Direct accountability',
  },
};

export function getFooterConclusionContent(locale: Locale): FooterConclusionContent {
  return footerConclusion[locale];
}

/**
 * The Footer's own locale, from the typed alternate one. Every page already passes
 * `paths.alternateLocale`, and the site has exactly two locales, so the current locale is its opposite.
 */
export function resolveFooterLocale(alternateLocale: Locale): Locale {
  return alternateLocale === 'es' ? 'en' : 'es';
}

// Argentine mobile numbers in the display form the contact record publishes: +54 9 11 5011-7565.
const argentineMobile = /^\+54(9)(\d{2})(\d{4})(\d{4})$/;

/**
 * The visible text of a direct channel. The reference composition shows the address and the number, not
 * an action sentence. Both derive from the content-owned `href`, so the displayed value cannot drift
 * from the destination. An unrecognized phone shape shows the dialed number as given; the WhatsApp
 * action keeps its approved label.
 */
export function getDirectChannelText(action: ContactAction): string {
  if (action.kind === 'email') return action.href.replace(/^mailto:/i, '').split('?')[0];

  if (action.kind === 'phone') {
    const dialed = action.href.replace(/^tel:/i, '');
    const match = argentineMobile.exec(dialed);
    return match ? `+54 ${match[1]} ${match[2]} ${match[3]}-${match[4]}` : dialed;
  }

  return action.label;
}
