import type { ConnectedQuality, ConnectedRoute } from './types';

const KIB = 1024;

/**
 * Static poster media for the connected routes, one entry per route and graph quality. The poster
 * is the matched static still of the scene's stronger composition (DESIGN-SPF-V1, "Accessibility,
 * preferences and fallbacks"). It is decorative: the adjacent HTML carries all meaning.
 */
export type ConnectedPosterEntry = {
  route: ConnectedRoute;
  quality: ConnectedQuality;
  /** Root-relative public path; apply `withBasePath` from `lib/paths` when rendering. */
  src: string;
  width: number;
  height: number;
  /** Byte ceiling: 150KiB wide, 80KiB compact. */
  maxBytes: number;
  /**
   * True once the file is committed within its byte ceiling (PLAN-SPF-V1 Task 8 published all four,
   * captured by `scripts/capture-connected-studio-posters.mjs`). While false, the Ground shows its pure
   * CSS chart and never references the missing URL; the chart also remains the fallback if the image fails.
   */
  published: boolean;
};

function poster(route: ConnectedRoute, quality: ConnectedQuality): ConnectedPosterEntry {
  const wide = quality === 'wide';
  return Object.freeze({
    route,
    quality,
    src: `/brand/connected-studio/${route}-${quality}.webp`,
    width: wide ? 1920 : 900,
    height: wide ? 1080 : 1600,
    maxBytes: (wide ? 150 : 80) * KIB,
    published: true,
  });
}

export const connectedMediaManifest: readonly ConnectedPosterEntry[] = Object.freeze([
  poster('services', 'wide'),
  poster('services', 'compact'),
  poster('projects', 'wide'),
  poster('projects', 'compact'),
]);

export function getConnectedPoster(route: ConnectedRoute, quality: ConnectedQuality): ConnectedPosterEntry {
  const entry = connectedMediaManifest.find((candidate) => candidate.route === route && candidate.quality === quality);
  if (!entry) throw new RangeError(`No connected poster for route "${String(route)}" and quality "${String(quality)}"`);
  return entry;
}
