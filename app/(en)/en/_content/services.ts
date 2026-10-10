import type { ServicesPageContent } from '../../../../components/services/content-types';

// PLAN-SPF-V1 Task 6. Exact copy from docs/product/pages/services.md: the "SPF-V1 proposed Services
// copy" table (APPROVED 2026-09-30), the D05 compressed boundaries, the shared working agreement, the
// complete Commercial boundaries block and the AI note, which stay verbatim. The English row labels
// "Common situations", "Agreed scope" and "Evidence" are not in the approved table (it names the
// Spanish fields); they are recorded as Task 6 rulings in the receipt.
export const servicesPageContent = {
  locale: 'en',
  routeId: 'services',
  introduction: {
    heading: 'Software that moves work forward.',
    description:
      'Websites, applications and integrations for concrete needs. We start with the problem and agree what to build, connect or improve.',
    catalogueLabel: 'Find your starting point',
    catalogueAction: 'Explore the service',
  },
  sceneCaption: 'Connected capabilities · illustrative model',
  services: [
    {
      id: 'web',
      family: 'Websites and web applications',
      headline: 'A clear interface for the business.',
      catalogueSummary: 'A clear presence. Simpler operations.',
      outcome: 'A business website, portal or application shaped around the problem.',
      deliveryHeading: 'What you receive',
      delivery: 'A website or application, agreed journeys and documentation proportionate to scope.',
      situationsHeading: 'Common situations',
      situations: 'Publish an offer; manage bookings or orders; coordinate information in an application.',
      startingHeading: 'Starting point',
      startingPoint: 'The objective, main journeys and data required.',
      scopeHeading: 'Agreed scope',
      scope: 'Hosting, licenses and integrations are defined around the project’s needs.',
      boundariesHeading: 'Service boundaries',
      boundaries:
        'Design, content, integrations, administration and testing are scoped for each project. Branding, content production, hosting, provider charges, mobile apps and maintenance are included only by agreement. Business results are not guaranteed.',
      evidenceHeading: 'Evidence',
      evidence: 'Available evidence: reservation prototype, with public code and current execution not revalidated.',
      evidenceLink: {
        label: 'Examine the reservation prototype',
        slug: 'general-reservation-system',
      },
      action: {
        label: 'Tell us what you need to solve',
        routeId: 'contact',
      },
    },
    {
      id: 'whatsapp',
      family: 'Integrations and automation',
      headline: 'Tools stop working in isolation.',
      catalogueSummary: 'Fewer manual handoffs.',
      outcome: 'Connected workflows and data to reduce manual handoffs.',
      deliveryHeading: 'What you receive',
      delivery: 'An integrated workflow, its boundaries and an agreed way to check it.',
      situationsHeading: 'Common situations',
      situations: 'Information copied between tools; orders or questions lost between messages.',
      startingHeading: 'Starting point',
      startingPoint: 'Map the existing workflow and check access to tools, APIs and data.',
      scopeHeading: 'Agreed scope',
      scope:
        'WhatsApp requires an eligible provider and approvals. Define what is automated and where a person takes over.',
      boundariesHeading: 'Service boundaries',
      boundaries:
        'Feasibility depends on WhatsApp/Meta policies, account and template approvals where required, providers, costs, data and available systems. FURLANICH does not control those approvals, availability, message delivery or price changes. Payments depend on the provider and do not necessarily happen inside WhatsApp.',
      evidenceHeading: 'Evidence',
      evidence: 'No verified case is currently published for this service. The background model is illustrative.',
      action: {
        label: 'Tell us what you need to solve',
        routeId: 'contact',
      },
    },
    {
      id: 'consulting',
      family: 'Improve existing software',
      headline: 'A system that can keep evolving.',
      catalogueSummary: 'Build on what you already have.',
      outcome: 'Diagnosis, maintenance and modernization with clear priorities.',
      deliveryHeading: 'What you receive',
      delivery: 'A bounded diagnosis, prioritized improvements and agreed next steps.',
      situationsHeading: 'Common situations',
      situations: 'Recurring errors, slow tasks, legacy software or an integration that needs continuity.',
      startingHeading: 'Starting point',
      startingPoint: 'Review the code, environment and problem. Agree on a bounded intervention first.',
      scopeHeading: 'Agreed scope',
      scope: 'Define priorities, responsibilities and a suitable support or maintenance arrangement.',
      boundariesHeading: 'Service boundaries',
      boundaries:
        'Authorized access to code, environments, logs, documentation and people who know the system is needed. Rebuilds, new systems, on-call response, SLAs, certification, licenses, infrastructure and another provider’s work are not included by default.',
      evidenceHeading: 'Evidence',
      evidence: 'No verified case is currently published for this service. The background model is illustrative.',
      action: {
        label: 'Tell us what you need to solve',
        routeId: 'contact',
      },
    },
  ],
  workingBoundariesLabel: 'Read working boundaries',
  principles: {
    heading: 'Clear scope. Reviewable delivery.',
    statements: [
      'Agree on responsibilities, journeys and acceptance criteria before building.',
      'Documentation and handover are proportionate to scope. Maintenance and support are agreed explicitly.',
      'AI where it serves a specific function, with defined limits and oversight. It is not a promise of total automation.',
    ],
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
    scope: 'Chatbots and agents are evaluated with agreed scope, data, providers, costs, limits and human oversight.',
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
