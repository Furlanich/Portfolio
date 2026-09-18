import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, join, relative } from 'node:path';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const outputRoot = join(projectRoot, '..', 'out');
const configuredBasePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

const artifacts = [
  { route: '/', file: 'index.html', lang: 'es-AR' },
  { route: '/servicios/', file: 'servicios/index.html', lang: 'es-AR' },
  { route: '/proyectos/', file: 'proyectos/index.html', lang: 'es-AR' },
  { route: '/proyectos/general-reservation-system/', file: 'proyectos/general-reservation-system/index.html', lang: 'es-AR' },
  { route: '/proyectos/the-system/', file: 'proyectos/the-system/index.html', lang: 'es-AR' },
  { route: '/proyectos/mpc-administracion/', file: 'proyectos/mpc-administracion/index.html', lang: 'es-AR' },
  { route: '/contacto/', file: 'contacto/index.html', lang: 'es-AR' },
  { route: '/privacidad/', file: 'privacidad/index.html', lang: 'es-AR' },
  { route: '/estudio/', file: 'estudio/index.html', lang: 'es-AR' },
  { route: '/estudio/samuel-furlanich/', file: 'estudio/samuel-furlanich/index.html', lang: 'es-AR' },
  { route: '/en/', file: 'en/index.html', lang: 'en' },
  { route: '/en/services/', file: 'en/services/index.html', lang: 'en' },
  { route: '/en/work/', file: 'en/work/index.html', lang: 'en' },
  { route: '/en/work/general-reservation-system/', file: 'en/work/general-reservation-system/index.html', lang: 'en' },
  { route: '/en/work/the-system/', file: 'en/work/the-system/index.html', lang: 'en' },
  { route: '/en/work/mpc-administracion/', file: 'en/work/mpc-administracion/index.html', lang: 'en' },
  { route: '/en/contact/', file: 'en/contact/index.html', lang: 'en' },
  { route: '/en/privacy/', file: 'en/privacy/index.html', lang: 'en' },
  { route: '/en/about/', file: 'en/about/index.html', lang: 'en' },
  { route: '/en/about/samuel-furlanich/', file: 'en/about/samuel-furlanich/index.html', lang: 'en' },
];

const studioRequirements = {
  'estudio/index.html': {
    heading: 'Software a medida con responsabilidad técnica directa.',
    sections: [
      'Dirección técnica de principio a fin',
      'Principios para trabajar con claridad',
      'Base en Buenos Aires, disponibilidad nacional e internacional',
      'La persona detrás de la dirección técnica',
      'Conversemos sobre lo que hoy frena a tu negocio',
    ],
    references: ['/contacto/', '/estudio/samuel-furlanich/', '/en/about/'],
  },
  'en/about/index.html': {
    heading: 'Custom software with direct technical accountability.',
    sections: [
      'Technical direction from start to finish',
      'Principles for clear delivery',
      'Based in Buenos Aires, available nationally and internationally',
      'The person behind the technical direction',
      "Let's talk about what's holding your business back",
    ],
    references: ['/en/contact/', '/en/about/samuel-furlanich/', '/estudio/'],
  },
};

const founderRequirements = {
  'estudio/samuel-furlanich/index.html': {
    heading: 'Samuel Furlanich',
    sections: ['Perfil profesional', 'Experiencia profesional', 'Formación', 'Sistemas que podemos construir', 'Trabajo y evidencia técnica', '¿Querés conversar sobre una necesidad de tu negocio?'],
    projects: '/proyectos/',
    contact: '/contacto/',
    cv: '/Samuel-Furlanich-CV.pdf',
    mpc: 'MPC Administración',
    mpcHref: '/proyectos/mpc-administracion/',
  },
  'en/about/samuel-furlanich/index.html': {
    heading: 'Samuel Furlanich',
    sections: ['Professional profile', 'Professional experience', 'Education', 'Systems we can engineer', 'Work and technical evidence', 'Want to discuss a business need?'],
    projects: '/en/work/',
    contact: '/en/contact/',
    cv: '/Samuel-Furlanich-CV.pdf',
    mpc: 'MPC Administración',
    mpcHref: '/en/work/mpc-administracion/',
  },
};
const homepageRequirements = {
  'index.html': {
    sections: [
      ['problems', 'problems-heading', 'Cuando lo manual empieza a frenar el negocio'],
      ['services', 'services-heading', 'Servicios para necesidades concretas'],
      ['audiences', 'audiences-heading', 'Pensado para negocios con operaciones reales'],
      ['proof', 'proof-heading', 'Credibilidad sin promesas infladas'],
      ['proceso', 'proceso-heading', 'De una necesidad concreta a una solución mantenible'],
      ['founder', 'founder-heading', 'Responsabilidad técnica directa'],
      ['cta', 'cta-heading', '¿Tenés una necesidad concreta o un sistema que necesita atención?'],
    ],
    requiredReferences: [
      '/servicios/',
      '/contacto/',
      '/estudio/samuel-furlanich/',
      '/#proceso',
      'https://wa.me/5491150117565',
    ],
  },
  'en/index.html': {
    sections: [
      ['problems', 'problems-heading', 'When manual work starts holding the business back'],
      ['services', 'services-heading', 'Services for concrete business needs'],
      ['audiences', 'audiences-heading', 'Built for businesses with real operations'],
      ['proof', 'proof-heading', 'Credibility without inflated claims'],
      ['process', 'process-heading', 'From a concrete need to a maintainable solution'],
      ['founder', 'founder-heading', 'Direct technical responsibility'],
      ['cta', 'cta-heading', 'Do you have a concrete need or a system that needs attention?'],
    ],
    requiredReferences: [
      '/en/services/',
      '/en/contact/',
      '/en/about/samuel-furlanich/',
      '/en/#process',
      'https://wa.me/5491150117565',
    ],
  },
};

