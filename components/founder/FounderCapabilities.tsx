import type { FounderPageContent } from './content-types';

interface FounderCapabilitiesProps {
  content: FounderPageContent['capabilities'];
}

export function FounderCapabilities({ content }: FounderCapabilitiesProps) {
  return (
    <section aria-labelledby="founder-capabilities-heading" className="bg-foundation-surface py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="border-t-2 border-foundation-ink pt-8 md:pt-10">
          <div className="max-w-[68ch]">
            <h2 id="founder-capabilities-heading" className="max-w-[24ch] text-[32px] font-bold leading-[38px] tracking-[-0.015em] text-foundation-ink md:text-[40px] md:leading-[48px]">
              {content.heading}
            </h2>
            <p className="mt-6 text-lg leading-7 text-foundation-muted">{content.introduction}</p>
          </div>
        </div>
        <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2">
          {content.groups.map((group) => (
            <section data-founder-capability-group key={group.id} aria-labelledby={'founder-capability-' + group.id}>
              <h3 id={'founder-capability-' + group.id} className="border-t border-foundation-border pt-5 text-lg font-bold leading-7 text-foundation-ink">
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
