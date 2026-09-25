/**
 * SKY-CHART-V2 D-22 App Bar pathname normalization.
 *
 * Compares a browser-resolved pathname (e.g. `window.location.pathname`, or an anchor's
 * `.pathname` DOM property, both of which already carry any configured Next.js `basePath`)
 * against another such pathname, ignoring a trailing slash and, defensively, a configured
 * base path prefix if one is still present. Pure and DOM-free so it is unit-testable with
 * `node --test` (AppBarBehavior.tsx cannot be imported directly there: JSX is not
 * type-strippable by Node's built-in TypeScript support).
 */
export function normalizeAppBarPath(pathname: string, basePath = ''): string {
  let value = pathname || '/';

  const trimmedBasePath = basePath.replace(/\/+$/, '');
  if (trimmedBasePath && value.startsWith(trimmedBasePath)) {
    value = value.slice(trimmedBasePath.length) || '/';
  }

  if (!value.startsWith('/')) value = `/${value}`;

  return value.length > 1 ? value.replace(/\/+$/, '') || '/' : '/';
}