const servicesRequirements = {
  'servicios/index.html': {
    route: '/servicios/',
    lang: 'es-AR',
    heading: 'Servicios para resolver necesidades concretas del negocio',
    indexLabel: 'Ir a un servicio',
    index: [
      ['/servicios/#web', 'Sitios y aplicaciones web'],
      ['/servicios/#whatsapp', 'WhatsApp e integraciones'],
      ['/servicios/#consultoria', 'Mantenimiento y consultoría'],
    ],
    services: [
      ['web', 'Sitios y aplicaciones web comerciales'],
      ['whatsapp', 'Automatización por WhatsApp e integraciones'],
      ['consultoria', 'Mantenimiento y consultoría de software'],
    ],
    groups: [
      'Situaciones habituales', 'Qué resultado buscamos', 'Distintos niveles de trabajo web',
      'Ejemplos posibles', 'Un trabajo puede incluir', 'No incluye automáticamente',
      'Dependencias externas', 'Buen encaje', 'Cuándo conviene otra alternativa', 'Evidencia disponible',
    ],
    principlesHeading: 'Qué podés esperar de cualquier servicio',
    finalHeading: 'Contanos qué necesitás resolver',
    actions: [
      'Contanos qué necesitás resolver en la web',
      'Conversemos sobre tu flujo por WhatsApp',
      'Contanos qué pasa con tu sistema',
      'Iniciar una consulta',
    ],
    evidence: [
      'El repositorio conserva un sistema general de reservas publicado por Samuel como evidencia de implementación.',
      'Hoy no hay un proyecto público de automatización por WhatsApp',
      'Hoy no hay una intervención pública de mantenimiento o consultoría',
    ],
  },
  'en/services/index.html': {
    route: '/en/services/',
    lang: 'en',
    heading: 'Services for concrete business needs',
    indexLabel: 'Jump to a service',
    index: [
      ['/en/services/#web', 'Websites and web applications'],
      ['/en/services/#whatsapp', 'WhatsApp and integrations'],
      ['/en/services/#consulting', 'Maintenance and consulting'],
    ],
    services: [
      ['web', 'Business websites and web applications'],
      ['whatsapp', 'WhatsApp automation and integrations'],
      ['consulting', 'Software maintenance and IT consulting'],
    ],
    groups: [
      'Common situations', 'The outcome we work towards', 'Different levels of web work',
      'Representative examples', 'An engagement may include', 'Not automatically included',
      'External dependencies', 'A good fit', 'When another option may be better', 'Available evidence',
    ],
    principlesHeading: 'What you can expect from every service',
    finalHeading: 'Tell us what you need to solve',
    actions: [
      'Tell us what you need to solve on the web',
      'Discuss your WhatsApp workflow',
      'Tell us what is happening with your system',
      'Start an enquiry',
    ],
    evidence: [
      'The repository contains a general reservation system published by Samuel as implementation evidence.',
      'There is currently no public WhatsApp automation project',
      'There is currently no public maintenance or consulting intervention',
    ],
  },
};

const projectsRequirements = {
  'proyectos/index.html': {
    heading: 'Proyectos seleccionados',
    introduction: 'Publicamos trabajo solo cuando podemos explicar con claridad',
    cards: [
      ['Gestión de reservas para transporte de pasajeros', 'Ver proyecto', '/proyectos/general-reservation-system/'],
      ['Gestión multiusuario de campañas de rol', 'Ver proyecto', '/proyectos/the-system/'],
    ],
    excludedCard: 'Gestión educativa de producción y stock',
    scopeHeading: 'Alcance de publicación',
    finalHeading: '¿Necesitás resolver algo parecido?',
    finalAction: 'Hablar sobre tu proyecto',
    forbiddenTaxonomy: ['Soluciones en producción', 'Laboratorio FURLANICH', 'Prototipos funcionales'],
  },
  'en/work/index.html': {
    heading: 'Selected work',
    introduction: 'We publish work only when we can clearly explain',
    cards: [
      ['Passenger transport reservation management', 'View project', '/en/work/general-reservation-system/'],
      ['Multi-user role-playing campaign management', 'View project', '/en/work/the-system/'],
    ],
    excludedCard: 'Educational production and inventory management',
    scopeHeading: 'Publication scope',
    finalHeading: 'Need to solve something similar?',
    finalAction: 'Discuss your project',
    forbiddenTaxonomy: ['Production solutions', 'FURLANICH Lab', 'Functional prototypes'],
  },
};

