'use client';

import { useEffect } from 'react';
import { normalizeAppBarPath } from './app-bar-path';

// SKY-CHART-V2 D-22. A client leaf: it renders nothing and only reaches into the DOM that
// SiteHeader (a server component) already rendered. Kept dependency-free and small (budget:
// <=3 KiB Brotli) so the shared header stays cheap on every route.
const DOCK_SCROLL_THRESHOLD = 24;
const READOUT_LINE_RATIO = 0.4;

function isProcessLink(link: HTMLAnchorElement): boolean {
  return link.hash === '#process' || link.hash === '#proceso';
}

export function AppBarBehavior() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('[data-app-bar]');
    if (!header) return undefined;

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    const currentPath = normalizeAppBarPath(window.location.pathname, basePath);

    // aria-current="page": every plain route link whose resolved pathname matches the
    // current one. The Process link is excluded here -- on Home it always resolves to the
    // home pathname (it is a same-page hash link), and D-22 reserves it for the
    // aria-current="location" treatment below instead.
    const navLinks = Array.from(header.querySelectorAll<HTMLAnchorElement>('[data-app-bar-nav-link]'));
    for (const link of navLinks) {
      if (isProcessLink(link)) continue;
      const matches = normalizeAppBarPath(link.pathname, basePath) === currentPath;
      if (matches) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }

    const brandLink = header.querySelector<HTMLAnchorElement>('[data-app-bar-brand]');
    const isHome = Boolean(brandLink) && normalizeAppBarPath(brandLink!.pathname, basePath) === currentPath;

    const cleanupFns: Array<() => void> = [];
    const surface = header.querySelector<HTMLElement>('[data-app-bar-surface]');

    if (isHome && surface) {
      let frame = 0;
      const applyDockState = () => {
        frame = 0;
        const docked = window.scrollY > DOCK_SCROLL_THRESHOLD ? 'true' : 'false';
        header.dataset.docked = docked;
        surface.dataset.docked = docked;
      };
      const onScroll = () => {
        if (frame) return;
        frame = window.requestAnimationFrame(applyDockState);
      };

      applyDockState();
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanupFns.push(() => {
        window.removeEventListener('scroll', onScroll);
        if (frame) window.cancelAnimationFrame(frame);
      });
    }

    const readoutEl = header.querySelector<HTMLElement>('[data-app-bar-readout]');
    if (isHome && readoutEl) readoutEl.dataset.home = 'true';

    const readoutSections = Array.from(document.querySelectorAll<HTMLElement>('[data-readout]'));
    if (isHome && readoutEl && readoutSections.length > 0) {
      const processLinks = navLinks.filter(isProcessLink);

      // D-22: "Text is `{NN} · {name}`". `[data-readout]` only carries the plain name (the
      // hero and all four chapters share "Home"), so the two-digit index is not read off the
      // DOM -- it is the position of each distinct value's first appearance in document
      // order. That reproduces the reference prototype's fixed `secs` array (Home 00,
      // Problems 01, Services 02, Position fix 03, ...) without hardcoding section ids.
      const readoutOrder = new Map<string, number>();
      for (const section of readoutSections) {
        const value = section.dataset.readout ?? '';
        if (!readoutOrder.has(value)) readoutOrder.set(value, readoutOrder.size);
      }

      const updateReadout = () => {
        const line = window.innerHeight * READOUT_LINE_RATIO;
        let current: HTMLElement | null = null;
        for (const section of readoutSections) {
          if (section.getBoundingClientRect().top <= line) current = section;
        }

        if (current) {
          const value = current.dataset.readout ?? '';
          const index = readoutOrder.get(value) ?? 0;
          readoutEl.textContent = `${String(index).padStart(2, '0')} · ${value}`;
        } else {
          readoutEl.textContent = '';
        }

        const isProcessCurrent = Boolean(current && (current.id === 'process' || current.id === 'proceso'));
        for (const link of processLinks) {
          if (isProcessCurrent) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        }
      };

      updateReadout();
      const observer = new IntersectionObserver(updateReadout, {
        rootMargin: `-${Math.round(READOUT_LINE_RATIO * 100)}% 0px -${Math.round((1 - READOUT_LINE_RATIO) * 100)}% 0px`,
        threshold: 0,
      });
      for (const section of readoutSections) observer.observe(section);
      cleanupFns.push(() => observer.disconnect());
    }

    return () => {
      for (const cleanup of cleanupFns) cleanup();
    };
  }, []);

  return null;
}
