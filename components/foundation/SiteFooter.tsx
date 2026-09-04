import Link from 'next/link';
import type { FoundationNavigationPaths } from '@/lib/foundation-navigation';
import type { ContactAction, ExternalLink } from '@/components/foundation/content-types';

interface SiteFooterProps {
  contactActions: ContactAction[];
  founderLinks: ExternalLink[];
  labels: {
    navigation: string;
    services: string;
    founder: string;
    contact: string;
    directContact: string;
    professional: string;
    location: string;
  };
  paths: FoundationNavigationPaths;
}

export function SiteFooter({ contactActions, founderLinks, labels, paths }: SiteFooterProps) {
  return (
    <footer className="border-t border-foundation-border bg-foundation-surface">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-12 md:grid-cols-3 md:px-8 lg:px-12">
        <div>
          <Link href={paths.home} className="text-base font-bold tracking-[0.08em] text-foundation-ink">
            FURLANICH
          </Link>
          <p className="mt-4 text-sm leading-6 text-foundation-muted">{labels.location}</p>
        </div>

        <nav aria-label={labels.navigation}>
          <h2 className="text-sm font-semibold text-foundation-ink">{labels.navigation}</h2>
          <ul className="mt-3 grid gap-2 text-sm font-semibold text-foundation-muted">
            <li><Link href={paths.services} className="inline-flex min-h-11 items-center hover:text-foundation-action">{labels.services}</Link></li>
            <li><Link href={paths.founder} className="inline-flex min-h-11 items-center hover:text-foundation-action">{labels.founder}</Link></li>
            <li><Link href={paths.contact} className="inline-flex min-h-11 items-center hover:text-foundation-action">{labels.contact}</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-foundation-ink">{labels.directContact}</h2>
          <ul className="mt-3 grid gap-2 text-sm text-foundation-muted">
            {contactActions.map((action) => (
              <li key={action.kind}>
                <a href={action.href} className="inline-flex min-h-11 items-center hover:text-foundation-action">{action.label}</a>
              </li>
            ))}
          </ul>
          <h2 className="mt-6 text-sm font-semibold text-foundation-ink">{labels.professional}</h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-foundation-muted">
            {founderLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center hover:text-foundation-action">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
