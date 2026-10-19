import type { PrivacyContent } from '@/components/privacy/content-types';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { legalContent } from './commercial/privacy.ts';

export const privacyContent = {
  "locale": "en",
  "routeId": "privacy",
  "heading": legalContent.title,
  "introduction": "This page explains what happens when you browse the website and contact Samuel Furlanich through the published channels.",
  "updatedLabel": legalContent.chrome.updateLabel,
  "updatedAt": "October 18, 2026",
  "sections": legalContent.sections,
  "termsLink": { "label": legalContent.chrome.reciprocalLabel, "href": legalContent.chrome.reciprocalHref },
  "githubLink": {
    "label": "View GitHub's privacy statement",
    "href": "https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
  }
} satisfies PrivacyContent;
