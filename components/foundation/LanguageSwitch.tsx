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
      className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-sky-plate-line px-3 font-mono text-[12px] text-white transition-colors duration-[160ms] ease-out hover:bg-[rgba(111,168,224,.12)] focus:outline-none focus-visible:[outline:3px_solid_#9CC4EC] focus-visible:[outline-offset:3px]"
    >
      {alternateLocale.toUpperCase()}
    </Link>
  );
}
