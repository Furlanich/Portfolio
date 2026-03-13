'use client';

import { useTranslations } from 'next-intl';
import { Section } from '@/components/core/Section';
import { Card } from '@/components/core/Card';
import { Badge } from '@/components/core/Badge';
import { getLocalizedString } from '@/lib/i18n';
import { withBasePath } from '@/lib/paths';
import type { Project } from '@/lib/types';
import type { Locale } from '@/lib/locales';

interface ProjectsSectionProps {
  projects: Project[];
  locale: Locale;
}

export function ProjectsSection({ projects, locale }: ProjectsSectionProps) {
  const t = useTranslations();

  return (
    <Section
      id="projects"
      title={t('sections.projects.title')}
      subtitle={t('sections.projects.subtitle')}
      className="bg-white/70"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.title.en} className="overflow-hidden">
            <div className="h-40 w-full overflow-hidden bg-paper-100">
              <img
                src={withBasePath(project.previewImage.path)}
                alt={project.previewImage.alt}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-4 p-6">
              <h3 className="text-lg font-semibold text-ink-900">
                {getLocalizedString(project.title, locale)}
              </h3>
              <p className="text-sm leading-relaxed text-ink-600">
                {getLocalizedString(project.description, locale)}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}