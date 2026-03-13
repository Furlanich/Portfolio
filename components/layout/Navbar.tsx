'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Container } from '@/components/core/Container';
import { IconButton } from '@/components/core/IconButton';
import { LanguageSwitch } from '@/components/layout/LanguageSwitch';
import { withBasePath } from '@/lib/paths';
import type { SocialMedia } from '@/lib/types';
import type { Locale } from '@/lib/locales';

interface NavItem {
  id: string;
  label: string;
}

interface NavbarProps {
  name: string;
  socialMedia: SocialMedia[];
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function Navbar({ name, socialMedia, locale, onLocaleChange }: NavbarProps) {
  const t = useTranslations();
  const navItems: NavItem[] = [
    { id: 'about', label: t('nav.items.about') },
    { id: 'skills', label: t('nav.items.skills') },
    { id: 'experience', label: t('nav.items.experience') },
    { id: 'projects', label: t('nav.items.projects') },
    { id: 'contact', label: t('nav.items.contact') }
  ];
  const [open, setOpen] = useState(false);

  const handleNavigate = () => setOpen(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-paper-200/70 bg-white/70 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={handleNavigate}
                className="text-sm font-medium text-ink-700 transition hover:text-brand-700"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-700">
            {name}
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <div className="flex items-center gap-2">
              {socialMedia.map((item) => (
                <IconButton key={item.url} href={item.url} label={item.alt}>
                  <img
                    src={withBasePath(item.image.path)}
                    alt={item.image.alt}
                    className="h-4 w-4"
                  />
                </IconButton>
              ))}
            </div>
            <LanguageSwitch locale={locale} onChange={onLocaleChange} />
          </div>
          <button
            type="button"
            aria-label={open ? t('nav.close') : t('nav.open')}
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-paper-200 text-ink-700 transition hover:text-brand-700 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Container>
      {open ? (
        <div className="border-t border-paper-200/70 bg-white/90 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={handleNavigate}
                className="text-sm font-medium text-ink-700"
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-2">
              {socialMedia.map((item) => (
                <IconButton key={item.url} href={item.url} label={item.alt}>
                  <img
                    src={withBasePath(item.image.path)}
                    alt={item.image.alt}
                    className="h-4 w-4"
                  />
                </IconButton>
              ))}
              <LanguageSwitch locale={locale} onChange={onLocaleChange} />
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}