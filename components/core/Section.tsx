'use client';

import { cn } from '@/lib/utils';
import { Container } from '@/components/core/Container';
import { MotionReveal } from '@/components/core/MotionReveal';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}

export function Section({ id, title, subtitle, className, children }: SectionProps) {
  return (
    <section id={id} className={cn('py-16 md:py-24 scroll-mt-24', className)}>
      <Container>
        <MotionReveal>
          <div className="mb-10 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">
              {title}
            </p>
            {subtitle ? (
              <h2 className="text-3xl font-semibold text-ink-900 md:text-4xl">
                {subtitle}
              </h2>
            ) : null}
          </div>
        </MotionReveal>
        {children}
      </Container>
    </section>
  );
}