const privacyRequirements = {
  'privacidad/index.html': {
    heading: 'Privacidad de esta demostración',
    introduction:
      'Este sitio funciona como portfolio y demostración técnica. No acepta consultas comerciales mediante el formulario y no presenta esta página como una política revisada por un profesional legal.',
    sections: [
      'Qué ocurre con los datos del formulario',
      'Alojamiento y datos técnicos',
      'Alternativas externas',
      'Información sensible',
      'Conservación y consultas',
      'Activación comercial futura',
    ],
    githubLabel: 'Ver la declaración de privacidad de GitHub',
  },
  'en/privacy/index.html': {
    heading: 'Privacy in this demonstration',
    introduction:
      'This site operates as a portfolio and technical showcase. It does not accept commercial inquiries through the form and does not present this page as a professionally reviewed legal policy.',
    sections: [
      'What happens to form data',
      'Hosting and technical data',
      'External alternatives',
      'Sensitive information',
      'Retention and questions',
      'Future commercial activation',
    ],
    githubLabel: "View GitHub's privacy statement",
  },
};

const contactRequirements = {
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

const detailRequirements = {
  'proyectos/general-reservation-system/index.html': {
    route: '/proyectos/general-reservation-system/',
    title: 'Gestión de reservas para transporte de pasajeros',
    headerSummary: 'Código para gestionar recorridos, estaciones, asientos y reservas de transporte de pasajeros.',
    evidenceStatement: 'Evidencia de implementación basada en el repositorio público',
    visual: '/projects/general-reservation-system/conceptual-workflow.webp',
    alt: 'Diagrama conceptual del flujo de recorridos, estaciones, disponibilidad de asientos, reservas y autogestión de pasajeros.',
    source: 'https://github.com/Furlanich/GeneralReservationSystem',
    limitation: 'No hay una demostración pública verificada. El funcionamiento actual no fue revalidado y la interfaz de pagos no se presenta como implementada. No se afirman adopción, disponibilidad ni resultados comerciales.',
    relatedService: '/servicios/#web',
    founder: '/estudio/samuel-furlanich/',
    contact: '/contacto/',
    alternate: '/en/work/general-reservation-system/',
    headings: ['Contexto y oportunidad', 'Alcance implementado', 'Evidencia y límites', 'Resultado y estado', 'Evidencia pública', 'Limitaciones y alcance', 'Siguientes destinos'],
  },
  'proyectos/the-system/index.html': {
    route: '/proyectos/the-system/',
    title: 'Gestión multiusuario de campañas de rol',
    headerSummary: 'Laboratorio de campañas de rol con código para cuentas, membresías, invitaciones y permisos.',
    evidenceStatement: 'Evidencia de implementación basada en el repositorio público',
    visual: '/projects/the-system/conceptual-access-model.webp',
    alt: 'Diagrama conceptual de un espacio de campañas conectado con identidad, membresías, invitaciones, permisos y límites de suscripción.',
    source: 'https://github.com/Furlanich/The-System',
    limitation: 'No hay demostración pública ni ejecución actual verificada. La suscripción está modelada en el código; no se presenta como facturación operativa. Escenas, activos, notas y colaboración completa no se presentan como entregados.',
    relatedService: '/servicios/#web',
    founder: '/estudio/samuel-furlanich/',
    contact: '/contacto/',
    alternate: '/en/work/the-system/',
    headings: ['Contexto y oportunidad', 'Alcance implementado', 'Evidencia y límites', 'Resultado y estado', 'Evidencia pública', 'Limitaciones y alcance', 'Siguientes destinos'],
  },
  'proyectos/mpc-administracion/index.html': {
    route: '/proyectos/mpc-administracion/',
    title: 'Gestión educativa de producción y stock',
    headerSummary: 'Proyecto educativo grupal de 2021 para administrar producción y stock de una fábrica de quesos ficticia.',
    evidenceStatement: 'Evidencia de implementación basada en el repositorio público',
    visual: '/projects/mpc-administracion/conceptual-operations-model.webp',
    alt: 'Diagrama conceptual de producción, stock, administración de usuarios, registros y datos de maduración para una organización ficticia.',
    source: 'https://github.com/Furlanich/MilkyPantsCheese-Administracion-',
    limitation: 'No se verificó su funcionamiento actual. No se afirma autoría individual, uso real, despliegue ni resultado comercial. No hay material visual autorizado del sistema original.',
    relatedService: null,
    founder: '/estudio/samuel-furlanich/',
    contact: '/contacto/',
    alternate: '/en/work/mpc-administracion/',
    headings: ['Contexto y oportunidad', 'Alcance implementado', 'Evidencia y límites', 'Resultado y estado', 'Evidencia pública', 'Limitaciones y alcance', 'Siguientes destinos'],
  },
  'en/work/general-reservation-system/index.html': {
    route: '/en/work/general-reservation-system/',
    title: 'Passenger transport reservation management',
    headerSummary: 'Code for managing passenger transport routes, stations, seats and reservations.',
    evidenceStatement: 'Implementation evidence based on the public repository',
    visual: '/projects/general-reservation-system/conceptual-workflow.webp',
    alt: 'Conceptual diagram of routes, stations, seat availability, reservations, and passenger self-service.',
    source: 'https://github.com/Furlanich/GeneralReservationSystem',
    limitation: 'There is no verified public demonstration. Current behavior has not been revalidated and the payment interface is not presented as implemented. Adoption, uptime and business results are not claimed.',
    relatedService: '/en/services/#web',
    founder: '/en/about/samuel-furlanich/',
    contact: '/en/contact/',
    alternate: '/proyectos/general-reservation-system/',
    headings: ['Context and opportunity', 'Implemented scope', 'Evidence and limitations', 'Result and current state', 'Public evidence', 'Limitations and scope', 'Next destinations'],
  },
  'en/work/the-system/index.html': {
    route: '/en/work/the-system/',
    title: 'Multi-user role-playing campaign management',
    headerSummary: 'A role-playing campaign lab with code for accounts, memberships, invitations and permissions.',
    evidenceStatement: 'Implementation evidence based on the public repository',
    visual: '/projects/the-system/conceptual-access-model.webp',
    alt: 'Conceptual diagram of a campaign workspace connected to identity, memberships, invitations, permissions, and subscription boundaries.',
    source: 'https://github.com/Furlanich/The-System',
    limitation: 'There is no public demonstration or verified current execution. Subscription boundaries are modeled in code, not presented as operational billing. Scenes, assets, notes and full collaboration are not presented as delivered.',
    relatedService: '/en/services/#web',
    founder: '/en/about/samuel-furlanich/',
    contact: '/en/contact/',
    alternate: '/proyectos/the-system/',
    headings: ['Context and opportunity', 'Implemented scope', 'Evidence and limitations', 'Result and current state', 'Public evidence', 'Limitations and scope', 'Next destinations'],
  },
  'en/work/mpc-administracion/index.html': {
    route: '/en/work/mpc-administracion/',
    title: 'Educational production and inventory management',
    headerSummary: 'A 2021 educational group project for managing production and inventory at a fictional cheese factory.',
    evidenceStatement: 'Implementation evidence based on the public repository',
    visual: '/projects/mpc-administracion/conceptual-operations-model.webp',
    alt: 'Conceptual diagram of production, inventory, user administration, logs, and curing data for a fictional organization.',
    source: 'https://github.com/Furlanich/MilkyPantsCheese-Administracion-',
    limitation: 'Current functionality has not been verified. Sole authorship, real-world use, deployment and business results are not claimed. No visual material from the original system is authorized.',
    relatedService: null,
    founder: '/en/about/samuel-furlanich/',
    contact: '/en/contact/',
    alternate: '/proyectos/mpc-administracion/',
    headings: ['Context and opportunity', 'Implemented scope', 'Evidence and limitations', 'Result and current state', 'Public evidence', 'Limitations and scope', 'Next destinations'],
  },
};

function countMatches(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

function hasHeading(html, level, text) {
  return new RegExp(`<${level}\\b[^>]*>${escapeRegExp(text)}</${level}>`).test(html);
}

const chromeRequirements = {
  'es-AR': {
    navigation: 'Navegación principal',
    menu: 'Abrir navegación principal',
    subjects: ['Servicios', 'Proyectos', 'Cómo trabajamos', 'El estudio'],
    primary: 'Ver contacto',
    footerLabels: ['Servicios', 'Proyectos', 'Cómo trabajamos', 'El estudio', 'Contacto', 'Privacidad'],
  },
  en: {
    navigation: 'Primary navigation',
    menu: 'Open primary navigation',
    subjects: ['Services', 'Work', 'How we work', 'About'],
    primary: 'Contact options',
    footerLabels: ['Services', 'Work', 'How we work', 'About', 'Contact', 'Privacy'],
  },
};

function assertChromeArtifact(artifact, html) {
  const requirement = chromeRequirements[artifact.lang];
  if (!requirement) return;

  const header = html.match(/<header\b[\s\S]*?<\/header>/i)?.[0];
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0];
  if (!header) {
    failures.push(`${artifact.file}: missing site header`);
    return;
  }
  if (!footer) {
    failures.push(`${artifact.file}: missing site footer`);
    return;
  }

  if (!header.includes(`aria-label="${requirement.navigation}"`)) {
    failures.push(`${artifact.file}: missing labelled primary navigation`);
  }
  if (!header.includes(`aria-label="${requirement.menu}"`)) {
    failures.push(`${artifact.file}: missing native mobile navigation label`);
  }
  for (const label of [...requirement.subjects, requirement.primary]) {
    if (!header.includes(`>${label}<`)) {
      failures.push(`${artifact.file}: missing approved header label "${label}"`);
    }
  }

  for (const label of requirement.footerLabels) {
    if (!footer.includes(`>${label}<`)) {
      failures.push(`${artifact.file}: missing approved footer label "${label}"`);
    }
  }
  if (!footer.includes('hrefLang="')) {
    failures.push(`${artifact.file}: missing footer language switch`);
  }
  if (!/©[\s\S]*\d{4}[\s\S]*FURLANICH/.test(footer)) {
    failures.push(`${artifact.file}: missing current-year footer utility`);
  }

  const directChannelHrefs = [...footer.matchAll(/href="(https:\/\/wa\.me[^"]+|mailto:[^"]+|tel:[^"]+)"/g)]
    .map((match) => match[1]);
  const expectedDirectChannelHrefs = [
    'https://wa.me/5491150117565',
    'mailto:samuelfurlanich@gmail.com',
    'tel:+5491150117565',
  ];
  if (JSON.stringify(directChannelHrefs) !== JSON.stringify(expectedDirectChannelHrefs)) {
    failures.push(`${artifact.file}: direct footer channels are missing or out of order`);
  }
}

function assertServicesArtifact(artifact, html) {
  const requirement = servicesRequirements[artifact.file];
  if (!requirement) return;

  if (countMatches(html, /<main\b/g) !== 1) {
    failures.push(`${artifact.file}: expected exactly one main landmark`);
  }
  if (countMatches(html, /<h1\b/g) !== 1 || !html.includes(requirement.heading)) {
    failures.push(`${artifact.file}: expected one approved visible H1`);
  }
  if (!html.includes(`<nav aria-label="${requirement.indexLabel}"`)) {
    failures.push(`${artifact.file}: missing labelled service index`);
  }
  if (!html.includes('<nav') || !html.includes('<ul')) {
    failures.push(`${artifact.file}: service index must use nav and ul semantics`);
  }

  for (const [route, label] of requirement.index) {
    const expected = expectedHref(route);
    if (!html.includes(`href="${expected}"`) || !html.includes(label)) {
      failures.push(`${artifact.file}: missing service index link ${expected}`);
    }
  }

  let previousSectionPosition = -1;
  for (const [id, heading] of requirement.services) {
    const sectionPosition = html.search(new RegExp(`<section\\b[^>]*\\bid="${escapeRegExp(id)}"`));
    if (sectionPosition === -1) {
      failures.push(`${artifact.file}: missing Services section id "${id}"`);
    } else if (sectionPosition <= previousSectionPosition) {
      failures.push(`${artifact.file}: Services section "${id}" is out of order`);
    }
    previousSectionPosition = sectionPosition;
    if (!hasHeading(html, 'h2', heading)) {
      failures.push(`${artifact.file}: missing visible Services heading "${heading}"`);
    }
  }

  for (const group of requirement.groups) {
    if (!hasHeading(html, 'h3', group)) {
      failures.push(`${artifact.file}: missing internal group heading "${group}"`);
    }
  }
  if (!hasHeading(html, 'h2', requirement.principlesHeading)) {
    failures.push(`${artifact.file}: missing principles heading`);
  }
  if (!hasHeading(html, 'h2', requirement.finalHeading)) {
    failures.push(`${artifact.file}: missing final CTA heading`);
  }
  for (const action of requirement.actions) {
    if (!html.includes(action)) failures.push(`${artifact.file}: missing CTA label "${action}"`);
  }
  for (const evidence of requirement.evidence) {
    if (!html.includes(evidence)) failures.push(`${artifact.file}: missing evidence text "${evidence}"`);
  }

  const forbidden = [
    /https?:\/\/[^\"]*(?:general.?reservation|reservation.?system)/i,
    /Busesfy|ChronoApp|MPC Administración|Documancer/i,
    /<img\b/i,
    /project-card|case-study|testimonial|client-logo|metric-card/i,
  ];
  for (const pattern of forbidden) {
    if (pattern.test(html)) failures.push(`${artifact.file}: forbidden public evidence or route content matched ${pattern}`);
  }
}

function assertProjectsArtifact(artifact, html) {
  const requirement = projectsRequirements[artifact.file];
  if (!requirement) return;
  if (countMatches(html, /<main\b/g) !== 1) failures.push(`${artifact.file}: expected exactly one main landmark`);
  if (countMatches(html, /<h1\b/g) !== 1 || !html.includes(requirement.heading)) {
    failures.push(`${artifact.file}: expected one approved visible H1`);
  }
  if (!html.includes(requirement.introduction)) failures.push(`${artifact.file}: missing approved introduction`);
  let previousCardPosition = -1;
  for (const [title, action, href] of requirement.cards) {
    const cardPosition = html.indexOf(title);
    if (cardPosition === -1 || cardPosition <= previousCardPosition) {
      failures.push(`${artifact.file}: cards are missing or out of approved order`);
    }
    previousCardPosition = cardPosition;
    if (!html.includes(action)) failures.push(`${artifact.file}: missing card action ${action}`);
    const expectedReference = href.startsWith('/') ? expectedHref(href) : href;
    if (!html.includes(`href="${expectedReference}"`)) failures.push(`${artifact.file}: missing project link ${expectedReference}`);
  }
  if (html.includes(requirement.excludedCard)) failures.push(`${artifact.file}: MPC must remain out of the commercial index`);
  if (countMatches(html, /<article\b/g) !== requirement.cards.length) {
    failures.push(`${artifact.file}: expected exactly ${requirement.cards.length} selected project cards`);
  }
  if (!html.includes('data-project-presentation="lead"') || !html.includes('data-project-presentation="secondary"')) {
    failures.push(`${artifact.file}: missing editorial lead/secondary presentation markers`);
  }
  if (!hasHeading(html, 'h2', requirement.scopeHeading)) failures.push(`${artifact.file}: missing publication scope heading`);
  if (!hasHeading(html, 'h2', requirement.finalHeading)) failures.push(`${artifact.file}: missing final CTA heading`);
  if (!html.includes(requirement.finalAction)) failures.push(`${artifact.file}: missing final CTA action`);
  for (const taxonomy of requirement.forbiddenTaxonomy) {
    if (new RegExp(`<h3\\b[^>]*>${escapeRegExp(taxonomy)}</h3>`).test(html)) {
      failures.push(`${artifact.file}: empty taxonomy group rendered: ${taxonomy}`);
    }
  }
  if (countMatches(html, /<img\b/gi) > 0) failures.push(`${artifact.file}: unexpected image in image-free index`);
  const firstArticle = html.indexOf('<article');
  const firstArticleClose = html.indexOf('</article>', firstArticle);
  const nestedArticle = firstArticle !== -1 && html.indexOf('<article', firstArticle + 1) < firstArticleClose;
  if (nestedArticle) failures.push(`${artifact.file}: nested project cards`);
}

function assertStudioArtifact(artifact, html) {
  const requirement = studioRequirements[artifact.file];
  if (!requirement) return;

  if (countMatches(html, /<main\b/g) !== 1) {
    failures.push(`${artifact.file}: expected exactly one main landmark`);
  }
  if (countMatches(html, /<h1\b/g) !== 1 || !html.includes(requirement.heading)) {
    failures.push(`${artifact.file}: expected one approved visible H1`);
  }

  let previousHeadingPosition = -1;
  for (const heading of requirement.sections) {
    const position = html.indexOf(heading);
    if (position === -1 || position <= previousHeadingPosition) {
      failures.push(`${artifact.file}: Studio sections are missing or out of approved order`);
    }
    previousHeadingPosition = position;
  }

  for (const route of requirement.references) {
    const expected = expectedHref(route);
    if (!html.includes(`href="${expected}"`)) {
      failures.push(`${artifact.file}: missing Studio reference ${expected}`);
    }
  }

  if (countMatches(html, /<img\b/gi) > 0) {
    failures.push(`${artifact.file}: unexpected Studio image`);
  }
}

function assertFounderArtifact(artifact, html) {
  const requirement = founderRequirements[artifact.file];
  if (!requirement) return;

  if (countMatches(html, /<main\b/g) !== 1) {
    failures.push(artifact.file + ': expected exactly one main landmark');
  }
  if (countMatches(html, /<h1\b/g) !== 1 || !html.includes(requirement.heading)) {
    failures.push(artifact.file + ': expected one approved Founder H1');
  }

  let previousHeadingPosition = -1;
  for (const heading of requirement.sections) {
    const position = html.indexOf(heading);
    if (position === -1 || position <= previousHeadingPosition) {
      failures.push(artifact.file + ': Founder sections are missing or out of approved order');
    }
    previousHeadingPosition = position;
  }

  for (const route of [requirement.projects, requirement.contact, requirement.cv]) {
    const expected = expectedHref(route);
    if (!html.includes('href="' + expected + '"')) {
      failures.push(artifact.file + ': missing Founder reference ' + expected);
    }
  }

  for (const link of ['https://www.linkedin.com/in/samuel-furlanich/', 'https://github.com/Furlanich']) {
    if (!html.includes('href="' + link + '"')) {
      failures.push(artifact.file + ': missing professional link ' + link);
    }
  }

  if (countMatches(html, /<li\b[^>]*data-founder-experience-entry/g) !== 2) {
    failures.push(artifact.file + ': expected exactly two Founder experience entries');
  }
  if (countMatches(html, /<section\b[^>]*data-founder-capability-group/g) !== 4) {
    failures.push(artifact.file + ': expected exactly four Founder capability groups');
  }
  if (!html.includes('Clever Soft SA') || /<h[1-6]\b[^>]*>[^<]*Clever Soft SA/i.test(html)) {
    failures.push(artifact.file + ': Clever Soft SA must remain narrative-only');
  }
  if (!html.includes(requirement.mpc) || !html.includes('href="' + expectedHref(requirement.mpcHref) + '"')) {
    failures.push(artifact.file + ': missing Founder-owned MPC education destination');
  }
  if (countMatches(html, /<img\b/gi) > 0) {
    failures.push(artifact.file + ': unexpected Founder portrait or media');
  }
}
function assertProjectDetailArtifact(artifact, html) {
  const requirement = detailRequirements[artifact.file];
  if (!requirement) return;
  const publicationScope = requirement.relatedService
    ? artifact.file.startsWith('en/')
      ? 'The public description is limited by publication permissions. The image is conceptual and does not show a real interface.'
      : 'La descripción pública está limitada por permisos de publicación. La imagen es conceptual y no muestra una interfaz real.'
    : artifact.file.startsWith('en/')
      ? 'The public description is limited by the educational context and publication permissions. The image is conceptual and does not show a real interface.'
      : 'La descripción pública está limitada por el contexto educativo y los permisos de publicación. La imagen es conceptual y no muestra una interfaz real.';
  if (countMatches(html, /<main\b/g) !== 1) failures.push(`${artifact.file}: expected exactly one main landmark`);
  if (countMatches(html, /<h1\b/g) !== 1 || !html.includes(requirement.title)) {
    failures.push(`${artifact.file}: expected one approved visible H1`);
  }
  for (const text of [requirement.headerSummary, requirement.evidenceStatement, requirement.limitation, publicationScope]) {
    if (!html.includes(text)) failures.push(`${artifact.file}: missing approved detail text "${text}"`);
  }
  let previousHeadingPosition = -1;
  for (const heading of requirement.headings) {
    const position = html.indexOf(heading);
    if (position === -1 || position <= previousHeadingPosition) failures.push(`${artifact.file}: detail sections are missing or out of order`);
    previousHeadingPosition = position;
  }
  const expectedImage = expectedHref(requirement.visual);
  if (!html.includes(expectedImage) || !html.includes(`alt="${requirement.alt}"`)) {
    failures.push(`${artifact.file}: missing approved conceptual visual or alt text`);
  }
  if (!html.includes(`href="${requirement.source}"`) || !html.includes(requirement.source)) {
    failures.push(`${artifact.file}: missing approved public repository evidence link`);
  }
  if (!requirement.relatedService && /href="[^"]*services\/#web"/.test(html)) {
    failures.push(artifact.file + ': MPC must not expose a commercial service destination');
  }
  for (const route of [requirement.relatedService, requirement.founder, requirement.contact, requirement.alternate]) {
    if (!route) continue;
    const expected = expectedHref(route);
    if (!html.includes(`href="${expected}"`)) failures.push(`${artifact.file}: missing internal detail reference ${expected}`);
  }
  if (countMatches(html, /<img\b/gi) !== 1) failures.push(`${artifact.file}: expected exactly one conceptual visual`);
  if (/Busesfy|ChronoApp|Documancer|PRIVATE|FOUNDER-ONLY|BLOCKED-|functional-demonstration/i.test(html)) {
    failures.push(`${artifact.file}: forbidden non-public or unsupported evidence matched`);
  }
  if (/public\/projects\/.*\.svg|projects\/(?:Busesfy|MPC-Administracion|GRS)\.svg/i.test(html)) {
    failures.push(`${artifact.file}: legacy project asset referenced`);
  }
}

function assertPrivacyArtifact(artifact, html) {
  const requirement = privacyRequirements[artifact.file];
  if (!requirement) return;

  if (countMatches(html, /<main\b/g) !== 1) {
    failures.push(artifact.file + ': expected exactly one main landmark');
  }
  if (countMatches(html, /<h1\b/g) !== 1 || !html.includes(requirement.heading)) {
    failures.push(artifact.file + ': expected one approved visible Privacy H1');
  }
  if (!html.includes(requirement.introduction)) {
    failures.push(artifact.file + ': missing approved Privacy introduction');
  }

  let previousHeadingPosition = -1;
  for (const heading of requirement.sections) {
    const position = html.search(new RegExp('<h2\\b[^>]*>' + escapeRegExp(heading) + '</h2>'));
    if (position === -1 || position <= previousHeadingPosition) {
      failures.push(artifact.file + ': Privacy sections are missing or out of approved order');
    }
    previousHeadingPosition = position;
  }

  const githubHref = 'https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement';
  if (!html.includes('href="' + githubHref + '"') || !html.includes(requirement.githubLabel)) {
    failures.push(artifact.file + ': missing GitHub privacy statement reference');
  }
  if (/DPA|subprocessor|(?:consulta enviada|inquiry sent)/i.test(html)) {
    failures.push(artifact.file + ': live-processing or commercial inquiry claim leaked into Privacy artifact');
  }
}

function assertContactArtifact(artifact, html) {
  const requirement = contactRequirements[artifact.file];
  if (!requirement) return;
  if (countMatches(html, /<main\b/g) !== 1) failures.push(artifact.file + ': expected exactly one Contact main landmark');
  if (countMatches(html, /<h1\b/g) !== 1 || !html.includes(requirement.heading)) {
    failures.push(artifact.file + ': expected one approved Contact H1');
  }
  for (const text of [requirement.notice, requirement.noticeBody, requirement.fallback, ...requirement.fields]) {
    if (!html.includes(text)) failures.push(artifact.file + ': missing approved Contact text "' + text + '"');
  }
  for (const route of [requirement.privacy, requirement.founder]) {
    const expected = expectedHref(route);
    if (!html.includes('href="' + expected + '"')) failures.push(artifact.file + ': missing Contact reference ' + expected);
  }
  if (!html.includes('<form') || !html.includes('Simul') && !html.includes('Simulate')) {
    failures.push(artifact.file + ': missing local-only Contact form');
  }
  if (/NEXT_PUBLIC_FORMSPREE_ENDPOINT|formspree\.io|inquiry sent|consulta enviada/i.test(html)) {
    failures.push(artifact.file + ': contains live provider or delivery wording');
  }
}

function expectedHref(route) {
  return `${configuredBasePath}${route}`;
}

function getInternalReferences(html) {
  return [...html.matchAll(/\b(?:href|src)="([^"]+)"/gi)]
    .map((match) => match[1])
    .filter((value) => value.startsWith('/') && !value.startsWith('//'));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function collectTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectTextFiles(path));
    else if (['.html', '.js', '.json', '.map', '.txt', '.css'].includes(extname(entry.name).toLowerCase())) files.push(path);
  }
  return files;
}

