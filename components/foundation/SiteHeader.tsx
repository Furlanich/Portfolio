import Link from 'next/link';
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

function PrimaryNavigationItems({
  links,
  primaryAction,
}: PrimaryNavigationItemsProps) {
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex min-h-11 items-center rounded-[8px] px-3 transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-surface focus-visible:ring-offset-[3px] focus-visible:ring-offset-foundation-action-strong lg:px-0 lg:hover:bg-transparent"
        >
          {link.label}
        </Link>
      ))}
      <Link
        href={primaryAction.href}
        className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-surface focus-visible:ring-offset-[3px] focus-visible:ring-offset-foundation-action-strong"
      >
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
      <header className="sticky top-0 z-50 border-b border-foundation-border bg-foundation-surface">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-5 py-3 md:px-8 lg:px-12">
        <BrandSignature href={`${paths.home}#site-top`} />

        <div className="flex items-center gap-3">
          <LanguageSwitch
            alternateHref={paths.alternateHref}
            alternateLocale={paths.alternateLocale}
            label={labels.languageSwitch}
          />

          <nav
            aria-label={labels.navigation}
            className="hidden items-center gap-x-5 gap-y-2 text-sm font-semibold text-foundation-muted lg:flex"
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
    </>
  );
}
