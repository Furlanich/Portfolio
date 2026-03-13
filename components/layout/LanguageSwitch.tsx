'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/locales';

interface LanguageSwitchProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
}

export function LanguageSwitch({ locale, onChange }: LanguageSwitchProps) {
  const t = useTranslations();

  return (
    <div className="flex items-center gap-2 rounded-full border border-paper-200 bg-white/80 px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">
      <button
        type="button"
        aria-label={t('language.enLabel')}
        onClick={() => onChange('en')}
        className={cn(
          'rounded-full px-2 py-1 transition',
          locale === 'en'
            ? 'bg-brand-600 text-white'
            : 'text-ink-600 hover:text-brand-700'
        )}
      >
        {t('language.en')}
      </button>
      <span className="text-[10px] text-ink-400">|</span>
      <button
        type="button"
        aria-label={t('language.esLabel')}
        onClick={() => onChange('es')}
        className={cn(
          'rounded-full px-2 py-1 transition',
          locale === 'es'
            ? 'bg-brand-600 text-white'
            : 'text-ink-600 hover:text-brand-700'
        )}
      >
        {t('language.es')}
      </button>
    </div>
  );
}