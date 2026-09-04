import type { FounderContent } from '../../../components/foundation/content-types';

export const founderContent = {
  locale: 'es',
  routeId: 'founder',
  name: 'Samuel Furlanich',
  role: 'Fundador y desarrollador de software full-stack',
  biography:
    'Samuel Furlanich es desarrollador de software full-stack y fundador de FURLANICH. Trabaja de forma independiente desde 2024, diseñando y manteniendo aplicaciones web y de escritorio, sistemas de gestión y automatizaciones. Completó sus estudios de Ciencias de la Computación en la Universidad de Buenos Aires y cuenta además con formación como Técnico Informático en la E.E.S.T. N.º 1 de Chivilcoy. Su práctica se especializa en backend con .NET y se complementa con interfaces construidas con React, Next.js y Blazor. También se desempeña como Software Developer en Clever Soft SA, experiencia que complementa su trabajo al frente de FURLANICH. Lidera personalmente cada proyecto e incorpora colaboradores especializados cuando el alcance lo requiere.',
  experience: [
    {
      title: 'Trabajo independiente',
      period: 'Desde 2024',
      summary:
        'Diseño y mantenimiento de aplicaciones web y de escritorio, sistemas de gestión y automatizaciones.',
    },
  ],
  education: [
    {
      title: 'Ciencias de la Computación',
      institution: 'Universidad de Buenos Aires',
      status: 'Estudios completados',
    },
    {
      title: 'Técnico Informático',
      institution: 'E.E.S.T. N.º 1 de Chivilcoy',
      status: 'Formación completada',
    },
  ],
  capabilities: [
    'Backend con .NET',
    'Interfaces con React, Next.js y Blazor',
    'Aplicaciones web y de escritorio',
    'Sistemas de gestión y automatizaciones',
    'Mantenimiento y mejora de sistemas existentes',
  ],
  cv: {
    label: 'Descargar CV',
    path: '/Samuel-Furlanich-CV.pdf',
  },
  linkedin: {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/samuel-furlanich',
  },
  github: {
    label: 'GitHub',
    href: 'https://github.com/Furlanich',
  },
  contactAction: {
    label: 'Hablemos de tu proyecto',
    routeId: 'contact',
  },
} satisfies FounderContent;
