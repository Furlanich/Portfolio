import type { ContactPageContent } from '../../../../components/contact/content-types';

export const contactContent = {
  locale: 'en',
  routeId: 'contact',
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
  notice: {
    heading: 'Interactive demonstration',
    body: 'This site is a technical showcase. The form simulates submission in this browser: it sends no data, creates no commercial inquiry, and reaches no inbox.',
    failureHelper: 'To try the failure state, use failure@example.invalid as the email address.',
  },
  form: {
    heading: 'Start an inquiry',
    introduction: 'Share your details and briefly explain the problem, how it works today, and what you would like to improve.',
    requiredNote: 'Fields marked as required must be completed.',
    fields: [
      { name: 'name', label: 'Name', requiredLabel: 'Required', required: true, maxLength: 100, autocomplete: 'name', inputType: 'text', helper: '', errors: { required: 'Enter your name.', 'max-length': 'Name must be 100 characters or fewer.' } },
      { name: 'email', label: 'Email', requiredLabel: 'Required', required: true, maxLength: 254, autocomplete: 'email', inputType: 'email', helper: 'We will use it only to respond to this inquiry.', errors: { required: 'Enter your email address.', 'invalid-email': 'Enter a valid email address.', 'max-length': 'Email must be 254 characters or fewer.' } },
      { name: 'company', label: 'Company', requiredLabel: 'Optional', required: false, maxLength: 120, autocomplete: 'organization', inputType: 'text', helper: '', errors: { 'max-length': 'Company must be 120 characters or fewer.' } },
      { name: 'message', label: 'What do you need to solve?', requiredLabel: 'Required', required: true, maxLength: 4000, autocomplete: 'off', inputType: 'textarea', helper: 'Do not include passwords, credentials, or sensitive information.', errors: { required: 'Tell us what you need to solve.', 'max-length': 'Your message must be 4,000 characters or fewer.' } },
    ],
    privacyContext: 'We will use your information to review and respond to your inquiry. Before sending, read how we handle it in our Privacy Policy.',
    privacyLabel: 'Privacy Policy',
    submit: 'Simulate submission',
    submitting: 'Simulating…',
    success: { heading: 'Demonstration complete.', body: 'Demonstration complete. No data was sent and no commercial inquiry was created.' },
    failure: { heading: 'The simulation could not be completed.', body: 'The simulation could not be completed. No data was sent. Your values remain available on this page so you can correct them or try again.' },
    retry: 'Try again',
  },
  alternatives: {
    heading: 'Prefer another way to get in touch?',
    note: 'WhatsApp, email, and phone are shown as functional alternatives. Using one leaves this simulation and opens an external service; the form values are not copied there.',
    actions: [
      { label: 'Write on WhatsApp', kind: 'whatsapp', href: 'https://wa.me/5491150117565' },
      { label: 'Send an email', kind: 'email', href: 'mailto:samuelfurlanich@gmail.com' },
      { label: 'Call', kind: 'phone', href: 'tel:+5491150117565' },
    ],
  },
} satisfies ContactPageContent;
