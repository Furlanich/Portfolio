import type { Locale } from './locales';

export const foundationRouteIds = [
  'home',
  'services',
  'contact',
  'founder',
] as const;

export type FoundationRouteId = (typeof foundationRouteIds)[number];

export const foundationRoutes = {
  home: { es: '/', en: '/en/' },
  services: { es: '/servicios/', en: '/en/services/' },
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

export function getFoundationPath(
  routeId: FoundationRouteId,
  locale: Locale,
): string {
  return foundationRoutes[routeId][locale];
}

export function getHomeProcessHref(locale: Locale): string {
  return `${getFoundationPath('home', locale)}#${homeProcessAnchors[locale]}`;
}
