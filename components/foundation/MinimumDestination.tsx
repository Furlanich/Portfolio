import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import type {
  ActionLink,
  ContactAction,
  ServiceSummary,
} from '@/components/foundation/content-types';
import { resolveActionLink } from '@/components/foundation/content-types';

interface MinimumDestinationProps {
  action?: ActionLink;
  contactActions?: ContactAction[];
  heading: string;
  introduction: string;
  items?: ServiceSummary[];
  locale: Locale;
  location?: string;
  responseExpectation?: string;
}

export function MinimumDestination({
  action,
  contactActions,
  heading,
  introduction,
  items,
  locale,
  location,
  responseExpectation,
}: MinimumDestinationProps) {
  const resolvedAction = action ? resolveActionLink(action, locale) : undefined;

  return (
    <main className="bg-foundation-canvas py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="max-w-3xl">
          <h1 className="max-w-[18ch] text-[36px] font-bold leading-10 tracking-[-0.02em] text-foundation-ink md:text-[48px] md:leading-[52px]">
            {heading}
          </h1>
          <p className="mt-6 max-w-[68ch] text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">
            {introduction}
          </p>
        </div>

        {items ? (
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {items.map((item) => (
              <li
                key={item.title}
                className="min-w-0 border border-foundation-border bg-foundation-surface p-6"
              >
                <h2 className="text-xl font-bold leading-7 text-foundation-ink">
                  {item.title}
                </h2>
                <p className="mt-4 text-base leading-7 text-foundation-muted">
                  {item.summary}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        {contactActions ? (
          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)]">
            <div>
              <h2 className="text-xl font-bold text-foundation-ink">{location}</h2>
              <p className="mt-4 max-w-[52ch] text-base leading-7 text-foundation-muted">
                {responseExpectation}
              </p>
            </div>
            <ul className="grid gap-3">
              {contactActions.map((contactAction) => (
                <li key={contactAction.kind}>
                  <a
                    href={contactAction.href}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong"
                  >
                    {contactAction.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {resolvedAction ? (
          <div className="mt-12">
            <Link
              href={resolvedAction.href}
              className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong max-[479px]:w-full"
            >
              {resolvedAction.label}
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
