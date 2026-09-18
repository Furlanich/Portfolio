'use client';

import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { useRef } from 'react';

interface NavigationDisclosureProps {
  menuLabel: string;
  navigationLabel: string;
  children: ReactNode;
}

function getDestinationHeading(targetId: string): HTMLElement | null {
  const destination = document.getElementById(targetId);

  if (!destination) return null;
  if (/^H[1-6]$/.test(destination.tagName)) return destination;

  return destination.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6');
}

export function NavigationDisclosure({
  menuLabel,
  navigationLabel,
  children,
}: NavigationDisclosureProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);

  function close() {
    if (detailsRef.current) detailsRef.current.open = false;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDetailsElement>) {
    if (event.key !== 'Escape' || !detailsRef.current?.open) return;

    event.preventDefault();
    event.stopPropagation();
    close();
    summaryRef.current?.focus();
  }

  function handleNavigationClick(event: MouseEvent<HTMLElement>) {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a');
    const href = link?.getAttribute('href');

    if (!href) return;

    close();

    const destination = new URL(href, window.location.href);
    if (destination.pathname !== window.location.pathname || !destination.hash) return;

    const targetId = decodeURIComponent(destination.hash.slice(1));
    window.requestAnimationFrame(() => {
      const heading = getDestinationHeading(targetId);
      if (!heading) return;

      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  }

  return (
    <details ref={detailsRef} className="group lg:hidden" onKeyDown={handleKeyDown}>
      <summary
        ref={summaryRef}
        aria-label={menuLabel}
        aria-controls="primary-navigation-panel"
        className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-[10px] border border-foundation-border text-foundation-ink transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-surface focus-visible:ring-offset-[3px] focus-visible:ring-offset-foundation-action-strong lg:hidden [&::-webkit-details-marker]:hidden"
      >
        <span className="sr-only">{menuLabel}</span>
        <span aria-hidden="true" className="flex w-5 flex-col gap-1">
          <span className="h-0.5 w-full bg-current" />
          <span className="h-0.5 w-full bg-current" />
          <span className="h-0.5 w-full bg-current" />
        </span>
      </summary>

      <nav
        id="primary-navigation-panel"
        aria-label={navigationLabel}
        onClick={handleNavigationClick}
        className="absolute left-1/2 top-full hidden w-[min(calc(100vw-40px),24rem)] -translate-x-1/2 flex-col gap-1 rounded-[12px] border border-foundation-border bg-foundation-surface p-2 text-sm font-semibold text-foundation-muted shadow-[0_12px_32px_rgba(11,31,51,0.12)] group-open:flex"
      >
        {children}
      </nav>
    </details>
  );
}
