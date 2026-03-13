'use client';

import { useTranslations } from 'next-intl';
import { Section } from '@/components/core/Section';
import { TimelineItem } from '@/components/core/TimelineItem';
import { getLocalizedString } from '@/lib/i18n';
import type { Education } from '@/lib/types';
import type { Locale } from '@/lib/locales';

interface EducationSectionProps {
  education: Education[];
  locale: Locale;
}

export function EducationSection({ education, locale }: EducationSectionProps) {
  const t = useTranslations();

  return (
    <Section
      id="education"
      title={t('sections.education.title')}
      subtitle={t('sections.education.subtitle')}
    >
      <div className="space-y-8">
        {education.map((item) => (
          <TimelineItem
            key={`${item.title.en}-${item.date}`}
            title={getLocalizedString(item.title, locale)}
            meta={getLocalizedString(item.institution, locale)}
            date={item.date}
          />
        ))}
      </div>
    </Section>
  );
}