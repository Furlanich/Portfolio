import localFont from 'next/font/local';

// Shared by both locale layouts so each face is emitted once. Provenance, subsets and
// SHA-256 values are recorded in DESIGN-VISUAL; the OFL notices sit beside the files.
export const instrumentSans = localFont({
  src: './fonts/instrument-sans-variable-latin.woff2',
  weight: '400 700',
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

export const plexMono = localFont({
  src: [
    { path: './fonts/ibm-plex-mono-regular-latin.woff2', weight: '400' },
    { path: './fonts/ibm-plex-mono-semibold-latin.woff2', weight: '600' },
  ],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
  // next/font's only automatic fallback is Arial or Times New Roman scaled to the font's average
  // width, which is wrong for a monospace face: uppercase text and digits (the App Bar readout,
  // the hero coordinate line, every label) come out ~25% wider than IBM Plex Mono, so they wrapped
  // and reflowed the hero when the file arrived. Plex Mono advances 0.6em, as do Courier New (and
  // its metric twin Liberation Mono) and the platform monospace faces, so the swap is width-neutral.
  adjustFontFallback: false,
  fallback: ['Courier New', 'Liberation Mono', 'monospace'],
});
