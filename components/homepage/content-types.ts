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
  audienceStatement: string;
  situations: string[];
  action: ActionLink;
};

export type HomeServicesSectionContent = {
  heading: string;
  introduction: string;
  services: HomepageItem[];
  action: ActionLink;
};

export type HomeProofContent = {
  heading: string;
  introduction: string;
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
  action: ActionLink;
};

export type HomeCtaContent = {
  heading: string;
  demoStatement: string;
  primaryAction: ActionLink;
  secondaryAction: ContactAction;
};

export type HomePageContent = HomeHeroContent & {
  problems: HomeProblemsContent;
  servicesSection: HomeServicesSectionContent;
  proof: HomeProofContent;
  process: HomeProcessContent;
  founderSection: HomeFounderSectionContent;
  cta: HomeCtaContent;
};
