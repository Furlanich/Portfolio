import type { ProjectsPageContent } from '../../../../components/projects/content-types';

// Exact approved copy: docs/product/pages/projects.md#spf-v1-proposed-projects-copy-and-inline-presentation
// (APPROVED 2026-09-30). `scripts/projects-publication.test.mjs` compares every string below with that table.
export const projectPageContent = {
  locale: 'en',
  routeId: 'projects',
  heading: 'Work you can examine.',
  introduction:
    'Code and implementation, with context and limits. Each project states what was built and which evidence is available.',
  sourceAction: 'View source code',
  relatedServiceAction: 'Websites and web applications',
  founderAction: {
    label: 'Meet Samuel',
    routeId: 'founder',
  },
  disclosure: {
    heading: 'Context matters.',
    description:
      'Each dossier retains its maturity, relationship and publication limits. Illustrations explain the scope; they are not product screenshots or evidence of operation.',
  },
  sceneCaption: 'Connected capabilities · illustrative model',
  dossiers: {
    'PROJECT-GRS': {
      jumpLabel: 'Transport reservations',
      title: 'Passenger transport reservation management',
      maturityLabel: 'Reservation prototype',
      summary: 'Coordinate routes, stations, seats and passenger self-service.',
      relationship: 'Founder-published repository with another contributor. It is not presented as client work.',
      visual: {
        caption: 'Conceptual illustration · not a product screenshot',
        alt: 'Conceptual diagram of routes, stations, seat availability, reservations, and passenger self-service.',
      },
      opportunity: {
        heading: 'The modeled opportunity',
        content:
          'The scope models a coordination opportunity in passenger transport; it is not a confirmed client problem.',
      },
      scope: {
        heading: 'Implemented scope',
        items: [
          'Account access and administration',
          'Routes, stations and seat availability',
          'Reservation creation and cancellation',
          'Passenger self-service and station exchange through CSV',
        ],
      },
      evidence: {
        heading: 'What you can examine',
        content:
          'The public result is implementation evidence: code, test projects, Docker configuration and available technical history. Historical successful CI does not establish current operation.',
      },
      limits: {
        heading: 'Evidence limits',
        content:
          'The documented demo is unavailable and current execution has not been revalidated. Production use, implemented payments, adoption, uptime and measured business outcomes are not claimed.',
      },
    },
    'PROJECT-THE-SYSTEM': {
      jumpLabel: 'Multi-user campaigns',
      title: 'Multi-user role-playing campaign management',
      maturityLabel: 'FURLANICH Lab',
      summary: 'Organize role-playing campaigns with identity, memberships and invitations.',
      relationship: 'Founder-published laboratory exploration. Its domain is role-playing campaign management.',
      visual: {
        caption: 'Conceptual illustration · not a product screenshot',
        alt: 'Conceptual diagram of a campaign workspace connected to identity, memberships, invitations, permissions, and subscription boundaries.',
      },
      opportunity: {
        heading: 'The modeled opportunity',
        content:
          'The laboratory explores access boundaries and multi-user organization. It is not presented as a confirmed client need.',
      },
      scope: {
        heading: 'Implemented scope',
        items: [
          'Identity, authentication and account recovery',
          'Campaigns, memberships and invitations',
          'Multi-user permissions',
          'Subscription/billing abstractions and a web-client foundation',
        ],
      },
      evidence: {
        heading: 'What you can examine',
        content:
          'The public result is implementation evidence: repository, backend/frontend test source and development configuration.',
      },
      limits: {
        heading: 'Evidence limits',
        content:
          'No public demo or current runtime verification. Subscription boundaries are modeled in code, not presented as operational billing. Scenes, assets, notes and complete collaboration are not presented as delivered. Production use is not claimed.',
      },
    },
  },
} satisfies ProjectsPageContent;
