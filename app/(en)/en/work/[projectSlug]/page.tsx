import { notFound } from 'next/navigation';
import { ProjectDetailPage } from '@/components/projects/ProjectDetailPage';
import { SiteFooter } from '@/components/foundation/SiteFooter';
import { SiteHeader } from '@/components/foundation/SiteHeader';
import { getFoundationPath } from '@/lib/site-routes';
import { getProjectDetailNavigationPaths } from '@/lib/foundation-navigation';
import { getPublishedProjectDetail, getPublishedProjectDetails, validateProjectContent } from '@/lib/projects/publication';
import { contactContent } from '../../_content/contact';
import { founderContent } from '../../_content/founder';
import { projectPageContent } from '../../_content/projects';

const locale = 'en' as const;
const detailEntries = getPublishedProjectDetails(projectPageContent, locale);
validateProjectContent(projectPageContent, locale);
export const dynamicParams = false;

export function generateStaticParams() {
  return detailEntries.map((entry) => ({ projectSlug: entry.slug }));
}

export default async function Page({ params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = await params;
  const detail = getPublishedProjectDetail(projectPageContent, projectSlug, locale);
  if (!detail) notFound();
  const paths = getProjectDetailNavigationPaths(locale, projectSlug);

  return (
    <>
      <SiteHeader
        locale={locale}
        paths={paths}
        labels={{
          navigation: 'Primary navigation',
          menu: 'Open primary navigation',
          services: 'Services',
          projects: 'Work',
          process: 'Process',
          founder: 'About',
          contact: 'Contact',
          primaryAction: contactContent.actions[0].label,
          languageSwitch: 'View site in Spanish',
        }}
      />
      <ProjectDetailPage
        detail={detail}
        locale={locale}
        contactHref={getFoundationPath('contact', locale)}
        labels={{
          evidenceHeading: 'Project evidence',
          contextHeading: 'Context',
          problemHeading: 'Modeled opportunity',
          scopeHeading: 'Implemented scope',
          capabilitiesHeading: 'Capabilities',
          resultHeading: 'Result and current state',
          evidenceLinkLabel: 'Public evidence',
          limitationsHeading: 'Limitations and scope',
          relatedServiceHeading: 'Related service',
          finalHeading: 'Need to solve something similar?',
          finalDescription: 'Tell us about the context, process, or system you need to improve. We will respond with a direct assessment of the next step.',
          finalAction: 'Discuss your project',
          sourceLinkSuffix: '(external link)',
        }}
      />
      <SiteFooter
        paths={paths}
        contactActions={contactContent.actions}
        founderLinks={[founderContent.linkedin, founderContent.github]}
        labels={{
          navigation: 'Navigation',
          services: 'Services',
          projects: 'Work',
          process: 'Process',
          founder: 'About',
          contact: 'Contact',
          directContact: 'Direct contact',
          professional: 'Professional links',
          location: contactContent.location,
        }}
      />
    </>
  );
}
