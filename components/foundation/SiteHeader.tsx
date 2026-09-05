import Link from 'next/link';
import type { FoundationNavigationPaths } from '@/lib/foundation-navigation';
import type { Locale } from '@/lib/locales';
import { LanguageSwitch } from '@/components/foundation/LanguageSwitch';

interface SiteHeaderProps {
  locale: Locale;
  paths: FoundationNavigationPaths;
  labels: {
    navigation: string;
    services: string;
    process: string;
    founder: string;
    contact: string;
    primaryAction: string;
    languageSwitch: string;
  };
}

export function SiteHeader({ locale, paths, labels }: SiteHeaderProps) {
  return (
    <header className="border-b border-foundation-border bg-foundation-surface">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-5 py-4 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={paths.home}
            className="text-base font-bold tracking-[0.08em] text-foundation-ink"
          >
            FURLANICH
          </Link>
          <LanguageSwitch
            alternateHref={paths.alternateHref}
            alternateLocale={paths.alternateLocale}
            label={labels.languageSwitch}
          />
        </div>

        <nav
          aria-label={labels.navigation}
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-foundation-muted"
        >
          <Link
            href={paths.services}
            className="inline-flex min-h-11 items-center transition-colors duration-[160ms] ease-out hover:text-foundation-action"
          >
            {labels.services}
          </Link>
          <Link
            href={paths.process}
            className="inline-flex min-h-11 items-center transition-colors duration-[160ms] ease-out hover:text-foundation-action"
          >
            {labels.process}
          </Link>
          <Link
            href={paths.founder}
            className="inline-flex min-h-11 items-center transition-colors duration-[160ms] ease-out hover:text-foundation-action"
          >
            {labels.founder}
          </Link>
          <Link
            href={paths.contact}
            className="inline-flex min-h-11 items-center transition-colors duration-[160ms] ease-out hover:text-foundation-action"
          >
            {labels.contact}
          </Link>
          <Link
            href={paths.contact}
            className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong"
          >
            {labels.primaryAction}
          </Link>
        </nav>

        <span className="sr-only">{locale === 'es' ? 'Español' : 'English'}</span>
      </div>
    </header>
  );
}
