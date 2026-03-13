import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const withBasePath = (path: string) => `${basePath}${path}`;

export const metadata: Metadata = {
  title: 'Samuel Furlanich - Developer',
  description: 'A modern developer portfolio built with Next.js and TypeScript.',
  icons: {
    icon: [
      { url: withBasePath('/favicon.ico'), type: 'image/x-icon' },
      { url: withBasePath('/favicon.svg'), type: 'image/svg+xml' },
      { url: withBasePath('/favicon.png'), type: 'image/png', sizes: '32x32' }
    ],
    apple: [
      {
        url: withBasePath('/apple-touch-icon.png'),
        type: 'image/png',
        sizes: '180x180'
      }
    ]
  },
  openGraph: {
    title: 'Senior Engineer Portfolio',
    description: 'A modern developer portfolio built with Next.js and TypeScript.',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
