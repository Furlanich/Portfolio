import type { ServicesPageContent } from '../../../../components/services/content-types';

export const servicesPageContent = {
  locale: 'en',
  routeId: 'services',
  introduction: {
    heading: 'Software for your business',
    description:
      'Websites, automation and integrations, and improvements to existing systems. You do not need a solution worked out to explore the options.',
    indexLabel: 'Jump to a service',
    indexItems: [
      { id: 'web', label: 'Websites and web applications' },
      { id: 'whatsapp', label: 'WhatsApp and integrations' },
      { id: 'consulting', label: 'Maintenance and consulting' },
    ],
  },
  services: [
    {
      id: 'web',
      heading: 'Websites and web applications',
      lead:
        'From presenting your business to managing orders, bookings or customer access. Scope depends on the process you need to support.',
      workHeading: 'Ways of working',
      work: [
        'Website or catalogue: present the offer.',
        'Orders or bookings: organize requests and integrate providers where feasible.',
        'Portal or application: provide access and manage a specific workflow.',
      ],
      startingHeading: 'Starting point',
      startingPoint:
        'Review content, user journeys and existing systems to agree what to build or integrate.',
      fitHeading: 'A good fit',
      fit:
        'An existing website tool or product may be enough. Custom development makes sense when the workflow needs something those options do not provide.',
      boundariesHeading: 'Service boundaries',
      boundaries:
        'Design, content, integrations, administration and testing are scoped for each project. Branding, content production, hosting, provider charges, mobile apps and maintenance are included only by agreement. Business results are not guaranteed.',
      evidenceHeading: 'Available evidence',
      evidence:
        'General Reservation System contains code for passenger transport reservations. Its current behavior is unverified and it is not presented as client work.',
      evidenceLink: {
        label: 'View the project and its limitations',
        slug: 'general-reservation-system',
      },
      action: {
        label: 'Contact options',
        routeId: 'contact',
      },
    },
    {
      id: 'whatsapp',
      heading: 'WhatsApp and integrations',
      lead:
        'Organize repeated questions, requests and notifications, with a person responsible when the workflow needs attention.',
      workHeading: 'Ways of working',
      work: [
        'A link opens a conversation.',
        'An automated flow organizes steps.',
        'A bot supports defined responses.',
        'An integration connects systems where the platform and providers allow it.',
      ],
      startingHeading: 'Starting point',
      startingPoint:
        'Review volume, data, exceptions and who handles each case.',
      fitHeading: 'A good fit',
      fit:
        'At low volume, a link or manual replies may be enough.',
      boundariesHeading: 'Service boundaries',
      boundaries:
        'Feasibility depends on WhatsApp/Meta policies, account and template approvals where required, providers, costs, data and available systems. FURLANICH does not control those approvals, availability, message delivery or price changes. Payments depend on the provider and do not necessarily happen inside WhatsApp.',
      evidenceHeading: 'Available evidence',
      evidence:
        'There is no public WhatsApp project to show yet.',
      action: {
        label: 'Contact options',
        routeId: 'contact',
      },
    },
    {
      id: 'consulting',
      heading: 'Improvements to existing systems',
      lead:
        'Investigate faults, connect tools and assess improvements before deciding on a rebuild.',
      workHeading: 'Ways of working',
      work: [
        'Fault diagnosis and fixes.',
        'Updates and integrations.',
        'Performance review and modernization planning.',
      ],
      startingHeading: 'Starting point',
      startingPoint:
        'Start with the system and authorized access.',
      fitHeading: 'A good fit',
      fit:
        'Diagnosis identifies options; improvements and ongoing support are agreed separately.',
      boundariesHeading: 'Service boundaries',
      boundaries:
        'Authorized access to code, environments, logs, documentation and people who know the system is needed. Rebuilds, new systems, on-call response, SLAs, certification, licenses, infrastructure and another provider’s work are not included by default.',
      evidenceHeading: 'Available evidence',
      evidence:
        'The approach draws on Samuel’s technical background. There is no authorized public intervention to show yet.',
      action: {
        label: 'Contact options',
        routeId: 'contact',
      },
    },
  ],
  principles: {
    heading: 'What you can expect from every service',
    introduction: 'The service changes; these working decisions do not.',
    workingHeading: 'Working agreement',
    workingAgreement:
      'Scope, deliverables, responsibilities, validation and handover are agreed before proceeding. Samuel retains technical responsibility, with maintainable implementation and proportionate documentation. Work depends on business participation and the necessary access. External costs, ownership, licenses and ongoing support are defined in the relevant agreement.',
  },
  commercialBoundaries: {
    heading: 'Commercial boundaries',
    description:
      'Price and timing are defined after the work has been understood and scoped. Nothing on this page guarantees a business metric, a fixed delivery date, continuous availability, or an outcome that depends on adoption, content, providers, or external systems.',
    items: [
      'Hosting, domains, licences, payment services, messaging, APIs, and third-party subscriptions are quoted or contracted separately unless expressly included.',
      'The client provides or authorizes the content, data, access, accounts, decisions, and validation required by the agreed scope.',
      'Post-delivery maintenance, scope changes, and ongoing support are separate agreements.',
      'A response target for commercial enquiries is not a support SLA. Any on-call coverage, priority, or service level requires a specific agreement.',
      'Final payment, acceptance, ownership, warranty, and liability terms belong in each proposal or contract and remain subject to commercial and legal review.',
    ],
  },
  aiNote: {
    heading: 'AI only where it adds value',
    description:
      'AI is not a fourth service and is not included by default. It may be one capability inside a tailored automation or system — for example, document processing, an AI-assisted internal workflow, or interpretation of a bounded request — only when it adds value and its providers, data, costs, limitations, evaluation, and human oversight are explicit.',
  },
  finalCta: {
    heading: 'Tell us what you need to solve',
    description: 'Explore the contact options and try the form demonstration.',
    action: {
      label: 'Start an enquiry',
      routeId: 'contact',
    },
  },
} satisfies ServicesPageContent;
