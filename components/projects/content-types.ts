import type { ActionLink } from '../foundation/content-types';
import type { ServiceSectionId } from '../services/content-types';
import type { Locale } from '../../lib/locales';

export type PublicProjectManifestEntry = {
  id: string;
  slug: string;
  maturity: 'production' | 'lab' | 'prototype';
  services: readonly [ServiceSectionId, ...ServiceSectionId[]];
  publicationScope: 'open' | 'limited';
  destination:
    | { kind: 'detail' }
    | { kind: 'contact' }
    | { kind: 'service'; serviceId: ServiceSectionId }
    | { kind: 'external'; href: string };
  visual?: {
    kind: 'screenshot' | 'diagram' | 'illustration';
    src: string;
    width: number;
    height: number;
  };
};

export type PublicProjectCardContent = {
  title: string;
  context: string;
  maturityLabel: string;
  summary: string;
  capabilities: readonly [string, string] | readonly [string, string, string];
  evidenceSignal: string;
  actionLabel: string;
  visualAlt?: string;
};

export type ResolvedProjectCard = PublicProjectCardContent & {
  id: string;
  slug: string;
  maturity: PublicProjectManifestEntry['maturity'];
  serviceIds: PublicProjectManifestEntry['services'];
  action: {
    href: string;
    external: boolean;
  };
  visual?: PublicProjectManifestEntry['visual'];
};

export type ProjectsPageContent = {
  locale: Locale;
  routeId: 'projects';
  heading: string;
  introduction: string;
  taxonomy: {
    production: string;
    lab: string;
    prototype: string;
  };
  confidentiality: {
    heading: string;
    description: string;
  };
  finalCta: {
    heading: string;
    description: string;
    action: ActionLink;
  };
  cards: Readonly<Record<string, PublicProjectCardContent>>;
  details: Readonly<Record<string, never>>;
};

export type PublicProjectLocaleContent = Pick<ProjectsPageContent, 'cards' | 'details'>;
