import Link from 'next/link';
import { BrandSignature } from '@/components/brand/BrandSignature';
import type { FoundationNavigationPaths } from '@/lib/foundation-navigation';
import { LanguageSwitch } from '@/components/foundation/LanguageSwitch';
import type {
  ContactAction,
  ExternalLink,
  SiteFooterLabels,
} from '@/components/foundation/content-types';

interface SiteFooterProps {
  contactActions: ContactAction[];
  founderLinks: ExternalLink[];
  labels: SiteFooterLabels;
  paths: FoundationNavigationPaths;
}

export function SiteFooter({ contactActions, founderLinks, labels, paths }: SiteFooterProps) {
  const copyrightYear = new Date().getFullYear();

  return (
    <footer className="border-t border-foundation-border bg-foundation-surface">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-12 md:grid-cols-3 md:px-8 lg:px-12">
        <div>
          <BrandSignature href={paths.home} />
          <p className="mt-4 text-sm leading-6 text-foundation-muted">{labels.location}</p>
        </div>

        <nav aria-label={labels.navigation}>
          <h2 className="text-sm font-semibold text-foundation-ink">{labels.navigation}</h2>
          <ul className="mt-3 grid gap-2 text-sm font-semibold text-foundation-muted">
            <li><Link href={paths.services} className="inline-flex min-h-11 items-center hover:text-foundation-action">{labels.services}</Link></li>
            <li><Link href={paths.projects} className="inline-flex min-h-11 items-center hover:text-foundation-action">{labels.projects}</Link></li>
            <li><Link href={paths.process} className="inline-flex min-h-11 items-center hover:text-foundation-action">{labels.process}</Link></li>
            <li><Link href={paths.studio} className="inline-flex min-h-11 items-center hover:text-foundation-action">{labels.studio}</Link></li>
            <li><Link href={paths.contact} className="inline-flex min-h-11 items-center hover:text-foundation-action">{labels.contact}</Link></li>
            <li><Link href={paths.privacy} className="inline-flex min-h-11 items-center hover:text-foundation-action">{labels.privacy}</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-foundation-ink">{labels.professional}</h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-foundation-muted">
            <li>
              <Link href={paths.founder} className="inline-flex min-h-11 items-center hover:text-foundation-action">
                {labels.founder}
              </Link>
            </li>
            {founderLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="inline-flex min-h-11 items-center hover:text-foundation-action">{link.label}</a>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 text-sm font-semibold text-foundation-ink">{labels.directContact}</h3>
          <ul className="mt-3 grid gap-2 text-sm text-foundation-muted">
            {contactActions.map((action) => (
              <li key={action.kind}>
                <a href={action.href} className="inline-flex min-h-11 items-center hover:text-foundation-action">{action.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 border-t border-foundation-border pt-6 md:col-span-3 md:flex-row md:items-center md:justify-between">
          <LanguageSwitch
            alternateHref={paths.alternateHref}
            alternateLocale={paths.alternateLocale}
            label={labels.languageSwitch}
          />
          <p className="text-sm text-foundation-muted">© {copyrightYear} FURLANICH</p>
        </div>
      </div>
    </footer>
  );
}
