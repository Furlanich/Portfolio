import type { ServicesContent } from '../../../../components/foundation/content-types';

export const servicesContent = {
  locale: 'en',
  routeId: 'services',
  heading: 'Services for concrete business needs',
  introduction:
    'We do not force a generic platform. First we understand the process, then decide whether building, integrating, or modernizing is the right approach.',
  services: [
    {
      title: 'Business websites and web applications',
      summary:
        'Web solutions that help businesses present, sell, or manage services: professional websites, catalogues, ordering, bookings, customer portals, and payment integrations.',
    },
    {
      title: 'WhatsApp automation and integrations',
      summary:
        'Flows for answering common questions, capturing orders, managing bookings, sending confirmations, and connecting WhatsApp with other business tools.',
    },
    {
      title: 'Software maintenance and IT consulting',
      summary:
        'Diagnosis and improvement of existing systems to solve problems, reduce risk, and define a maintainable technical path.',
    },
  ],
  action: {
    label: 'Tell us what you need to solve',
    routeId: 'contact',
  },
} satisfies ServicesContent;
