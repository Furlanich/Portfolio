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
  cards: {},
  details: {},
} satisfies ProjectsPageContent;
