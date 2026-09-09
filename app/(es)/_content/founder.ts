import type { FounderPageContent } from '@/components/founder/content-types';

export const founderContent = {
  locale: 'es',
  routeId: 'founder',
  header: {
    context: 'Fundador de FURLANICH · Desarrollador de software full-stack',
    name: 'Samuel Furlanich',
    biography:
      'Samuel Furlanich es desarrollador de software full-stack y fundador de FURLANICH. Trabaja de forma independiente desde 2024, diseñando y manteniendo aplicaciones web y de escritorio, sistemas de gestión y automatizaciones. Completó sus estudios de Ciencias de la Computación en la Universidad de Buenos Aires y cuenta además con formación como Técnico Informático en la E.E.S.T. N.º 1 de Chivilcoy. Su práctica se especializa en backend con .NET y se complementa con interfaces construidas con React, Next.js y Blazor. También se desempeña como Software Developer en Clever Soft SA, experiencia que complementa su trabajo al frente de FURLANICH. Lidera personalmente cada proyecto e incorpora colaboradores especializados cuando el alcance lo requiere.',
  },
  professionalLinks: {
    heading: 'Perfil profesional',
    cv: { label: 'Descargar CV', path: '/Samuel-Furlanich-CV.pdf' },
    linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/samuel-furlanich/' },
    github: { label: 'GitHub', href: 'https://github.com/Furlanich' },
  },
  experience: {
    heading: 'Experiencia profesional',
    entries: [
      {
        period: 'Desde 2024',
        role: 'Desarrollo de software independiente',
        context: 'Práctica profesional',
        summary:
          'Diseño, desarrollo y mantenimiento de aplicaciones web y de escritorio, sistemas de gestión y automatizaciones. El trabajo abarca backend con .NET, interfaces web, integraciones, mejora de rendimiento y soporte técnico acordado.',
      },
      {
        period: '2021',
        role: 'Pasantía profesional como Técnico Informático',
        context: 'E.E.S.T. N.º 1, Chivilcoy',
        summary:
          'Desarrollo y soporte de aplicaciones de gestión con .NET y ASP.NET Razor Pages, junto con mantenimiento de entornos de desarrollo, redes locales, cuentas y permisos.',
      },
    ],
  },
  education: {
    heading: 'Formación',
    entries: [
      { title: 'Ciencias de la Computación', institution: 'Universidad de Buenos Aires', status: 'Estudios completados' },
      { title: 'Técnico Informático', institution: 'E.E.S.T. N.º 1, Chivilcoy', status: 'Formación completada' },
    ],
  },
  capabilities: {
    heading: 'Sistemas que podemos construir',
    introduction:
      'El foco está en lo que el sistema permite ordenar, automatizar y hacer evolucionar, no en acumular nombres de herramientas.',
    groups: [
      {
        title: 'Sistemas de gestión y operación',
        items: ['Sistemas para administrar usuarios, permisos, roles y circuitos internos', 'Paneles para registrar, consultar y auditar operaciones', 'Flujos de trabajo con estados, reglas y validaciones', 'Modelos de datos preparados para crecer con el negocio'],
      },
      {
        title: 'Portales y aplicaciones web',
        items: ['Sitios comerciales orientados a consultas, reservas o ventas', 'Portales con recorridos diferenciados por tipo de usuario', 'Interfaces adaptables para tareas comerciales y operativas', 'Experiencias accesibles, claras y mantenibles'],
      },
      {
        title: 'Automatizaciones e integraciones',
        items: ['Conexiones entre sistemas existentes y servicios externos', 'Sincronización de datos, calendarios, pagos y mensajería', 'Automatizaciones para reducir carga manual y errores', 'Procesos con trazabilidad, reintentos y manejo de excepciones'],
      },
      {
        title: 'Sistemas existentes que necesitan evolucionar',
        items: ['Aplicaciones de escritorio cuando el contexto lo requiere', 'Mantenimiento y mejora de sistemas existentes', 'Diagnóstico de rendimiento, fallas y deuda técnica', 'Pruebas, documentación y publicación para sostener el sistema'],
      },
    ],
  },
  projectsBridge: {
    heading: 'Trabajo y evidencia técnica',
    description:
      'La selección pública de Proyectos reúne evidencia de implementación y trabajo clasificado por madurez, con sus límites explícitos. Ese índice concentra el contexto para evitar duplicar historias o confundir evidencia técnica con experiencia profesional.',
    action: { label: 'Ver proyectos seleccionados', routeId: 'projects' },
  },
  finalCta: {
    heading: '¿Querés conversar sobre una necesidad de tu negocio?',
    description:
      'La experiencia de Samuel aporta contexto sobre quién conduce el trabajo. Para evaluar un proyecto, contanos qué necesitás resolver.',
    action: { label: 'Iniciar una consulta', routeId: 'contact' },
  },
} satisfies FounderPageContent;