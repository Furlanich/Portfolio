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
    heading: 'When manual work starts holding the business back',
    introduction:
      'A digital solution makes sense when it reduces repetitive work, prevents errors, or helps you serve customers better. These are some of the problems FURLANICH can help you solve.',
    situations: [
      {
        title: 'Scattered orders and bookings',
        description:
          'Enquiries spread across messages, calls, spreadsheets, and notes that are difficult to keep up to date.',
      },
      {
        title: 'Processes that take too much time',
        description:
          'Administrative or customer-service work that could be connected, simplified, or automated.',
      },
      {
        title: 'A web presence that does not support the business',
        description:
          'Sites that provide information but do not let customers book, buy, place an order, or start a request.',
      },
      {
        title: 'Software that is difficult to maintain',
        description:
          'Unstable or outdated systems without a clear technical direction.',
      },
    ],
    action: {
      label: 'See how we can help',
      routeId: 'services',
    },
  },
  servicesSection: {
    heading: 'Services for concrete business needs',
    introduction:
      'We do not force a generic platform. First we understand the process, then decide whether building, integrating, or modernizing is the right approach.',
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
  audiences: {
    heading: 'Built for businesses with real operations',
    audiences: [
      {
        title: 'Retailers and shops',
        description:
          'Catalogues, orders, enquiries, payments, and tools for organizing day-to-day operations.',
      },
      {
        title: 'Restaurants and food-service businesses',
        description:
          'Menus, orders, bookings, confirmations, and customer-service channels.',
      },
      {
        title: 'Transport and logistics',
        description:
          'Requests, coordination, tracking, and information for passengers or customers.',
      },
      {
        title: 'Professional services and consultancies',
        description:
          'Portals, automations, integrations, and technical capacity for projects or existing systems.',
      },
    ],
    closing:
      'If your sector is not listed, the starting point is still the same: understand the process, the problem, and the outcome you need.',
    action: {
      label: 'Tell us how your business works',
      routeId: 'contact',
    },
  },
  proof: {
    heading: 'Credibility without inflated claims',
    introduction:
      'FURLANICH only presents work when its context, status, and publication permission are clear. We do not turn prototypes into client stories or publish metrics without a verifiable source.',
    commitments: [
      {
        title: 'Direct accountability',
        description: 'Samuel retains technical responsibility for every FURLANICH project.',
      },
      {
        title: 'Verifiable claims',
        description:
          "A project's status, scope, and limitations are explained before it is used as evidence.",
      },
      {
        title: 'Confidentiality respected',
        description:
          'Client identities, screenshots, and results are published only with explicit permission.',
      },
    ],
    action: {
      label: "View Samuel's background",
      routeId: 'founder',
    },
  },
  process: {
    heading: 'From a concrete need to a maintainable solution',
    steps: [
      {
        title: 'Understand and diagnose',
        description:
          'We learn how the business works, what the problem is, who uses the process, and which constraints matter. If it is not yet clear what to build, we first clarify the need.',
      },
      {
        title: 'Define the scope',
        description:
          'We document objectives, deliverables, boundaries, risks, responsibilities, and a clear proposal for the work.',
      },
      {
        title: 'Build and validate',
        description:
          'We work through reviewable deliveries, testing, and validation so issues are found before production.',
      },
      {
        title: 'Launch and support',
        description:
          'We prepare the release, documentation, and agreed follow-up so the solution can be used and maintained.',
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
    biography:
      'FURLANICH is led by Samuel Furlanich, a full-stack software developer who completed his Computer Science studies at the University of Buenos Aires. Samuel retains direct technical responsibility for every project and brings in specialist collaborators when the scope requires them.',
    primaryAction: {
      label: "Let's talk about your project",
      routeId: 'contact',
    },
    secondaryAction: {
      label: 'Meet Samuel',
      routeId: 'founder',
    },
  },
  cta: {
    heading: 'Do you have a concrete need or a system that needs attention?',
    description:
      'Tell us briefly what you need to solve. Samuel will personally review your inquiry to determine whether it makes sense to continue with a conversation.',
    responseStatement:
      'Usual response time is within the same business day. In exceptional cases, it may take up to two business days.',
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
