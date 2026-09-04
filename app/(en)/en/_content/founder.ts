import type { FounderContent } from '../../../../components/foundation/content-types';

export const founderContent = {
  locale: 'en',
  routeId: 'founder',
  name: 'Samuel Furlanich',
  role: 'Founder and full-stack software developer',
  biography:
    'Samuel Furlanich is a full-stack software developer and the founder of FURLANICH. He has worked independently since 2024, designing and maintaining web and desktop applications, management systems, and automations. He completed his Computer Science studies at the University of Buenos Aires and also trained as an IT Technician at E.E.S.T. No. 1 in Chivilcoy. His practice focuses on .NET backend development, complemented by interfaces built with React, Next.js, and Blazor. He also works as a Software Developer at Clever Soft SA, experience that complements his work leading FURLANICH. He personally leads each project and brings in specialist collaborators when the scope requires them.',
  experience: [
    {
      title: 'Independent work',
      period: 'Since 2024',
      summary:
        'Designing and maintaining web and desktop applications, management systems, and automations.',
    },
  ],
  education: [
    {
      title: 'Computer Science',
      institution: 'University of Buenos Aires',
      status: 'Studies completed',
    },
    {
      title: 'IT Technician',
      institution: 'E.E.S.T. No. 1 in Chivilcoy',
      status: 'Training completed',
    },
  ],
  capabilities: [
    '.NET backend development',
    'Interfaces with React, Next.js, and Blazor',
    'Web and desktop applications',
    'Management systems and automations',
    'Maintenance and improvement of existing systems',
  ],
  cv: {
    label: 'Download CV',
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
    label: 'Tell us about your project',
    routeId: 'contact',
  },
} satisfies FounderContent;
