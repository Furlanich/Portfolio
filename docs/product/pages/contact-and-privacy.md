---
id: PAGE-CONTACT
type: page-spec
status: APPROVED
related:
  - ADR-CONTACT-DIRECT-CHANNELS
  - RFC-MARKETING-NARRATIVE-CLOSURE
  - PAGE-PRIVACY
  - HOME-CTA
  - IA-SITE
  - PAGE-FOUNDER
  - CONTENT-LOCALIZATION
  - DESIGN-VISUAL
  - DESIGN-IX-A11Y
  - ARCHITECTURE-MAP
  - RFC-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-PIPELINE
  - ADR-CONTACT-INQUIRY-DEMO-MODE
  - PLAN-CONTACT-INQUIRY-PIPELINE
  - REF-CONTACT-DEMO-KIT
  - RFC-HOME-HERO-IMPLEMENTATION-BOUNDARY
last_verified: 2026-10-18
---

# Contact and privacy pages

## Direct contact decision — APPROVED 2026-10-18

The owner approved removal of the embedded inquiry form from both Contact routes and requested removal of Formspree and mandatory counsel decisions from PLAN-SFC-V1. [ADR-CONTACT-DIRECT-CHANNELS](../../decisions/contact-direct-channels.md) records the explicit supersession. This owner decision replaces the demonstration/commercial form requirements, field/state contracts, provider readiness checklist, and professional-review release gate formerly in this document. Earlier evidence remains dated history in the completed plans and ADRs.

No provider account, backend, endpoint, automated submission, simulated success, inquiry storage, or consent checkbox is part of the website Contact experience. Native links open WhatsApp, the visitor's email application, or their phone application. The visitor decides whether to send a message or place a call. Opening a link is not a delivery confirmation.

## PAGE-CONTACT responsibility and hierarchy

Routes remain Spanish `/contacto/` and English `/en/contact/`. The page is complete without JavaScript. Preserve the Atlas introduction, response expectation, static/Pause slot, opaque Bone contact surface, and subdued Founder bridge.

Source and visual order: H1/introduction → usual response expectation → contact channel description/location → WhatsApp/email/phone links → Privacy reference → Founder bridge. At 820px and above, description and links may share two columns; below 820px they stack. Preserve approved 24/32/40px surface padding, 1180px container, 20/32px outer gutters, and 48px channel targets. There are no form inputs, submit controls, hydration fallback, busy states, validation, success, failure or retry messages.

## Contact facts and copy — APPROVED

Samuel Furlanich is the founder and recipient. Location: Buenos Aires, Argentina. Channels remain:

- WhatsApp: `https://wa.me/5491150117565`, without prefilled message text.
- Email: `mailto:samuelfurlanich@gmail.com`.
- Phone: `tel:+5491150117565`.

| Element | Spanish | English |
| --- | --- | --- |
| H1 | Contanos qué necesitás resolver. | Tell us what you need to solve. |
| Introduction | Samuel revisará personalmente la consulta para determinar si tiene sentido avanzar con una conversación. | Samuel personally reviews every inquiry to determine whether it makes sense to continue with a conversation. |
| Response expectation | Respuesta habitual dentro del mismo día hábil. En casos excepcionales, puede demorar hasta dos días hábiles. | Usual response time is within the same business day. In exceptional cases, it may take up to two business days. |
| Channels heading | Hablemos de tu proyecto. | Let's talk about your project. |
| Context | Escribinos por WhatsApp o correo, o llamanos. Contanos brevemente qué necesitás resolver, cómo funciona hoy y qué te gustaría mejorar. | Write to us on WhatsApp or by email, or give us a call. Briefly describe what you need to solve, how it works today, and what you would like to improve. |
| Channel note | El enlace abre el canal que elijas. Vos decidís qué información compartir. | The link opens your chosen contact channel. You decide what information to share. |
| Privacy link | Cómo tratamos tus datos | How we handle your information |
| Founder bridge | Conocer la trayectoria de Samuel | View Samuel's background |

The response statement describes a usual expectation for direct messages; it is not a guaranteed deadline or incident-support SLA. Typed copy is owned by the locale's `_content/contact.ts`; the commercial entry re-exports that same source.

## PAGE-PRIVACY responsibility

Explain the verified website behavior and direct communication channels: Samuel's identity and contact, Gmail and WhatsApp communications, GitHub Pages technical data, graphics session preferences, data minimization and the email route for access/correction/deletion requests. Do not claim that external messages stay only in browser memory or that the site creates no personal-data obligations. Do not invent a retention schedule, provider deletion guarantee, transfer assessment, professional certification or corporate registration.

Formspree configuration, processor-chain verification, live provider probes, quota monitoring and delivery/deletion receipts are not applicable to this scope. Professional counsel approval is no longer a repository release prerequisite; this is an owner-approved product/workflow decision, not a finding that no privacy obligations exist. Any later embedded intake system requires a new explicit decision and accurate processing disclosures before activation.

## Canonical direct-contact Privacy copy

