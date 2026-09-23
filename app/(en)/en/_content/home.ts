import type { HomePageContent } from '../../../../components/homepage/content-types';

export const homeContent = {
  locale: 'en',
  routeId: 'home',
  eyebrow: 'Custom software studio',
  heading: 'Connect your systems. Simplify everyday work.',
  description:
    'Websites, web applications, WhatsApp automation and integrations for orders, bookings and everyday tasks. We also improve existing systems.',
  primaryAction: {
    label: 'Contact options',
    routeId: 'contact',
  },
  secondaryAction: {
    label: 'Explore services',
    routeId: 'services',
  },
  trustLine: 'Samuel Furlanich, the studio’s technical lead.',
  availability: 'Based in Buenos Aires, Argentina. Available in Spanish and English for work in Argentina and internationally.',
  instrument: {
    label: 'FURLANICH · From process to system',
    statusLabel: 'PHASE {current} OF 04',
    pauseLabel: 'Pause motion',
    resumeLabel: 'Resume motion',
    chapters: [
      {
        id: 'recognition',
        sequence: '01',
        heading: 'Recognize the real system',
        description:
          'Orders, bookings, messages, and tasks already coexist in one business. The first step is understanding how they relate.',
        artworkId: 'recognition-poster',
      },
      {
        id: 'fragmentation',
        sequence: '02',
        heading: 'See where it fragments',
        description:
          'When information changes channels and is repeated, operations depend on more manual checks.',
        artworkId: 'fragmentation-poster',
      },
      {
        id: 'connection',
        sequence: '03',
        heading: 'Connect what matters',
        description:
          'A well-defined solution brings data, rules, and actions together without adding unnecessary complexity.',
        artworkId: 'connection-poster',
      },
      {
        id: 'coordination',
        sequence: '04',
        heading: 'Coordinate the work',
        description:
          'The system supports the real process and creates a foundation that can be maintained and adapted as the business changes.',
        artworkId: 'coordination-poster',
      },
    ],
  },
  problems: {
    heading: 'When manual work starts holding the business back',
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
    demoStatement: 'Explore the contact options and try the demonstration form. The form does not send inquiries.',
    primaryAction: {
      label: 'Contact options',
      routeId: 'contact',
    },
    secondaryAction: {
      label: 'Write on WhatsApp',
      kind: 'whatsapp',
      href: 'https://wa.me/5491150117565',
    },
  },
} satisfies HomePageContent;
