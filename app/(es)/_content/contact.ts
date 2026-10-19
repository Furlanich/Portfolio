import type { ContactPageContent } from '../../../components/contact/content-types';

export const contactContent = {
  locale: 'es',
  routeId: 'contact',
  wordBindings: [
    { nodeId: 'n0', word: 'Contexto' },
    { nodeId: 'n4', word: 'Consulta' },
    { nodeId: 'n8', word: 'Conversación' },
  ],
  heading: 'Contanos qué necesitás resolver.',
  introduction:
    'Samuel revisará personalmente la consulta para determinar si tiene sentido avanzar con una conversación.',
  responseExpectation:
    'Respuesta habitual dentro del mismo día hábil. En casos excepcionales, puede demorar hasta dos días hábiles.',
  location: 'Buenos Aires, Argentina',
  actions: [
    { label: 'Escribir por WhatsApp', kind: 'whatsapp', href: 'https://wa.me/5491150117565' },
    { label: 'Enviar un correo', kind: 'email', href: 'mailto:samuelfurlanich@gmail.com' },
    { label: 'Llamar', kind: 'phone', href: 'tel:+5491150117565' },
  ],
  founderContextAction: { label: 'Conocer la trayectoria de Samuel', routeId: 'founder' },
  channels: {
    heading: 'Hablemos de tu proyecto.',
    note: 'Escribinos por WhatsApp o correo, o llamanos. Contanos brevemente qué necesitás resolver, cómo funciona hoy y qué te gustaría mejorar.',
    privacyContext: 'El enlace abre el canal que elijas. Vos decidís qué información compartir.',
  },
  privacyLabel: 'Cómo tratamos tus datos',
} satisfies ContactPageContent;
