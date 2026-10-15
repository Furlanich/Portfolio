// Declarative static-export requirements for the Founder pair (PLAN-SFC-V1 Task 2: one owner per page, data only).
// The shared verifier (scripts/verify-static-export.mjs) imports this map and owns the assertion logic.
export const founderRequirements = {
  'estudio/samuel-furlanich/index.html': {
    heading: 'Samuel Furlanich',
    sections: ['Perfil profesional', 'Experiencia profesional', 'Biografía profesional', 'Formación', 'Sistemas que podemos construir', 'Trabajo y evidencia técnica', '¿Querés conversar sobre una necesidad de tu negocio?'],
    projects: '/proyectos/',
    contact: '/contacto/',
    cv: '/Samuel-Furlanich-CV.pdf',
    mpc: 'MPC Administración',
    mpcAction: 'Ver código fuente',
  },
  'en/about/samuel-furlanich/index.html': {
    heading: 'Samuel Furlanich',
    sections: ['Professional profile', 'Professional experience', 'Professional biography', 'Education', 'Systems we can engineer', 'Work and technical evidence', 'Want to discuss a business need?'],
    projects: '/en/work/',
    contact: '/en/contact/',
    cv: '/Samuel-Furlanich-CV.pdf',
    mpc: 'MPC Administración',
    mpcAction: 'View source code',
  },
};
