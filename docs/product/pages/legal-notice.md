---
id: PAGE-LEGAL
type: page-spec
status: APPROVED
related:
  - BRAND-POSITIONING
  - CONTENT-LOCALIZATION
  - IA-SITE
  - PAGE-PRIVACY
  - LEGAL-PROTOTYPE-POSTURE
  - RELEASE-READINESS
last_verified: 2026-09-14
---

# Legal Notice page

## Decision — APPROVED

Publish a dedicated, concise Legal Notice at `/aviso-legal/` and `/en/legal/`. Privacy remains a separate page because it explains data handling; this page identifies the site, defines its demonstration and informational scope, and explains intellectual-property, external-link, availability, and change boundaries.

The route pair uses the accepted static localized architecture, trailing slashes, language-context switching, and the existing page shell. It appears in the footer beside Privacy and does not enter primary navigation.

The page is a prototype notice, not commercial Terms and Conditions and not evidence of professional legal review.

## Exact public Spanish copy — APPROVED

**Page label:** `Aviso legal`

**Prototype marker:** `Seguimos creciendo`

**Revision:** `Última actualización: septiembre de 2026.`

### Spanish H1

> Aviso legal

### Spanish lead

> Este sitio presenta FURLANICH, un estudio de desarrollo de software liderado por Samuel Furlanich. Es la muestra profesional actual del estudio: reúne los servicios y capacidades que estamos desarrollando como oferta, junto con productos, proyectos y experiencia técnica que pueden evaluarse públicamente.

### Spanish prototype-status callout

**Heading:** `Alcance del prototipo`

> FURLANICH se encuentra en una etapa de crecimiento y preparación comercial. Este sitio público funciona como una demostración técnica y profesional. La información sobre servicios, capacidades y formas de trabajo es informativa: el sitio no formaliza contrataciones, presupuestos ni relaciones comerciales de manera automática.

### H2: Identificación del sitio

> FURLANICH es presentado y dirigido por Samuel Furlanich desde Buenos Aires, Argentina. Para consultas sobre este sitio, podés escribir a `samuelfurlanich@gmail.com`.

### H2: Finalidad informativa

> El contenido ayuda a conocer el enfoque, los servicios previstos, los productos en desarrollo y la experiencia técnica de FURLANICH. Puede actualizarse a medida que el estudio, sus productos y su oferta evolucionan.

> Una conversación iniciada por WhatsApp, email o teléfono es solamente un contacto inicial. Cualquier alcance, presupuesto, plazo, responsabilidad o contratación requiere una propuesta o acuerdo posterior y expreso entre las partes.

### H2: Contenido y propiedad intelectual

> Los textos, el diseño y el código original creados para FURLANICH deben distinguirse de marcas, herramientas, bibliotecas, proyectos y materiales de terceros. Las marcas y nombres de terceros pertenecen a sus respectivos titulares; su mención no implica patrocinio, asociación ni respaldo.

> Algunos proyectos o repositorios pueden enlazarse públicamente como evidencia o referencia. Cuando incluyan una licencia o condiciones propias, esas reglas determinan su uso. El acceso público a un enlace o repositorio no debe interpretarse por sí solo como transferencia de derechos sobre materiales de FURLANICH o de terceros.

### H2: Servicios y enlaces externos

> El sitio puede abrir servicios externos como GitHub, LinkedIn, WhatsApp, la aplicación o el proveedor de email del visitante, y destinos vinculados desde proyectos o repositorios. Esos servicios operan bajo sus propias condiciones, disponibilidad y reglas de privacidad.

> FURLANICH procura mantener enlaces útiles y descriptivos, pero no controla el contenido, la seguridad ni la continuidad de sitios o aplicaciones de terceros.

### H2: Disponibilidad del prototipo

> Esta demostración puede cambiar, interrumpirse o dejar de estar disponible mientras continúa el desarrollo. No ofrece un acuerdo de nivel de servicio ni garantiza disponibilidad continua.

### H2: Cambios en este aviso

> Este aviso puede actualizarse para reflejar cambios reales en el sitio o en la etapa del estudio. La fecha de la versión publicada se muestra al comienzo de la página; no se presenta un historial anterior que no exista.

## Exact public English copy — APPROVED

**Page label:** `Legal Notice`

**Prototype marker:** `Building what comes next`

**Revision:** `Last updated: September 2026.`

### English H1

> Legal Notice

### English lead

> This website presents FURLANICH, a software development studio led by Samuel Furlanich. It is the studio's current professional showcase, bringing together the services and capabilities we are developing as an offering, along with products, projects, and technical experience that can be evaluated publicly.

### English prototype-status callout

**Heading:** `Prototype scope`

> FURLANICH is growing and preparing for commercial operations. This public website currently serves as a professional and technical demonstration. Information about services, capabilities, and ways of working is provided for informational purposes: the website does not automatically create engagements, quotations, or contractual relationships.

### H2: Site identification

> FURLANICH is presented and led by Samuel Furlanich from Buenos Aires, Argentina. Questions about this website may be sent to `samuelfurlanich@gmail.com`.

### H2: Informational purpose

> The content helps visitors understand FURLANICH's approach, planned services, products in development, and technical experience. It may be updated as the studio, its products, and its offering evolve.

> A conversation started through WhatsApp, email, or phone is only an initial contact. Any scope, quotation, timeline, responsibility, or engagement requires a later express proposal or agreement between the parties.

### H2: Content and intellectual property

> Original text, design, and code created for FURLANICH must be distinguished from third-party marks, tools, libraries, projects, and materials. Third-party marks and names belong to their respective owners; mentioning them does not imply sponsorship, affiliation, or endorsement.

> Some projects or repositories may be linked publicly as evidence or reference material. Where they include their own licence or terms, those rules govern their use. Public access to a link or repository should not, by itself, be understood as a transfer of rights in FURLANICH or third-party material.

### H2: External services and links

> The website may open external services such as GitHub, LinkedIn, WhatsApp, the visitor's email application or provider, and destinations linked from projects or repositories. Those services operate under their own terms, availability, and privacy practices.

> FURLANICH aims to keep links useful and descriptive, but does not control the content, security, or continued availability of third-party websites or applications.

### H2: Prototype availability

> This demonstration may change, be interrupted, or become unavailable while development continues. It does not provide a service-level agreement or guarantee continuous availability.

### H2: Changes to this notice

> This notice may be updated to reflect real changes in the website or the studio's stage of development. The published revision date appears at the start of the page; no earlier version history is presented unless it genuinely exists.

## Page structure and acceptance criteria — APPROVED

- Render one H1, then sequential H2 sections in the order above.
- Show the marker and genuine revision near the H1, followed by the lead and the prototype-status callout.
- Render all legal information as visible, selectable editorial text; do not hide it in accordions.
- Use descriptive `mailto:` and external links. External destinations remain normal links, not endorsements or provider claims.
- Keep the body within the legal-page readable measure defined by `DESIGN-VISUAL`.
- Preserve the exact meaning between locales without mechanically mirroring sentence structure.
- Add `legal` to the semantic route-equivalence map and footer labels/paths. Do not add it to primary navigation.
- Do not add a legal seal, compliance badge, lawyer name, company number, tax ID, legal domicile, registration, certification, insurance claim, or commercial Terms text.
