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
        {projects.map((project) => {
          const title = getLocalizedString(project.title, locale);

          return (
            <Card
              key={project.title.en}
              className="group relative overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-400 focus-visible:outline-offset-2"
              tabIndex={0}
              aria-label={title}
            >
              <div className="h-40 w-full overflow-hidden bg-paper-100">
                <img
                  src={withBasePath(project.previewImage.path)}
                  alt={project.previewImage.alt}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-4 p-6 transition-[padding-bottom] duration-200 ease-out group-hover:pb-20 group-focus-within:pb-20">
                <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
                <p className="text-sm leading-relaxed text-ink-600">
                  {getLocalizedString(project.description, locale)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
              </div>
              <div
                className="invisible absolute bottom-6 left-6 flex translate-y-2 items-center gap-3 opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
              >
                {project.socialMedia.map((social) => (
                  <a
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-paper-200 bg-paper-50 text-ink-700 transition-colors duration-200 hover:bg-paper-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-100 focus-visible:ring-offset-2"
                  >
                    <img
                      src={withBasePath(social.image.path)}
                      alt={social.image.alt}
                      className="h-5 w-5"
                    />
                  </a>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
