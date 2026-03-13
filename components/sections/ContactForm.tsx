'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const t = useTranslations();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

    if (!endpoint) {
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">
          {t('form.name')}
        </label>
        <input
          type="text"
          className="mt-2 w-full rounded-lg border border-paper-200 bg-white/90 px-4 py-3 text-sm text-ink-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          aria-invalid={Boolean(errors.name)}
          {...register('name', { required: true, minLength: 2 })}
        />
        {errors.name ? (
          <p className="mt-2 text-xs text-red-600">{t('form.errors.name')}</p>
        ) : null}
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">
          {t('form.email')}
        </label>
        <input
          type="email"
          className="mt-2 w-full rounded-lg border border-paper-200 bg-white/90 px-4 py-3 text-sm text-ink-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          aria-invalid={Boolean(errors.email)}
          {...register('email', {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          })}
        />
        {errors.email ? (
          <p className="mt-2 text-xs text-red-600">{t('form.errors.email')}</p>
        ) : null}
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">
          {t('form.message')}
        </label>
        <textarea
          rows={5}
          className="mt-2 w-full rounded-lg border border-paper-200 bg-white/90 px-4 py-3 text-sm text-ink-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          aria-invalid={Boolean(errors.message)}
          {...register('message', { required: true, minLength: 10 })}
        />
        {errors.message ? (
          <p className="mt-2 text-xs text-red-600">{t('form.errors.message')}</p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'loading' ? t('form.sending') : t('form.submit')}
      </button>
      <div aria-live="polite" className="text-sm">
        {status === 'success' ? (
          <p className="text-green-700">{t('form.success')}</p>
        ) : null}
        {status === 'error' ? (
          <p className="text-red-600">{t('form.error')}</p>
        ) : null}
      </div>
    </form>
  );
}