interface CommercialContentCardProps {
  title: string;
  description: string;
}

export function CommercialContentCard({ title, description }: CommercialContentCardProps) {
  return (
    <article className="rounded-[16px] border border-foundation-border bg-foundation-surface p-6 md:p-8">
      <h3 className="text-xl font-bold leading-7 text-foundation-ink">{title}</h3>
      <p className="mt-3 text-base leading-[26px] text-foundation-muted">{description}</p>
    </article>
  );
}
