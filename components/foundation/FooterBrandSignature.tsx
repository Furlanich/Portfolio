import Link from 'next/link';
import styles from './site-footer.module.css';

/**
 * The protected mark's three canonical chevron centerlines, exactly as in
 * public/brand/furlanich-mark-bone-on-azure.svg: stroke 30, butt caps, miter joins, miter limit 4, in a
 * 256 x 256 box. The foreground signature and the static watermark both draw this one definition, with
 * no transform attribute, so the only difference between them is the CSS box they scale into
 * (PLAN-SPF-V1 Task 4: "no crop, split, rotation, morph, recolor or protected-asset edit").
 */
export function FooterMarkStrokes() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth={30} strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit={4}>
      <polyline points="30,102 128,28 226,102" />
      <polyline points="30,166 128,92 226,166" />
      <polyline points="30,230 128,156 226,230" />
    </g>
  );
}

/**
 * The Footer's own signature: the whole Bone mark beside the FURLANICH wordmark, as one link home.
 * It is deliberately not `BrandSignature`. That component's `on-dark` variant carries
 * `data-app-bar-brand`, the marker Home's App Bar uses to detect its own home link, and the Footer
 * must never join that detection.
 */
export function FooterBrandSignature({ href }: { href: string }) {
  return (
    <Link href={href} className={styles.signature}>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 256 256" className={styles.signatureMark}>
        <FooterMarkStrokes />
      </svg>
      <span className={styles.wordmark}>FURLANICH</span>
    </Link>
  );
}
