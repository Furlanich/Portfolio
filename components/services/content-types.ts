import type { ActionLink } from '../foundation/content-types';
import type { Locale } from '../../lib/locales';

export type ServiceSectionId = 'web' | 'whatsapp' | 'consulting';

export type ServiceEvidenceLink = {
  label: string;
  slug: string;
};

// One service family, in three presentations that share these fields: a catalogue card (family,
// catalogueSummary), a chapter (headline through action) and the same-page boundary (boundaries).
// PLAN-SPF-V1 Task 6: the labels and fields follow the approved SPF-V1 copy table; `boundaries` is
// the approved D05 compressed boundary and stays verbatim.
export type ServicesSectionContent = {
  id: ServiceSectionId;
  family: string;
  headline: string;
  catalogueSummary: string;
  outcome: string;
  deliveryHeading: string;
  delivery: string;
  situationsHeading: string;
  situations: string;
  startingHeading: string;
  startingPoint: string;
  scopeHeading: string;
  scope: string;
  boundariesHeading: string;
  boundaries: string;
  evidenceHeading: string;
  evidence: string;
  evidenceLink?: ServiceEvidenceLink;
  action: ActionLink;
};

export type ServicesPageContent = {
  locale: Locale;
  routeId: 'services';
  introduction: {
    heading: string;
    description: string;
    catalogueLabel: string;
    catalogueAction: string;
  };
  sceneCaption: string;
  services: [ServicesSectionContent, ServicesSectionContent, ServicesSectionContent];
  workingBoundariesLabel: string;
  principles: {
    heading: string;
    statements: [string, string, string];
    workingHeading: string;
    workingAgreement: string;
  };
  commercialBoundaries: {
    heading: string;
    description: string;
    items: string[];
  };
  aiNote: {
    heading: string;
    description: string;
    managementScope: string;
    scope: string;
  };
  finalCta: {
    heading: string;
    description: string;
    action: ActionLink;
  };
};
