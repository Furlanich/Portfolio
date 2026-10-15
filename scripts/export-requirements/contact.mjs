// Declarative static-export requirements for Contact (PLAN-SFC-V1 Task 2: one owner per page, data only).
// The shared verifier (scripts/verify-static-export.mjs) imports this map and owns the assertion logic.
export const contactRequirements = {
  'contacto/index.html': {
    heading: 'Contanos qué necesitás resolver.',
    notice: 'Demostración interactiva',
    noticeBody: 'Este sitio es una muestra técnica. El formulario simula el envío en este navegador: no envía datos, no crea una consulta comercial y no llega a ninguna bandeja de entrada.',
    fields: ['Nombre', 'Correo electrónico', 'Empresa', '¿Qué necesitás resolver?'],
    fallback: 'WhatsApp, email y teléfono se muestran como alternativas funcionales.',
    privacy: '/privacidad/',
    founder: '/estudio/samuel-furlanich/',
  },
  'en/contact/index.html': {
    heading: 'Tell us what you need to solve.',
    notice: 'Interactive demonstration',
    noticeBody: 'This site is a technical showcase. The form simulates submission in this browser: it sends no data, creates no commercial inquiry, and reaches no inbox.',
    fields: ['Name', 'Email', 'Company', 'What do you need to solve?'],
    fallback: 'WhatsApp, email, and phone are shown as functional alternatives.',
    privacy: '/en/privacy/',
    founder: '/en/about/samuel-furlanich/',
  },
};
