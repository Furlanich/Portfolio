import type { FounderPageContent } from './content-types';

interface FounderProfessionalHistoryProps {
  experience: FounderPageContent['experience'];
  education: FounderPageContent['education'];
}

export function FounderProfessionalHistory({ experience, education }: FounderProfessionalHistoryProps) {
  return (
    <>
      <section aria-labelledby="founder-experience-heading" className="bg-foundation-canvas py-16 md:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          <h2 id="founder-experience-heading" className="text-2xl font-bold leading-8 text-foundation-ink md:text-3xl">
            {experience.heading}
          </h2>
          <ol className="mt-10 grid gap-10">
            {experience.entries.map((entry) => (
              <li data-founder-experience-entry key={entry.period + '-' + entry.role} className="grid gap-3 border-t border-foundation-border pt-5 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8">
                <div data-founder-period>
                  <p className="text-sm font-semibold leading-6 text-foundation-action">{entry.period}</p>
                </div>
                <div className="max-w-[68ch]">
                  <h3 className="text-xl font-bold leading-7 text-foundation-ink">{entry.role}</h3>
                  <p className="mt-1 text-sm font-semibold leading-6 text-foundation-muted">{entry.context}</p>
                  <p className="mt-3 text-base leading-7 text-foundation-muted">{entry.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="founder-education-heading" className="bg-foundation-surface py-16 md:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 lg:px-12">
          <h2 id="founder-education-heading" className="text-2xl font-bold leading-8 text-foundation-ink md:text-3xl">
            {education.heading}
          </h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-2">
            {education.entries.map((entry) => (
              <li key={entry.institution} className="border-t border-foundation-border pt-5">
                <h3 className="text-lg font-bold leading-7 text-foundation-ink">{entry.title}</h3>
                <p className="mt-2 text-base leading-7 text-foundation-muted">{entry.institution}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-foundation-action">{entry.status}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}