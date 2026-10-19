import type { PrivacyContent } from '@/components/privacy/content-types';
// @ts-expect-error Node's built-in TypeScript test loader requires the explicit extension.
import { legalContent } from './commercial/privacy.ts';

export const privacyContent = {
  "locale": "es",
  "routeId": "privacy",
  "heading": legalContent.title,
  "introduction": "Esta página explica qué ocurre al navegar por el sitio y al contactar a Samuel Furlanich por los canales publicados.",
  "updatedLabel": legalContent.chrome.updateLabel,
  "updatedAt": "18 de octubre de 2026",
  "sections": legalContent.sections,
  "termsLink": { "label": legalContent.chrome.reciprocalLabel, "href": legalContent.chrome.reciprocalHref },
  "githubLink": {
    "label": "Ver la declaración de privacidad de GitHub",
    "href": "https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement"
  }
} satisfies PrivacyContent;
