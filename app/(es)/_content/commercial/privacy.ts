import type { StudioLegalContent } from '@/components/legal/content-types';

export const legalContent = {
  "locale": "es",
  "routeId": "privacy",
  "title": "Privacidad y contacto",
  "chrome": {
    "contentsLabel": "Contenido",
    "updateLabel": "Última actualización",
    "reciprocalLabel": "Ver los términos y condiciones",
    "reciprocalHref": "/terminos/"
  },
  "sections": [
    {
      "id": "responsible-party",
      "heading": "Responsable y contacto",
      "paragraphs": [
        "Samuel Furlanich presenta su trabajo bajo la marca FURLANICH, desde Buenos Aires, Argentina. Para consultas sobre tus datos, escribí a samuelfurlanich@gmail.com."
      ]
    },
    {
      "id": "direct-contact",
      "heading": "Contacto directo",
      "paragraphs": [
        "Podés contactar a Samuel por WhatsApp, correo electrónico o teléfono. Los enlaces abren el servicio o la aplicación que elijas; vos decidís qué información enviar. Samuel usa los datos que compartís para evaluar y responder tu consulta y coordinar una posible conversación o trabajo.",
        "El correo publicado se recibe en Gmail, de Google. Los mensajes de WhatsApp y las llamadas se gestionan a través de los servicios correspondientes. Esos servicios tienen sus propias políticas de privacidad y pueden procesar datos técnicos de la comunicación."
      ]
    },
    {
      "id": "hosting",
      "heading": "Alojamiento y datos técnicos",
      "paragraphs": [
        "GitHub Pages publica los archivos estáticos del sitio en https://furlanich.github.io/Portfolio/. GitHub informa que registra la dirección IP de quienes visitan sitios de GitHub Pages por motivos de seguridad. Ese tratamiento se rige por su declaración de privacidad.",
        "El sitio no agrega analítica, publicidad, perfiles, CRM ni seguimiento de conversiones."
      ]
    },
    {
      "id": "preferences",
      "heading": "Preferencias de navegación",
      "paragraphs": [
        "El sitio puede guardar durante la sesión tu preferencia de pausa de las animaciones y un indicador técnico de fallo gráfico. Esos valores no contienen mensajes ni datos de contacto. Si ese almacenamiento no está disponible, se usa una alternativa estática o una preferencia temporal en memoria."
      ]
    },
    {
      "id": "sensitive-information",
      "heading": "Información que compartís",
      "paragraphs": [
        "Para una consulta inicial alcanza con describir brevemente el problema y cómo te gustaría avanzar. No compartas contraseñas, credenciales, datos de producción de clientes ni información sensible."
      ]
    },
    {
      "id": "retention-questions",
      "heading": "Mensajes y solicitudes sobre tus datos",
      "paragraphs": [
        "Los mensajes que enviás quedan en el correo o servicio usado para la conversación. El sitio no crea otra copia en un sistema de recepción de consultas. Para consultar por el uso de tus datos o solicitar acceso, corrección o eliminación, escribí a samuelfurlanich@gmail.com.",
        "La atención de esas solicitudes depende de los datos involucrados y de las obligaciones aplicables. Los proveedores gestionan sus propios registros técnicos y copias de seguridad conforme a sus políticas."
      ]
    }
  ]
} satisfies StudioLegalContent;
