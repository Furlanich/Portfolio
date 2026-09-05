import type { ServicesContent } from '../../../../components/foundation/content-types';
import type { ServicesPageContent } from '../../../../components/services/content-types';

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

export const servicesPageContent = {
  locale: 'en',
  routeId: 'services',
  introduction: {
    heading: 'Services for concrete business needs',
    description:
      'FURLANICH designs web solutions, automations, and integrations, and improves existing systems. We do not begin with a technology or a fixed package. We begin by understanding what is holding the operation back, the outcome you need, and whether it makes more sense to build, integrate, or modernize.',
    qualification:
      'You do not need to arrive with the solution already defined. An initial conversation can clarify the problem and identify the most sensible path.',
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
      eyebrow: 'SERVICE-WEB',
      heading: 'Business websites and web applications',
      situation:
        'Your business needs something more useful than a generic web presence: a better way to present its offer, receive orders or bookings, take payments, give customers access, or move a process out of messages, spreadsheets, and manual work.',
      situationsHeading: 'Common situations',
      situations: [
        'The current site is outdated, does not explain the offer clearly, or makes it difficult to enquire.',
        'Orders, appointments, or bookings arrive through several channels and have to be reorganized by hand.',
        'Customers or staff need to check information, complete requests, or follow progress without relying on an individual conversation.',
        'A business-specific process does not fit a generic tool well.',
      ],
      outcomeHeading: 'The outcome we work towards',
      outcome:
        'A clear, maintainable web experience that helps the business present, sell, or manage a specific process. The result may range from a professional commercial site to a custom operational application; those engagements do not have the same scope, risk, or investment.',
      levelsHeading: 'Different levels of web work',
      levels: [
        {
          title: 'Commercial website or catalogue',
          description:
            'Communicates the offer, organizes content or products, and makes the visitor\'s next step clear.',
        },
        {
          title: 'Ordering, booking, or payment flow',
          description:
            'Lets someone start or complete a transaction and may connect to calendars, payment providers, or other tools.',
        },
        {
          title: 'Custom portal or web application',
          description:
            'Adds access control, statuses, business rules, administration, and integrations for a specific operation.',
        },
      ],
      levelsNote:
        'These categories help frame the conversation. They are not fixed packages or mandatory tiers.',
      examplesHeading: 'Representative examples',
      examples: [
        'A professional site for a service business with well-directed enquiries.',
        'A catalogue that sends orders to an agreed channel or records them in a system.',
        'An appointment or booking flow with availability, confirmations, and administration.',
        'A portal where customers can view documents, requests, or statuses.',
        'A web application for an internal or commercial workflow that standard software does not handle well.',
      ],
      engagementHeading: 'An engagement may include',
      engagement: [
        'diagnosing the objective, users, and process;',
        'defining content, journeys, and functional scope;',
        'designing and building the agreed web experience;',
        'integrating payments, calendars, email, APIs, or existing systems where feasible;',
        'testing, preparing for launch, and delivering the agreed documentation.',
      ],
      boundariesHeading: 'Not automatically included',
      boundaries: [
        'brand identity, copywriting, photography, bulk data entry, or content production;',
        'hosting, domains, email, licences, or third-party charges;',
        'an admin area, mobile app, or integration that is not in scope;',
        'ongoing maintenance after delivery;',
        'guaranteed commercial results, search rankings, or uninterrupted availability.',
      ],
      dependenciesHeading: 'External dependencies',
      dependencies:
        'Feasibility may depend on hosting, domains, payment providers, APIs, calendars, existing systems, and client access. Each provider sets its own terms, costs, availability, and limits. The proposal must state what FURLANICH integrates, what the client contracts or manages, and which assumptions still need validation.',
      fitHeading: 'A good fit',
      fit:
        'This is a good fit when there is a concrete commercial or operational need, responsible people are available to validate the process, and there is a clear reason to adapt the solution to the business.',
      nonFitHeading: 'When another option may be better',
      nonFit:
        'If a website builder, online store, booking tool, or existing product solves the need well with less cost and risk, FURLANICH may recommend configuring or integrating it instead of building from scratch. If the main issue is stabilizing an existing system, Software maintenance and IT consulting is the more relevant starting point.',
      evidenceHeading: 'Available evidence',
      evidence:
        'The repository contains a general reservation system published by Samuel as implementation evidence. Its functional demonstration, limitations, and commercial presentation are still under review, so it is not presented as client work, a production solution, or a verified outcome.',
      action: {
        label: 'Tell us what you need to solve on the web',
        routeId: 'contact',
      },
    },
    {
      id: 'whatsapp',
      eyebrow: 'SERVICE-WHATSAPP',
      heading: 'WhatsApp automation and integrations',
      situation:
        'WhatsApp is already part of customer service, but many questions repeat, orders or bookings become difficult to track across conversations, and information has to be copied into another tool afterwards.',
      situationsHeading: 'Common situations',
      situations: [
        'The team answers the same questions and asks for the same details repeatedly.',
        'Orders, bookings, or confirmations get lost among chats or depend on one person.',
        'The business needs to send updates or statuses without handling every conversation manually.',
        'WhatsApp should start or retrieve an operation recorded in another business tool.',
      ],
      outcomeHeading: 'The outcome we work towards',
      outcome:
        'A clear conversational journey that reduces repetitive work, captures the information the process needs, and connects the channel to a useful workflow. Automation does not mean removing people from every interaction: the design must make clear when the system responds, when it hands over, and what happens when it cannot continue.',
      levelsHeading: 'Possible levels of scope',
      levels: [
        {
          title: 'Basic contact',
          description:
            'A link starts a conversation; using WhatsApp alone does not create automation or integration.',
        },
        {
          title: 'Automated workflow',
          description:
            'Replies, guided questions, data capture, confirmations, or notifications within the platform\'s permitted capabilities.',
        },
        {
          title: 'Bot-assisted interaction',
          description:
            'Conversational logic helps interpret or resolve a bounded request and hands over when appropriate.',
        },
        {
          title: 'Official integration',
          description:
            'An API or authorized provider connects WhatsApp to calendars, orders, externally initiated payments, CRM, or other systems once feasibility is confirmed.',
        },
      ],
      examplesHeading: 'Representative examples',
      examples: [
        'Answering common questions and handing special cases to a person.',
        'Capturing the initial details for an order or booking.',
        'Sending confirmations, reminders, or status updates when applicable rules permit it.',
        'Starting a payment through an external link or flow.',
        'Looking up or recording information in an existing system.',
      ],
      engagementHeading: 'An engagement may include',
      engagement: [
        'analysing conversations, exceptions, and handover points;',
        'designing the flow, messages, and required data;',
        'configuring or building the agreed automation;',
        'integrating an official provider and client systems where feasible;',
        'testing journeys, errors, human handover, and the initial operational follow-through.',
      ],
      boundariesHeading: 'Not automatically included',
      boundaries: [
        'unlimited access to WhatsApp features or independence from Meta or the provider;',
        'approval of accounts, numbers, templates, categories, or messages;',
        'conversation, provider, infrastructure, AI, or other third-party fees;',
        'a complete CRM, ordering system, booking platform, or back office;',
        'human customer service, daily channel operation, or permanent support availability;',
        'guaranteed sales results, response times, or message delivery.',
      ],
      dependenciesHeading: 'External dependencies',
      dependencies:
        'Actual capabilities depend on current WhatsApp and Meta policies, approved templates where applicable, the selected provider, third-party fees, data quality, client systems, and the feasibility of each integration. These conditions are validated before scope is finalized; FURLANICH does not control their approval, continuity, or changes.',
      fitHeading: 'A good fit',
      fit:
        'This is a good fit when the workflow is repeatable, the required data is understood, the volume or friction justifies automation, and someone remains responsible for exceptions and day-to-day operation.',
      nonFitHeading: 'When another option may be better',
      nonFit:
        'A direct link or manual replies may be enough at low volume. A native feature in the current system may be better than a new integration. If the process itself is unstable, it should be clarified first; automating disorder usually moves the problem rather than solving it.',
      evidenceHeading: 'Available evidence',
      evidence:
        'There is currently no public WhatsApp automation project that meets FURLANICH\'s verification and publication requirements. The offer is presented through its scope and limitations, not through a case study, certification, or outcome the repository cannot support.',
      action: {
        label: 'Discuss your WhatsApp workflow',
        routeId: 'contact',
      },
    },
    {
      id: 'consulting',
      eyebrow: 'SERVICE-CONSULTING',
      heading: 'Software maintenance and IT consulting',
      situation:
        'A system already exists, but it is failing, outdated, difficult to change, performing poorly, or dependent on technical decisions no one can explain clearly. Before replacing it, you need to understand what is happening, what is at risk, and what is worth doing.',
      situationsHeading: 'Common situations',
      situations: [
        'A defect keeps returning or its cause is unknown.',
        'A framework, dependency, or platform update has been postponed and now blocks other changes.',
        'The system has become slow, unstable, or difficult to deploy and maintain.',
        'An integration has stopped working, or the system needs to connect to another tool.',
        'Technical debt, missing documentation, or uncertainty makes it hard to choose between repair, modernization, and replacement.',
      ],
      outcomeHeading: 'The outcome we work towards',
      outcome:
        'A clear diagnosis and an improvement proportionate to the problem: stabilize what matters, reduce risk, restore the ability to change the system, or define a modernization path. Consulting may end with recommendations, an agreed technical intervention, or separately contracted continuity.',
      levels: [],
      examplesHeading: 'Representative examples',
      examples: [
        'Investigating and fixing reproducible defects.',
        'Stabilizing a system or delivery process.',
        'Updating dependencies, frameworks, or platforms.',
        'Improving performance, reliability, testing, or deployment.',
        'Integrating APIs, services, or data sources.',
        'Reviewing architecture and technical debt.',
        'Planning modernization in stages.',
        'Providing ongoing maintenance or technical support under a specific agreement.',
      ],
      engagementHeading: 'An engagement may include',
      engagement: [
        'gathering symptoms, context, code, logs, and available environment information;',
        'reproducing and prioritizing problems;',
        'reviewing architecture, dependencies, risks, and maintainability;',
        'preparing a stabilization or modernization plan with alternatives and trade-offs;',
        'implementing and validating the fixes or improvements included in scope;',
        'providing the agreed documentation, handover, and continuity.',
      ],
      boundariesHeading: 'Not automatically included',
      boundaries: [
        'rebuilding the entire system or developing a new one;',
        'fixing issues that cannot be observed because access or evidence is unavailable;',
        'on-call support, incident response, or a service-level agreement (SLA);',
        'legal audit, security certification, or a guarantee that the system has no defects;',
        'licences, infrastructure, third-party services, or work owned by other providers;',
        'maintenance after the agreed intervention.',
      ],
      dependenciesHeading: 'External dependencies',
      dependencies:
        'Diagnosis depends on authorized access to code, documentation, logs, environments, appropriate data, and people who understand the operation. Third-party systems, licences, unsupported versions, providers, infrastructure, and contractual restrictions may limit the available options. Access, backups, environments, and responsibilities are agreed before intervention.',
      fitHeading: 'A good fit',
      fit:
        'This is a good fit when there is an identifiable existing system, legitimate access is sufficient to investigate it, and the business needs to restore stability, capacity for change, or a clear technical direction.',
      nonFitHeading: 'When another option may be better',
      nonFit:
        'If a standard product is still supported, working with its vendor may be the right path. If a smaller need is already covered by an existing tool, configuring it may be better than replacing it. If no system exists and the goal is to create one, the work should be treated as a development project rather than maintenance.',
      evidenceHeading: 'Available evidence',
      evidence:
        'There is currently no public maintenance or consulting intervention with verifiable scope, permission, and outcome. FURLANICH does not publish confidential details or turn general experience into a success story. Until authorized evidence is available, this section is supported by explicit scope and a verifiable working approach.',
      action: {
        label: 'Tell us what is happening with your system',
        routeId: 'contact',
      },
    },
  ],
  principles: {
    heading: 'What you can expect from every service',
    introduction: 'The service changes; these working decisions do not.',
    items: [
      {
        title: 'Understand before building',
        description:
          'Clarify the problem, the people involved, and the expected outcome first.',
      },
      {
        title: 'Choose between building, integrating, and modernizing',
        description:
          'Recommend custom work only when it adds value compared with an existing tool.',
      },
      {
        title: 'Define testable scope',
        description:
          'Make deliverables, exclusions, assumptions, and validation criteria explicit before committing to the work.',
      },
      {
        title: 'Validate incrementally',
        description:
          'Where the project allows, review important journeys before final delivery.',
      },
      {
        title: 'Make dependencies visible',
        description:
          'Providers, access, data, content, and client decisions are part of feasibility and timing.',
      },
      {
        title: 'Plan for continuity',
        description:
          'Prioritize maintainable implementation, proportionate documentation, and Samuel\'s direct technical accountability.',
      },
    ],
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
    description:
      'You do not need to choose a service before getting in touch. Tell us what is happening, how it works today, and what you would like to improve. Samuel will review the enquiry personally to determine whether FURLANICH can help and what a sensible next step would be.',
    responseStatement:
      'Usual response time is within the same business day. In exceptional cases, it may take up to two business days.',
    action: {
      label: 'Start an enquiry',
      routeId: 'contact',
    },
  },
} satisfies ServicesPageContent;
