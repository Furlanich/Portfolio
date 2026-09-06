import type { ProjectsPageContent } from '../../../../components/projects/content-types';

export const projectPageContent = {
  locale: 'en',
  routeId: 'projects',
  heading: 'Selected work',
  introduction:
    'We publish work only when we can clearly explain its context, scope, current status, and publication permission. Each project distinguishes what is in production, what can be demonstrated, and what must remain private.',
  taxonomy: {
    production: 'Production solutions',
    lab: 'FURLANICH Lab',
    prototype: 'Functional prototypes',
  },
  confidentiality: {
    heading: 'Publication scope',
    description:
      'The public description is limited by publication permissions and confidentiality commitments. Some implementation details are not shown.',
  },
  finalCta: {
    heading: 'Need to solve something similar?',
    description:
      'Tell us about the context, process, or system you need to improve. We will respond with a direct assessment of the next step.',
    action: {
      label: 'Discuss your project',
      routeId: 'contact',
    },
  },
  cards: {
    'PROJECT-GRS': {
      title: 'Passenger transport reservation management',
      context: 'Passenger transport',
      maturityLabel: 'Reservation prototype',
      summary:
        'Reference implementation for managing routes, stations, seat availability, reservations, and passenger self-service. It is published as implementation evidence; no production use or measured business outcome is claimed.',
      capabilities: ['Reservations', 'Seat availability', 'Passenger portal'],
      evidenceSignal: 'Public source',
      actionLabel: 'View project',
    },
    'PROJECT-THE-SYSTEM': {
      title: 'Multi-user role-playing campaign management',
      context: 'FURLANICH Lab · Role-playing operations',
      maturityLabel: 'FURLANICH Lab',
      summary:
        'Web-application lab with identity and access, campaigns, memberships and invitations, and subscription boundaries represented in code. It is published as implementation evidence; planned areas are not presented as delivered.',
      capabilities: ['Identity and access', 'Multi-user permissions', 'Campaign management'],
      evidenceSignal: 'Public source',
      actionLabel: 'View project',
    },
    'PROJECT-MPC-ADMIN': {
      title: 'Educational production and inventory management',
      context: 'Educational group project · Fictional manufacturing operations',
      maturityLabel: 'Educational prototype',
      summary:
        'A 2021 group project for a fictional organization, with administration workflows for production, inventory, users, logs, and curing data. It is published as educational implementation evidence, not as client work or a production system.',
      capabilities: ['Production', 'Inventory', 'Administration'],
      evidenceSignal: 'Public source',
      actionLabel: 'View project',
    },
  },
  details: {
    'PROJECT-GRS': {
      headerSummary: 'Reference implementation for coordinating passenger transport reservations. This page documents scope and implementation, not production use.',
      evidenceStatement: 'Implementation evidence based on the public repository and its available technical history. Current behavior has not been revalidated.',
      context: 'The project explores route, station, seat, and self-service operations for passenger transport.',
      problem: 'The scope addresses coordination of availability and reservations that is often split across operations, administration, and passengers. This describes the modeled opportunity, not a confirmed client problem.',
      deliveredScope: ['Account access', 'Route and station management', 'Seat availability', 'Reservation creation and cancellation', 'Passenger self-service', 'Administration', 'CSV station exchange'],
      capabilities: ['Reservations', 'Seat availability', 'Passenger portal'],
      result: 'Public result: implementation evidence. Current functional behavior, production use, adoption, payments, uptime, and measured business outcome are not claimed.',
      evidence: {
        links: [{ label: 'Approved public repository', href: 'https://github.com/Furlanich/GeneralReservationSystem', kind: 'repository' }],
      },
      limitations: 'The documented demo returned 404; local startup and workflows were not revalidated; the payment UI must not be presented as implemented.',
      relatedService: { label: 'Commercial websites and web applications', serviceId: 'web' },
      publicationScope: 'The public description is limited by publication permissions. The image is conceptual and does not show a real interface.',
      visual: {
        label: 'Conceptual illustration · not a product screenshot',
        alt: 'Conceptual diagram of routes, stations, seat availability, reservations, and passenger self-service.',
      },
    },
    'PROJECT-THE-SYSTEM': {
      headerSummary: 'Web-application laboratory for organizing role-playing campaigns with identity, memberships, and multi-user permissions. This page distinguishes existing code from planned areas.',
      evidenceStatement: 'Implementation evidence based on the public repository, its tests, and development configuration. A current runtime was not verified.',
      context: 'The laboratory explores role-playing campaign operations and the access boundaries needed when several people participate.',
      problem: 'The scope models how to separate identity, memberships, invitations, and permissions around a campaign. This describes a product exploration, not a confirmed client need.',
      deliveredScope: ['Authentication and email verification', 'Password recovery', 'External-auth boundaries', 'Campaign CRUD', 'Memberships and invitations', 'Subscription/billing abstractions', 'Next.js client foundation', 'Backend-layer and frontend tests'],
      capabilities: ['Identity and access', 'Multi-user permissions', 'Campaign management'],
      result: 'Public result: implementation evidence. Current execution, production use, full collaboration, scenes, assets, notes, and business outcomes are not claimed.',
      evidence: {
        links: [{ label: 'Approved public repository', href: 'https://github.com/Furlanich/The-System', kind: 'repository' }],
      },
      limitations: 'There is no public demo or current runtime verification; several blueprint areas remain planned or scaffolded.',
      relatedService: { label: 'Commercial websites and web applications', serviceId: 'web' },
      publicationScope: 'The public description is limited by publication permissions. The image is conceptual and does not show a real interface.',
      visual: {
        label: 'Conceptual illustration · not a product screenshot',
        alt: 'Conceptual diagram of a campaign workspace connected to identity, memberships, invitations, permissions, and subscription boundaries.',
      },
    },
    'PROJECT-MPC-ADMIN': {
      headerSummary: 'Educational group prototype for production and inventory administration for a fictional organization. This page keeps its academic context explicit.',
      evidenceStatement: 'Implementation evidence based on the public repository and the 2021 technical-education competition context. A current runtime was not verified.',
      context: 'The work models administrative operations for a fictional cheese factory within a group educational activity.',
      problem: 'The assignment explored how to organize production, inventory, users, logs, and curing data in an administrative system. It does not represent a confirmed problem from a real company.',
      deliveredScope: ['Administration workflows for production and inventory', 'Users', 'Logs', 'Curing data', 'Fictional organization structure'],
      capabilities: ['Production', 'Inventory', 'Administration'],
      result: 'Public result: educational implementation evidence. Sole authorship, real-world use, deployment, business outcome, and current functionality are not claimed.',
      evidence: {
        links: [{ label: 'Approved public repository', href: 'https://github.com/Furlanich/MilkyPantsCheese-Administracion-', kind: 'repository' }],
      },
      limitations: 'The project is 2021 group work for a fictional organization; there is no current runtime verification or authorized visual material from the original system.',
      relatedService: { label: 'Commercial websites and web applications', serviceId: 'web' },
      publicationScope: 'The public description is limited by the educational context and publication permissions. The image is conceptual and does not show a real interface.',
      visual: {
        label: 'Conceptual illustration · not a product screenshot',
        alt: 'Conceptual diagram of production, inventory, user administration, logs, and curing data for a fictional organization.',
      },
    },
  },
} satisfies ProjectsPageContent;
