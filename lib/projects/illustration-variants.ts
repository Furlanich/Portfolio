/**
 * PLAN-SPF-V1 Task 8: the responsive candidates of a project's conceptual illustration. The original
 * 1599x900 WebP stays the largest candidate and the `src` fallback; the three resolution-only
 * derivatives (`scripts/capture-connected-studio-posters.mjs --derivatives`) sit beside it as
 * `<name>-640.webp`, `<name>-960.webp` and `<name>-1280.webp`, each the whole frame at the same ratio.
 * The static export serves files as they are, so the page lists the candidates itself.
 */
export type IllustrationVariant = { src: string; width: number };

export const ILLUSTRATION_ORIGINAL_WIDTH = 1599;
export const ILLUSTRATION_DERIVATIVE_WIDTHS = [640, 960, 1280] as const;

/** The candidates in ascending width order, ending with the original. `original` is a root-relative `.webp` path. */
export function getIllustrationVariants(original: string): IllustrationVariant[] {
  const match = /^(.*)\.webp$/.exec(original);
  if (!match) throw new RangeError(`An illustration must be a .webp path, received "${original}"`);
  return [
    ...ILLUSTRATION_DERIVATIVE_WIDTHS.map((width) => ({ src: `${match[1]}-${width}.webp`, width })),
    { src: original, width: ILLUSTRATION_ORIGINAL_WIDTH },
  ];
}

/** The `srcset` attribute value; `toUrl` applies the deployment base path to each root-relative path. */
export function buildIllustrationSrcSet(original: string, toUrl: (path: string) => string): string {
  return getIllustrationVariants(original)
    .map((variant) => `${toUrl(variant.src)} ${variant.width}w`)
    .join(', ');
}
