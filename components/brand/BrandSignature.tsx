import Link from 'next/link';

interface BrandSignatureProps {
  href: string;
}

// Protected mark plus the live text wordmark, proportioned from the approved horizontal
// lockup: a 40px mark box beside the 16px wordmark. The 2.6px gap plus the mark's
// transparent right margin gives the 1.25x silhouette gap DESIGN-VISUAL requires.
// The mark is inline and decorative because the static-export gate treats every page
// image element as content media; its geometry matches public/brand/furlanich-mark-azure-on-bone.svg.
export function BrandSignature({ href }: BrandSignatureProps) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 shrink-0 items-center gap-[2.6px] rounded-[8px] text-base font-bold tracking-[0.08em] text-foundation-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-surface focus-visible:ring-offset-[3px] focus-visible:ring-offset-foundation-action-strong"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 256 256"
        width={40}
        height={40}
        className="h-10 w-10 shrink-0"
      >
        <g fill="none" stroke="#004589" strokeWidth={30} strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit={4}>
          <polyline points="30,102 128,28 226,102" />
          <polyline points="30,166 128,92 226,166" />
          <polyline points="30,230 128,156 226,230" />
        </g>
      </svg>
      <span>FURLANICH</span>
    </Link>
  );
}
