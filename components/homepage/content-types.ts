import type {
  ActionLink,
  ContactAction,
  HomeHeroContent,
} from '@/components/foundation/content-types';

export type HomepageItem = {
  title: string;
  description: string;
};

export type HomeProblemsContent = {
  heading: string;
  introduction: string;
  situations: HomepageItem[];
  action: ActionLink;
};

export type HomeServicesSectionContent = {
  heading: string;
  introduction: string;
  services: HomepageItem[];
  action: ActionLink;
};

export type HomeAudiencesContent = {
  heading: string;
  audiences: HomepageItem[];
  closing: string;
  action: ActionLink;
};

export type HomeProofContent = {
  heading: string;
  introduction: string;
  commitments: HomepageItem[];
  action: ActionLink;
};

export type HomeProcessContent = {
  heading: string;
  steps: HomepageItem[];
  qualityStatement: string;
  action: ActionLink;
};

export type HomeFounderSectionContent = {
  heading: string;
  biography: string;
  primaryAction: ActionLink;
  secondaryAction: ActionLink;
};

export type HomeCtaContent = {
  heading: string;
  description: string;
  responseStatement: string;
  primaryAction: ActionLink;
  secondaryAction: ContactAction;
};

export type HomePageContent = HomeHeroContent & {
  problems: HomeProblemsContent;
  servicesSection: HomeServicesSectionContent;
  audiences: HomeAudiencesContent;
  proof: HomeProofContent;
  process: HomeProcessContent;
  founderSection: HomeFounderSectionContent;
  cta: HomeCtaContent;
};
