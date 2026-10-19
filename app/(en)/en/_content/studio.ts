import type { StudioPageContent } from '../../../../components/studio/content-types';

export const studioPageContent = {
  locale: 'en',
  routeId: 'studio',
  intro: {
    eyebrow: 'Founder-led software studio',
    heading: 'Custom software with direct technical accountability.',
    positioning: 'FURLANICH designs, builds, and improves custom software for businesses with concrete operational needs.',
    primaryAction: { label: 'Tell us what you need to solve', routeId: 'contact' },
    secondaryAction: { label: 'Meet Samuel', routeId: 'founder' },
  },
  sceneCaption: 'Central accountability, connected specialties.',
  wordBindings: [
    { nodeId: 'n0', word: 'Accountability' },
    { nodeId: 'n4', word: 'Scope' },
    { nodeId: 'n8', word: 'Specialists' },
    { nodeId: 'n12', word: 'Review' },
  ],
  accountability: {
    heading: 'Technical direction from start to finish',
    paragraphs: [
      'Samuel Furlanich is involved in defining the problem, technical decisions and review of the work. One named technical lead remains accountable throughout the project.',
    ],
  },
  collaboratorModel: {
    heading: 'Collaboration shaped by the scope',
    paragraphs: ['When the scope calls for another specialty, collaborator involvement and responsibilities are agreed. Samuel retains technical leadership.'],
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
    description: 'Based in Buenos Aires, Argentina, with availability for work in Argentina and internationally. Communication is available in Spanish and English.',
  },
  founderBridge: {
    heading: 'The person behind the technical direction',
    description: 'Explore the experience and background of the person leading the work.',
    action: { label: 'Meet Samuel', routeId: 'founder' },
  },
  finalCta: {
    heading: "Let's talk about what's holding your business back",
    // Demonstration-dependent: the coordinated commercial release (PLAN-SFC-V1 Task 16) owns the final wording.
    description: 'Contact us on WhatsApp, by email or by phone.',
    action: { label: 'Start an enquiry', routeId: 'contact' },
  },
} satisfies StudioPageContent;
