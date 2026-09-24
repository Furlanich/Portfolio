// `react-dom` (18.2.0, pinned by package.json) ships no bundled type declarations, and
// `@types/react-dom` is not installed -- adding it would be a new dependency (plan T-01,
// lock L-01). This ambient shim types only the export the Sky Chart runtime actually uses:
// `createPortal`, for T-04's canvas portal to `document.body`.
declare module 'react-dom' {
  import type { ReactNode, ReactPortal } from 'react';

  export function createPortal(children: ReactNode, container: Element | DocumentFragment, key?: string | null): ReactPortal;
}
