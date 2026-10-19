// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { getFoundationPath, getHomeProcessHref } from './site-routes.ts';
import type { FoundationRouteId } from './site-routes.ts';
import type { Locale } from './locales';

export type FoundationNavigationPaths = {
  home: string;
  services: string;
  projects: string;
  contact: string;
  studio: string;
  founder: string;
  privacy: string;
  terms: string;
  process: string;
  alternateLocale: Locale;
  alternateHref: string;
};

/** Page links use a stable top target; canonical URLs and intentional section links stay separate. */
export function getFoundationPageLinkHref(routeId: FoundationRouteId, locale: Locale): string {
  const path = getFoundationPath(routeId, locale);
  return routeId === 'services' || routeId === 'projects' ? `${path}#site-top` : path;
}

export function getFoundationNavigationPaths(
  locale: Locale,
  currentRouteId: FoundationRouteId,
): FoundationNavigationPaths {
  const alternateLocale = locale === 'es' ? 'en' : 'es';

  return {
    home: getFoundationPath('home', locale),
    services: getFoundationPageLinkHref('services', locale),
    projects: getFoundationPageLinkHref('projects', locale),
    contact: getFoundationPath('contact', locale),
    studio: getFoundationPath('studio', locale),
    founder: getFoundationPath('founder', locale),
    privacy: getFoundationPath('privacy', locale),
    terms: getFoundationPath('terms', locale),
    process: getHomeProcessHref(locale),
    alternateLocale,
    alternateHref: getFoundationPath(currentRouteId, alternateLocale),
  };
}
