import type { StudioPageContent } from '../../../../components/studio/content-types';

export const studioPageContent = {
  locale: 'en',
  routeId: 'studio',
  intro: {
    eyebrow: 'Founder-led software studio',
    heading: 'Custom software with direct technical accountability.',
    positioning: 'FURLANICH designs, builds, and improves custom software for businesses with concrete operational needs. Samuel Furlanich leads discovery, technical direction, and delivery, keeping decisions explicit and systems maintainable.',
    supportingStatement: 'When the scope calls for additional expertise, specialist collaborators are brought in explicitly.',
    primaryAction: { label: 'Tell us what you need to solve', routeId: 'contact' },
    secondaryAction: { label: 'Meet Samuel', routeId: 'founder' },
  },
  operatingModel: {
    label: 'Operating model',
    items: ['Founder-led', 'Direct technical accountability', 'Buenos Aires, Argentina', 'Spanish and English', 'Specialist collaborators when the scope calls for them'],
  },
  accountability: {
    heading: 'Technical direction from start to finish',
    paragraphs: [
      'Samuel leads the initial discovery, sets the technical direction, and remains involved throughout delivery. Commercial conversations and technical decisions are not separated by sales or project-management layers that obscure who is accountable for the work.',
      'That continuity reduces lost context, makes trade-offs easier to explain, and keeps responsibility visible across what is decided, built, and delivered.',
    ],
  },
  collaboratorModel: {
    heading: 'Collaboration shaped by the scope',
    paragraphs: ['FURLANICH is led by Samuel. When a project requires expertise beyond the core delivery scope, specialist collaborators may be brought in explicitly. Their involvement depends on the needs of the project and does not change who leads the technical direction or remains accountable for delivery.'],
  },
  principles: {
    heading: 'Principles for clear delivery',
    introduction: "These do not replace each project's delivery process. They are the criteria used to guide decisions and reduce business risk.",
    items: [
      { title: 'Understand before building.', description: 'We first clarify the problem, the people involved, the constraints, and the intended outcome, so the business does not invest in the wrong solution.' },
      { title: 'Define the scope clearly.', description: 'Objectives, deliverables, boundaries, responsibilities, and validation criteria are made explicit so both sides know what the work is meant to solve.' },
      { title: 'Validate incrementally.', description: 'Important journeys are reviewed through verifiable deliveries so issues can be found early and risk can be reduced.' },
      { title: 'Build for maintainability.', description: 'Architecture, testing, and documentation are proportionate to the scope so the solution can evolve without depending on opaque decisions.' },
    ],
  },
  location: {
    heading: 'Based in Buenos Aires, available nationally and internationally',
    description: 'FURLANICH works from Buenos Aires, Argentina, with projects across the country and availability for international engagements. Communication is available in Spanish and English.',
  },
  founderBridge: {
    heading: 'The person behind the technical direction',
    description: 'Samuel Furlanich is the founder and directly accountable technical lead of FURLANICH. His background spans .NET backend development, web interfaces, management systems, automation, and software maintenance. His professional profile provides the full biography, experience, education, capabilities, selected work, CV, and professional links.',
    action: { label: 'Meet Samuel', routeId: 'founder' },
  },
  finalCta: {
    heading: "Let's talk about what's holding your business back",
    description: 'Tell us what you need to solve and how it works today. Samuel will personally review your enquiry to assess the most sensible next step.',
    action: { label: 'Start an enquiry', routeId: 'contact' },
  },
} satisfies StudioPageContent;