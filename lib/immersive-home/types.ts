export type InstrumentChapterId =
  | 'recognition'
  | 'fragmentation'
  | 'connection'
  | 'coordination';

export type InstrumentChapterContent = {
  id: InstrumentChapterId;
  sequence: string;
  /** Mono chapter verb, e.g. "Recognize" / "Reconocer". */
  kicker: string;
  heading: string;
  description: string;
  artworkId: string;
};

/** The 20 Sky Chart scene node ids (`PLAN-SKY-CHART-HOME-REDESIGN-V2` Appendix B). */
export type SkyChartNodeId =
  | 'orders'
  | 'bookings'
  | 'messages'
  | 'tasks'
  | 'understand'
  | 'process'
  | 'constraints'
  | 'diagnosis'
  | 'define'
  | 'scope'
  | 'responsibilities'
  | 'validation-criteria'
  | 'build-review'
  | 'integrate'
  | 'technical-review'
  | 'functional-tests'
  | 'hand-over'
  | 'documentation'
  | 'journeys-validated'
  | 'maintain';

export type HomeInstrumentContent = {
  label: string;
  /** Visible compact metadata; `{current}` is replaced by the zero-padded chapter sequence. */
  statusLabel: string;
  /** Decorative atlas-plate number; `{current}` is replaced by the zero-padded chapter sequence. */
  plateLabel: string;
  /**
   * Decorative coordinate readout, e.g. `34°36'S · 58°22'W`. Uses the ASCII apostrophe
   * (U+0027) as the plain-text minute mark, not U+2032 PRIME: the shipped primary font
   * subset only covers U+0000-00FF (see `scripts/brand-assets.test.mjs`).
   */
  coordinates: string;
  pauseLabel: string;
  resumeLabel: string;
  chapters: readonly [
    InstrumentChapterContent,
    InstrumentChapterContent,
    InstrumentChapterContent,
    InstrumentChapterContent,
  ];
  /** Labels for the 20 Sky Chart scene nodes, keyed by `SkyChartNodeId`. */
  nodes: Record<SkyChartNodeId, string>;
};

export type InstrumentMediaEntry = {
  id: string;
  chapter: InstrumentChapterId;
  kind: 'poster';
  src: string;
  width: number;
  height: number;
  classification: 'brand-motion';
  locale: 'neutral';
  evidence: false;
  decorative: true;
  maxBytes: number;
};
