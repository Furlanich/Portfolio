import type { ContactAction, ContactContent } from '@/components/foundation/content-types';
import type { ConnectedWordBinding } from '@/lib/connected-studio/types';
import type { InquiryField, InquiryValidationCode } from '@/lib/inquiry/contracts';

export type ContactFieldContent = {
  name: InquiryField;
  label: string;
  requiredLabel: string;
  required: boolean;
  /** Native maxlength uses UTF-16 units; validateInquiry remains the code-point boundary. */
  maxLength: number;
  autocomplete: string;
  inputType: 'text' | 'email' | 'textarea';
  helper: string;
  errors: Partial<Record<InquiryValidationCode, string>>;
};

type ContactFormBaseContent = {
  heading: string;
  introduction: string;
  requiredNote: string;
  fields: ContactFieldContent[];
  privacyContext: string;
  privacyLabel: string;
  submit: string;
  submitting: string;
  success: { heading: string; body: string };
  retry: string;
};

type ContactAlternativesContent = {
  heading: string;
  note: string;
  actions: ContactAction[];
};

type ContactPageBaseContent = ContactContent & {
  wordBindings: readonly ConnectedWordBinding[];
};

export type DemonstrationContactPageContent = ContactPageBaseContent & {
  mode: 'demonstration';
  form: ContactFormBaseContent & {
    failure: { heading: string; body: string };
  };
  alternatives: ContactAlternativesContent;
};

export type CommercialContactPageContent = ContactPageBaseContent & {
  mode: 'commercial';
  preHydrationFallback: string;
  termsLabel: string;
  form: ContactFormBaseContent & {
    outcomes: {
      uncertain: { heading: string; body: string };
      rateLimited: { heading: string; body: string };
      unavailable: { heading: string; body: string };
    };
  };
  alternatives: ContactAlternativesContent;
};

export type ContactPageContent = DemonstrationContactPageContent | CommercialContactPageContent;

/** Selects the page-owned copy to match the frozen application release record. */
export function selectContactPageContent(
  mode: ContactPageContent['mode'],
  demonstration: DemonstrationContactPageContent,
  commercial: CommercialContactPageContent,
): ContactPageContent {
  const selected = mode === 'commercial' ? commercial : demonstration;
  if (selected.mode !== mode) {
    throw new Error(`Contact content must be mode-matched to ${mode}.`);
  }
  return selected;
}
