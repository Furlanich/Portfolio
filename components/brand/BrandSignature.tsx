import Link from 'next/link';

interface BrandSignatureProps {
  href: string;
  variant?: 'on-light' | 'on-dark';
}

// Protected mark plus the live text wordmark, proportioned from the approved horizontal
// lockup: a 40px mark box beside the 16px wordmark. The 2.6px gap plus the mark's
// transparent right margin gives the 1.25x silhouette gap DESIGN-VISUAL requires.
// The mark is inline and decorative because the static-export gate treats every page
// image element as content media; its geometry matches public/brand/furlanich-mark-azure-on-bone.svg.
//
// SKY-CHART-V2 D-22 adds the `on-dark` variant for the App Bar: a 32px Azure tile (radius
// 7px) holding the Bone protected mark at 22px beside a Bone 16px/700/0.08em wordmark. The
// protected mark's geometry (the three canonical chevron centerlines) is unchanged between
// variants; only the layer colors invert. `data-app-bar-brand` on the on-dark link lets
// AppBarBehavior find the App Bar's own home link (never the footer's, which stays
// `on-light`) to detect the Home route without any window/document use in this server
// component tree.
export function BrandSignature({ href, variant = 'on-light' }: BrandSignatureProps) {
  if (variant === 'on-dark') {
    return (
      <Link
        href={href}
        data-app-bar-brand
        className="inline-flex min-h-11 shrink-0 items-center gap-[10px] rounded-[8px] text-base font-bold tracking-[0.08em] text-white focus:outline-none focus-visible:[outline:3px_solid_#9CC4EC] focus-visible:[outline-offset:3px]"
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] bg-foundation-action"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 256 256"
            width={22}
            height={22}
            className="h-[22px] w-[22px]"
          >
            <g fill="none" stroke="#F9F6EE" strokeWidth={30} strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit={4}>
              <polyline points="30,102 128,28 226,102" />
              <polyline points="30,166 128,92 226,166" />
              <polyline points="30,230 128,156 226,230" />
            </g>
          </svg>
        </span>
        <span>FURLANICH</span>
      </Link>
    );
  }

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
