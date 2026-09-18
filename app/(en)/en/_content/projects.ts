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
        'Code for managing passenger transport routes, stations, seats and reservations.',
      relationship: 'Prototype published by Samuel, with another repository contributor. It is not client work or a production delivery.',
      limitation: 'No current public demo; current behavior has not been revalidated.',
      capabilities: ['Reservations', 'Seat availability', 'Passenger portal'],
      evidenceSignal: 'Public source',
      actionLabel: 'View project',
    },
    'PROJECT-THE-SYSTEM': {
      title: 'Multi-user role-playing campaign management',
      context: 'FURLANICH Lab · Role-playing operations',
      maturityLabel: 'FURLANICH Lab',
      summary:
        'A role-playing campaign lab with code for accounts, memberships, invitations and permissions.',
      relationship: 'Lab published by Samuel, with no client relationship or production delivery.',
      limitation: 'No public demo or current runtime verification; no production use is claimed.',
      capabilities: ['Identity and access', 'Multi-user permissions', 'Campaign management'],
      evidenceSignal: 'Public source',
      actionLabel: 'View project',
    },
    'PROJECT-MPC-ADMIN': {
      title: 'Educational production and inventory management',
      context: 'Educational group project · Fictional manufacturing operations',
      maturityLabel: 'Educational prototype',
      summary:
        'A 2021 educational group project for managing production and inventory at a fictional cheese factory.',
      relationship: 'Educational group work; it does not represent a client, employment or a FURLANICH delivery.',
      limitation: 'No current runtime verification; no claim of sole authorship, real-world use, or business outcome.',
      capabilities: ['Production', 'Inventory', 'Administration'],
      evidenceSignal: 'Public source',
      actionLabel: 'View project',
    },
  },
  details: {
    'PROJECT-GRS': {
      founderAction: {
        label: 'Meet Samuel',
        routeId: 'founder',
      },
      headerSummary: 'Code for managing passenger transport routes, stations, seats and reservations.',
      evidenceStatement: 'Implementation evidence based on the public repository and its available technical history. Current behavior has not been revalidated.',
      relationship: 'Prototype published by Samuel, with another repository contributor. It is not client work or a production delivery.',
      context: 'The project explores route, station, seat, and self-service operations for passenger transport.',
      problem: 'The scope addresses coordination of availability and reservations that is often split across operations, administration, and passengers. This describes the modeled opportunity, not a confirmed client problem.',
      deliveredScope: ['Account access', 'Route and station management', 'Seat availability', 'Reservation creation and cancellation', 'Passenger self-service', 'Administration', 'CSV station exchange'],
      capabilities: ['Reservations', 'Seat availability', 'Passenger portal'],
      result: 'Public result: implementation evidence. Current functional behavior, production use, adoption, payments, uptime, and measured business outcome are not claimed.',
      evidence: {
        links: [{ label: 'Approved public repository', href: 'https://github.com/Furlanich/GeneralReservationSystem', kind: 'repository' }],
      },
      limitations: 'There is no verified public demonstration. Current behavior has not been revalidated and the payment interface is not presented as implemented. Adoption, uptime and business results are not claimed.',
      relatedService: { label: 'Commercial websites and web applications', serviceId: 'web', visibility: 'public' },
      publicationScope: 'The public description is limited by publication permissions. The image is conceptual and does not show a real interface.',
      visual: {
        label: 'Conceptual illustration · not a product screenshot',
        alt: 'Conceptual diagram of routes, stations, seat availability, reservations, and passenger self-service.',
      },
    },
    'PROJECT-THE-SYSTEM': {
      founderAction: {
        label: 'Meet Samuel',
        routeId: 'founder',
      },
      headerSummary: 'A role-playing campaign lab with code for accounts, memberships, invitations and permissions.',
      evidenceStatement: 'Implementation evidence based on the public repository, its tests, and development configuration. A current runtime was not verified.',
      relationship: 'Lab published by Samuel, with no client relationship or production delivery.',
      context: 'The laboratory explores role-playing campaign operations and the access boundaries needed when several people participate.',
      problem: 'The scope models how to separate identity, memberships, invitations, and permissions around a campaign. This describes a product exploration, not a confirmed client need.',
      deliveredScope: ['Authentication and email verification', 'Password recovery', 'External-auth boundaries', 'Campaign CRUD', 'Memberships and invitations', 'Subscription/billing abstractions', 'Next.js client foundation', 'Backend-layer and frontend tests'],
      capabilities: ['Identity and access', 'Multi-user permissions', 'Campaign management'],
      result: 'Public result: implementation evidence. Current execution, production use, full collaboration, scenes, assets, notes, and business outcomes are not claimed.',
      evidence: {
        links: [{ label: 'Approved public repository', href: 'https://github.com/Furlanich/The-System', kind: 'repository' }],
      },
      limitations: 'There is no public demonstration or verified current execution. Subscription boundaries are modeled in code, not presented as operational billing. Scenes, assets, notes and full collaboration are not presented as delivered.',
      relatedService: { label: 'Commercial websites and web applications', serviceId: 'web', visibility: 'public' },
      publicationScope: 'The public description is limited by publication permissions. The image is conceptual and does not show a real interface.',
      visual: {
        label: 'Conceptual illustration · not a product screenshot',
        alt: 'Conceptual diagram of a campaign workspace connected to identity, memberships, invitations, permissions, and subscription boundaries.',
      },
    },
    'PROJECT-MPC-ADMIN': {
      founderAction: {
        label: "View Samuel's background",
        routeId: 'founder',
      },
      headerSummary: 'A 2021 educational group project for managing production and inventory at a fictional cheese factory.',
      evidenceStatement: 'Implementation evidence based on the public repository and the 2021 technical-education competition context. A current runtime was not verified.',
      relationship: 'Educational group work; it does not represent a client, employment or a FURLANICH delivery.',
      context: 'The work models administrative operations for a fictional cheese factory within a group educational activity.',
      problem: 'The assignment explored how to organize production, inventory, users, logs, and curing data in an administrative system. It does not represent a confirmed problem from a real company.',
      deliveredScope: ['Administration workflows for production and inventory', 'Users', 'Logs', 'Curing data', 'Fictional organization structure'],
      capabilities: ['Production', 'Inventory', 'Administration'],
      result: 'Public result: educational implementation evidence. Sole authorship, real-world use, deployment, business outcome, and current functionality are not claimed.',
      evidence: {
        links: [{ label: 'Approved public repository', href: 'https://github.com/Furlanich/MilkyPantsCheese-Administracion-', kind: 'repository' }],
      },
      limitations: 'Current functionality has not been verified. Sole authorship, real-world use, deployment and business results are not claimed. No visual material from the original system is authorized.',
      relatedService: { label: 'Commercial websites and web applications', serviceId: 'web', visibility: 'internal' },
      publicationScope: 'The public description is limited by the educational context and publication permissions. The image is conceptual and does not show a real interface.',
      visual: {
        label: 'Conceptual illustration · not a product screenshot',
        alt: 'Conceptual diagram of production, inventory, user administration, logs, and curing data for a fictional organization.',
      },
    },
  },
} satisfies ProjectsPageContent;
