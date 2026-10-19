import type { StudioLegalContent } from '@/components/legal/content-types';

export const legalContent = {
  "locale": "en",
  "routeId": "privacy",
  "title": "Privacy and contact",
  "chrome": {
    "contentsLabel": "Contents",
    "updateLabel": "Last updated",
    "reciprocalLabel": "Read the Terms and Conditions",
    "reciprocalHref": "/en/terms/"
  },
  "sections": [
    {
      "id": "responsible-party",
      "heading": "Responsible party and contact",
      "paragraphs": [
        "Samuel Furlanich presents his work under the FURLANICH brand from Buenos Aires, Argentina. For questions about your information, email samuelfurlanich@gmail.com."
      ]
    },
    {
      "id": "direct-contact",
      "heading": "Direct contact",
      "paragraphs": [
        "You can contact Samuel on WhatsApp, by email or by phone. The links open your chosen service or application; you decide what information to send. Samuel uses the information you share to assess and respond to your inquiry and coordinate a possible conversation or engagement.",
        "The published email address receives messages in Gmail, provided by Google. WhatsApp messages and phone calls use their respective services. Those services have their own privacy policies and may process technical communication data."
      ]
    },
    {
      "id": "hosting",
      "heading": "Hosting and technical data",
      "paragraphs": [
        "GitHub Pages publishes the static website files at https://furlanich.github.io/Portfolio/. GitHub states that it records visitors’ IP addresses for security purposes. That processing is governed by its privacy statement.",
        "The website adds no analytics, advertising, profiling, CRM or conversion tracking."
      ]
    },
    {
      "id": "preferences",
      "heading": "Browsing preferences",
      "paragraphs": [
        "The website may keep your animation pause preference and a technical graphics-failure flag for the browsing session. Those values contain no messages or contact information. If storage is unavailable, the website uses a static alternative or a temporary preference in memory."
      ]
    },
    {
      "id": "sensitive-information",
      "heading": "Information you share",
      "paragraphs": [
        "A brief description of the problem and how you would like to proceed is enough for an initial inquiry. Do not share passwords, credentials, client production data or sensitive information."
      ]
    },
    {
      "id": "retention-questions",
      "heading": "Messages and requests about your information",
      "paragraphs": [
        "Messages you send remain in the email or service used for the conversation. The website does not create another copy in an inquiry intake system. To ask how your information is used or request access, correction or deletion, email samuelfurlanich@gmail.com.",
        "Handling those requests depends on the information involved and applicable obligations. Providers manage their own technical records and backups under their policies."
      ]
    }
  ]
} satisfies StudioLegalContent;
