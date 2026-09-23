import type { StudioPageContent } from './content-types';

interface StudioAccountabilityProps {
  accountability: StudioPageContent['accountability'];
  collaboratorModel: StudioPageContent['collaboratorModel'];
}

export function StudioAccountability({
  accountability,
  collaboratorModel,
}: StudioAccountabilityProps) {
  return (
    <section aria-labelledby="studio-accountability-heading" className="bg-foundation-surface py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-10 border-t-2 border-foundation-ink pt-8 md:pt-10 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <p data-sequence aria-hidden="true" className="mb-4 font-mono text-sm font-semibold leading-5 text-foundation-action">01</p>
            <h2
              id="studio-accountability-heading"
              className="max-w-[20ch] text-[32px] font-bold leading-[38px] tracking-[-0.015em] text-foundation-ink md:text-[40px] md:leading-[48px]"
            >
              {accountability.heading}
            </h2>
            <div className="mt-6 grid gap-5">
              {accountability.paragraphs.map((paragraph) => (
                <p key={paragraph} className="max-w-[68ch] text-lg leading-7 text-foundation-muted">{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="min-w-0 rounded-[16px] border border-foundation-border bg-foundation-canvas p-6 md:p-8 lg:col-span-5 lg:self-start">
            <h3 className="text-lg font-bold leading-7 text-foundation-ink">{collaboratorModel.heading}</h3>
            {collaboratorModel.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-base leading-7 text-foundation-muted">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
