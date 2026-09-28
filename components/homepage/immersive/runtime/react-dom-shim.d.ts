// `react-dom` (18.2.0, pinned by package.json) ships no bundled type declarations, and
// `@types/react-dom` is not installed -- adding it would be a new dependency (plan T-01,
// lock L-01). This ambient shim types only the export the Sky Chart runtime actually uses:
// `createPortal`, for T-04's canvas portal to `document.body`.
//
// N4 (PR #83 review): this `declare module 'react-dom'` is project-wide, not scoped to this
// file or to `runtime/` -- TypeScript's `declare module` for an npm package always augments
// the module globally for the whole program, regardless of which file declares it. It happens
// to be the only `react-dom` import in this codebase today, so nothing else is masked in
// practice, but that is a fact about the current codebase, not something this file's location
// enforces. It must be deleted once `@types/react-dom` is approved -- adding that package is an
// L-01 owner decision, not something this task can make unilaterally.
declare module 'react-dom' {
  import type { ReactNode, ReactPortal } from 'react';

  export function createPortal(children: ReactNode, container: Element | DocumentFragment, key?: string | null): ReactPortal;
}
