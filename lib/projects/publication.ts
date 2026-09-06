// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { getFoundationPath, getProjectDetailPath, getServiceSectionHref, serviceSectionIds } from '../site-routes.ts';
import type { Locale } from '../locales';
import type {
  PublicProjectCardContent,
  PublicProjectLocaleContent,
  PublicProjectManifestEntry,
  ResolvedProjectDetail,
  ResolvedProjectCard,
} from '../../components/projects/content-types';

export const publishedProjectManifest: readonly PublicProjectManifestEntry[] = [
  {
    id: 'PROJECT-GRS',
    slug: 'general-reservation-system',
    maturity: 'prototype',
    services: ['web'],
    publicationScope: 'limited',
    destination: {
      kind: 'detail',
    },
    visual: {
      kind: 'illustration',
      src: '/projects/general-reservation-system/conceptual-workflow.webp',
      width: 1599,
      height: 900,
    },
  },
  {
    id: 'PROJECT-THE-SYSTEM',
    slug: 'the-system',
    maturity: 'lab',
    services: ['web'],
    publicationScope: 'limited',
    destination: {
      kind: 'detail',
    },
    visual: {
      kind: 'illustration',
      src: '/projects/the-system/conceptual-access-model.webp',
      width: 1599,
      height: 900,
    },
  },
  {
    id: 'PROJECT-MPC-ADMIN',
    slug: 'mpc-administracion',
    maturity: 'prototype',
    services: ['web'],
    publicationScope: 'limited',
    destination: {
      kind: 'detail',
    },
    visual: {
      kind: 'illustration',
      src: '/projects/mpc-administracion/conceptual-operations-model.webp',
      width: 1599,
      height: 900,
    },
  },
];

const allowedMaturities = new Set<PublicProjectManifestEntry['maturity']>([
  'production',
  'lab',
  'prototype',
]);
const allowedScopes = new Set<PublicProjectManifestEntry['publicationScope']>([
  'open',
  'limited',
]);
const allowedVisualKinds = new Set<NonNullable<PublicProjectManifestEntry['visual']>['kind']>([
  'screenshot',
  'diagram',
  'illustration',
]);

function resolveProjectAction(
  entry: PublicProjectManifestEntry,
  locale: Locale,
): { href: string; external: boolean } {
  switch (entry.destination.kind) {
    case 'detail':
      return { href: getProjectDetailPath(locale, entry.slug), external: false };
    case 'contact':
      return { href: getFoundationPath('contact', locale), external: false };
    case 'service':
      return { href: getServiceSectionHref(locale, entry.destination.serviceId), external: false };
    case 'external':
      return { href: entry.destination.href, external: true };
  }
}

function assertCardContent(card: PublicProjectCardContent, entry: PublicProjectManifestEntry, locale: Locale): void {
  for (const field of [
    'title',
    'context',
    'maturityLabel',
    'summary',
    'evidenceSignal',
    'actionLabel',
  ] as const) {
    const value = card[field];
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`${locale} ${entry.id} ${field} must not be empty`);
    }
  }

  if (!Array.isArray(card.capabilities) || (card.capabilities.length !== 2 && card.capabilities.length !== 3)) {
    throw new Error(`${locale} ${entry.id} must have two or three capabilities`);
  }
  if (card.capabilities.some((capability) => typeof capability !== 'string' || !capability.trim())) {
    throw new Error(`${locale} ${entry.id} capabilities must not be empty`);
  }
}

