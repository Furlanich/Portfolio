import type { ContactAction, ContactContent } from '@/components/foundation/content-types';
import type { InquiryField, InquiryValidationCode } from '@/lib/inquiry/contracts';

export type ContactFieldContent = {
  name: InquiryField;
  label: string;
  requiredLabel: string;
  required: boolean;
  maxLength: number;
  autocomplete: string;
  inputType: 'text' | 'email' | 'textarea';
  helper: string;
  errors: Partial<Record<InquiryValidationCode, string>>;
};

export type ContactPageContent = ContactContent & {
  notice: {
    heading: string;
    body: string;
    failureHelper: string;
  };
  form: {
    heading: string;
    introduction: string;
    requiredNote: string;
    fields: ContactFieldContent[];
    privacyContext: string;
    privacyLabel: string;
    submit: string;
    submitting: string;
    success: { heading: string; body: string };
    failure: { heading: string; body: string };
    retry: string;
  };
  alternatives: {
    heading: string;
    note: string;
    actions: ContactAction[];
  };
};
