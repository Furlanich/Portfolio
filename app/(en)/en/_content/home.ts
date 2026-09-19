import type { HomePageContent } from '../../../../components/homepage/content-types';

export const homeContent = {
  locale: 'en',
  routeId: 'home',
  eyebrow: 'Custom software development for small and medium-sized businesses',
  heading: 'Practical software to help you sell, serve customers, and run your business better.',
  description:
    'FURLANICH designs and builds business websites and web applications, WhatsApp automations and integrations, and improvements to existing systems for organizations with concrete needs.',
  primaryAction: {
    label: 'Tell us about your project',
    routeId: 'contact',
  },
  secondaryAction: {
    label: 'View services',
    routeId: 'services',
  },
  trustLine: 'Direct technical contact · Buenos Aires, Argentina · Projects in Spanish and English',
  availability: 'Available for projects across Argentina and internationally.',
  problems: {
    heading: 'When work is spread across tools',
    introduction: 'When work is spread across tools',
    audienceStatement:
      'For small and medium-sized businesses managing orders, bookings or customer service, or improving an existing system.',
    situations: [
      'Orders and bookings reorganized by hand.',
      'Repeated questions that interrupt work.',
      'Systems that do not share information or need improvement.',
    ],
    action: {
      label: 'See how we can help',
      routeId: 'services',
    },
  },
  servicesSection: {
    heading: 'Services for concrete business needs',
    introduction: 'Build, connect or improve, depending on the problem.',
    services: [
      {
        title: 'Business websites and web applications',
        description:
          'Web solutions that help businesses present, sell, or manage services: professional websites, catalogues, ordering, bookings, customer portals, and payment integrations.',
      },
      {
        title: 'WhatsApp automation and integrations',
        description:
          'Flows for answering common questions, capturing orders, managing bookings, sending confirmations, and connecting WhatsApp with other business tools.',
      },
      {
        title: 'Software maintenance and IT consulting',
        description:
          'Diagnosis and improvement of existing systems to solve problems, reduce risk, and define a maintainable technical path.',
      },
    ],
    action: {
      label: 'View all services',
      routeId: 'services',
    },
  },
  proof: {
    heading: 'Clear technical accountability',
    introduction:
      'Samuel is involved in defining the problem, technical decisions and review of the work. Scope and validation are agreed around each need.',
    action: {
      label: 'Explore projects and their limitations',
      routeId: 'projects',
    },
  },
  process: {
    heading: 'How we work',
    steps: [
      {
        title: 'Understand',
        description: 'Review the process and the problem.',
      },
      {
        title: 'Define',
        description: 'Agree scope, responsibilities and deliverables.',
      },
      {
        title: 'Build and review',
        description: 'Check important user journeys.',
      },
      {
        title: 'Hand over',
        description: 'Document use and agree next steps.',
      },
    ],
    qualityStatement:
      'Before a production release, each delivery goes through technical review, functional testing, and validation of its main user journeys. The exact controls depend on the type of solution and its level of risk.',
    action: {
      label: 'Start an inquiry',
      routeId: 'contact',
    },
  },
  founderSection: {
    heading: 'Direct technical responsibility',
    biography: 'Samuel Furlanich leads FURLANICH. Explore his experience and background.',
    action: {
      label: 'Meet Samuel',
      routeId: 'founder',
    },
  },
  cta: {
    heading: 'Do you have a concrete need or a system that needs attention?',
    description:
      'Tell us briefly what you need to solve. Samuel will personally review your inquiry to determine whether it makes sense to continue with a conversation.',
    demoStatement: 'Explore the contact options and try the demonstration form. The form does not send inquiries.',
    primaryAction: {
      label: 'Tell us about your project',
      routeId: 'contact',
    },
    secondaryAction: {
      label: 'Write on WhatsApp',
      kind: 'whatsapp',
      href: 'https://wa.me/5491150117565',
    },
  },
} satisfies HomePageContent;
