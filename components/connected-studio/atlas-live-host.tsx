import type { ConnectedWordBinding, ProfileConnectedRoute } from '@/lib/connected-studio/types';
import type { Locale } from '@/lib/locales';
import { ConnectedStudioEnhancement } from './ConnectedStudioEnhancement';

type AtlasLiveHostProps = {
  route: ProfileConnectedRoute;
  locale: Locale;
  wordBindings: readonly ConnectedWordBinding[];
};

/**
 * The Studio, Founder and Contact live-host seam, and the only place the connected host attaches to an Atlas page.
 * Until PLAN-SFC-V1 Task 18 it was empty, so a policy-disabled build carried no host code; the Task 18 enablement PR
 * made the two-file change together: the wide tier in `lib/connected-studio/capability.ts` and this body, which
 * renders `ConnectedStudioEnhancement` with these props. The host gates itself: it requests no engine and draws
 * nothing unless the visitor, the device and the policy all allow it, so a compact phone, a reduced-motion or
 * Save-Data visitor and a software renderer keep the complete static page.
 *
 * It stays the single import path (scripts/sfc-contracts.test.mjs walks the module graph): the shared static
 * ground never imports the host, and the host chunk (about 13.7 KiB Brotli) reaches the three Atlas pages only here.
 * Next ships a client component's chunk with every page that can reach it, whether or not the visitor qualifies, which is
 * why a reduced-motion, Save-Data or software-renderer visitor pays the host's bytes and startup cost while staying static
 * (Task 18 receipt; since Task 25 both tiers are enabled, so this applies to those visitors only).
 */
export function AtlasLiveHost({ route, locale, wordBindings }: AtlasLiveHostProps) {
  return <ConnectedStudioEnhancement route={route} locale={locale} wordBindings={wordBindings} />;
}
