'use client';

import { useEffect, useRef, useState } from 'react';
import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Download, Mail, Phone } from 'lucide-react';
import { Container } from '@/components/core/Container';
import { MotionReveal } from '@/components/core/MotionReveal';
import { IconButton } from '@/components/core/IconButton';
import { cn } from '@/lib/utils';
import { getLocalizedString } from '@/lib/i18n';
import { withBasePath } from '@/lib/paths';
import type { AboutMe } from '@/lib/types';
import type { Locale } from '@/lib/locales';

interface LandingSectionProps {
  about: AboutMe;
  locale: Locale;
}

const copyWithFallback = (value: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand('copy');
  document.body.removeChild(textarea);
  return success;
};

export function LandingSection({ about, locale }: LandingSectionProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  let presentationText = getLocalizedString(about.presentation, locale);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopyEmail = async () => {
    let success = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(about.email);
        success = true;
      }
    } catch (error) {
      success = false;
    }

    if (!success) {
      success = copyWithFallback(about.email);
    }

    if (success) {
      setCopied(true);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <section id="about" className="pb-16 pt-28 md:pb-20 md:pt-36 scroll-mt-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <MotionReveal>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">
              {t('sections.about.kicker')}
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-ink-900 md:text-5xl">
              {about.name}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-600 md:text-lg">
              {presentationText.split('\\n').map((item, index) => (
                <Fragment key={index}>
                  {item}
                  {index < presentationText.split('\\n').length - 1 && <br />}
                </Fragment>
              ))}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                {t('buttons.contact')}
              </a>
              <a
                href={withBasePath(about.cvPath)}
                download
                className="inline-flex items-center gap-2 rounded-full border border-paper-200 bg-white/90 px-6 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-200 hover:text-brand-700"
              >
                <Download className="h-4 w-4" />
                {t('buttons.downloadCv')}
              </a>
              <motion.button
                type="button"
                onClick={handleCopyEmail}
                animate={copied ? { scale: 1.05 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className={cn(
                  'rounded-full border border-paper-200 px-6 py-3 text-sm font-semibold transition',
                  copied
                    ? 'bg-brand-700 text-white'
                    : 'bg-white/90 text-ink-700 hover:border-brand-200 hover:text-brand-700'
                )}
              >
                {copied ? t('buttons.copied') : t('buttons.copyEmail')}
              </motion.button>
              <a
                href={`tel:${about.phone}`}
                className="rounded-full border border-paper-200 bg-white/90 px-6 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-200 hover:text-brand-700"
              >
                {t('buttons.call')}
              </a>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <div className="rounded-2xl border border-paper-200 bg-white/90 p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600">
                {t('sections.about.contactLabel')}
              </p>
              <div className="mt-6 space-y-4 text-sm text-ink-700">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-brand-600" />
                  <span>{about.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-brand-600" />
                  <span>{about.phone}</span>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {about.socialMedia.map((item) => (
                  <IconButton key={item.url} href={item.url} label={item.alt}>
                    <img
                      src={withBasePath(item.image.path)}
                      alt={item.image.alt}
                      className="h-4 w-4"
                    />
                  </IconButton>
                ))}
              </div>
            </div>
          </MotionReveal>
        </div>
      </Container>
    </section>
  );
}