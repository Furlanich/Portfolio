'use client';

import { useEffect, useState, type SyntheticEvent } from 'react';
import type { Locale } from '@/lib/locales';
import { withBasePath } from '@/lib/paths';
import { resolveDossierAlternateHref } from '@/lib/project-dossier-navigation';

interface LanguageSwitchProps {
  alternateHref: string;
  alternateLocale: Locale;
  label: string;
}

/**
 * The locale switch. Server-rendered, it is an ordinary link to the equivalent route, which is the
 * complete behavior without JavaScript. On the Projects index a small client enhancement keeps a
 * recognized dossier fragment (`#general-reservation-system`, `#the-system`) across the switch; every
 * other page, and every unknown fragment, keeps the equivalent route unchanged (PLAN-SPF-V1 Task 3).
 * The enhancement only reads the browser's pathname and hash; it never invents a link.
 *
 * It is a native anchor, not `next/link`: the Spanish and English routes sit under separate root
 * layouts, so every switch is a full document load anyway, and a router transition would first wait on
 * an RSC request it then discards. The href therefore carries the deployment base path itself.
 */
export function LanguageSwitch({
  alternateHref,
  alternateLocale,
  label,
}: LanguageSwitchProps) {
  const [href, setHref] = useState(() => withBasePath(alternateHref));

  useEffect(() => {
    const update = () => setHref(withBasePath(resolveDossierAlternateHref(window.location.pathname, window.location.hash, alternateHref)));
    update();
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, [alternateHref]);

  // The fragment can change without an event (a client-side navigation to `#the-system`), so the
  // destination is recomputed at activation time as well. Nothing is intercepted: the browser reads the
  // refreshed `href` itself, for a plain click, a modified click (new tab, new window) and a middle
  // click (`auxclick`) alike, so all of them open the same destination.
  const refreshHref = (event: SyntheticEvent<HTMLAnchorElement>) => {
    const resolved = withBasePath(resolveDossierAlternateHref(window.location.pathname, window.location.hash, alternateHref));
    if (event.currentTarget.getAttribute('href') !== resolved) event.currentTarget.setAttribute('href', resolved);
  };

  return (
    <a
      href={href}
      onClick={refreshHref}
      onAuxClick={refreshHref}
      hrefLang={alternateLocale === 'es' ? 'es-AR' : 'en'}
      aria-label={label}
      className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-sky-plate-line px-3 font-mono text-[12px] text-white transition-colors duration-[160ms] ease-out hover:bg-[rgba(111,168,224,.12)] focus:outline-none focus-visible:[outline:3px_solid_#9CC4EC] focus-visible:[outline-offset:3px]"
    >
      {alternateLocale.toUpperCase()}
    </a>
  );
}
