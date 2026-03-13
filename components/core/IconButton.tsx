'use client';

import { cn } from '@/lib/utils';

interface IconButtonProps {
  href: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}

export function IconButton({ href, label, className, children }: IconButtonProps) {
  const isExternal = href.startsWith('https');

  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper-200 bg-white/80 text-ink-700 transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
        className
      )}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
      <span className="sr-only">{label}</span>
    </a>
  );
}
