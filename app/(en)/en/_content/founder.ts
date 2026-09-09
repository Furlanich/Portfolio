import type { FounderPageContent } from '@/components/founder/content-types';

export const founderContent = {
  locale: 'en',
  routeId: 'founder',
  header: {
    context: 'Founder of FURLANICH · Full-stack software developer',
    name: 'Samuel Furlanich',
    biography:
      'Samuel Furlanich is a full-stack software developer and the founder of FURLANICH. He has worked independently since 2024, designing and maintaining web and desktop applications, management systems, and automations. He completed his Computer Science studies at the University of Buenos Aires and also trained as an IT Technician at E.E.S.T. No. 1 in Chivilcoy. His practice focuses on .NET backend development, complemented by interfaces built with React, Next.js, and Blazor. He also works as a Software Developer at Clever Soft SA, experience that complements his work leading FURLANICH. He personally leads each project and brings in specialist collaborators when the scope requires them.',
  },
  professionalLinks: {
    heading: 'Professional profile',
    cv: { label: 'Download CV', path: '/Samuel-Furlanich-CV.pdf' },
    linkedin: { label: 'LinkedIn', href: 'https://www.linkedin.com/in/samuel-furlanich/' },
    github: { label: 'GitHub', href: 'https://github.com/Furlanich' },
  },
  experience: {
    heading: 'Professional experience',
    entries: [
      {
        period: 'Since 2024',
        role: 'Independent software development',
        context: 'Professional practice',
        summary:
          'Designing, building, and maintaining web and desktop applications, management systems, and automations. The work spans .NET backends, web interfaces, integrations, performance improvements, and agreed technical support.',
      },
      {
        period: '2021',
        role: 'IT Technician professional internship',
        context: 'E.E.S.T. No. 1, Chivilcoy',
        summary:
          'Developed and supported management applications with .NET and ASP.NET Razor Pages, while also maintaining development environments, local networks, user accounts, and permissions.',
      },
    ],
  },
  education: {
    heading: 'Education',
    entries: [
      { title: 'Computer Science', institution: 'University of Buenos Aires', status: 'Studies completed' },
      { title: 'IT Technician', institution: 'E.E.S.T. No. 1, Chivilcoy', status: 'Training completed' },
    ],
  },
  capabilities: {
    heading: 'Systems we can engineer',
    introduction:
      'The focus is what the system enables the business to organize, automate, and evolve—not a catalogue of tools.',
    groups: [
      {
        title: 'Management and operational systems',
        items: ['Systems for users, permissions, roles, and internal workflows', 'Dashboards to record, query, and audit operations', 'Workflows with states, rules, and validation', 'Data models prepared to grow with the business'],
      },
      {
        title: 'Websites and web applications',
        items: ['Commercial sites oriented to enquiries, reservations, or sales', 'Portals with journeys tailored to different user types', 'Responsive interfaces for commercial and operational work', 'Accessible, clear, maintainable experiences'],
      },
      {
        title: 'Automation and integrations',
        items: ['Connections between existing systems and external services', 'Data synchronization across calendars, payments, and messaging', 'Automations that reduce manual work and errors', 'Traceable processes with retries and exception handling'],
      },
      {
        title: 'Existing systems that need to evolve',
        items: ['Desktop applications when the context calls for them', 'Maintenance and improvement of existing systems', 'Diagnosis of performance issues, failures, and technical debt', 'Testing, documentation, and deployment to sustain the system'],
      },
    ],
  },
  projectsBridge: {
    heading: 'Work and technical evidence',
    description:
      'The public Work selection brings together implementation evidence and work classified by maturity, with its limitations stated explicitly. Keeping that context in one index avoids duplicating stories or confusing technical evidence with professional experience.',
    action: { label: 'View selected work', routeId: 'projects' },
  },
  finalCta: {
    heading: 'Want to discuss a business need?',
    description:
      "Samuel's professional background shows who leads the work. To evaluate a project, tell us what you need to solve.",
    action: { label: 'Start an enquiry', routeId: 'contact' },
  },
} satisfies FounderPageContent;