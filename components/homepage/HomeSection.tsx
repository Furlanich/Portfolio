import type { ReactNode } from 'react';

/**
 * SKY-CHART-V2 D-13 to D-19 shared Home section shell (Task 9 REFACTOR).
 *
 * Every restyled Home section (Problems, Services, Position fix, Proof, Process,
 * Founder, Dawn CTA) shares the same outer contract: the `<section>` keeps its
 * approved `id`/`aria-labelledby`, carries `data-readout` (read by the Task 6 App
 * Bar readout and `aria-current="location"` logic per D-22), and wraps its content
 * in the standard 1200px container with the D-10 section padding-block.
 *
 * Two tones exist:
 *  - `dark` (default): the section is transparent, sitting directly over the fixed
 *    Sky Chart environment (D-01/D-02/D-03), so text defaults to Bone/`sky.text-2`.
 *  - `dawn`: the Dawn CTA only (D-19), an opaque Bone panel with Ink/Muted text.
 */

export type HomeSectionTone = 'dark' | 'dawn';

interface HomeSectionProps {
  id: string;
  ariaLabelledBy: string;
  readout: string;
  tone?: HomeSectionTone;
  /**
   * A D-09 `label` kicker (mono, `sky.lit`, uppercase) rendered above `children`.
   * Only sections whose kicker sits alone above the full section width (Services,
   * Process) use this; sections whose kicker sits inside one grid column
   * (Problems, Proof, Founder) render their own kicker with `homeKickerClassName`.
   */
  kicker?: string;
  className?: string;
  children: ReactNode;
}

const toneClassName: Record<HomeSectionTone, string> = {
  dark: 'py-[clamp(72px,10vw,140px)] text-sky-text-2',
  dawn: 'relative bg-[linear-gradient(180deg,rgba(249,246,238,0)_0,#F9F6EE_200px)] pb-[120px] pt-[220px] text-foundation-muted',
};

export function HomeSection({ id, ariaLabelledBy, readout, tone = 'dark', kicker, className, children }: HomeSectionProps) {
  const sectionClassName = [toneClassName[tone], className].filter(Boolean).join(' ');

  return (
    <section id={id} aria-labelledby={ariaLabelledBy} data-readout={readout} className={sectionClassName}>
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        {kicker ? <p className={homeKickerClassName}>{kicker}</p> : null}
        {children}
      </div>
    </section>
  );
}

/** D-09 `label` kicker: mono, 0.08em tracking, uppercase, `sky.lit`. */
export const homeKickerClassName = 'font-mono text-label uppercase text-sky-lit';

/** D-09 `display-2` section heading, shared max width and balanced wrapping. Add a color class per tone. */
export const homeHeadingClassName = 'mt-3.5 mb-[18px] max-w-[18ch] text-display-2 [text-wrap:balance]';

/** D-09 `body-lg` introduction copy, shared max width. Add a color class per tone. */
export const homeIntroClassName = 'mt-4 max-w-[60ch] text-body-lg';

/**
 * D-21 dark-context focus ring (`outline: 3px solid #9CC4EC (sky.glow); outline-offset: 3px`)
 * for actions rendered directly on a `tone="dark"` HomeSection (not inside an AtlasPlate or
 * PlottingSheet, which are never interactive, and not inside the Position-fix toggle, which
 * already carries its own Ink ring since it sits on a PlottingSheet). The higher specificity
 * of these utility classes (one class + `:focus-visible`) wins over app/globals.css's bare
 * `:focus-visible` rule (0,0,1,0), so this only overrides the ring where it is applied.
 */
const homeDarkFocusRingClassName =
  'focus-visible:[box-shadow:none] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-sky-glow';

/**
 * D-20 primary action. Identical fill/hover in every Home context (dark sections
 * and the Dawn CTA); only the focus ring differs, since the Dawn CTA sits on an
 * opaque Bone panel where the sitewide Ink `:focus-visible` default in
 * app/globals.css already satisfies D-21. `primaryActionClassName` is the Dawn CTA
 * variant (no override); `primaryActionOnDarkClassName` adds the sky.glow ring for
 * every other Home section.
 */
export const primaryActionClassName =
  'inline-flex min-h-12 w-auto items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(249,246,238,.18)] transition-colors duration-[160ms] ease-out hover:bg-[#0A55A3] max-[479px]:w-full';

export const primaryActionOnDarkClassName = `${primaryActionClassName} ${homeDarkFocusRingClassName}`;

/**
 * D-20 "ghost on dark" action (Bone text and border) with its D-21 sky.glow focus ring
 * already combined in, for sections sitting on the transparent Sky Chart environment.
 */
export const ghostActionOnDarkClassName = `inline-flex min-h-12 w-auto items-center justify-center rounded-[10px] border border-[rgba(156,196,236,.5)] px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-[rgba(111,168,224,.12)] max-[479px]:w-full ${homeDarkFocusRingClassName}`;

/**
 * D-19 "ghost on light" action: the Dawn CTA's secondary action (Azure border/text, Tint
 * hover). No focus override: the sitewide Ink ring already satisfies D-21 here.
 */
export const ghostActionLightClassName =
  'inline-flex min-h-12 w-auto items-center justify-center rounded-[10px] border border-foundation-action bg-transparent px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint max-[479px]:w-full';
