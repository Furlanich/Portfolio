import type { PrivacyContent } from '../../../../components/privacy/content-types';

export const privacyContent = {
  locale: 'en',
  routeId: 'privacy',
  heading: 'Privacy in this demonstration',
  introduction:
    'This site operates as a portfolio and technical showcase. It does not accept commercial inquiries through the form and does not present this page as a professionally reviewed legal policy.',
  sections: [
    {
      id: 'form-data',
      heading: 'What happens to form data',
      paragraphs: [
        "Values entered in the name, email, company, and message fields remain temporarily in this page's memory. The simulation validates them and shows loading, success, or failure states, but does not send them to FURLANICH, Formspree, Gmail, or any inbox.",
        'After simulated success, the fields are cleared. After a validation error or simulated failure, the values remain visible so you can correct them or try again. Reloading or leaving the page causes the Contact implementation to discard them.',
      ],
    },
    {
      id: 'hosting',
      heading: 'Hosting and technical data',
      paragraphs: [
        "GitHub Pages publishes the site's static files at https://furlanich.github.io/Portfolio/. GitHub states that it logs the IP addresses of visitors to GitHub Pages sites for security purposes. That technical processing is governed by GitHub's documentation and privacy statement.",
        'FURLANICH adds no analytics, advertising, profiling, CRM, form storage, or conversion events to this demonstration.',
      ],
    },
    {
      id: 'external-alternatives',
      heading: 'External alternatives',
      paragraphs: [
        'The WhatsApp, email, and phone links are functional examples separate from the form. Selecting one opens an external service on your device, and any information you choose to communicate is governed by that service. Values entered in the form are not copied automatically.',
      ],
    },
    {
      id: 'sensitive-information',
      heading: 'Sensitive information',
      paragraphs: [
        'Do not enter passwords, credentials, client production data, sensitive information, or files. The form neither requests nor needs that information to demonstrate its behavior.',
      ],
    },
    {
      id: 'retention-questions',
      heading: 'Retention and questions',
      paragraphs: [
        'The simulation creates no provider, database, or inbox copy. It keeps values only on the page for the interaction described above. For questions about this demonstration, you may email samuelfurlanich@gmail.com without including sensitive information.',
      ],
    },
    {
      id: 'future-commercial-activation',
      heading: 'Future commercial activation',
      paragraphs: [
        'Before enabling real submission, FURLANICH must replace this explanation with verified information about responsible parties, providers, purposes, retention, transfers, and rights; complete professional review; and prove delivery and deletion of a test inquiry. This demonstration does not approve any of those items.',
      ],
    },
  ],
  githubLink: {
    label: "View GitHub's privacy statement",
    href: 'https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement',
  },
} satisfies PrivacyContent;
