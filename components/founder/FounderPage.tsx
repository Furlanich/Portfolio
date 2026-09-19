import { resolveActionLink } from '@/components/foundation/content-types';
import type { FounderPageContent } from './content-types';
import { getProjectDetailPath } from '@/lib/site-routes';
import { FounderCapabilities } from './FounderCapabilities';
import { FounderFinalCta } from './FounderFinalCta';
import { FounderHeader } from './FounderHeader';
import { FounderProfessionalHistory } from './FounderProfessionalHistory';
import { FounderProfessionalLinks } from './FounderProfessionalLinks';
import { FounderProjectsBridge } from './FounderProjectsBridge';

interface FounderPageProps {
  content: FounderPageContent;
}

export function FounderPage({ content }: FounderPageProps) {
  const projectsAction = resolveActionLink(content.projectsBridge.action, content.locale);
  const finalAction = resolveActionLink(content.finalCta.action, content.locale);
  const educationProjectHref = getProjectDetailPath(content.locale, content.education.project.slug);

  return (
    <main>
      <FounderHeader content={content.header} />
      <FounderProfessionalLinks content={content.professionalLinks} />
      <FounderProfessionalHistory
        experience={content.experience}
        biography={content.biography}
        education={content.education}
        projectHref={educationProjectHref}
      />
      <FounderCapabilities content={content.capabilities} />
      <FounderProjectsBridge content={content.projectsBridge} actionHref={projectsAction.href} />
      <FounderFinalCta content={content.finalCta} actionHref={finalAction.href} />
    </main>
  );
}
