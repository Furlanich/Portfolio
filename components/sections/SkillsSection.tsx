'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Section } from '@/components/core/Section';
import { Card } from '@/components/core/Card';
import { withBasePath } from '@/lib/paths';
import type { Skill } from '@/lib/types';

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const t = useTranslations();

  return (
    <Section
      id="skills"
      title={t('sections.skills.title')}
      subtitle={t('sections.skills.subtitle')}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {skills.map((skill) => (
          <Card key={skill.title} className="p-6">
            <h3 className="text-base font-semibold text-ink-900">
              {skill.title}
            </h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {skill.icons.map((icon) => (
                <motion.div
                  key={icon.alt}
                  whileHover={{ scale: 1.08 }}
                  className="flex items-center justify-center rounded-lg border border-paper-200 bg-paper-50 p-3"
                >
                  <img
                    src={withBasePath(icon.path)}
                    alt={icon.alt}
                    className="h-5 w-5"
                  />
                </motion.div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}