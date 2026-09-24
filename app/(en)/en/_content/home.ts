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
    plateLabel: 'Plate {current}/04',
    coordinates: '34°36’S · 58°22’W',
    pauseLabel: 'Pause motion',
    resumeLabel: 'Resume motion',
    chapters: [
      {
        id: 'recognition',
        sequence: '01',
        kicker: 'Recognize',
        heading: 'Recognize the real system',
        description:
          'Orders, bookings, messages, and tasks already coexist in one business. The first step is understanding how they relate.',
        artworkId: 'recognition-poster',
      },
      {
        id: 'fragmentation',
        sequence: '02',
        kicker: 'Fragment',
        heading: 'See where it fragments',
        description:
          'When information changes channels and is repeated, operations depend on more manual checks.',
        artworkId: 'fragmentation-poster',
      },
      {
        id: 'connection',
        sequence: '03',
        kicker: 'Connect',
        heading: 'Connect what matters',
        description:
          'A well-defined solution brings data, rules, and actions together without adding unnecessary complexity.',
        artworkId: 'connection-poster',
      },
      {
        id: 'coordination',
        sequence: '04',
        kicker: 'Coordinate',
        heading: 'Coordinate the work',
        description:
          'The system supports the real process and creates a foundation that can be maintained and adapted as the business changes.',
        artworkId: 'coordination-poster',
      },
    ],
    nodes: {
      orders: 'Orders',
      bookings: 'Bookings',
      messages: 'Messages',
      tasks: 'Tasks',
      understand: 'Understand',
      process: 'Process',
      constraints: 'Constraints',
      diagnosis: 'Diagnosis',
      define: 'Define',
      scope: 'Scope',
      responsibilities: 'Responsibilities',
      'validation-criteria': 'Validation criteria',
      'build-review': 'Build & review',
      integrate: 'Integrate',
      'technical-review': 'Technical review',
      'functional-tests': 'Functional tests',
      'hand-over': 'Hand over',
      documentation: 'Documentation',
      'journeys-validated': 'Journeys validated',
      maintain: 'Maintain',
    },
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
    kicker: 'Services',
    heading: 'Services for concrete business needs',
    introduction: 'Build, connect or improve, depending on the problem.',
    services: [
      {
        title: 'Business websites and web applications',
        description:
          'Web solutions that help businesses present, sell, or manage services: professional websites, catalogues, ordering, bookings, customer portals, and payment integrations.',
        category: 'Build',
      },
      {
        title: 'WhatsApp automation and integrations',
        description:
          'Flows for answering common questions, capturing orders, managing bookings, sending confirmations, and connecting WhatsApp with other business tools.',
        category: 'Connect',
      },
      {
        title: 'Software maintenance and IT consulting',
        description:
          'Diagnosis and improvement of existing systems to solve problems, reduce risk, and define a maintainable technical path.',
        category: 'Improve',
      },
    ],
    action: {
      label: 'View all services',
      routeId: 'services',
    },
  },
  impact: {
    kicker: 'Position fix',
    heading: 'Fewer places to check before you know where an order stands',
    introduction:
      'An illustrative scenario, not a client result. A navigator fixes a position from several bearings; when the sources disagree, the fix becomes an area of doubt.',
    illustrativeTag: 'Illustrative scenario',
    toggle: {
      groupLabel: 'Scenario',
      separateLabel: 'Separate sources',
      connectedLabel: 'Connected record',
      announcement: 'Showing: {state}',
    },
    figure: {
      title: 'Where one order stands, according to its sources',
      separateDescription:
        'Five bearings from a WhatsApp thread, a paper order book, a spreadsheet, an email and a phone call cross in different places, leaving an area of doubt.',
      connectedDescription: 'Every source reads one connected record, so all bearings meet at one exact point.',
      doubtLabel: 'Area of doubt',
      fixLabel: 'Exact fix',
    },
    sources: [
      { id: 'whatsapp', name: 'WhatsApp thread', note: '“Confirmed” in the chat' },
      { id: 'book', name: 'Paper order book', note: 'Written down, not yet paid' },
      { id: 'spreadsheet', name: 'Spreadsheet', note: 'Updated yesterday evening' },
      { id: 'email', name: 'Email', note: 'Customer asked to change the date' },
      { id: 'call', name: 'Phone call', note: 'Promised for Friday' },
    ],
    connectedNoteTemplate: '{source}: reads the connected record',
    counts: {
      title: 'Places checked to confirm one order',
      separateLabel: 'Separate sources',
      connectedLabel: 'Connected record',
      caption:
        'Counts come from this example: a WhatsApp thread, a paper order book, a spreadsheet, an email and a phone call. They are not measurements.',
    },
  },
  proof: {
    kicker: 'Accountability',
    heading: 'Clear technical accountability',
    introduction:
      'Samuel is involved in defining the problem, technical decisions and review of the work. Scope and validation are agreed around each need.',
    logLabel: 'Where accountability applies',
    log: [
      { term: 'Define', text: 'Problem and scope agreed' },
      { term: 'Decide', text: 'Technical decisions led by Samuel' },
      { term: 'Review', text: 'Work reviewed before handover' },
    ],
    action: {
      label: 'Explore projects and their limitations',
      routeId: 'projects',
    },
  },
  process: {
    kicker: 'Process',
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
    kicker: 'Founder',
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
  readout: {
    home: 'Home',
    problems: 'Problems',
    services: 'Services',
    impact: 'Position fix',
    proof: 'Accountability',
    process: 'Process',
    founder: 'Founder',
    contact: 'Contact',
  },
} satisfies HomePageContent;
