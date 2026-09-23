export type InstrumentChapterId =
  | 'recognition'
  | 'fragmentation'
  | 'connection'
  | 'coordination';

export type InstrumentChapterContent = {
  id: InstrumentChapterId;
  sequence: string;
  heading: string;
  description: string;
  artworkId: string;
};

export type HomeInstrumentContent = {
  label: string;
  /** Visible compact metadata; `{current}` is replaced by the zero-padded chapter sequence. */
  statusLabel: string;
  pauseLabel: string;
  resumeLabel: string;
  chapters: readonly [
    InstrumentChapterContent,
    InstrumentChapterContent,
    InstrumentChapterContent,
    InstrumentChapterContent,
  ];
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
