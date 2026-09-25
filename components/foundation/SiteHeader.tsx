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
          The `.94` no-backdrop-filter fallback fill from D-22/D-07 is not reproduced here:
          it would need a new rule in app/globals.css, which Task 3 owns and locks (L-02).
          Recorded as a visual-only exception; browsers without backdrop-filter support see
          the `.82` fill without blur instead of `.94`.
        */}
        <div
          data-app-bar-surface
          className="relative mx-auto flex w-full max-w-[1200px] items-center gap-4 rounded-[14px] border border-sky-plate-line bg-[rgba(10,30,51,.82)] py-2 pl-4 pr-2 backdrop-blur-[16px] backdrop-saturate-[125%] transition-[background-color,border-color] duration-[var(--dur-3)] ease-[var(--ease-out)] data-[docked=false]:border-transparent data-[docked=false]:bg-transparent data-[docked=false]:backdrop-blur-none data-[docked=false]:backdrop-saturate-100"
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
