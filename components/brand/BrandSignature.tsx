import Image from 'next/image';
import Link from 'next/link';
import { withBasePath } from '@/lib/paths';

interface BrandSignatureProps {
  href: string;
}

// Protected mark plus the live text wordmark, proportioned from the approved horizontal
// lockup: a 40px mark box beside the 16px wordmark. The 2.6px gap plus the mark's
// transparent right margin gives the 1.25x silhouette gap DESIGN-VISUAL requires.
export function BrandSignature({ href }: BrandSignatureProps) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 shrink-0 items-center gap-[2.6px] rounded-[8px] text-base font-bold tracking-[0.08em] text-foundation-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-surface focus-visible:ring-offset-[3px] focus-visible:ring-offset-foundation-action-strong"
    >
      <Image
        src={withBasePath('/brand/furlanich-mark-azure-on-bone.svg')}
        alt=""
        width={40}
        height={40}
        loading="eager"
        className="h-10 w-10 shrink-0"
      />
      <span>FURLANICH</span>
    </Link>
  );
}
