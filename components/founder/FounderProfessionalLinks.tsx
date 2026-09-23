import type { FounderPageContent } from './content-types';

interface FounderProfessionalLinksProps {
  content: FounderPageContent['professionalLinks'];
}

function withBasePath(path: string) {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  return basePath + path;
}

export function FounderProfessionalLinks({ content }: FounderProfessionalLinksProps) {
  return (
    <section
      aria-labelledby="founder-professional-links-heading"
      className="bg-foundation-canvas pb-16 md:pb-20 lg:pb-24"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="rounded-[16px] border border-foundation-border bg-foundation-surface p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
          <h2 id="founder-professional-links-heading" className="text-xl font-bold leading-7 text-foundation-ink">
            {content.heading}
          </h2>
          <div className="mt-5 flex flex-wrap gap-3 md:mt-0">
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
                className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-foundation-action bg-foundation-surface px-6 text-base font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong max-[479px]:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}