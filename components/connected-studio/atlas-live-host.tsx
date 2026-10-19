import type { ConnectedWordBinding, ProfileConnectedRoute } from '@/lib/connected-studio/types';
import type { Locale } from '@/lib/locales';

type AtlasLiveHostProps = {
  route: ProfileConnectedRoute;
  locale: Locale;
  wordBindings: readonly ConnectedWordBinding[];
};

/**
 * The Studio, Founder and Contact live-host seam. Every merged build ships it empty: it imports nothing, so
 * a policy-disabled page carries no host code, no session keys and no engine reference (PLAN-SFC-V1 Task 16;
 * the production check "a policy-disabled Atlas page references no connected host code" holds this).
 *
 * Enabling a qualified tier is a bounded change of two files, made together in the Task 18 enablement PR:
 * `lib/connected-studio/capability.ts` (the per-tier policy) and this module, whose body then imports
 * `ConnectedStudioEnhancement` and renders it with these props. `tests/fixtures/sfc/live-policy.patch` does
 * exactly that for the controlled runtime candidate. The empty seam cannot be enabled by a flag alone, which is
 * intended: a flag cannot make a bundler drop an import, and shipping the host to disabled pages cost
 * 27 to 144 ms of startup CPU in the Task 14 measurement.
 */
export function AtlasLiveHost(props: AtlasLiveHostProps): null {
  void props;
  return null;
}
