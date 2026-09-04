import type { ServicesContent } from '../../../components/foundation/content-types';

export const servicesContent = {
  locale: 'es',
  routeId: 'services',
  heading: 'Servicios para necesidades concretas',
  introduction:
    'No imponemos una plataforma genérica. Primero entendemos el proceso y después evaluamos si conviene construir, integrar o modernizar.',
  services: [
    {
      title: 'Sitios y aplicaciones web comerciales',
      summary:
        'Soluciones web para presentar, vender o gestionar servicios: sitios profesionales, catálogos, pedidos, reservas, portales para clientes e integraciones con medios de pago.',
    },
    {
      title: 'Automatización por WhatsApp e integraciones',
      summary:
        'Flujos para responder consultas, registrar pedidos, gestionar reservas, enviar confirmaciones y conectar WhatsApp con otras herramientas del negocio.',
    },
    {
      title: 'Mantenimiento y consultoría de software',
      summary:
        'Diagnóstico y mejora de sistemas existentes para resolver problemas, reducir riesgos y definir un camino técnico mantenible.',
    },
  ],
  action: {
    label: 'Contanos qué necesitás resolver',
    routeId: 'contact',
  },
} satisfies ServicesContent;
