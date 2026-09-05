interface CommercialSectionHeadingProps {
  headingId: string;
  heading: string;
  intro?: string;
}

export function CommercialSectionHeading({
  headingId,
  heading,
  intro,
}: CommercialSectionHeadingProps) {
  return (
    <div className="max-w-[68ch]">
      <h2
        id={headingId}
        className="max-w-[20ch] text-[32px] font-bold leading-[38px] tracking-[-0.015em] text-foundation-ink md:text-[40px] md:leading-[48px]"
      >
        {heading}
      </h2>
      {intro ? (
        <p className="mt-6 text-lg leading-7 text-foundation-muted lg:text-xl lg:leading-8">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
