import type { InstrumentChapterId, InstrumentMediaEntry } from './types';

export const INSTRUMENT_CHAPTER_IDS: readonly InstrumentChapterId[] = [
  'recognition',
  'fragmentation',
  'connection',
  'coordination',
];

const KIB = 1024;

// Static chapter posters. Every entry is brand motion: a general illustration of connected
// systems, never project evidence, a client workflow or a measured outcome. The adjacent
// HTML carries each chapter's meaning, so the posters are decorative.
export const instrumentMediaManifest: readonly InstrumentMediaEntry[] = INSTRUMENT_CHAPTER_IDS.map((chapter) => ({
  id: `${chapter}-poster`,
  chapter,
  kind: 'poster',
  src: `/brand/immersive/${chapter}.svg`,
  width: 800,
  height: 1000,
  classification: 'brand-motion',
  locale: 'neutral',
  evidence: false,
  decorative: true,
  maxBytes: 150 * KIB,
}));

export function getInstrumentPoster(artworkId: string): InstrumentMediaEntry {
  const entry = instrumentMediaManifest.find((candidate) => candidate.id === artworkId);
  if (!entry) throw new Error(`Unknown instrument artwork "${artworkId}"`);
  return entry;
}
