import type { FounderHeaderContent } from './content-types';

interface FounderHeaderProps {
  content: FounderHeaderContent;
}

export function FounderHeader({ content }: FounderHeaderProps) {
  return (
    <section id="founder-header" aria-labelledby="founder-heading" className="bg-foundation-canvas py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="max-w-[68ch]">
          <p className="text-sm font-semibold leading-5 text-foundation-action">{content.context}</p>
          <h1 id="founder-heading" className="mt-4 text-[36px] font-bold leading-10 tracking-[-0.02em] text-foundation-ink md:text-[48px] md:leading-[52px]">
            {content.name}
          </h1>
          <p className="mt-6 text-lg leading-8 text-foundation-muted md:text-xl">{content.biography}</p>
        </div>
      </div>
    </section>
  );
}