const failures = [];
const allHtml = [];

for (const artifact of artifacts) {
  const filePath = join(outputRoot, artifact.file);

  try {
    const html = await readFile(filePath, 'utf8');
    allHtml.push({ artifact, html });

    if (/PROJECT-(?:GRS|THE-SYSTEM|MPC-ADMIN)/.test(html)) {
      failures.push(`${artifact.file}: internal project identifier leaked into the published artifact`);
    }

    const lang = html.match(/<html\b[^>]*\blang="([^"]+)"/i)?.[1];
    if (lang !== artifact.lang) {
      failures.push(`${artifact.file}: expected <html lang="${artifact.lang}">, found ${lang ?? 'none'}`);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      failures.push(`missing static artifact: ${artifact.file}`);
    } else {
      throw error;
    }
  }
}

const exportedTextFiles = await collectTextFiles(outputRoot);
for (const filePath of exportedTextFiles) {
  const source = await readFile(filePath, 'utf8');
  const file = relative(outputRoot, filePath);
  if (/Busesfy|ChronoApp|Documancer|FOUNDER-ONLY|BLOCKED-|PROJECT-(?:GRS|THE-SYSTEM|MPC-ADMIN)/i.test(source)) {
    failures.push(`${file}: blocked, private, retired, or internal project identity leaked into exported payload`);
  }
  if (/(?:Busesfy|MPC-Administracion|AI-Scheduler|GRS|Documancer|atlas|pulse|vertex)\.svg/i.test(source)) {
    failures.push(`${file}: retired legacy project asset name leaked into exported payload`);
  }
}

