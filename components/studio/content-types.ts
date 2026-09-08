import type { ActionLink } from '../foundation/content-types';
import type { Locale } from '../../lib/locales';

export type StudioTextItem = {
  title: string;
  description: string;
};

export type StudioPageContent = {
  locale: Locale;
  routeId: 'studio';
  intro: {
    eyebrow: string;
    heading: string;
    positioning: string;
    supportingStatement: string;
    primaryAction: ActionLink;
    secondaryAction: ActionLink;
  };
  operatingModel: {
    label: string;
    items: string[];
  };
  accountability: {
    heading: string;
    paragraphs: string[];
  };
  collaboratorModel: {
    heading: string;
    paragraphs: string[];
  };
  principles: {
    heading: string;
    introduction: string;
    items: [StudioTextItem, StudioTextItem, StudioTextItem, StudioTextItem];
  };
  location: {
    heading: string;
    description: string;
  };
  founderBridge: {
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