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
});