const internalReferences = allHtml.flatMap(({ artifact, html }) =>
  getInternalReferences(html).map((value) => ({ artifact: artifact.file, value })),
);

for (const { artifact, html } of allHtml) {
  assertChromeArtifact(artifact, html);
  assertServicesArtifact(artifact, html);
  assertProjectsArtifact(artifact, html);
  assertStudioArtifact(artifact, html);
  assertFounderArtifact(artifact, html);
  assertProjectDetailArtifact(artifact, html);
  assertPrivacyArtifact(artifact, html);
  assertContactArtifact(artifact, html);
  const requirement = homepageRequirements[artifact.file];
  if (!requirement) continue;

  let previousSectionPosition = -1;
  for (const [sectionId, headingId, heading] of requirement.sections) {
    const sectionPosition = html.search(
      new RegExp(`<section\\b[^>]*\\bid="${escapeRegExp(sectionId)}"`),
    );
    if (sectionPosition === -1) {
      failures.push(`${artifact.file}: missing homepage section id "${sectionId}"`);
    } else if (sectionPosition <= previousSectionPosition) {
      failures.push(`${artifact.file}: homepage section "${sectionId}" is out of order`);
    }
    previousSectionPosition = sectionPosition;

    const headingPosition = html.search(
      new RegExp(`<h2\\b[^>]*\\bid="${escapeRegExp(headingId)}"[^>]*>`),
    );
    if (headingPosition === -1) {
      failures.push(`${artifact.file}: missing homepage heading id "${headingId}"`);
    } else if (!html.includes(heading)) {
      failures.push(`${artifact.file}: missing visible homepage heading "${heading}"`);
    }
  }

  for (const reference of requirement.requiredReferences) {
    const expectedReference = reference.startsWith('/') ? expectedHref(reference) : reference;
    if (!html.includes(`href="${expectedReference}"`)) {
      failures.push(`${artifact.file}: missing required homepage reference ${expectedReference}`);
    }
  }
}

if (configuredBasePath) {
  const duplicatedPrefix = `${configuredBasePath}${configuredBasePath}`;

  for (const reference of internalReferences) {
    if (reference.value.startsWith(duplicatedPrefix)) {
      failures.push(`${reference.artifact}: duplicated base path in ${reference.value}`);
    }

    if (
      reference.value !== configuredBasePath &&
      !reference.value.startsWith(`${configuredBasePath}/`)
    ) {
      failures.push(`${reference.artifact}: missing base path in ${reference.value}`);
    }
  }
}

const normalizedReferences = new Set(
  internalReferences.map(({ value }) => value.split(/[?#]/, 1)[0]),
);

for (const artifact of artifacts) {
  const href = expectedHref(artifact.route);
  if (!normalizedReferences.has(href)) {
    failures.push(`missing internal route link: ${href}`);
  }
}

if (failures.length > 0) {
  console.error('Static export verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Static export verified: ${artifacts.length} routes, base path "${configuredBasePath || '/'}".`);
}
