'use client';

import Link from 'next/link';
import { useEffect, useMemo, useReducer, useRef, useSyncExternalStore } from 'react';
import { useForm } from 'react-hook-form';
import { createConfiguredSubmitInquiry } from '@/lib/inquiry/configuration';
import { createInquirySubmissionController, type InquirySubmissionController } from '@/lib/inquiry/submission-controller';
import { validateInquiry } from '@/lib/inquiry/validation';
import type { InquiryField, InquiryValues, SubmitInquiry } from '@/lib/inquiry/contracts';
import { firstInvalidField, initialInquiryFormState, inquiryReducer } from './state';
import type { ContactPageContent } from './content-types';
import styles from './contact.module.css';

type ContactFormProps = {
  content: ContactPageContent;
  locale: 'es' | 'en';
};

const emptyValues: InquiryValues = { name: '', email: '', company: '', message: '' };
const subscribeToHydration = () => () => undefined;
const getHydratedSnapshot = () => true;
const getServerHydratedSnapshot = () => false;

function createSafeSubmitter(): SubmitInquiry {
  try {
    return createConfiguredSubmitInquiry();
  } catch {
    // Configuration errors are safe page state, never a fallback to demo success or raw error prose.
    return async () => ({ status: 'failed', reason: 'misconfigured' });
  }
}

