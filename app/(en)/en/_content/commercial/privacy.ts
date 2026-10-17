import type { CommercialLegalDraft } from '@/components/legal/content-types';

export const legalContent = {
  "locale": "en",
  "routeId": "privacy",
  "title": "Privacy Policy",
  "publication": {
    "status": "nonpublishable",
    "releaseGate": "professional-review-and-factual-gates-open"
  },
  "chrome": {
    "contentsLabel": "Contents",
    "updateLabel": "Last updated",
    "reciprocalLabel": "Read the Terms and Conditions",
    "reciprocalHref": "/en/terms/"
  },
  "sections": [
    {
      "id": "responsible-party-and-contact",
      "heading": "Responsible party and contact",
      "paragraphs": [
        "Samuel Furlanich, operating under the FURLANICH brand, is responsible for handling inquiries received through this website. The supplied address is Chivilcoy 6620, Buenos Aires, Argentina. For privacy questions or to exercise your rights, contact samuelfurlanich@gmail.com."
      ]
    },
    {
      "id": "information-requested-by-the-form",
      "heading": "Information requested by the form",
      "paragraphs": [
        "We request your name, email address and a description of what you need to solve. Your company name is optional. The submission also identifies its language and source page. We do not request attachments, passwords, credentials or sensitive information."
      ]
    },
    {
      "id": "how-we-use-it",
      "heading": "How we use it",
      "paragraphs": [
        "We use this information to understand your inquiry, assess whether we can help and respond to you. Controls also help prevent spam and abuse. The form does not subscribe you to marketing communications or authorize advertising use of your message."
      ]
    },
    {
      "id": "how-an-inquiry-is-processed",
      "heading": "How an inquiry is processed",
      "paragraphs": [
        "GitHub Pages hosts the website pages. When you submit the form, your browser sends the inquiry to Formspree, which processes it and sends a notification to Samuel's email, managed through Gmail. Providers may process technical information needed to operate and protect their services."
      ]
    },
    {
      "id": "graphic-background-preferences",
      "heading": "Graphic background preferences",
      "paragraphs": [
        "The site may store your pause preference and a technical graphics-failure flag for the browsing session to avoid repeated animation attempts. These values contain no form information. If browser storage is unavailable, the page uses a static alternative or a temporary preference held in memory."
      ]
    },
    {
      "id": "providers-and-international-transfers",
      "heading": "Providers and international transfers",
      "paragraphs": [
        "[EDITORIAL BLOCK — DO NOT PUBLISH: complete the verified material providers, countries and transfer mechanism; professional Argentine legal review required. Do not assume European contractual terms alone establish the applicable Argentine safeguards.]"
      ]
    },
    {
      "id": "retention",
      "heading": "Retention",
      "paragraphs": [
        "[EDITORIAL BLOCK — DO NOT PUBLISH: turn the table's 30-day / 12-month operational targets into public wording only after verifying their operation, exceptions and professional approval. Do not promise automatic erasure or immediate disappearance of backup copies.]"
      ]
    },
    {
      "id": "your-requests",
      "heading": "Your requests",
      "paragraphs": [
        "You can request access, correction, updating or deletion of your information by contacting the email address above. We may request proportionate information to verify your identity when handling a request. Any applicable retention exception must be explained in the response.",
        "[PROFESSIONAL REVIEW: complete applicable wording and time limits, supervisory-authority information and any other required statement.]"
      ]
    },
    {
      "id": "other-channels-and-changes",
      "heading": "Other channels and changes",
      "paragraphs": [
        "If you choose WhatsApp, email or phone, you use a channel independent of the form and subject to the services involved in that communication. Form values are not automatically copied into those links. The published policy will show its update date."
      ]
    }
  ]
} satisfies CommercialLegalDraft;
