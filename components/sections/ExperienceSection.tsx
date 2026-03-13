'use client';

import { useTranslations } from 'next-intl';
import { Section } from '@/components/core/Section';
import { TimelineItem } from '@/components/core/TimelineItem';
import { getLocalizedString } from '@/lib/i18n';
import type { Experience } from '@/lib/types';
import type { Locale } from '@/lib/locales';

interface ExperienceSectionProps {
  experience: Experience[];
  locale: Locale;
}

export function ExperienceSection({ experience, locale }: ExperienceSectionProps) {
  const t = useTranslations();

  return (
    <Section
      id="experience"
      title={t('sections.experience.title')}
      subtitle={t('sections.experience.subtitle')}
      className="bg-white/70"
    >
      <div className="space-y-8">
        {experience.map((item) => (
          <TimelineItem
            key={`${item.title.en}-${item.date}`}
            title={getLocalizedString(item.title, locale)}
            meta={getLocalizedString(item.description, locale)}
            date={item.date}
          />
        ))}
      </div>
    </Section>
  );
}