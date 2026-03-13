import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Senior Engineer Portfolio',
  description: 'A modern developer portfolio built with Next.js and TypeScript.',
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