'use client';

import { MotionReveal } from '@/components/core/MotionReveal';

interface TimelineItemProps {
  title: string;
  meta: string;
  date: string;
}

export function TimelineItem({ title, meta, date }: TimelineItemProps) {
  return (
    <MotionReveal>
      <div className="relative border-l border-paper-200 pl-6">
        <span className="absolute -left-[7px] top-2 h-3 w-3 rounded-full border-2 border-brand-600 bg-white" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
          {date}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-ink-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">{meta}</p>
      </div>
    </MotionReveal>
  );
}