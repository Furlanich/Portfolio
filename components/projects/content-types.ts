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

export type PublicProjectEvidenceLink = {
  label: string;
  href: string;
  kind: 'repository' | 'conceptual-visual';
};

export type PublicProjectDetailContent = {
  headerSummary: string;
  evidenceStatement: string;
  context: string;
  problem: string;
  deliveredScope: readonly string[];
  capabilities: readonly [string, string] | readonly [string, string, string];
  result: string;
  evidence: {
    links: readonly [PublicProjectEvidenceLink, ...PublicProjectEvidenceLink[]];
  };
  limitations: string;
  relatedService: {
    label: string;
    serviceId: ServiceSectionId;
  };
  publicationScope: string;
  visual: {
    label: string;
    alt: string;
  };
};

export type ResolvedProjectCard = PublicProjectCardContent & {
  id: string;
  slug: string;
  maturity: PublicProjectManifestEntry['maturity'];
  serviceIds: PublicProjectManifestEntry['services'];
  publicationScope: PublicProjectManifestEntry['publicationScope'];
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
  details: Readonly<Record<string, PublicProjectDetailContent>>;
};

export type ResolvedProjectDetail = PublicProjectDetailContent & {
  id: string;
  slug: string;
  title: string;
  maturityLabel: string;
  maturity: PublicProjectManifestEntry['maturity'];
  serviceIds: PublicProjectManifestEntry['services'];
  publicationScope: PublicProjectManifestEntry['publicationScope'];
  visual: NonNullable<PublicProjectManifestEntry['visual']> & PublicProjectDetailContent['visual'];
  relatedServiceHref: string;
};

export type PublicProjectLocaleContent = Pick<ProjectsPageContent, 'cards' | 'details'>;
