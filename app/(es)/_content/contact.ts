import type { ContactContent } from '../../../components/foundation/content-types';

export const contactContent = {
  locale: 'es',
  routeId: 'contact',
  heading: 'Contanos qué necesitás resolver.',
  introduction:
    'Samuel revisará personalmente la consulta para determinar si tiene sentido avanzar con una conversación.',
  responseExpectation:
    'Respuesta habitual dentro del mismo día hábil. En casos excepcionales, puede demorar hasta dos días hábiles.',
  location: 'Buenos Aires, Argentina',
  actions: [
    {
      label: 'Escribir por WhatsApp',
      kind: 'whatsapp',
      href: 'https://wa.me/5491150117565',
    },
    {
      label: 'Enviar un correo',
      kind: 'email',
      href: 'mailto:samuelfurlanich@gmail.com',
    },
    {
      label: 'Llamar',
      kind: 'phone',
      href: 'tel:+5491150117565',
    },
  ],
} satisfies ContactContent;
