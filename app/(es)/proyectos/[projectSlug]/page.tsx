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

const locale = 'es' as const;
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
          navigation: 'Navegación principal',
          menu: 'Abrir navegación principal',
          services: 'Servicios',
          projects: 'Proyectos',
          process: 'Proceso',
          founder: 'El estudio',
          contact: 'Contacto',
          primaryAction: contactContent.actions[0].label,
          languageSwitch: 'Ver sitio en inglés',
        }}
      />
      <ProjectDetailPage
        detail={detail}
        locale={locale}
        contactHref={getFoundationPath('contact', locale)}
        labels={{
          evidenceHeading: 'Evidencia del proyecto',
          contextHeading: 'Contexto',
          problemHeading: 'Oportunidad modelada',
          scopeHeading: 'Alcance implementado',
          capabilitiesHeading: 'Capacidades',
          resultHeading: 'Resultado y estado',
          evidenceLinkLabel: 'Evidencia pública',
          limitationsHeading: 'Limitaciones y alcance',
          relatedServiceHeading: 'Servicio relacionado',
          finalHeading: '¿Necesitás resolver algo parecido?',
          finalDescription: 'Contanos el contexto, el proceso o el sistema que necesitás mejorar. Te respondemos con una evaluación directa del próximo paso.',
          finalAction: 'Hablar sobre tu proyecto',
          sourceLinkSuffix: '(enlace externo)',
        }}
      />
      <SiteFooter
        paths={paths}
        contactActions={contactContent.actions}
        founderLinks={[founderContent.linkedin, founderContent.github]}
        labels={{
          navigation: 'Navegación',
          services: 'Servicios',
          projects: 'Proyectos',
          process: 'Proceso',
          founder: 'El estudio',
          contact: 'Contacto',
          directContact: 'Contacto directo',
          professional: 'Enlaces profesionales',
          location: contactContent.location,
        }}
      />
    </>
  );
}
