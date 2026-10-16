// Declarative static-export requirements for the Founder pair (PLAN-SFC-V1 Task 2: one owner per page, data only).
// The shared verifier (scripts/verify-static-export.mjs) imports this map and owns the assertion logic.
export const founderRequirements = {
  'estudio/samuel-furlanich/index.html': {
    heading: 'Samuel Furlanich',
    sections: ['Biografía profesional', 'Perfil profesional', 'Experiencia profesional', 'Formación', 'Capacidades para construir y mejorar sistemas', 'Trabajo y evidencia técnica', '¿Querés conversar sobre una necesidad de tu negocio?'],
    projects: '/proyectos/',
    contact: '/contacto/',
    cv: '/Samuel-Furlanich-CV.pdf',
    mpc: 'MPC Administración',
    mpcAction: 'Ver código fuente',
  },
  'en/about/samuel-furlanich/index.html': {
    heading: 'Samuel Furlanich',
    sections: ['Professional biography', 'Professional profile', 'Professional experience', 'Education', 'Capabilities for building and improving systems', 'Work and technical evidence', 'Want to discuss a business need?'],
    projects: '/en/work/',
    contact: '/en/contact/',
    cv: '/Samuel-Furlanich-CV.pdf',
    mpc: 'MPC Administración',
    mpcAction: 'View source code',
  },
};
