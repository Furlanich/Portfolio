import type { ActionLink } from '../foundation/content-types';
import type { ServiceSectionId } from '../services/content-types';
import type { Locale } from '../../lib/locales';
import type { ProjectDossierSlug } from '../../lib/site-routes';

// PLAN-SPF-V1 Task 3: the Projects index publishes two complete dossiers. These types replace the
// former card/detail-route roles; there is no per-project destination any more.

export type PublicProjectManifestEntry = {
  id: string;
  slug: ProjectDossierSlug;
  maturity: 'production' | 'lab' | 'prototype';
  services: readonly [ServiceSectionId, ...ServiceSectionId[]];
  publicationScope: 'open' | 'limited';
  /** The existing approved public repository (language-neutral). */
  sourceHref: string;
  visual: {
    kind: 'screenshot' | 'diagram' | 'illustration';
    src: string;
    width: number;
    height: number;
  };
};

export type PublicProjectDossierContent = {
  /** The localized jump-link label shown in the page introduction. */
  jumpLabel: string;
  title: string;
  maturityLabel: string;
  summary: string;
  relationship: string;
  visual: {
    caption: string;
    alt: string;
  };
  opportunity: { heading: string; content: string };
  scope: { heading: string; items: readonly string[] };
  evidence: { heading: string; content: string };
  limits: { heading: string; content: string };
};

export type ProjectsPageContent = {
  locale: Locale;
  routeId: 'projects';
  heading: string;
  introduction: string;
  sourceAction: string;
  relatedServiceAction: string;
  founderAction: ActionLink;
  disclosure: {
    heading: string;
    description: string;
  };
  sceneCaption: string;
  dossiers: Readonly<Record<string, PublicProjectDossierContent>>;
};

export type ResolvedProjectDossier = Omit<PublicProjectDossierContent, 'visual'> & {
  id: string;
  slug: ProjectDossierSlug;
  maturity: PublicProjectManifestEntry['maturity'];
  serviceIds: PublicProjectManifestEntry['services'];
  publicationPermission: PublicProjectManifestEntry['publicationScope'];
  sourceHref: string;
  relatedServiceHref: string;
  founderHref: string;
  visual: PublicProjectManifestEntry['visual'] & PublicProjectDossierContent['visual'];
};

export type PublicProjectLocaleContent = Pick<ProjectsPageContent, 'dossiers' | 'sourceAction' | 'relatedServiceAction' | 'founderAction' | 'disclosure'>;
