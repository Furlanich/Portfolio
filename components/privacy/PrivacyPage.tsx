import type { PrivacyContent } from './content-types';
import { LegalPage } from '@/components/legal/LegalPage';

interface PrivacyPageProps {
  content: PrivacyContent;
}

export function PrivacyPage({ content }: PrivacyPageProps) {
  return (
    <LegalPage
      content={{
        locale: content.locale,
        heading: content.heading,
        introduction: content.introduction,
        contentsLabel: content.locale === 'es' ? 'Contenido' : 'Contents',
        sections: content.sections,
        links: [{ label: content.githubLink.label, href: content.githubLink.href, external: true }],
      }}
    />
  );
}
