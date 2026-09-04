import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'FURLANICH',
  icons: {
    icon: `${basePath}/favicon.ico`,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function SpanishLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
