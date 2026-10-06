'use client';

import Link from 'next/link';
import { useEffect, useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/locales';
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
 */
export function LanguageSwitch({
  alternateHref,
  alternateLocale,
  label,
}: LanguageSwitchProps) {
  const router = useRouter();
  const [href, setHref] = useState(alternateHref);

  useEffect(() => {
    const update = () => setHref(resolveDossierAlternateHref(window.location.pathname, window.location.hash, alternateHref));
    update();
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, [alternateHref]);

  // The fragment can change without an event (a client-side navigation to `#the-system`), so the
  // destination is recomputed at activation time as well.
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const resolved = resolveDossierAlternateHref(window.location.pathname, window.location.hash, alternateHref);
    if (resolved === alternateHref) return;
    event.preventDefault();
    router.push(resolved);
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      hrefLang={alternateLocale === 'es' ? 'es-AR' : 'en'}
      aria-label={label}
      className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-sky-plate-line px-3 font-mono text-[12px] text-white transition-colors duration-[160ms] ease-out hover:bg-[rgba(111,168,224,.12)] focus:outline-none focus-visible:[outline:3px_solid_#9CC4EC] focus-visible:[outline-offset:3px]"
    >
      {alternateLocale.toUpperCase()}
    </Link>
  );
}