The bounded JSON below is the canonical legal-template copy and must equal both typed commercial modules. The published Privacy modules use the same sections and locale title/introduction. Task 13 updates existing Privacy routes now; the Terms pair and reciprocal legal navigation remain assigned to Task 16. Publication dates reflect actual publication, not inferred counsel approval.

<!-- SFC-PUBLIC-COPY-ES:START -->
```json
{
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
}
```
<!-- SFC-PUBLIC-COPY-ES:END -->

<!-- SFC-PUBLIC-COPY-EN:START -->
```json
{
  "locale": "en",
  "routeId": "privacy",
  "title": "Privacy and contact",
  "chrome": {
    "contentsLabel": "Contents",
    "updateLabel": "Last updated",
    "reciprocalLabel": "Read the Terms and Conditions",
    "reciprocalHref": "/en/terms/"
  },
  "sections": [
    {
      "id": "responsible-party",
      "heading": "Responsible party and contact",
      "paragraphs": [
        "Samuel Furlanich presents his work under the FURLANICH brand from Buenos Aires, Argentina. For questions about your information, email samuelfurlanich@gmail.com."
      ]
    },
    {
      "id": "direct-contact",
      "heading": "Direct contact",
      "paragraphs": [
        "You can contact Samuel on WhatsApp, by email or by phone. The links open your chosen service or application; you decide what information to send. Samuel uses the information you share to assess and respond to your inquiry and coordinate a possible conversation or engagement.",
        "The published email address receives messages in Gmail, provided by Google. WhatsApp messages and phone calls use their respective services. Those services have their own privacy policies and may process technical communication data."
      ]
    },
    {
      "id": "hosting",
      "heading": "Hosting and technical data",
      "paragraphs": [
        "GitHub Pages publishes the static website files at https://furlanich.github.io/Portfolio/. GitHub states that it records visitors’ IP addresses for security purposes. That processing is governed by its privacy statement.",
        "The website adds no analytics, advertising, profiling, CRM or conversion tracking."
      ]
    },
    {
      "id": "preferences",
      "heading": "Browsing preferences",
      "paragraphs": [
        "The website may keep your animation pause preference and a technical graphics-failure flag for the browsing session. Those values contain no messages or contact information. If storage is unavailable, the website uses a static alternative or a temporary preference in memory."
      ]
    },
    {
      "id": "sensitive-information",
      "heading": "Information you share",
      "paragraphs": [
        "A brief description of the problem and how you would like to proceed is enough for an initial inquiry. Do not share passwords, credentials, client production data or sensitive information."
      ]
    },
    {
      "id": "retention-questions",
      "heading": "Messages and requests about your information",
      "paragraphs": [
        "Messages you send remain in the email or service used for the conversation. The website does not create another copy in an inquiry intake system. To ask how your information is used or request access, correction or deletion, email samuelfurlanich@gmail.com.",
        "Handling those requests depends on the information involved and applicable obligations. Providers manage their own technical records and backups under their policies."
      ]
    }
  ]
}
```
<!-- SFC-PUBLIC-COPY-EN:END -->

## Acceptance and verification

- Both localized Contact pages render one main landmark and H1, genuine direct links, a Privacy link and Founder bridge.
- No form/input/textarea/submit, form-specific client bundle or Formspree request is emitted, including with JavaScript disabled.
- Root and `/Portfolio` internal links, semantic locale switches, keyboard order, visible focus, 320px reflow and zoom remain correct.
- Privacy matches direct-channel behavior and canonical text. Existing Home/Services/Studio referrals must not invite visitors to try a removed form.
- Deterministic checks, served-export browser behavior, accessibility scans and narrow/wide visual review precede the implementation PR. No real message or call is needed to validate links.

## Retired reference anchors

The headings below preserve links from immutable historical plans/reviews. Their former form requirements are superseded by the direct-contact decision above. The complete prior text remains in Git at the Task 12 base, 60b76daa07ed15b8b4a5432dc96043ee80ad689b.

### Task 10 integration-preview exception — APPROVED 2026-10-17

Retired. See the approved direct-contact decision and current requirements above.

### Atlas commercial interaction copy

Retired. See the approved direct-contact decision and current requirements above.

### Formspree Free readiness checklist — PROPOSED operational requirements

Retired. See the approved direct-contact decision and current requirements above.

### Original commercial Privacy draft — PROPOSED, professional review required

Retired. See the approved direct-contact decision and current requirements above.

### Homepage-foundation minimum destination — APPROVED

Retired. See the approved direct-contact decision and current requirements above.

### MKT-D03 — Demonstration presentation contract — REJECTED revision 1

Retired. See the approved direct-contact decision and current requirements above.

### D03 current-versus-proposed bilingual copy

Retired. See the approved direct-contact decision and current requirements above.

### Completed Contact hierarchy — APPROVED

Retired. See the approved direct-contact decision and current requirements above.

### Owner facts for the proposed commercial activation — APPROVED 2026-10-14

Retired. See the approved direct-contact decision and current requirements above.
