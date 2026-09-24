import type {
  ActionLink,
  ContactAction,
  HomeHeroContent,
} from '@/components/foundation/content-types';
import type { HomeInstrumentContent } from '@/lib/immersive-home/types';

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
  kicker: string;
  heading: string;
  introduction: string;
  services: (HomepageItem & { category: string })[];
  action: ActionLink;
};

export type HomeProofLogEntry = {
  term: string;
  text: string;
};

export type HomeProofContent = {
  kicker: string;
  heading: string;
  introduction: string;
  logLabel: string;
  log: HomeProofLogEntry[];
  action: ActionLink;
};

export type HomeProcessContent = {
  kicker: string;
  heading: string;
  steps: HomepageItem[];
  qualityStatement: string;
  action: ActionLink;
};

export type HomeFounderSectionContent = {
  kicker: string;
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

export type HomeImpactSource = {
  id: 'whatsapp' | 'book' | 'spreadsheet' | 'email' | 'call';
  name: string;
  note: string;
};

export type HomeImpactContent = {
  kicker: string;
  heading: string;
  introduction: string;
  illustrativeTag: string;
  toggle: {
    groupLabel: string;
    separateLabel: string;
    connectedLabel: string;
    /** `{state}` is replaced by the active toggle label. */
    announcement: string;
  };
  figure: {
    title: string;
    separateDescription: string;
    connectedDescription: string;
    doubtLabel: string;
    fixLabel: string;
  };
  /** Fixed order: whatsapp, book, spreadsheet, email, call. */
  sources: [
    HomeImpactSource,
    HomeImpactSource,
    HomeImpactSource,
    HomeImpactSource,
    HomeImpactSource,
  ];
  /** `{source}` is replaced by the active source name. */
  connectedNoteTemplate: string;
  counts: {
    title: string;
    separateLabel: string;
    connectedLabel: string;
    caption: string;
  };
};

export type HomeReadoutContent = Record<
  'home' | 'problems' | 'services' | 'impact' | 'proof' | 'process' | 'founder' | 'contact',
  string
>;

export type HomePageContent = HomeHeroContent & {
  instrument: HomeInstrumentContent;
  problems: HomeProblemsContent;
  servicesSection: HomeServicesSectionContent;
  impact: HomeImpactContent;
  proof: HomeProofContent;
  process: HomeProcessContent;
  founderSection: HomeFounderSectionContent;
  cta: HomeCtaContent;
  readout: HomeReadoutContent;
};
