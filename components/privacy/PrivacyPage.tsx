import Link from 'next/link';
import type { PrivacyContent } from './content-types';

interface PrivacyPageProps {
  content: PrivacyContent;
}

export function PrivacyPage({ content }: PrivacyPageProps) {
  return (
    <main className="bg-foundation-canvas">
      <section className="border-b border-foundation-border bg-foundation-canvas">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-16 md:px-8 md:py-24 lg:px-12">
          <h1 className="max-w-[18ch] text-4xl font-bold leading-tight tracking-[-0.02em] text-foundation-ink md:text-5xl md:leading-[1.1]">
            {content.heading}
          </h1>
          <p className="mt-6 max-w-[68ch] text-lg leading-8 text-foundation-muted">
            {content.introduction}
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-8 md:py-16 lg:px-12">
        <div className="max-w-[760px]">
          {content.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={section.id + '-heading'}
              className="border-t border-foundation-border py-8 first:border-t-0 first:pt-0 md:py-10"
            >
              <h2 id={section.id + '-heading'} className="text-2xl font-bold leading-8 text-foundation-ink md:text-3xl md:leading-10">
                {section.heading}
              </h2>
              <div className="mt-4 grid gap-4 text-base leading-7 text-foundation-muted md:text-lg md:leading-8">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}

          <p className="border-t border-foundation-border pt-8 text-base leading-7 text-foundation-muted">
            <Link
              href={content.githubLink.href}
              className="font-semibold text-foundation-action underline decoration-foundation-border underline-offset-4 hover:text-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-action focus-visible:ring-offset-4"
            >
              {content.githubLink.label}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
