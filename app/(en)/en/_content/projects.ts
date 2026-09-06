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
      actionLabel: 'View source',
    },
    'PROJECT-THE-SYSTEM': {
      title: 'Multi-user role-playing campaign management',
      context: 'FURLANICH Lab · Role-playing operations',
      maturityLabel: 'FURLANICH Lab',
      summary:
        'Web-application lab with identity and access, campaigns, memberships and invitations, and subscription boundaries represented in code. It is published as implementation evidence; planned areas are not presented as delivered.',
      capabilities: ['Identity and access', 'Multi-user permissions', 'Campaign management'],
      evidenceSignal: 'Public source',
      actionLabel: 'View source',
    },
    'PROJECT-MPC-ADMIN': {
      title: 'Educational production and inventory management',
      context: 'Educational group project · Fictional manufacturing operations',
      maturityLabel: 'Educational prototype',
      summary:
        'A 2021 group project for a fictional organization, with administration workflows for production, inventory, users, logs, and curing data. It is published as educational implementation evidence, not as client work or a production system.',
      capabilities: ['Production', 'Inventory', 'Administration'],
      evidenceSignal: 'Public source',
      actionLabel: 'View source',
    },
  },
  details: {},
} satisfies ProjectsPageContent;
