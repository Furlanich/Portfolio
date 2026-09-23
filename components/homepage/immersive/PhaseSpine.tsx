interface PhaseSpineProps {
  current: number;
  total: number;
}

// Decorative position marker on the text/stage boundary. The adjacent visible phase status
// carries the same information as text, so the spine is hidden from assistive technology.
export function PhaseSpine({ current, total }: PhaseSpineProps) {
  return (
    <span
      aria-hidden="true"
      data-phase-spine
      className="absolute -right-[5px] top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={
            index === current
              ? 'h-[9px] w-[9px] rounded-full bg-foundation-action ring-4 ring-foundation-canvas'
              : 'h-[9px] w-[9px] rounded-full border border-foundation-border bg-foundation-canvas'
          }
        />
      ))}
    </span>
  );
}
