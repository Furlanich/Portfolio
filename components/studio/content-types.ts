import type { ActionLink } from '../foundation/content-types';
import type { ConnectedWordBinding } from '../../lib/connected-studio/types';
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
    primaryAction: ActionLink;
    secondaryAction: ActionLink;
  };
  /** The open chart caption beside the introduction plate (PAGE-STUDIO, "Studio graph caption"). */
  sceneCaption: string;
  /** Four decorative graph words bound to n0, n4, n8 and n12 in this order. They carry no meaning of their own. */
  wordBindings: readonly ConnectedWordBinding[];
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
