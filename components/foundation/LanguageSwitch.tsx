import Link from 'next/link';
import type { Locale } from '@/lib/locales';

interface LanguageSwitchProps {
  alternateHref: string;
  alternateLocale: Locale;
  label: string;
}

export function LanguageSwitch({
  alternateHref,
  alternateLocale,
  label,
}: LanguageSwitchProps) {
  return (
    <Link
      href={alternateHref}
      hrefLang={alternateLocale === 'es' ? 'es-AR' : 'en'}
      aria-label={label}
      className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-foundation-border bg-foundation-surface px-4 text-sm font-semibold text-foundation-action transition-colors duration-[160ms] ease-out hover:bg-foundation-tint hover:text-foundation-action-strong"
    >
      {alternateLocale.toUpperCase()}
    </Link>
  );
}
