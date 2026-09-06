// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { getFoundationPath, getHomeProcessHref } from './site-routes.ts';
import type { FoundationRouteId } from './site-routes.ts';
import type { Locale } from './locales';

export type FoundationNavigationPaths = {
  home: string;
  services: string;
  projects: string;
  contact: string;
  founder: string;
  process: string;
  alternateLocale: Locale;
  alternateHref: string;
};

export function getFoundationNavigationPaths(
  locale: Locale,
  currentRouteId: FoundationRouteId,
): FoundationNavigationPaths {
  const alternateLocale = locale === 'es' ? 'en' : 'es';

  return {
    home: getFoundationPath('home', locale),
    services: getFoundationPath('services', locale),
    projects: getFoundationPath('projects', locale),
    contact: getFoundationPath('contact', locale),
    founder: getFoundationPath('founder', locale),
    process: getHomeProcessHref(locale),
    alternateLocale,
    alternateHref: getFoundationPath(currentRouteId, alternateLocale),
  };
}
