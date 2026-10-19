import type { PrivacyContent } from './content-types';
import { LegalPage } from '@/components/legal/LegalPage';
import { withBasePath } from '@/lib/paths';

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
        updatedLabel: content.updatedLabel,
        updatedAt: content.updatedAt,
        contentsLabel: content.locale === 'es' ? 'Contenido' : 'Contents',
        sections: content.sections,
        links: [
          { label: content.termsLink.label, href: withBasePath(content.termsLink.href) },
          { label: content.githubLink.label, href: content.githubLink.href },
        ],
      }}
    />
  );
}
