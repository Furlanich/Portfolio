import type { FounderPageContent } from './content-types';

interface FounderCapabilitiesProps {
  content: FounderPageContent['capabilities'];
}

export function FounderCapabilities({ content }: FounderCapabilitiesProps) {
  return (
    <section aria-labelledby="founder-capabilities-heading" className="bg-foundation-canvas py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="max-w-[68ch]">
          <h2 id="founder-capabilities-heading" className="text-2xl font-bold leading-8 text-foundation-ink md:text-3xl">
            {content.heading}
          </h2>
          <p className="mt-4 text-base leading-7 text-foundation-muted">{content.introduction}</p>
        </div>
        <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2">
          {content.groups.map((group) => (
            <section data-founder-capability-group key={group.title} aria-labelledby={'founder-capability-' + group.title}>
              <h3 id={'founder-capability-' + group.title} className="border-t border-foundation-border pt-5 text-lg font-bold leading-7 text-foundation-ink">
                {group.title}
              </h3>
              <ul className="mt-4 grid gap-2 text-base leading-7 text-foundation-muted">
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}