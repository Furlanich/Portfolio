---
id: PAGE-TERMS
type: page-spec
status: APPROVED
related:
  - ADR-CONTACT-DIRECT-CHANNELS
  - PAGE-CONTACT
  - PAGE-PRIVACY
  - IA-SITE
  - REVIEW-STUDIO-FOUNDER-CONTACT-2026-10-14
last_verified: 2026-10-18
---

# Terms and Conditions

## Responsibility — APPROVED direct-contact scope, 2026-10-18

Website use and initial contact only. Project scope, price, payment, deliverables, ownership, support and other engagement obligations belong in a separately agreed proposal or contract. [ADR-CONTACT-DIRECT-CHANNELS](../../decisions/contact-direct-channels.md) removes embedded intake and mandatory counsel/provider approval from this release. Owner-approved wording is not represented as counsel-certified.

## Routes and presentation

Task 16 retains the planned `/terminos/` and `/en/terms/` pair with semantic locale equivalence, localized title/description, App Bar/Footer and reciprocal Privacy link. Task 16 registers them once in the route registry, navigation paths and Footer, and renders the canonical typed copy below through the shared legal template with the update date 18 de octubre de 2026 / October 18, 2026 (the date the owner-approved text was finalized). They reach production only on the human-reviewed coordinated release. Use the shared static legal template: title, actual update date, compact contents, all sections, contact and Privacy. No accordion or optional graph runtime. Never expose editorial gate notes as public text.

## Canonical direct-contact Terms copy

The exact bounded JSON must deep-equal the typed exports. No form, acceptance confirmation, Formspree workflow or counsel decision is a dependency of this copy. Existing supplied identity/address facts are retained; no corporation, registration or new legal fact is inferred.

<!-- SFC-PUBLIC-COPY-ES:START -->
```json
{
  "locale": "es",
  "routeId": "terms",
  "title": "Términos y condiciones",
  "chrome": {
    "contentsLabel": "Contenido",
    "updateLabel": "Última actualización",
    "reciprocalLabel": "Ver la política de privacidad",
    "reciprocalHref": "/privacidad/"
  },
  "sections": [
    {
      "id": "responsable-y-alcance",
      "heading": "Responsable y alcance",
      "paragraphs": [
        "Este sitio presenta el trabajo y los servicios de FURLANICH, marca bajo la cual actúa Samuel Furlanich. El domicilio informado es Chivilcoy 6620, Buenos Aires, Argentina. Para consultas sobre el sitio o estos términos, escribí a samuelfurlanich@gmail.com.",
        "Estos términos se refieren al uso del sitio y al contacto inicial con el estudio. Las condiciones de un proyecto o servicio se acuerdan por separado."
      ]
    },
    {
      "id": "informacion-del-sitio",
      "heading": "Información del sitio",
      "paragraphs": [
        "Las descripciones de servicios explican qué tipos de necesidades podemos evaluar. El alcance, los entregables, los plazos y las condiciones económicas de cada trabajo requieren un acuerdo específico. Los proyectos publicados indican su contexto, la evidencia disponible y sus limitaciones; un ejemplo o prototipo no acredita por sí solo un resultado comercial."
      ]
    },
    {
      "id": "consultas-y-contratacion",
      "heading": "Consultas y contratación",
      "paragraphs": [
        "Podés usar WhatsApp, correo o teléfono para contarnos qué necesitás resolver. Enviar una consulta, intercambiar mensajes o conversar con Samuel no crea por sí solo un contrato de prestación de servicios ni una obligación de contratar.",
        "Los precios, pagos, responsabilidades, propiedad intelectual de los entregables, garantías, soporte y mantenimiento se definen en la propuesta o acuerdo correspondiente."
      ]
    },
    {
      "id": "uso-responsable",
      "heading": "Uso responsable",
      "paragraphs": [
        "Usá el sitio y sus canales para consultas legítimas. No los utilices para enviar spam, distribuir contenido malicioso, intentar acceder a información ajena o interferir con su funcionamiento. No incluyas contraseñas, credenciales ni datos sensibles en una consulta inicial."
      ]
    },
    {
      "id": "materiales-y-licencias",
      "heading": "Materiales y licencias",
      "paragraphs": [
        "La consulta del sitio no implica una cesión de derechos sobre marcas, textos, diseños o código. Cuando un material se publica con una licencia específica, su uso se rige por esa licencia. Los materiales y herramientas de terceros conservan sus condiciones aplicables."
      ]
    },
    {
      "id": "enlaces-y-disponibilidad",
      "heading": "Enlaces y disponibilidad",
      "paragraphs": [
        "Algunos enlaces llevan a servicios externos, como GitHub, LinkedIn o WhatsApp, sujetos a sus propias condiciones. La disponibilidad del sitio y de esos servicios puede variar. Podés elegir entre los canales de contacto publicados."
      ]
    },
    {
      "id": "privacidad-y-cambios",
      "heading": "Privacidad y cambios",
      "paragraphs": [
        "La Política de privacidad explica cómo se tratan los datos de una consulta. Si actualizamos estos términos, publicaremos la versión vigente con su fecha de actualización. Podés escribirnos al correo indicado para consultar su alcance."
      ]
    }
  ],
  "metadata": {
    "title": "Términos y condiciones | FURLANICH",
    "description": "Condiciones de uso del sitio FURLANICH y de las consultas iniciales, bajo la responsabilidad de Samuel Furlanich."
  }
}
```
<!-- SFC-PUBLIC-COPY-ES:END -->

