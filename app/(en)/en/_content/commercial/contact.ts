import type { ContactPageContent } from '../../../../../components/contact/content-types';

export const commercialContactContent = {
  mode: 'commercial',
  locale: 'en',
  routeId: 'contact',
  wordBindings: [
    { nodeId: 'n0', word: 'Context' },
    { nodeId: 'n5', word: 'Inquiry' },
    { nodeId: 'n10', word: 'Conversation' },
  ],
  heading: 'Tell us what you need to solve.',
  introduction:
    'Samuel personally reviews every inquiry to determine whether it makes sense to continue with a conversation.',
  responseExpectation:
    'Usual response time is within the same business day. In exceptional cases, it may take up to two business days.',
  location: 'Buenos Aires, Argentina',
  actions: [
    { label: 'Write on WhatsApp', kind: 'whatsapp', href: 'https://wa.me/5491150117565' },
    { label: 'Send an email', kind: 'email', href: 'mailto:samuelfurlanich@gmail.com' },
    { label: 'Call', kind: 'phone', href: 'tel:+5491150117565' },
  ],
  founderContextAction: { label: "View Samuel's background", routeId: 'founder' },
  preHydrationFallback:
    'Enable JavaScript to submit the form. You can also contact us on WhatsApp, by email or by phone.',
  termsLabel: 'Terms and Conditions',
  form: {
    heading: 'Start an inquiry',
    introduction: 'Share your details and briefly explain the problem, how it works today, and what you would like to improve.',
    requiredNote: 'Fields marked as required must be completed.',
    fields: [
      { name: 'name', label: 'Name', requiredLabel: 'Required', required: true, maxLength: 200, autocomplete: 'name', inputType: 'text', helper: '', errors: { required: 'Enter your name.', 'max-length': 'Name must be 100 characters or fewer.' } },
      { name: 'email', label: 'Email', requiredLabel: 'Required', required: true, maxLength: 508, autocomplete: 'email', inputType: 'email', helper: 'We will use it only to respond to this inquiry.', errors: { required: 'Enter your email address.', 'invalid-email': 'Enter a valid email address.', 'max-length': 'Email must be 254 characters or fewer.' } },
      { name: 'company', label: 'Company', requiredLabel: 'Optional', required: false, maxLength: 240, autocomplete: 'organization', inputType: 'text', helper: '', errors: { 'max-length': 'Company must be 120 characters or fewer.' } },
      { name: 'message', label: 'What do you need to solve?', requiredLabel: 'Required', required: true, maxLength: 8000, autocomplete: 'off', inputType: 'textarea', helper: 'Do not include passwords, credentials, or sensitive information.', errors: { required: 'Tell us what you need to solve.', 'max-length': 'Your message must be 4,000 characters or fewer.', 'request-too-large': 'This inquiry is too large to send. Shorten the message and try again.' } },
    ],
    privacyContext: 'We will use your information to review and respond to your inquiry. Before sending, read how we handle it in our Privacy Policy.',
    privacyLabel: 'Privacy Policy',
    submit: 'Send inquiry',
    submitting: 'Sending...',
    success: {
      heading: 'Message accepted.',
      body: 'Your inquiry was accepted for sending. If you need to confirm Samuel received it, use a direct contact option.',
    },
    outcomes: {
      uncertain: {
        heading: "We couldn't confirm your submission.",
        body: 'Your information is still in the form. You can try again or contact us on WhatsApp. If the first submission was received, retrying may create another copy of your inquiry.',
      },
      rateLimited: {
        heading: 'Submissions are temporarily limited.',
        body: 'Your information is still in the form. Try later or contact us on WhatsApp.',
      },
      unavailable: {
        heading: 'The form is unavailable.',
        body: 'You can contact us on WhatsApp, by email or by phone. The information you entered remains on this page.',
      },
    },
    retry: 'Try again',
  },
  alternatives: {
    heading: 'Prefer another way to get in touch?',
    note: 'WhatsApp, email and phone are independent channels. Form information is not copied into those links.',
    actions: [
      { label: 'Write on WhatsApp', kind: 'whatsapp', href: 'https://wa.me/5491150117565' },
      { label: 'Send an email', kind: 'email', href: 'mailto:samuelfurlanich@gmail.com' },
      { label: 'Call', kind: 'phone', href: 'tel:+5491150117565' },
    ],
  },
} satisfies ContactPageContent;
