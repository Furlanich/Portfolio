// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { getFoundationPath, getServiceSectionHref, projectDossierSlugs, serviceSectionIds } from '../site-routes.ts';
import type { ProjectDossierSlug } from '../site-routes.ts';
import type { Locale } from '../locales';
import type {
  PublicProjectDossierContent,
  PublicProjectLocaleContent,
  PublicProjectManifestEntry,
  ResolvedProjectDossier,
} from '../../components/projects/content-types';

// PLAN-SPF-V1 Task 3. The Projects index publishes exactly two complete dossiers, GRS first and
// The-System second. This module is the fail-closed gate: anything outside the approved pair, its
// maturity, publication permission, image and source is rejected at build time, so a record can
// never reach the page by accident. MPC is not in this projection: it stays a text context on
// Founder, and its evidence record and permission are unchanged.

type ApprovedRecord = {
  id: string;
  slug: ProjectDossierSlug;
  maturity: PublicProjectManifestEntry['maturity'];
  /** The existing approved public repository from the item record. */
  sourceHref: string;
  /** The original 1599x900 conceptual WebP, moved into its index dossier unchanged. */
  visualSrc: string;
};

const approvedRecords: readonly ApprovedRecord[] = Object.freeze([
  {
    id: 'PROJECT-GRS',
    slug: 'general-reservation-system',
    maturity: 'prototype',
    sourceHref: 'https://github.com/Furlanich/GeneralReservationSystem',
    visualSrc: '/projects/general-reservation-system/conceptual-workflow.webp',
  },
  {
    id: 'PROJECT-THE-SYSTEM',
    slug: 'the-system',
    maturity: 'lab',
    sourceHref: 'https://github.com/Furlanich/The-System',
    visualSrc: '/projects/the-system/conceptual-access-model.webp',
  },
]);

export const publishedProjectManifest: readonly PublicProjectManifestEntry[] = approvedRecords.map((record) => ({
  id: record.id,
  slug: record.slug,
  maturity: record.maturity,
  services: ['web'],
  publicationScope: 'limited',
  sourceHref: record.sourceHref,
  visual: { kind: 'illustration', src: record.visualSrc, width: 1599, height: 900 },
}));

const allowedMaturities = new Set<PublicProjectManifestEntry['maturity']>(['production', 'lab', 'prototype']);
const allowedScopes = new Set<PublicProjectManifestEntry['publicationScope']>(['open', 'limited']);

function isBlank(value: unknown): boolean {
  return typeof value !== 'string' || !value.trim();
}

export function validateProjectManifest(entries: readonly PublicProjectManifestEntry[]): void {
  if (entries.length !== approvedRecords.length) {
    throw new Error(`the manifest must publish exactly ${approvedRecords.length} dossiers`);
  }
  entries.forEach((entry, index) => {
    const approved = approvedRecords[index];
    if (entry.id !== approved.id) throw new Error(`manifest position ${index + 1} must be ${approved.id}, got ${entry.id}`);
    if (!(projectDossierSlugs as readonly string[]).includes(entry.slug) || entry.slug !== approved.slug) {
      throw new Error(`unsupported slug for ${entry.id}`);
    }
    if (!allowedMaturities.has(entry.maturity) || entry.maturity !== approved.maturity) {
      throw new Error(`unsupported maturity for ${entry.id}`);
    }
    if (!allowedScopes.has(entry.publicationScope) || entry.publicationScope !== 'limited') {
      throw new Error(`unsupported publication scope for ${entry.id}`);
    }
    if (entry.services.length !== 1 || entry.services[0] !== 'web' || !serviceSectionIds.includes(entry.services[0])) {
      throw new Error(`unsupported service for ${entry.id}`);
    }
    if (!/^https:\/\//.test(entry.sourceHref) || entry.sourceHref !== approved.sourceHref) {
      throw new Error(`source for ${entry.id} is not the approved public repository`);
    }
    if (entry.visual.kind !== 'illustration' || entry.visual.src !== approved.visualSrc) {
      throw new Error(`visual for ${entry.id} is not the approved conceptual illustration`);
    }
    if (entry.visual.width !== 1599 || entry.visual.height !== 900) {
      throw new Error(`visual dimensions for ${entry.id} must stay 1599x900`);
    }
  });
}

function assertDossierContent(dossier: PublicProjectDossierContent, entry: PublicProjectManifestEntry, locale: Locale): void {
  for (const field of ['jumpLabel', 'title', 'maturityLabel', 'summary', 'relationship'] as const) {
    if (isBlank(dossier[field])) throw new Error(`${locale} ${entry.id} ${field} must not be empty`);
  }
  if (isBlank(dossier.visual?.caption) || isBlank(dossier.visual?.alt)) {
    throw new Error(`${locale} ${entry.id} conceptual image caption and alt text are required`);
  }
  for (const section of ['opportunity', 'evidence', 'limits'] as const) {
    if (isBlank(dossier[section]?.heading) || isBlank(dossier[section]?.content)) {
      throw new Error(`${locale} ${entry.id} ${section} must have a heading and content`);
    }
  }
  if (isBlank(dossier.scope?.heading) || !Array.isArray(dossier.scope.items) || !dossier.scope.items.length || dossier.scope.items.some(isBlank)) {
    throw new Error(`${locale} ${entry.id} implemented scope must have a heading and non-empty items`);
  }
}

export function validateProjectContent(content: PublicProjectLocaleContent, locale: Locale): void {
  validateProjectManifest(publishedProjectManifest);

  for (const field of ['sourceAction', 'relatedServiceAction'] as const) {
    if (isBlank(content[field])) throw new Error(`${locale} ${field} must not be empty`);
  }
  if (isBlank(content.founderAction?.label) || content.founderAction.routeId !== 'founder') {
    throw new Error(`${locale} Founder action must target the Founder route`);
  }
  if (isBlank(content.disclosure?.heading) || isBlank(content.disclosure?.description)) {
    throw new Error(`${locale} disclosure must not be empty`);
  }

  const expectedIds = publishedProjectManifest.map((entry) => entry.id);
  for (const id of Object.keys(content.dossiers)) {
    if (!expectedIds.includes(id)) throw new Error(`${locale} content ${id} is outside the publication manifest`);
  }
  for (const entry of publishedProjectManifest) {
    const dossier = content.dossiers[entry.id];
    if (!dossier) throw new Error(`${locale} content is missing ${entry.id}`);
    assertDossierContent(dossier, entry, locale);
  }
}

export function getPublishedProjectDossiers(content: PublicProjectLocaleContent, locale: Locale): ResolvedProjectDossier[] {
  validateProjectContent(content, locale);
  return publishedProjectManifest.map((entry) => {
    const dossier = content.dossiers[entry.id];
    return {
      ...dossier,
      id: entry.id,
      slug: entry.slug,
      maturity: entry.maturity,
      serviceIds: entry.services,
      publicationPermission: entry.publicationScope,
      sourceHref: entry.sourceHref,
      relatedServiceHref: getServiceSectionHref(locale, entry.services[0]),
      founderHref: getFoundationPath('founder', locale),
      visual: { ...entry.visual, ...dossier.visual },
    };
  });
}
