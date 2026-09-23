import type { Metadata } from 'next';
import { instrumentSans, plexMono } from '../fonts';
import '../globals.css';

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'FURLANICH',
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: '16x16 32x32' },
      { url: `${basePath}/favicon.svg`, type: 'image/svg+xml' },
    ],
    apple: `${basePath}/apple-touch-icon.png`,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function SpanishLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${instrumentSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
