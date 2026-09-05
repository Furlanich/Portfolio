import Link from 'next/link';
import type { FoundationNavigationPaths } from '@/lib/foundation-navigation';
import type { Locale } from '@/lib/locales';
import { LanguageSwitch } from '@/components/foundation/LanguageSwitch';

interface SiteHeaderProps {
  locale: Locale;
  paths: FoundationNavigationPaths;
  labels: {
    navigation: string;
    menu: string;
    services: string;
    process: string;
    founder: string;
    contact: string;
    primaryAction: string;
    languageSwitch: string;
  };
}

export function SiteHeader({ locale, paths, labels }: SiteHeaderProps) {
  const navigationLinks = [
    { href: paths.services, label: labels.services },
    { href: paths.process, label: labels.process },
    { href: paths.founder, label: labels.founder },
    { href: paths.contact, label: labels.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-foundation-border bg-foundation-surface">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-5 py-3 md:px-8 lg:px-12">
        <Link
          href={paths.home}
          className="text-base font-bold tracking-[0.08em] text-foundation-ink"
        >
          FURLANICH
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitch
            alternateHref={paths.alternateHref}
            alternateLocale={paths.alternateLocale}
            label={labels.languageSwitch}
          />

          <details className="group relative lg:static">
            <summary
              aria-label={labels.menu}
              aria-controls="primary-navigation-panel"
              className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-[10px] border border-foundation-border text-foundation-ink transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-surface focus-visible:ring-offset-[3px] focus-visible:ring-offset-foundation-action-strong lg:hidden [&::-webkit-details-marker]:hidden"
            >
              <span className="sr-only">{labels.menu}</span>
              <span aria-hidden="true" className="flex w-5 flex-col gap-1">
                <span className="h-0.5 w-full bg-current" />
                <span className="h-0.5 w-full bg-current" />
                <span className="h-0.5 w-full bg-current" />
              </span>
            </summary>

            <nav
              id="primary-navigation-panel"
              aria-label={labels.navigation}
              className="absolute right-0 top-[calc(100%+13px)] hidden w-[min(calc(100vw-40px),24rem)] flex-col gap-1 rounded-[12px] border border-foundation-border bg-foundation-surface p-2 text-sm font-semibold text-foundation-muted shadow-[0_12px_32px_rgba(11,31,51,0.12)] group-open:flex lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-x-5 lg:gap-y-2 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
            >
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-[8px] px-3 transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-surface focus-visible:ring-offset-[3px] focus-visible:ring-offset-foundation-action-strong lg:px-0 lg:hover:bg-transparent"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={paths.contact}
                className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-surface focus-visible:ring-offset-[3px] focus-visible:ring-offset-foundation-action-strong"
              >
                {labels.primaryAction}
              </Link>
            </nav>
          </details>
        </div>

        <span className="sr-only">{locale === 'es' ? 'Español' : 'English'}</span>
      </div>
    </header>
  );
}
