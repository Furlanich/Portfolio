import type { Locale } from '@/lib/locales';
import type { LocalizedString } from '@/lib/types';

export function getLocalizedString(value: LocalizedString, locale: Locale) {
  return value[locale] ?? value.en;
}