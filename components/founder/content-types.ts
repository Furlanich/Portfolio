import type {
  ActionLink,
  DocumentLink,
  ExternalLink,
} from '@/components/foundation/content-types';
import type { Locale } from '@/lib/locales';

export type FounderHeaderContent = {
  context: string;
  name: string;
  biography: string;
};

export type FounderExperienceEntry = {
  period: string;
  role: string;
  context: string;
  summary: string;
};

export type FounderEducationEntry = {
  title: string;
  institution: string;
  status: string;
};

export type FounderEducationProject = {
  slug: string;
  title: string;
  context: string;
  summary: string;
  relationship: string;
  limitation: string;
  actionLabel: string;
};

export type FounderCapabilityGroup = {
  title: string;
  items: string[];
};

export type FounderPageContent = {
  locale: Locale;
  routeId: 'founder';
  header: FounderHeaderContent;
  professionalLinks: {
    heading: string;
    cv: DocumentLink;
    linkedin: ExternalLink;
    github: ExternalLink;
  };
  experience: {
    heading: string;
    entries: FounderExperienceEntry[];
  };
  education: {
    heading: string;
    entries: FounderEducationEntry[];
    project: FounderEducationProject;
  };
  capabilities: {
    heading: string;
    introduction: string;
    groups: FounderCapabilityGroup[];
  };
  projectsBridge: {
    heading: string;
    description: string;
    action: ActionLink;
  };
  finalCta: {
    heading: string;
    description: string;
    action: ActionLink;
  };
};
