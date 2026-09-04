import type { ContactContent } from '../../../../components/foundation/content-types';

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
    {
      label: 'Write on WhatsApp',
      kind: 'whatsapp',
      href: 'https://wa.me/5491150117565',
    },
    {
      label: 'Send an email',
      kind: 'email',
      href: 'mailto:samuelfurlanich@gmail.com',
    },
    {
      label: 'Call',
      kind: 'phone',
      href: 'tel:+5491150117565',
    },
  ],
} satisfies ContactContent;
