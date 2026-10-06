import type { Locale } from '../locales';
import type { CapabilityWords } from './types';

// Exact approved copy, one tuple per locale, in the approved order. Owners:
// - capability words: Services "Revision 5 capability words" (APPROVED 2026-09-30); Projects uses
//   the same vocabulary;
// - control labels: information architecture "Proposed Footer wording" (APPROVED 2026-09-30).
// `scripts/connected-studio-content.test.mjs` compares both against those tables.

export const CONNECTED_CAPABILITY_WORDS: Record<Locale, CapabilityWords> = Object.freeze({
  es: Object.freeze(['Sitios web', 'Apps', 'Chatbots', 'Agentes', 'Automatización', 'Consultoría', 'Soporte', 'Modernización'] as const),
  en: Object.freeze(['Websites', 'Apps', 'Chatbots', 'Agents', 'Automation', 'Consulting', 'Support', 'Modernization'] as const),
});

export type ConnectedControlLabels = {
  pause: string;
  resume: string;
  /** Replaces the label of a focused control after fallback; the control stays and is `aria-disabled`. */
  staticBackground: string;
};

export const CONNECTED_CONTROL_LABELS: Record<Locale, ConnectedControlLabels> = Object.freeze({
  es: Object.freeze({ pause: 'Pausar fondo', resume: 'Reanudar fondo', staticBackground: 'Fondo estático' }),
  en: Object.freeze({ pause: 'Pause background', resume: 'Resume background', staticBackground: 'Static background' }),
});

/** The semantic legend: the same words, in order, separated by ` · `. */
export function formatCapabilityLegend(words: CapabilityWords): string {
  return words.join(' · ');
}
