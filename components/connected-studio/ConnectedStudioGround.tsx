import type { CapabilityWords, LegacyConnectedRoute } from '@/lib/connected-studio/types';
import type { Locale } from '@/lib/locales';
import { ConnectedStudioEnhancement } from './ConnectedStudioEnhancement';
import { ConnectedStudioGroundLayer } from './ConnectedStudioGroundLayer';

/**
 * Services and Projects label their nodes with the localized eight-word capability vocabulary, and they
 * always render the live leaf, which gates itself. Studio, Founder and Contact use
 * `ConnectedStudioAtlasGround`, which cannot reach the leaf (PLAN-SFC-V1 Task 16).
 */
export type ConnectedStudioGroundProps = {
  locale: Locale;
  route: LegacyConnectedRoute;
  capabilityWords: CapabilityWords;
};

export function ConnectedStudioGround({ route, locale, capabilityWords }: ConnectedStudioGroundProps) {
  return (
    <ConnectedStudioGroundLayer route={route} locale={locale} mountAttribute={{ 'data-capability-words': JSON.stringify(capabilityWords) }}>
      <ConnectedStudioEnhancement route={route} locale={locale} capabilityWords={capabilityWords} />
    </ConnectedStudioGroundLayer>
  );
}