function assertDetailContent(
  detail: import('../../components/projects/content-types').PublicProjectDetailContent,
  entry: PublicProjectManifestEntry,
  locale: Locale,
): void {
  for (const field of ['headerSummary', 'evidenceStatement', 'context', 'problem', 'result', 'limitations', 'publicationScope'] as const) {
    if (typeof detail[field] !== 'string' || !detail[field].trim()) {
      throw new Error(`${locale} ${entry.id} ${field} must not be empty`);
    }
  }
  if (!detail.deliveredScope.length || detail.deliveredScope.some((item) => !item.trim())) {
    throw new Error(`${locale} ${entry.id} delivered scope must not be empty`);
  }
  if (detail.capabilities.length < 2 || detail.capabilities.length > 3 || detail.capabilities.some((item) => !item.trim())) {
    throw new Error(`${locale} ${entry.id} detail capabilities must contain two or three labels`);
  }
  if (!detail.evidence.links.length || detail.evidence.links.some((link) => !link.label.trim() || !/^https:\/\//.test(link.href))) {
    throw new Error(`${locale} ${entry.id} detail evidence links must be approved https links`);
  }
  if (!entry.services.includes(detail.relatedService.serviceId) || !detail.relatedService.label.trim()) {
    throw new Error(`${locale} ${entry.id} related service is not approved`);
  }
  if (!detail.visual.label.trim() || !detail.visual.alt.trim()) {
    throw new Error(`${locale} ${entry.id} conceptual visual label and alt text are required`);
  }
}

function assertManifestShape(entry: PublicProjectManifestEntry): void {
  if (!entry.id.trim() || !entry.slug.trim()) {
    throw new Error('manifest IDs and slugs must not be empty');
  }
  if (!allowedMaturities.has(entry.maturity)) {
    throw new Error(`unsupported maturity for ${entry.id}`);
  }
  if (!entry.services.length || entry.services.some((serviceId) => !serviceSectionIds.includes(serviceId))) {
    throw new Error(`unsupported service for ${entry.id}`);
  }
  if (!allowedScopes.has(entry.publicationScope)) {
    throw new Error(`unsupported publication scope for ${entry.id}`);
  }
  if (entry.destination.kind === 'external' && !/^https:\/\//.test(entry.destination.href)) {
    throw new Error(`external destination for ${entry.id} must use https`);
  }
  if (entry.visual) {
    if (!allowedVisualKinds.has(entry.visual.kind) || !entry.visual.src.trim()) {
      throw new Error(`invalid visual for ${entry.id}`);
    }
    if (!Number.isInteger(entry.visual.width) || entry.visual.width <= 0 ||
      !Number.isInteger(entry.visual.height) || entry.visual.height <= 0) {
      throw new Error(`visual dimensions for ${entry.id} must be positive integers`);
    }
  }
}

function getManifestEntry(id: string): PublicProjectManifestEntry | undefined {
  return publishedProjectManifest.find((entry) => entry.id === id);
}

export function getPublishedProjectCards(
  content: PublicProjectLocaleContent,
  locale: Locale,
): ResolvedProjectCard[] {
  return publishedProjectManifest.map((entry) => {
    const card = content.cards[entry.id];
    if (!card) throw new Error(`${locale} content is missing ${entry.id}`);
    return {
      ...card,
      id: entry.id,
      slug: entry.slug,
      maturity: entry.maturity,
      serviceIds: entry.services,
      publicationScope: entry.publicationScope,
      action: resolveProjectAction(entry, locale),
      visual: entry.visual,
    };
  });
}

export function getPublishedProjectDetails(
  content: PublicProjectLocaleContent,
  locale: Locale,
): PublicProjectManifestEntry[] {
  return publishedProjectManifest
    .filter((entry) => entry.destination.kind === 'detail')
    .map((entry) => {
      if (!content.details[entry.id]) throw new Error(`${locale} detail content is missing ${entry.id}`);
      return entry;
    });
}

export function validateProjectContent(
  content: PublicProjectLocaleContent,
  locale: Locale,
): void {
  const ids = publishedProjectManifest.map((entry) => entry.id);
  const slugs = publishedProjectManifest.map((entry) => entry.slug);
  if (new Set(ids).size !== ids.length) throw new Error('manifest IDs must be unique');
  if (new Set(slugs).size !== slugs.length) throw new Error('manifest slugs must be unique');
  for (const entry of publishedProjectManifest) assertManifestShape(entry);

  for (const id of Object.keys(content.cards)) {
    if (!getManifestEntry(id)) throw new Error(`${locale} content ${id} is outside the publication manifest`);
  }
  for (const id of Object.keys(content.details)) {
    const entry = getManifestEntry(id);
    if (!entry || entry.destination.kind !== 'detail') {
      throw new Error(`${locale} content ${id} is outside the publication manifest`);
    }
  }

  for (const entry of publishedProjectManifest) {
    const card = content.cards[entry.id];
    if (!card) throw new Error(`${locale} content is missing ${entry.id}`);
    assertCardContent(card, entry, locale);

    if (entry.destination.kind === 'detail' && !content.details[entry.id]) {
      throw new Error(`${locale} detail content is missing ${entry.id}`);
    }
    if (entry.destination.kind !== 'detail' && content.details[entry.id]) {
      throw new Error(`${locale} detail content is not eligible for ${entry.id}`);
    }
    if (entry.destination.kind === 'detail') {
      assertDetailContent(content.details[entry.id], entry, locale);
    }
  }
}

export function getPublishedProjectDetail(
  content: PublicProjectLocaleContent,
  slug: string,
  locale: Locale,
): ResolvedProjectDetail | undefined {
  validateProjectContent(content, locale);
  const entry = publishedProjectManifest.find(
    (candidate) => candidate.slug === slug && candidate.destination.kind === 'detail',
  );
  if (!entry || !entry.visual) return undefined;
  const detail = content.details[entry.id];
  if (!detail) return undefined;
  return {
    ...detail,
    id: entry.id,
    slug: entry.slug,
    title: content.cards[entry.id].title,
    maturityLabel: content.cards[entry.id].maturityLabel,
    maturity: entry.maturity,
    serviceIds: entry.services,
    publicationScope: entry.publicationScope,
    visual: { ...entry.visual, ...detail.visual },
    relatedServiceHref: getServiceSectionHref(locale, detail.relatedService.serviceId),
  };
}
