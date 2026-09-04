// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { getFoundationPath } from './site-routes.ts';
import type { FoundationRouteId } from './site-routes.ts';
import type { Locale } from './locales';

export type FoundationNavigationPaths = {
  home: string;
  services: string;
  contact: string;
  founder: string;
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
    contact: getFoundationPath('contact', locale),
    founder: getFoundationPath('founder', locale),
    alternateLocale,
    alternateHref: getFoundationPath(currentRouteId, alternateLocale),
  };
}
