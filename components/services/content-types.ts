import type { ActionLink } from '../foundation/content-types';
import type { Locale } from '../../lib/locales';

export type ServiceSectionId = 'web' | 'whatsapp' | 'consulting';

export type ServicesIndexItem = {
  id: ServiceSectionId;
  label: string;
};

export type ServiceEvidenceLink = {
  label: string;
  slug: string;
};

export type ServicesSectionContent = {
  id: ServiceSectionId;
  heading: string;
  lead: string;
  workHeading: string;
  work: string[];
  startingHeading: string;
  startingPoint: string;
  fitHeading: string;
  fit: string;
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
    indexLabel: string;
    indexItems: ServicesIndexItem[];
  };
  services: [ServicesSectionContent, ServicesSectionContent, ServicesSectionContent];
  principles: {
    heading: string;
    introduction: string;
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
  };
  finalCta: {
    heading: string;
    description: string;
    action: ActionLink;
  };
};
