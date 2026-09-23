'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { createDemoSubmitInquiry } from '@/lib/inquiry/demo';
import { validateInquiry } from '@/lib/inquiry/validation';
import type { InquiryField, InquiryValues } from '@/lib/inquiry/contracts';
import { initialInquiryFormState, inquiryReducer } from './state';
import type { ContactPageContent } from './content-types';

type ContactFormProps = {
  content: ContactPageContent;
  locale: 'es' | 'en';
  mode: 'demonstration';
};

const emptyValues: InquiryValues = { name: '', email: '', company: '', message: '' };

function createSubmitter(mode: 'demonstration') {
  if (mode === 'demonstration') return createDemoSubmitInquiry();
  throw new Error('Unsupported Contact mode');
}

export function ContactForm({ content, locale, mode }: ContactFormProps) {
  const [state, dispatch] = useReducer(inquiryReducer, initialInquiryFormState);
  const formElement = useRef<HTMLFormElement>(null);
 const successStatus = useRef<HTMLDivElement>(null);
  const failureStatus = useRef<HTMLDivElement>(null);
  const focusedField = useRef<InquiryField | null>(null);
  const { clearErrors, handleSubmit, register, reset } = useForm<InquiryValues>({
    defaultValues: emptyValues,
  });
  const submitInquiry = useMemo(() => createSubmitter(mode), [mode]);
  const sourceLocale = locale === 'es' ? 'es-AR' : 'en';

 useEffect(() => {
    formElement.current?.setAttribute('data-contact-hydrated', 'true');
 }, []);

  useEffect(() => {
    if (state.focusField && state.focusField !== focusedField.current) {
      focusedField.current = state.focusField;
      document.getElementById('contact-' + state.focusField)?.focus();
    }
    if (!state.focusField) focusedField.current = null;
  }, [state.focusField]);

  useEffect(() => {
    if (state.phase === 'success') {
      reset(emptyValues);
      successStatus.current?.focus();
    }
  }, [reset, state.phase]);

  useEffect(() => {
    if (state.phase === 'error') failureStatus.current?.focus();
  }, [state.phase]);

  async function submit(values: InquiryValues) {
    if (state.phase === 'submitting') return;
    dispatch({ type: 'VALIDATE' });
    const validation = validateInquiry(values, sourceLocale);
    if (!validation.valid) {
      dispatch({ type: 'VALIDATION_FAILED', fieldErrors: validation.fieldErrors });
      return;
    }

    const nextRequestId = state.requestId + 1;
    dispatch({ type: 'SUBMIT_STARTED', requestId: nextRequestId });
    const result = await submitInquiry(validation.payload);
    if (result.status === 'accepted') {
      dispatch({ type: 'SUBMIT_SUCCEEDED', requestId: nextRequestId });
      return;
    }
    if (result.status === 'invalid') {
      dispatch({ type: 'VALIDATION_FAILED', fieldErrors: result.fieldErrors });
      return;
    }
    dispatch({ type: 'SUBMIT_FAILED', requestId: nextRequestId, reason: result.reason });
  }

  const fieldError = (field: InquiryField) => state.fieldErrors[field];
  const statusId = 'contact-' + locale + '-status';
  const isSubmitting = state.phase === 'submitting';
  const isFailure = state.phase === 'error';

  return (
    <section
      aria-labelledby={'contact-' + locale + '-form-heading'}
      className="rounded-2xl border border-foundation-border bg-foundation-surface p-6 md:p-8"
    >
      <div className="rounded-[12px] border border-foundation-border bg-foundation-tint p-5 md:p-6">
        <h2 className="text-xl font-bold leading-7 text-foundation-ink">{content.notice.heading}</h2>
        <p className="mt-3 text-base leading-7 text-foundation-ink">{content.notice.body}</p>
        <p className="mt-3 text-sm leading-6 text-foundation-muted">{content.notice.failureHelper}</p>
      </div>

     <form
       aria-busy={isSubmitting}
       aria-labelledby={'contact-' + locale + '-form-heading'}
        ref={formElement}
       className="mt-8"
        noValidate
        onSubmit={handleSubmit(submit)}
      >
        <h2 id={'contact-' + locale + '-form-heading'} className="text-2xl font-bold leading-8 text-foundation-ink">
          {content.form.heading}
        </h2>
        <p className="mt-3 text-base leading-7 text-foundation-muted">{content.form.introduction}</p>
        <p className="mt-4 text-sm leading-6 text-foundation-muted">{content.form.requiredNote}</p>

        <fieldset disabled={isSubmitting} className="mt-8 grid gap-6 border-0 p-0">
          <legend className="sr-only">{content.form.heading}</legend>
          {content.form.fields.map((field) => {
            const id = 'contact-' + field.name;
            const helperId = id + '-helper';
            const errorId = id + '-error';
            const errorCode = fieldError(field.name);
            const registration = register(field.name);
            const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              registration.onChange(event);
              clearErrors(field.name);
              dispatch({ type: 'CLEAR_FIELD_ERROR', field: field.name });
            };
            const describedBy = helperId + (errorCode ? ' ' + errorId : '');
            const commonProps = {
              ...registration,
              id,
              'aria-describedby': describedBy,
              'aria-invalid': Boolean(errorCode),
              autoComplete: field.autocomplete,
              maxLength: field.maxLength,
              required: field.required,
              onChange: handleChange,
            };
            return (
              <div key={field.name}>
                <label htmlFor={id} className="flex items-baseline justify-between gap-4 text-base font-semibold leading-6 text-foundation-ink">
                  <span>{field.label}</span>
                  <span className="text-sm font-normal text-foundation-muted">{field.requiredLabel}</span>
                </label>
                {field.inputType === 'textarea' ? (
                  <textarea
                    {...commonProps}
                    className="mt-2 min-h-[180px] w-full resize-y rounded-[10px] border border-foundation-muted bg-foundation-surface px-4 py-3 text-base leading-7 text-foundation-ink outline-none transition-colors duration-[160ms] ease-out focus:border-foundation-action focus-visible:ring-2 focus-visible:ring-foundation-action focus-visible:ring-offset-2"
                  />
                ) : (
                  <input
                    {...commonProps}
                    className="mt-2 min-h-12 w-full rounded-[10px] border border-foundation-muted bg-foundation-surface px-4 text-base leading-7 text-foundation-ink outline-none transition-colors duration-[160ms] ease-out focus:border-foundation-action focus-visible:ring-2 focus-visible:ring-foundation-action focus-visible:ring-offset-2"
                    type={field.inputType}
                  />
                )}
                <span id={helperId} className="mt-2 block text-sm leading-6 text-foundation-muted">{field.helper}</span>
                {errorCode ? (
                  <p id={errorId} className="mt-1 text-sm leading-6 text-[#B42318]">
                    {field.errors[errorCode] ?? 'Please review this field.'}
                  </p>
                ) : null}
              </div>
            );
          })}
        </fieldset>

        <p className="mt-6 text-sm leading-6 text-foundation-muted">
          {content.form.privacyContext}{' '}
          <Link
            href={locale === 'es' ? '/privacidad/' : '/en/privacy/'}
            className="font-semibold underline decoration-foundation-border underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-action focus-visible:ring-offset-4"
          >
            {content.form.privacyLabel}
          </Link>
        </p>

        {isSubmitting ? (
          <p id={statusId} role="status" aria-live="polite" className="mt-6 rounded-[12px] border border-foundation-border bg-foundation-tint p-4 text-base leading-7 text-foundation-ink">
            {content.form.submitting}
          </p>
        ) : null}
        {state.phase === 'success' ? (
          <div ref={successStatus} id={statusId} role="status" aria-live="polite" tabIndex={-1} className="mt-6 rounded-[12px] border border-[#067647] bg-foundation-surface p-4 text-foundation-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-action">
            <h3 className="font-bold">{content.form.success.heading}</h3>
            <p className="mt-2 text-base leading-7">{content.form.success.body}</p>
          </div>
        ) : null}
        {isFailure ? (
          <div ref={failureStatus} id={statusId} role="alert" tabIndex={-1} className="mt-6 rounded-[12px] border border-[#B42318] bg-foundation-surface p-4 text-foundation-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-action">
            <h3 className="font-bold">{content.form.failure.heading}</h3>
            <p className="mt-2 text-base leading-7">{content.form.failure.body}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foundation-action px-6 text-base font-semibold text-white transition-colors duration-[160ms] ease-out hover:bg-foundation-action-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-foundation-action focus-visible:ring-offset-4 disabled:cursor-wait disabled:opacity-70 max-[479px]:w-full"
        >
          {isFailure ? content.form.retry : isSubmitting ? content.form.submitting : content.form.submit}
        </button>
      </form>
    </section>
  );
}
