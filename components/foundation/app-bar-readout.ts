/**
 * SKY-CHART-V2 D-22 App Bar readout formatting.
 *
 * D-22: the readout text is `{NN} · {name}`, taken from the `data-readout` of the last
 * Home section whose top has crossed the 40% line. `[data-readout]` sections only carry the
 * plain name -- the hero and all four chapters render the same "Home"/"Inicio" value (D-12) --
 * so the two-digit index cannot be read off the DOM. It is the position of each distinct
 * value's first appearance in document order, reproducing the reference prototype's fixed
 * `secs` array (Home 00, Problems 01, Services 02, Position fix 03, ...) without hardcoding
 * section ids or labels.
 *
 * Pure and DOM-free so it is unit-testable with `node --test` (AppBarBehavior.tsx cannot be
 * imported directly there: JSX is not type-strippable by Node's built-in TypeScript support).
 */

/** Maps each distinct value in `values` to the index of its first appearance. */
export function buildReadoutIndex(values: readonly string[]): Map<string, number> {
  const index = new Map<string, number>();
  for (const value of values) {
    if (!index.has(value)) index.set(value, index.size);
  }
  return index;
}

/** Formats `value` as `{NN} · {value}`, `index` from {@link buildReadoutIndex}. */
export function formatReadout(value: string, index: ReadonlyMap<string, number>): string {
  const position = index.get(value) ?? 0;
  return `${String(position).padStart(2, '0')} · ${value}`;
}
