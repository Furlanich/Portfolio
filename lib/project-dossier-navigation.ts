// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { foundationRoutes, isProjectDossierSlug } from './site-routes.ts';

// PLAN-SPF-V1 Task 3. The Projects index holds both dossiers, so a locale switch on that page may
// keep a recognized dossier fragment. Every other case returns the existing equivalent-route href
// unchanged: ordinary pages, an unknown or malformed fragment, and any alternate that is not the
// opposite Projects index. The function is pure and total; `LanguageSwitch` supplies the browser's
// pathname and hash, and the native link it renders already points at the equivalent index.

const PROJECTS_INDEX_PATHS: readonly string[] = [foundationRoutes.projects.es, foundationRoutes.projects.en];

// `process.env.NEXT_PUBLIC_BASE_PATH` is written out in full so Next inlines it in the client bundle.
function readBasePath(): string {
  const configured = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').trim().replace(/^\/+|\/+$/g, '');
  return configured ? `/${configured}` : '';
}

function stripBasePath(path: string): string | undefined {
  const basePath = readBasePath();
  if (!basePath) return path;
  if (path === basePath) return '/';
  return path.startsWith(`${basePath}/`) ? path.slice(basePath.length) : undefined;
}

function withTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

/**
 * `currentPath` is the browser pathname (it carries the deployment base path), `hash` is
 * the URL fragment including its `#`, and `alternateHref` is the router-level href of the equivalent route. The
 * result is router-level too: it never carries the base path. The caller owns applying it, exactly once, when it
 * renders a native link (`LanguageSwitch` does so with `withBasePath`).
 */
export function resolveDossierAlternateHref(currentPath: string, hash: string, alternateHref: string): string {
  const appPath = stripBasePath(currentPath);
  if (appPath === undefined) return alternateHref;

  const currentIndex = withTrailingSlash(appPath);
  if (!PROJECTS_INDEX_PATHS.includes(currentIndex)) return alternateHref;

  const alternateIndex = currentIndex === foundationRoutes.projects.es ? foundationRoutes.projects.en : foundationRoutes.projects.es;
  if (alternateHref !== alternateIndex) return alternateHref;

  if (!hash.startsWith('#')) return alternateHref;
  const slug = hash.slice(1);
  return isProjectDossierSlug(slug) ? `${alternateIndex}#${slug}` : alternateHref;
}
