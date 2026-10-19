import type { ConnectedWordBinding, ProfileConnectedRoute } from '@/lib/connected-studio/types';
import type { Locale } from '@/lib/locales';
import { AtlasLiveHost } from './atlas-live-host';
import { ConnectedStudioGroundLayer } from './ConnectedStudioGroundLayer';

/**
 * Studio, Founder and Contact never fabricate eight services: they bind a few decorative words to node ids.
 *
 * PLAN-SFC-V1 Tasks 16 and 18: the live host reaches these pages only through `atlas-live-host.tsx`, and the shared
 * ground layer this module renders never imports it (`scripts/sfc-contracts.test.mjs` walks the import graph). Next
 * ships a client chunk with every page that can reach it, rendered or not, so the seam is the single place that
 * decides whether an Atlas page carries the host (see that file).
 */
export type ConnectedStudioAtlasGroundProps = {
  locale: Locale;
  route: ProfileConnectedRoute;
  wordBindings: readonly ConnectedWordBinding[];
};

export function ConnectedStudioAtlasGround({ route, locale, wordBindings }: ConnectedStudioAtlasGroundProps) {
  return (
    <ConnectedStudioGroundLayer route={route} locale={locale} mountAttribute={{ 'data-word-bindings': JSON.stringify(wordBindings) }}>
      <AtlasLiveHost route={route} locale={locale} wordBindings={wordBindings} />
    </ConnectedStudioGroundLayer>
  );
}
