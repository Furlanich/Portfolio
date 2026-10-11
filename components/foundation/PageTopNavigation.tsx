'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getFoundationPath } from '../../lib/site-routes';

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const pageTopPaths = new Set((['es', 'en'] as const).flatMap((locale) =>
  (['services', 'projects'] as const).map((route) => `${basePath}${getFoundationPath(route, locale)}`),
));

/** Finish explicit page-top link navigation after Next's layout scroll and focus have run. */
export function PageTopNavigation() {
  const pathname = usePathname();
  const pendingPath = useRef<string | null>(null);
  const frame = useRef(0);

  const cancel = useCallback(() => {
    pendingPath.current = null;
    if (frame.current) window.cancelAnimationFrame(frame.current);
    frame.current = 0;
  }, []);

  const finish = useCallback(() => {
    if (!pendingPath.current || window.location.pathname !== pendingPath.current) return;
    if (frame.current) window.cancelAnimationFrame(frame.current);
    frame.current = window.requestAnimationFrame(() => {
      frame.current = 0;
      if (window.location.pathname === pendingPath.current && window.location.hash === '#site-top') {
        // Cancel any smooth scroll left over from revealing a link on the previous page.
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        pendingPath.current = null;
      }
    });
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a') : null;
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      cancel();
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || url.hash !== '#site-top' || !pageTopPaths.has(url.pathname)) return;
      pendingPath.current = url.pathname;
      // Same-page links do not change usePathname, so finish them from the click's next frame.
      finish();
    };
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', cancel);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', cancel);
      cancel();
    };
  }, [cancel, finish]);

  useEffect(finish, [pathname, finish]);
  return null;
}
