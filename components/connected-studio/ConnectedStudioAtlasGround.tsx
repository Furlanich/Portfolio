import type { ConnectedWordBinding, ProfileConnectedRoute } from '@/lib/connected-studio/types';
import type { Locale } from '@/lib/locales';
import { AtlasLiveHost } from './atlas-live-host';
import { ConnectedStudioGroundLayer } from './ConnectedStudioGroundLayer';

/**
 * Studio, Founder and Contact never fabricate eight services: they bind a few decorative words to node ids.
 *
 * PLAN-SFC-V1 Task 16: this module and everything it imports must not reach the live host
 * (`scripts/sfc-contracts.test.mjs` walks the import graph). Next ships a client chunk with every page that can
 * reach it, rendered or not, so a policy branch around the host is not enough; the policy-disabled build has to
 * be structurally free of it. The one seam is `atlas-live-host.tsx`, which a qualified live-policy enablement
 * replaces (see that file).
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
