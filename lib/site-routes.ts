import type { Locale } from './locales';
import type { ServiceSectionId } from '../components/services/content-types';

export const foundationRouteIds = [
  'home',
  'services',
  'projects',
  'contact',
  'founder',
] as const;

export type FoundationRouteId = (typeof foundationRouteIds)[number];

export const foundationRoutes = {
  home: { es: '/', en: '/en/' },
  services: { es: '/servicios/', en: '/en/services/' },
  projects: { es: '/proyectos/', en: '/en/work/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
  founder: {
    es: '/estudio/samuel-furlanich/',
    en: '/en/about/samuel-furlanich/',
  },
} as const satisfies Record<FoundationRouteId, Record<Locale, string>>;

export const homeProcessAnchors = {
  es: 'proceso',
  en: 'process',
} as const satisfies Record<Locale, string>;

export const serviceSectionIds = ['web', 'whatsapp', 'consulting'] as const satisfies readonly ServiceSectionId[];

export const serviceSectionAnchors = {
  web: { es: 'web', en: 'web' },
  whatsapp: { es: 'whatsapp', en: 'whatsapp' },
  consulting: { es: 'consultoria', en: 'consulting' },
} as const satisfies Record<ServiceSectionId, Record<Locale, string>>;

export function getServiceSectionHref(
  locale: Locale,
  serviceId: ServiceSectionId,
): string {
  return getFoundationPath('services', locale) + '#' + serviceSectionAnchors[serviceId][locale];
}

export function getFoundationPath(
  routeId: FoundationRouteId,
  locale: Locale,
): string {
  return foundationRoutes[routeId][locale];
}

export function getHomeProcessHref(locale: Locale): string {
  return `${getFoundationPath('home', locale)}#${homeProcessAnchors[locale]}`;
}

export function getProjectDetailPath(locale: Locale, slug: string): string {
  return locale === 'es' ? `/proyectos/${slug}/` : `/en/work/${slug}/`;
}
