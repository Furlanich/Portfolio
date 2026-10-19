import type { ContactPageContent } from '../../../../components/contact/content-types';

export const contactContent = {
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
  channels: {
    heading: "Let's talk about your project.",
    note: 'Write to us on WhatsApp or by email, or give us a call. Briefly describe what you need to solve, how it works today, and what you would like to improve.',
    privacyContext: 'The link opens your chosen contact channel. You decide what information to share.',
  },
  privacyLabel: 'How we handle your information',
} satisfies ContactPageContent;
