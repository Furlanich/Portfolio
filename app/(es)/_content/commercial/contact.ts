import type { ContactPageContent } from '../../../../components/contact/content-types';

export const commercialContactContent = {
  mode: 'commercial',
  locale: 'es',
  routeId: 'contact',
  wordBindings: [
    { nodeId: 'n0', word: 'Contexto' },
    { nodeId: 'n5', word: 'Consulta' },
    { nodeId: 'n10', word: 'Conversación' },
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
  preHydrationFallback:
    'Para enviar el formulario, activá JavaScript. También podés escribirnos por WhatsApp, correo o teléfono.',
  termsLabel: 'Términos y condiciones',
  form: {
    heading: 'Iniciar una consulta',
    introduction: 'Completá los datos y contanos brevemente el problema, cómo funciona hoy y qué te gustaría mejorar.',
    requiredNote: 'Los campos indicados como obligatorios son necesarios.',
    fields: [
      { name: 'name', label: 'Nombre', requiredLabel: 'Obligatorio', required: true, maxLength: 200, autocomplete: 'name', inputType: 'text', helper: '', errors: { required: 'Ingresá tu nombre.', 'max-length': 'El nombre no puede superar los 100 caracteres.' } },
      { name: 'email', label: 'Correo electrónico', requiredLabel: 'Obligatorio', required: true, maxLength: 508, autocomplete: 'email', inputType: 'email', helper: 'Lo usaremos únicamente para responder esta consulta.', errors: { required: 'Ingresá tu correo electrónico.', 'invalid-email': 'Ingresá un correo electrónico válido.', 'max-length': 'El correo electrónico no puede superar los 254 caracteres.' } },
      { name: 'company', label: 'Empresa', requiredLabel: 'Opcional', required: false, maxLength: 240, autocomplete: 'organization', inputType: 'text', helper: '', errors: { 'max-length': 'El nombre de la empresa no puede superar los 120 caracteres.' } },
      { name: 'message', label: '¿Qué necesitás resolver?', requiredLabel: 'Obligatorio', required: true, maxLength: 8000, autocomplete: 'off', inputType: 'textarea', helper: 'No incluyas contraseñas, credenciales ni datos sensibles.', errors: { required: 'Contanos qué necesitás resolver.', 'max-length': 'El mensaje no puede superar los 4.000 caracteres.', 'request-too-large': 'La consulta es demasiado larga para enviarla. Acortá el mensaje e intentá nuevamente.' } },
    ],
    privacyContext: 'Usaremos tus datos para evaluar y responder tu consulta. Antes de enviar, consultá cómo los tratamos en nuestra Política de privacidad.',
    privacyLabel: 'Política de privacidad',
    submit: 'Enviar consulta',
    submitting: 'Enviando...',
    success: {
      heading: 'Mensaje aceptado.',
      body: 'Tu consulta fue aceptada para su envío. Si necesitás confirmar que Samuel la recibió, usá una opción de contacto directo.',
    },
    outcomes: {
      uncertain: {
        heading: 'No pudimos confirmar el envío.',
        body: 'Tus datos siguen en el formulario. Podés reintentar o escribirnos por WhatsApp. Si el primer envío fue recibido, un reintento puede generar otra copia de la consulta.',
      },
      rateLimited: {
        heading: 'El envío está temporalmente limitado.',
        body: 'Tus datos siguen en el formulario. Intentá más tarde o escribinos por WhatsApp.',
      },
      unavailable: {
        heading: 'El formulario no está disponible.',
        body: 'Podés escribirnos por WhatsApp, correo o teléfono. Los datos que completaste siguen en esta página.',
      },
    },
    retry: 'Intentar nuevamente',
  },
  alternatives: {
    heading: '¿Preferís otro canal?',
    note: 'WhatsApp, correo y teléfono son canales independientes. Los datos del formulario no se copian a esos enlaces.',
    actions: [
      { label: 'Escribir por WhatsApp', kind: 'whatsapp', href: 'https://wa.me/5491150117565' },
      { label: 'Enviar un correo', kind: 'email', href: 'mailto:samuelfurlanich@gmail.com' },
      { label: 'Llamar', kind: 'phone', href: 'tel:+5491150117565' },
    ],
  },
} satisfies ContactPageContent;
