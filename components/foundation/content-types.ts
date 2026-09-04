// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { getFoundationPath } from '../../lib/site-routes.ts';
import type { FoundationRouteId } from '../../lib/site-routes.ts';
import type { Locale } from '../../lib/locales';

export type ActionLink = {
  label: string;
  routeId: FoundationRouteId;
};

export type ResolvedActionLink = ActionLink & {
  href: string;
};

export function resolveActionLink(
  action: ActionLink,
  locale: Locale,
): ResolvedActionLink {
  return {
    ...action,
    href: getFoundationPath(action.routeId, locale),
  };
}

export type ExternalLink = {
  label: string;
  href: string;
};

export type DocumentLink = {
  label: string;
  path: string;
};

export type ContactAction = {
  label: string;
  kind: 'whatsapp' | 'email' | 'phone';
  href: string;
};

export type HomeHeroContent = {
  locale: Locale;
  routeId: 'home';
  eyebrow: string;
  heading: string;
  description: string;
  primaryAction: ActionLink;
  secondaryAction: ActionLink;
  trustLine: string;
  availability: string;
};

export type ServiceSummary = {
  title: string;
  summary: string;
};

export type ServicesContent = {
  locale: Locale;
  routeId: 'services';
  heading: string;
  introduction: string;
  services: ServiceSummary[];
  action: ActionLink;
};

export type ContactContent = {
  locale: Locale;
  routeId: 'contact';
  heading: string;
  introduction: string;
  responseExpectation: string;
  location: string;
  actions: ContactAction[];
};

export type FounderExperience = {
  title: string;
  period: string;
  summary: string;
};

export type FounderEducation = {
  title: string;
  institution: string;
  status: string;
};

export type FounderContent = {
  locale: Locale;
  routeId: 'founder';
  name: string;
  role: string;
  biography: string;
  experience: FounderExperience[];
  education: FounderEducation[];
  capabilities: string[];
  cv: DocumentLink;
  linkedin: ExternalLink;
  github: ExternalLink;
  contactAction: ActionLink;
};
