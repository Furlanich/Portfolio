import type { Locale } from '@/lib/locales';

export type LegalSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export type LegalPageLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type LegalPageContent = {
  locale: Locale;
  heading: string;
  introduction?: string;
  scope?: string;
  updatedLabel?: string;
  updatedAt?: string;
  contentsLabel: string;
  sections: LegalSection[];
  links?: LegalPageLink[];
};

export type CommercialLegalDraft = {
  locale: Locale;
  routeId: 'privacy' | 'terms';
  title: string;
  publication: {
    status: 'nonpublishable';
    releaseGate: 'professional-review-and-factual-gates-open';
  };
  chrome: {
    contentsLabel: string;
    updateLabel: string;
    reciprocalLabel: string;
    reciprocalHref: string;
  };
  metadata?: {
    title: string;
    description: string;
  };
  sections: LegalSection[];
};
