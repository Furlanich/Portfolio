'use client';

import { useEffect, useMemo, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '@/locales/en/common.json';
import esMessages from '@/locales/es/common.json';
import { aboutData, educationData, experienceData, projectsData, skillsData } from '@/lib/data';
import type { Locale } from '@/lib/locales';
import { Navbar } from '@/components/layout/Navbar';
import { LandingSection } from '@/components/sections/LandingSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { EducationSection } from '@/components/sections/EducationSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ContactSection } from '@/components/sections/ContactSection';

const messagesByLocale = {
  en: enMessages,
  es: esMessages
};

export default function Page() {
  const [locale, setLocale] = useState<Locale>('en');
  const messages = useMemo(() => messagesByLocale[locale], [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="relative">
        <Navbar
          name={aboutData.name}
          socialMedia={aboutData.socialMedia}
          locale={locale}
          onLocaleChange={setLocale}
        />
        <main className="pt-20">
          <LandingSection about={aboutData} locale={locale} />
          <SkillsSection skills={skillsData} />
          <ExperienceSection experience={experienceData} locale={locale} />
          <EducationSection education={educationData} locale={locale} />
          <ProjectsSection projects={projectsData} locale={locale} />
          <ContactSection about={aboutData} />
        </main>
      </div>
    </NextIntlClientProvider>
  );
}