import type { ContactPageContent } from '../../../components/contact/content-types';

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
    { label: 'Escribir por WhatsApp', kind: 'whatsapp', href: 'https://wa.me/5491150117565' },
    { label: 'Enviar un correo', kind: 'email', href: 'mailto:samuelfurlanich@gmail.com' },
    { label: 'Llamar', kind: 'phone', href: 'tel:+5491150117565' },
  ],
  founderContextAction: { label: 'Conocer la trayectoria de Samuel', routeId: 'founder' },
  notice: {
    heading: 'Demostración interactiva',
    body: 'Este sitio es una muestra técnica. El formulario simula el envío en este navegador: no envía datos, no crea una consulta comercial y no llega a ninguna bandeja de entrada.',
    failureHelper: 'Para probar el estado de error, usá failure@example.invalid como correo electrónico.',
  },
  form: {
    heading: 'Iniciar una consulta',
    introduction: 'Completá los datos y contanos brevemente el problema, cómo funciona hoy y qué te gustaría mejorar.',
    requiredNote: 'Los campos indicados como obligatorios son necesarios.',
    fields: [
      { name: 'name', label: 'Nombre', requiredLabel: 'Obligatorio', required: true, maxLength: 100, autocomplete: 'name', inputType: 'text', helper: '', errors: { required: 'Ingresá tu nombre.', 'max-length': 'El nombre no puede superar los 100 caracteres.' } },
      { name: 'email', label: 'Correo electrónico', requiredLabel: 'Obligatorio', required: true, maxLength: 254, autocomplete: 'email', inputType: 'email', helper: 'Lo usaremos únicamente para responder esta consulta.', errors: { required: 'Ingresá tu correo electrónico.', 'invalid-email': 'Ingresá un correo electrónico válido.', 'max-length': 'El correo electrónico no puede superar los 254 caracteres.' } },
      { name: 'company', label: 'Empresa', requiredLabel: 'Opcional', required: false, maxLength: 120, autocomplete: 'organization', inputType: 'text', helper: '', errors: { 'max-length': 'El nombre de la empresa no puede superar los 120 caracteres.' } },
      { name: 'message', label: '¿Qué necesitás resolver?', requiredLabel: 'Obligatorio', required: true, maxLength: 4000, autocomplete: 'off', inputType: 'textarea', helper: 'No incluyas contraseñas, credenciales ni datos sensibles.', errors: { required: 'Contanos qué necesitás resolver.', 'max-length': 'El mensaje no puede superar los 4.000 caracteres.' } },
    ],
    privacyContext: 'Usaremos tus datos para evaluar y responder tu consulta. Antes de enviar, consultá cómo los tratamos en nuestra Política de privacidad.',
    privacyLabel: 'Política de privacidad',
    submit: 'Simular envío',
    submitting: 'Simulando…',
    success: { heading: 'Demostración completada.', body: 'Demostración completada. No se enviaron datos ni se creó una consulta comercial.' },
    failure: { heading: 'La simulación no pudo completarse.', body: 'La simulación no pudo completarse. No se enviaron datos. Tus valores siguen disponibles en esta página para que puedas corregirlos o volver a probar.' },
    retry: 'Intentar nuevamente',
  },
  alternatives: {
    heading: '¿Preferís otro canal?',
    note: 'WhatsApp, email y teléfono se muestran como alternativas funcionales. Al usarlas, salís de esta simulación y abrís un servicio externo; los valores del formulario no se copian allí.',
    actions: [
      { label: 'Escribir por WhatsApp', kind: 'whatsapp', href: 'https://wa.me/5491150117565' },
      { label: 'Enviar un correo', kind: 'email', href: 'mailto:samuelfurlanich@gmail.com' },
      { label: 'Llamar', kind: 'phone', href: 'tel:+5491150117565' },
    ],
  },
} satisfies ContactPageContent;
