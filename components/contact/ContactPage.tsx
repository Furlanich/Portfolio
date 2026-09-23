import Link from 'next/link';
import { ContactForm } from './ContactForm';
import type { ContactPageContent } from './content-types';
import type { Locale } from '@/lib/locales';
import { resolveActionLink } from '@/components/foundation/content-types';

type ContactPageProps = {
  content: ContactPageContent;
  locale: Locale;
  mode: 'demonstration';
};

export function ContactPage({ content, locale, mode }: ContactPageProps) {
  const founderLink = resolveActionLink(content.founderContextAction, locale);

  return (
    <main className="bg-foundation-canvas py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="max-w-3xl">
          <h1 className="max-w-[18ch] text-[36px] font-bold leading-10 tracking-[-0.02em] text-foundation-ink md:text-[48px] md:leading-[52px]">
            {content.heading}
          </h1>
          <p className="mt-6 max-w-[68ch] text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">
            {content.introduction}
          </p>
          <p className="mt-4 max-w-[68ch] text-base leading-7 text-foundation-muted">
            {content.responseExpectation}
          </p>
        </div>

        <div className="mt-10 grid gap-10 border-t-2 border-foundation-ink pt-10 md:mt-12 md:pt-12 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
          <ContactForm content={content} locale={locale} mode={mode} />
          <aside className="self-start lg:pt-8">
            <section aria-labelledby={'contact-' + locale + '-alternatives-heading'}>
              <h2 id={'contact-' + locale + '-alternatives-heading'} className="text-xl font-bold leading-7 text-foundation-ink">
                {content.alternatives.heading}
              </h2>
              <p className="mt-4 text-base leading-7 text-foundation-muted">{content.alternatives.note}</p>
              <ul className="mt-6 grid gap-3">
                {content.alternatives.actions.map((action) => (
                  <li key={action.kind}>
                    <a
                      href={action.href}
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-action focus-visible:ring-offset-4"
                    >
                      {action.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-base font-semibold leading-7 text-foundation-ink">{content.location}</p>
            </section>
          </aside>
        </div>

        <div className="mt-10 border-t border-foundation-border pt-6">
          <Link
            href={founderLink.href}
            className="inline-flex min-h-11 items-center text-base font-semibold text-foundation-muted underline decoration-foundation-border underline-offset-4 transition-colors duration-[160ms] ease-out hover:text-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-action focus-visible:ring-offset-4"
          >
            {founderLink.label}
          </Link>
        </div>
      </div>
    </main>
  );
}
