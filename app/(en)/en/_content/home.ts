import type { HomeHeroContent } from '../../../../components/foundation/content-types';

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
} satisfies HomeHeroContent;
