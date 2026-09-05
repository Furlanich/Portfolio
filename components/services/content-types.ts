import type { ActionLink } from '../foundation/content-types';
import type { Locale } from '../../lib/locales';

export type ServiceSectionId = 'web' | 'whatsapp' | 'consulting';

export type ServicesTextItem = {
  title: string;
  description: string;
};

export type ServicesLevel = ServicesTextItem;

export type ServicesIndexItem = {
  id: ServiceSectionId;
  label: string;
};

export type ServicesSectionContent = {
  id: ServiceSectionId;
  eyebrow: string;
  heading: string;
  situation: string;
  situationsHeading: string;
  situations: string[];
  outcomeHeading: string;
  outcome: string;
  levelsHeading?: string;
  levels: ServicesLevel[];
  levelsNote?: string;
  examplesHeading: string;
  examples: string[];
  engagementHeading: string;
  engagement: string[];
  boundariesHeading: string;
  boundaries: string[];
  dependenciesHeading: string;
  dependencies: string;
  fitHeading: string;
  fit: string;
  nonFitHeading: string;
  nonFit: string;
  evidenceHeading: string;
  evidence: string;
  action: ActionLink;
};

export type ServicesPageContent = {
  locale: Locale;
  routeId: 'services';
  introduction: {
    heading: string;
    description: string;
    qualification: string;
    indexLabel: string;
    indexItems: ServicesIndexItem[];
  };
  services: [ServicesSectionContent, ServicesSectionContent, ServicesSectionContent];
  principles: {
    heading: string;
    introduction: string;
    items: ServicesTextItem[];
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
    responseStatement: string;
    action: ActionLink;
  };
};