<!-- SFC-PUBLIC-COPY-EN:START -->
```json
{
  "locale": "en",
  "routeId": "terms",
  "title": "Terms and Conditions",
  "chrome": {
    "contentsLabel": "Contents",
    "updateLabel": "Last updated",
    "reciprocalLabel": "Read the Privacy Policy",
    "reciprocalHref": "/en/privacy/"
  },
  "sections": [
    {
      "id": "responsible-party-and-scope",
      "heading": "Responsible party and scope",
      "paragraphs": [
        "This website presents the work and services of FURLANICH, the brand under which Samuel Furlanich operates. The supplied address is Chivilcoy 6620, Buenos Aires, Argentina. Questions about the website or these terms can be sent to samuelfurlanich@gmail.com.",
        "These terms cover use of the website and initial contact with the studio. The terms of any project or service are agreed separately."
      ]
    },
    {
      "id": "website-information",
      "heading": "Website information",
      "paragraphs": [
        "Service descriptions explain the types of needs we can assess. The scope, deliverables, timing and financial terms of any engagement require a specific agreement. Published projects identify their context, available evidence and limitations; an example or prototype does not by itself establish a commercial outcome."
      ]
    },
    {
      "id": "inquiries-and-engagements",
      "heading": "Inquiries and engagements",
      "paragraphs": [
        "You can use WhatsApp, email or phone to describe what you need to solve. Sending an inquiry, exchanging messages or speaking with Samuel does not by itself create a service contract or an obligation to engage the studio.",
        "Pricing, payments, responsibilities, intellectual property in deliverables, warranties, support and maintenance are defined in the relevant proposal or agreement."
      ]
    },
    {
      "id": "responsible-use",
      "heading": "Responsible use",
      "paragraphs": [
        "Use the website and its channels for legitimate inquiries. Do not use them to send spam, distribute malicious content, attempt to access another person's information or interfere with their operation. Do not include passwords, credentials or sensitive information in an initial inquiry."
      ]
    },
    {
      "id": "materials-and-licenses",
      "heading": "Materials and licenses",
      "paragraphs": [
        "Viewing the website does not transfer rights in brands, text, designs or code. Where material is published under a specific license, that license governs its use. Third-party materials and tools remain subject to their applicable terms."
      ]
    },
    {
      "id": "links-and-availability",
      "heading": "Links and availability",
      "paragraphs": [
        "Some links lead to external services, such as GitHub, LinkedIn or WhatsApp, which have their own terms. Availability of the website and external services may vary. You can choose between the published contact channels."
      ]
    },
    {
      "id": "privacy-and-changes",
      "heading": "Privacy and changes",
      "paragraphs": [
        "The Privacy Policy explains how inquiry information is handled. If these terms change, we will publish the current version with its update date. You can contact the email address above with questions about their scope."
      ]
    }
  ],
  "metadata": {
    "title": "Terms and Conditions | FURLANICH",
    "description": "Terms for using the FURLANICH website and making initial inquiries, under the responsibility of Samuel Furlanich."
  }
}
```
<!-- SFC-PUBLIC-COPY-EN:END -->

## Original Spanish draft — PROPOSED, professional review required

Retired historical anchor: the prior counsel-gated draft is preserved at the Task 12 base in Git. The direct-contact canonical copy above replaces it.