export function ContactForm({ content, locale }: ContactFormProps) {
  const [state, dispatch] = useReducer(inquiryReducer, initialInquiryFormState);
  const hydrated = useSyncExternalStore(subscribeToHydration, getHydratedSnapshot, getServerHydratedSnapshot);
  const controller = useRef<InquirySubmissionController | null>(null);
  const formElement = useRef<HTMLFormElement>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const resultRegion = useRef<HTMLDivElement>(null);
  const focusedField = useRef<InquiryField | null>(null);
  const focusedOutcome = useRef<string | null>(null);
  const { clearErrors, getValues, register, reset } = useForm<InquiryValues>({ defaultValues: emptyValues });
  const submitInquiry = useMemo(() => createSafeSubmitter(), []);
  const sourceLocale = locale === 'es' ? 'es-AR' : 'en';
  const isSubmitting = state.phase === 'submitting';
  const hasGlobalOutcome = state.phase === 'success' || state.phase === 'error';

  useEffect(() => {
    const currentController = createInquirySubmissionController({ submit: submitInquiry, dispatch });
    controller.current = currentController;
    return () => {
      currentController.dispose();
      if (controller.current === currentController) controller.current = null;
    };
  }, [dispatch, submitInquiry]);

  useEffect(() => {
    if (state.focusField && state.focusField !== focusedField.current) {
      focusedField.current = state.focusField;
      document.getElementById('contact-' + state.focusField)?.focus();
    }
    if (!state.focusField) focusedField.current = null;
  }, [state.focusField]);

  useEffect(() => {
    if (state.phase === 'success') reset(emptyValues);
    if (!hasGlobalOutcome) return;

    const outcomeKey = `${state.phase}:${state.requestId}`;
    if (focusedOutcome.current === outcomeKey) return;
    focusedOutcome.current = outcomeKey;
    resultRegion.current?.focus();
  }, [hasGlobalOutcome, reset, state.phase, state.requestId]);

  function onFieldChange(field: InquiryField) {
    clearErrors(field);
    if (state.phase === 'success') {
      dispatch({ type: 'RESET' });
      return;
    }
    // A global failure remains available while the visitor corrects values before an explicit retry.
    if (state.phase === 'error') return;
    dispatch({ type: 'CLEAR_FIELD_ERROR', field });
  }

  function submit(values: InquiryValues) {
    // The coordinator owns the synchronous lock and performs the authoritative validation. This first
    // validation only places focus on the still-enabled submit before a valid attempt disables its fields.
    const validation = validateInquiry(values, sourceLocale);
    if (validation.valid) {
      submitButton.current?.focus();
    } else {
      const invalidField = firstInvalidField(validation.fieldErrors);
      if (invalidField) {
        focusedField.current = invalidField;
        document.getElementById('contact-' + invalidField)?.focus();
      }
    }
    void controller.current?.submit(values, sourceLocale, honeypot.current?.value ?? '');
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(getValues());
  }

  const fieldError = (field: InquiryField) => state.fieldErrors[field];
  const formHeadingId = 'contact-' + locale + '-form-heading';
  const resultHeadingId = 'contact-' + locale + '-result-heading';
  const resultBodyId = 'contact-' + locale + '-result-body';

  let resultCopy: { heading: string; body: string } | null = null;
  if (state.phase === 'success') {
    resultCopy = content.form.success;
  } else if (state.phase === 'error') {
    if (content.mode === 'demonstration') {
      resultCopy = content.form.failure;
    } else if (state.failureReason === 'misconfigured') {
      resultCopy = content.form.outcomes.unavailable;
    } else if (state.failureReason === 'rate-limited') {
      resultCopy = content.form.outcomes.rateLimited;
    } else {
      resultCopy = content.form.outcomes.uncertain;
    }
  }

  return (
    <div className={styles.formColumn}>
      <h2 id={formHeadingId} className={styles.formHeading}>{content.form.heading}</h2>
      <p className={styles.formIntroduction}>{content.form.introduction}</p>
      <p className={styles.requiredNote}>{content.form.requiredNote}</p>

      <form
        ref={formElement}
        aria-busy={isSubmitting}
        aria-labelledby={formHeadingId}
        data-inquiry-phase={state.phase}
        data-contact-hydrated={hydrated ? 'true' : undefined}
        className={styles.form}
        noValidate
        onSubmit={handleFormSubmit}
      >
        <input
          ref={honeypot}
          name="_gotcha"
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          className={styles.honeypot}
        />

        <fieldset disabled={isSubmitting} className={styles.fields}>
          <legend className={styles.visuallyHidden}>{content.form.heading}</legend>
          {content.form.fields.map((field) => {
            const id = 'contact-' + field.name;
            const helperId = id + '-helper';
            const errorId = id + '-error';
            const errorCode = fieldError(field.name);
            const registration = register(field.name);
            const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              registration.onChange(event);
              onFieldChange(field.name);
            };
            const descriptionIds = [field.helper ? helperId : null, errorCode ? errorId : null]
              .filter(Boolean)
              .join(' ');
            const commonProps = {
              ...registration,
              id,
              'aria-describedby': descriptionIds || undefined,
              'aria-invalid': errorCode ? true : undefined,
              autoComplete: field.autocomplete,
              maxLength: field.maxLength,
              required: field.required,
              onChange: handleChange,
            };
            const errorText = errorCode ? field.errors[errorCode] ?? 'Please review this field.' : null;

            return (
              <div key={field.name} className={styles.field}>
                <label htmlFor={id} className={styles.label}>
                  <span>{field.label}</span>
                  <span className={styles.requiredState}>{field.requiredLabel}</span>
                </label>
                {field.inputType === 'textarea' ? (
                  <textarea {...commonProps} className={styles.textarea} />
                ) : (
                  <input {...commonProps} className={styles.input} type={field.inputType} />
                )}
                {field.helper ? <span id={helperId} className={styles.helper}>{field.helper}</span> : null}
                {errorText ? <p id={errorId} className={styles.fieldError}>{errorText}</p> : null}
              </div>
            );
          })}
        </fieldset>

        <p className={styles.privacyContext}>
          {content.form.privacyContext}{' '}
          <Link href={locale === 'es' ? '/privacidad/' : '/en/privacy/'} className={styles.inlineLink}>
            {content.form.privacyLabel}
          </Link>
          {content.mode === 'commercial' ? (
            <>
              {' '}{locale === 'es' ? 'También podés consultar los' : 'You can also read the'}{' '}
              <Link href={locale === 'es' ? '/terminos/' : '/en/terms/'} className={styles.inlineLink}>
                {content.termsLabel}
              </Link>.
            </>
          ) : null}
        </p>

        {content.mode === 'commercial' ? (
          <p data-contact-hydration-fallback hidden={hydrated} className={styles.hydrationFallback}>
            {content.preHydrationFallback}
          </p>
        ) : null}

        {hydrated ? (
          <p data-contact-busy role="status" aria-live="polite" aria-atomic="true" className={styles.busyStatus}>
            {isSubmitting ? content.form.submitting : ''}
          </p>
        ) : null}

        <div
          ref={resultRegion}
          data-contact-result
          hidden={!hasGlobalOutcome}
          role="region"
          tabIndex={-1}
          aria-labelledby={resultHeadingId}
          aria-describedby={resultBodyId}
          className={styles.resultRegion}
          data-result-kind={state.phase === 'success' ? 'success' : state.phase === 'error' ? 'error' : undefined}
        >
          <h3 id={resultHeadingId} className={styles.resultHeading}>{resultCopy?.heading ?? ''}</h3>
          <p id={resultBodyId} className={styles.resultBody}>{resultCopy?.body ?? ''}</p>
        </div>

        <button
          ref={submitButton}
          type="submit"
          disabled={!hydrated}
          aria-disabled={isSubmitting}
          className={styles.submitButton}
        >
          {state.phase === 'error' ? content.form.retry : isSubmitting ? content.form.submitting : content.form.submit}
        </button>
      </form>
    </div>
  );
}
