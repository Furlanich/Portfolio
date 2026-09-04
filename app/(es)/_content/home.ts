import type { HomeHeroContent } from '../../../components/foundation/content-types';

export const homeContent = {
  locale: 'es',
  routeId: 'home',
  eyebrow: 'Desarrollo de software a medida para pymes',
  heading: 'Software práctico para vender, atender y operar mejor.',
  description:
    'FURLANICH diseña y desarrolla sitios y aplicaciones web comerciales, automatizaciones por WhatsApp e integraciones, y mejora sistemas existentes para organizaciones con necesidades concretas.',
  primaryAction: {
    label: 'Contanos sobre tu proyecto',
    routeId: 'contact',
  },
  secondaryAction: {
    label: 'Ver servicios',
    routeId: 'services',
  },
  trustLine: 'Atención técnica directa · Buenos Aires, Argentina · Proyectos en español e inglés',
  availability: 'Disponible para proyectos en toda la Argentina y el exterior.',
} satisfies HomeHeroContent;
