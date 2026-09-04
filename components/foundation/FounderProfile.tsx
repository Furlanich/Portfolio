import Link from 'next/link';
import type { FoundationNavigationPaths } from '@/lib/foundation-navigation';
import type { FounderContent } from '@/components/foundation/content-types';
import { resolveActionLink } from '@/components/foundation/content-types';

interface FounderProfileProps {
  content: FounderContent;
  paths: FoundationNavigationPaths;
}

function withBasePath(path: string) {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  return `${basePath}${path}`;
}

export function FounderProfile({ content, paths }: FounderProfileProps) {
  const contactAction = resolveActionLink(content.contactAction, content.locale);

  return (
    <main className="bg-foundation-canvas py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold leading-5 text-foundation-action">{content.role}</p>
          <h1 className="mt-4 text-[36px] font-bold leading-10 tracking-[-0.02em] text-foundation-ink md:text-[48px] md:leading-[52px]">
            {content.name}
          </h1>
          <p className="mt-6 max-w-[68ch] text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">
            {content.biography}
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <section aria-labelledby="founder-experience">
            <h2 id="founder-experience" className="text-2xl font-bold text-foundation-ink">
              {content.locale === 'es' ? 'Experiencia' : 'Experience'}
            </h2>
            <ul className="mt-6 grid gap-6">
              {content.experience.map((item) => (
                <li key={item.title} className="border-l-2 border-foundation-action pl-5">
                  <p className="text-sm font-semibold text-foundation-action">{item.period}</p>
                  <h3 className="mt-2 text-lg font-bold text-foundation-ink">{item.title}</h3>
                  <p className="mt-2 text-base leading-7 text-foundation-muted">{item.summary}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="founder-education">
            <h2 id="founder-education" className="text-2xl font-bold text-foundation-ink">
              {content.locale === 'es' ? 'Formación' : 'Education'}
            </h2>
            <ul className="mt-6 grid gap-6">
              {content.education.map((item) => (
                <li key={item.institution} className="border-l-2 border-foundation-border pl-5">
                  <h3 className="text-lg font-bold text-foundation-ink">{item.title}</h3>
                  <p className="mt-2 text-base leading-7 text-foundation-muted">{item.institution}</p>
                  <p className="mt-1 text-sm font-semibold text-foundation-action">{item.status}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section aria-labelledby="founder-capabilities" className="mt-16">
          <h2 id="founder-capabilities" className="text-2xl font-bold text-foundation-ink">
            {content.locale === 'es' ? 'Capacidades' : 'Capabilities'}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.capabilities.map((capability) => (
              <li key={capability} className="border border-foundation-border bg-foundation-surface p-4 text-base leading-6 text-foundation-muted">
                {capability}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="founder-links" className="mt-16 border-t border-foundation-border pt-8">
          <h2 id="founder-links" className="text-2xl font-bold text-foundation-ink">
            {content.locale === 'es' ? 'Enlaces profesionales' : 'Professional links'}
          </h2>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href={withBasePath(content.cv.path)}
              className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong max-[479px]:w-full"
            >
              {content.cv.label}
            </a>
            {[content.linkedin, content.github].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong max-[479px]:w-full"
              >
                {link.label}
              </a>
            ))}
            <Link
              href={contactAction.href}
              className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong max-[479px]:w-full"
            >
              {contactAction.label}
            </Link>
          </div>
        </section>
      </div>
      <span className="sr-only">{paths.founder}</span>
    </main>
  );
}
