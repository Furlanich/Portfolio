'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Github, Linkedin, Mail, MessageCircle, Phone } from 'lucide-react';
import { Section } from '@/components/core/Section';
import { IconButton } from '@/components/core/IconButton';
import { ContactForm } from '@/components/sections/ContactForm';
import type { AboutMe } from '@/lib/types';

interface ContactSectionProps {
  about: AboutMe;
}

const sanitizePhone = (phone: string) => phone.replace(/\D/g, '');

export function ContactSection({ about }: ContactSectionProps) {
  const t = useTranslations();

  const socials = useMemo(() => {
    const linkedin = about.socialMedia.find((item) =>
      item.alt.toLowerCase().includes('linkedin')
    );
    const github = about.socialMedia.find((item) =>
      item.alt.toLowerCase().includes('github')
    );

    return { linkedin, github };
  }, [about.socialMedia]);

  const whatsappLink = `https://wa.me/${sanitizePhone(about.phone)}`;

  return (
    <Section
      id="contact"
      title={t('sections.contact.title')}
      subtitle={t('sections.contact.subtitle')}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-paper-200 bg-white/90 p-6 shadow-soft">
          <p className="text-sm text-ink-600">{t('sections.contact.description')}</p>
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
            <IconButton href={whatsappLink} label={t('contact.whatsapp')}>
              <MessageCircle className="h-4 w-4" />
            </IconButton>
            {socials.linkedin ? (
              <IconButton href={socials.linkedin.url} label={t('contact.linkedin')}>
                <Linkedin className="h-4 w-4" />
              </IconButton>
            ) : null}
            {socials.github ? (
              <IconButton href={socials.github.url} label={t('contact.github')}>
                <Github className="h-4 w-4" />
              </IconButton>
            ) : null}
          </div>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
}