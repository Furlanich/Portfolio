import type { PrivacyContent } from '../../../components/privacy/content-types';

export const privacyContent = {
  locale: 'es',
  routeId: 'privacy',
  heading: 'Privacidad de esta demostración',
  introduction:
    'Este sitio funciona como portfolio y demostración técnica. No acepta consultas comerciales mediante el formulario y no presenta esta página como una política revisada por un profesional legal.',
  sections: [
    {
      id: 'form-data',
      heading: 'Qué ocurre con los datos del formulario',
      paragraphs: [
        'Los valores que escribís en nombre, correo electrónico, empresa y mensaje permanecen temporalmente en la memoria de esta página. La simulación los valida y muestra estados de carga, éxito o error, pero no los envía a FURLANICH, Formspree, Gmail ni a ninguna bandeja de entrada.',
        'Después de un éxito simulado, los campos se limpian. Si hay un error de validación o una falla simulada, los valores permanecen visibles para que puedas corregirlos o volver a probar. Al recargar la página o salir de ella, la implementación de Contacto no los conserva.',
      ],
    },
    {
      id: 'hosting',
      heading: 'Alojamiento y datos técnicos',
      paragraphs: [
        'GitHub Pages publica los archivos estáticos del sitio en https://furlanich.github.io/Portfolio/. GitHub informa que registra la dirección IP de quienes visitan sitios de GitHub Pages por motivos de seguridad. Ese tratamiento técnico se rige por la documentación y la declaración de privacidad de GitHub.',
        'FURLANICH no agrega analítica, publicidad, perfiles, CRM, almacenamiento del formulario ni eventos de conversión para esta demostración.',
      ],
    },
    {
      id: 'external-alternatives',
      heading: 'Alternativas externas',
      paragraphs: [
        'Los enlaces de WhatsApp, email y teléfono son ejemplos funcionales separados del formulario. Si elegís uno, tu dispositivo abre un servicio externo y cualquier dato que decidas comunicar queda sujeto a ese servicio. Los valores escritos en el formulario no se copian automáticamente.',
      ],
    },
    {
      id: 'sensitive-information',
      heading: 'Información sensible',
      paragraphs: [
        'No ingreses contraseñas, credenciales, datos de producción de clientes, información sensible ni archivos. El formulario no solicita ni necesita esos datos para demostrar su funcionamiento.',
      ],
    },
    {
      id: 'retention-questions',
      heading: 'Conservación y consultas',
      paragraphs: [
        'La simulación no crea copias en un proveedor, una base de datos o una bandeja de entrada. Solo mantiene los valores en la página durante la interacción descrita arriba. Para preguntas sobre esta demostración, podés escribir a samuelfurlanich@gmail.com sin copiar datos sensibles.',
      ],
    },
    {
      id: 'future-commercial-activation',
      heading: 'Activación comercial futura',
      paragraphs: [
        'Antes de habilitar un envío real, FURLANICH deberá reemplazar esta explicación por información verificada sobre responsables, proveedores, finalidades, conservación, transferencias y derechos; completar una revisión profesional; y demostrar la entrega y eliminación de una consulta de prueba. Nada de eso se considera aprobado por esta demostración.',
      ],
    },
  ],
  githubLink: {
    label: 'Ver la declaración de privacidad de GitHub',
    href: 'https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement',
  },
} satisfies PrivacyContent;
