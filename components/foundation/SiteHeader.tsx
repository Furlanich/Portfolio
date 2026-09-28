import Link from 'next/link';
import { AppBarBehavior } from '@/components/foundation/AppBarBehavior';
import { BrandSignature } from '@/components/brand/BrandSignature';
import type { FoundationNavigationPaths } from '@/lib/foundation-navigation';
import type { Locale } from '@/lib/locales';
import { LanguageSwitch } from '@/components/foundation/LanguageSwitch';
import { NavigationDisclosure } from '@/components/foundation/NavigationDisclosure';
import type { SiteHeaderLabels } from '@/components/foundation/content-types';

interface SiteHeaderProps {
  locale: Locale;
  paths: FoundationNavigationPaths;
  labels: SiteHeaderLabels;
}

type SiteNavigationLink = {
  href: string;
  label: string;
};

interface PrimaryNavigationItemsProps {
  links: SiteNavigationLink[];
  primaryAction: SiteNavigationLink;
}

// SKY-CHART-V2 D-22. `aria-[current]` covers both `aria-current="page"` (route match) and
// `aria-current="location"` (the Process link while its Home section is in view); both are
// applied by AppBarBehavior, never rendered here, so this stays a plain server component.
const NAV_LINK_CLASSES =
  "relative inline-flex min-h-11 items-center rounded-[8px] px-3 text-sm font-semibold text-sky-text-2 transition-colors duration-[160ms] ease-out hover:text-white focus:outline-none focus-visible:[outline:3px_solid_#9CC4EC] focus-visible:[outline-offset:3px] aria-[current]:text-white aria-[current]:after:absolute aria-[current]:after:bottom-1 aria-[current]:after:left-1/2 aria-[current]:after:h-[7px] aria-[current]:after:w-[7px] aria-[current]:after:-translate-x-1/2 aria-[current]:after:content-[''] aria-[current]:after:bg-sky-glow aria-[current]:after:[clip-path:polygon(50%_0,62%_38%,100%_50%,62%_62%,50%_100%,38%_62%,0_50%,38%_38%)]";

// D-20 primary action: 48px min height, Azure fill, Bone text, inset highlight, `#0A55A3`
// hover. `w-full` in the compact disclosure panel, `lg:w-auto` inline in the desktop nav.
const CTA_CLASSES =
  'inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(249,246,238,.18)] transition-colors duration-[160ms] ease-out hover:bg-[#0A55A3] focus:outline-none focus-visible:[outline:3px_solid_#9CC4EC] focus-visible:[outline-offset:3px] lg:w-auto';

function PrimaryNavigationItems({
  links,
  primaryAction,
}: PrimaryNavigationItemsProps) {
  return (
    <>
      {links.map((link) => (
        <Link key={link.href} href={link.href} data-app-bar-nav-link className={NAV_LINK_CLASSES}>
          {link.label}
        </Link>
      ))}
      <Link href={primaryAction.href} className={CTA_CLASSES}>
        {primaryAction.label}
      </Link>
    </>
  );
}

export function SiteHeader({ locale, paths, labels }: SiteHeaderProps) {
  const navigationLinks = [
    { href: paths.services, label: labels.services },
    { href: paths.projects, label: labels.projects },
    { href: paths.process, label: labels.process },
    { href: paths.studio, label: labels.studio },
  ];

  return (
    <>
      <div id="site-top" aria-hidden="true" />
      <header data-app-bar className="sticky top-0 z-50 px-3 py-[10px]">
        {/*
          SKY-CHART-V2 D-22 structure: `header[data-app-bar]` is the full-width sticky
          positioner (outer 10px/12px padding); `[data-app-bar-surface]` is the floating
          atlas-plate "chart header" itself (max 1200px, 16px gap, 14px radius, 1px border).
          The docked fill/border below is the default and the only state reachable without
          JavaScript (D-22); AppBarBehavior only ever adds `data-docked="false"` on Home.
          The D-22/D-07 `.94` no-backdrop-filter fallback fill uses Tailwind's arbitrary
          `supports-[...]` variant rather than a new app/globals.css rule (Task 3 owns and
          locks that file, L-02); the Home-top transparent override is stacked on top of it
          so `data-docked="false"` still wins in browsers without backdrop-filter support.

          D-07 also fallbacks for `prefers-reduced-transparency: reduce` (opaque #0D243C, no
          blur -- the plate material's own reduced-transparency value, app/globals.css) and
          `forced-colors: active` (a CanvasText border, no custom background -- the plate
          material's own forced-colors value, components/surfaces/surfaces.module.css).
          Neither file's selectors reach this element (both are Task 3's; app/globals.css is
          additionally locked, L-02), so both fallbacks are repeated here as arbitrary
          variants, `!` (important) and NOT scoped to `data-[docked=...]`, so they win
          unconditionally -- including over the Home-top transparent override above. Decision:
          reduced transparency exists to keep translucent, blurred surfaces from hurting
          legibility, and a *fully* transparent bar lets more of the environment bleed through
          unfiltered than the docked blur does, so it is not exempted; forced-colors users
          likewise always get the CanvasText boundary and no custom background, at every
          scroll position.
        */}
        <div
          data-app-bar-surface
          className="relative mx-auto flex w-full max-w-[1200px] items-center gap-4 rounded-[14px] border border-sky-plate-line bg-[rgba(10,30,51,.82)] py-2 pl-4 pr-2 backdrop-blur-[16px] backdrop-saturate-[125%] transition-[background-color,border-color] duration-[var(--dur-3)] ease-[var(--ease-out)] supports-[not_(backdrop-filter:blur(1px))]:bg-[rgba(10,30,51,.94)] data-[docked=false]:border-transparent data-[docked=false]:bg-transparent data-[docked=false]:backdrop-blur-none data-[docked=false]:backdrop-saturate-100 data-[docked=false]:supports-[not_(backdrop-filter:blur(1px))]:bg-transparent [@media(prefers-reduced-transparency:reduce)]:!bg-[#0D243C] [@media(prefers-reduced-transparency:reduce)]:![backdrop-filter:none] forced-colors:!border-[CanvasText] forced-colors:!bg-transparent forced-colors:![backdrop-filter:none]"
        >
          <BrandSignature href={`${paths.home}#site-top`} variant="on-dark" />

          {/* D-22 readout: Home only, >=1024px, aria-hidden. AppBarBehavior fills the text
              from the last `[data-readout]` section past the 40% line and only reveals it
              (`data-home="true"`) once it has confirmed we are on Home. */}
          <span
            data-app-bar-readout
            aria-hidden="true"
            className="hidden min-w-[18ch] shrink-0 border-l border-sky-plate-line pl-[14px] font-mono text-[12px] text-sky-lit lg:data-[home=true]:block"
          />

          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitch
              alternateHref={paths.alternateHref}
              alternateLocale={paths.alternateLocale}
              label={labels.languageSwitch}
            />

            <nav
              aria-label={labels.navigation}
              className="hidden items-center gap-1 text-sm font-semibold text-sky-text-2 lg:flex"
            >
              <PrimaryNavigationItems
                links={navigationLinks}
                primaryAction={{ href: paths.contact, label: labels.primaryAction }}
              />
            </nav>

            <NavigationDisclosure menuLabel={labels.menu} navigationLabel={labels.navigation}>
              <PrimaryNavigationItems
                links={navigationLinks}
                primaryAction={{ href: paths.contact, label: labels.primaryAction }}
              />
            </NavigationDisclosure>
          </div>

          <span className="sr-only">{locale === 'es' ? 'Español' : 'English'}</span>
        </div>
      </header>
      <AppBarBehavior />
    </>
  );
}
