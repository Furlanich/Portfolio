const KIB = 1024;

/**
 * SKY-CHART-V2 D-23 environment posters. The declared shape lives here, in the manifest's own
 * file, rather than in `types.ts` (Task 4's file): the chapter posters that shape described
 * are gone, and these two stills are not tied to a chapter.
 */
export type EnvironmentPosterEntry = {
  id: 'environment-wide' | 'environment-compact';
  kind: 'poster';
  /** Root-relative public path; apply `withBasePath` from `lib/paths` when rendering. */
  src: string;
  width: number;
  height: number;
  classification: 'brand-motion';
  locale: 'neutral';
  evidence: false;
  decorative: true;
  maxBytes: number;
};

// Locale-neutral stills of the resolved Sky Chart scene: graticule, field stars and every
// link, with no labels and no scrim. Every entry is brand motion: a general illustration of
// connected systems, never project evidence, a client workflow or a measured outcome. The
// adjacent HTML carries all meaning, so the posters are decorative (CSS backgrounds, no alt).
// Regenerate both with `node scripts/render-sky-chart-posters.mjs`.
export const instrumentMediaManifest: readonly EnvironmentPosterEntry[] = [
  {
    id: 'environment-wide',
    kind: 'poster',
    src: '/brand/sky-chart/environment-wide.webp',
    width: 1920,
    height: 1080,
    classification: 'brand-motion',
    locale: 'neutral',
    evidence: false,
    decorative: true,
    maxBytes: 150 * KIB,
  },
  {
    id: 'environment-compact',
    kind: 'poster',
    src: '/brand/sky-chart/environment-compact.webp',
    width: 900,
    height: 1600,
    classification: 'brand-motion',
    locale: 'neutral',
    evidence: false,
    decorative: true,
    maxBytes: 80 * KIB,
  },
];

export function getEnvironmentPoster(id: EnvironmentPosterEntry['id']): EnvironmentPosterEntry {
  const entry = instrumentMediaManifest.find((candidate) => candidate.id === id);
  if (!entry) throw new Error(`Unknown environment poster "${id}"`);
  return entry;
}
