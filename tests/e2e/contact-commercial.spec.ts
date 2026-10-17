import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readConnected } from './support/connected-studio';
import { appPathname, appUrl, stableRoutes } from './support/paths';

const endpoint = 'https://formspree.io/f/meaqwnbr';
const submissions = [
  {
    locale: 'es',
    route: stableRoutes.contact.es,
    language: 'es-AR',
    heading: 'Contanos qué necesitás resolver.',
    nameLabel: 'Nombre',
    formHeading: 'Iniciar una consulta',
    preHydrationFallback: 'Para enviar el formulario, activá JavaScript. También podés escribirnos por WhatsApp, correo o teléfono.',
    termsLabel: 'Términos y condiciones',
    submit: 'Enviar consulta',
    submitting: 'Enviando...',
    acceptedHeading: 'Mensaje aceptado.',
    acceptedBody: 'Tu consulta fue aceptada para su envío. Si necesitás confirmar que Samuel la recibió, usá una opción de contacto directo.',
    uncertaintyHeading: 'No pudimos confirmar el envío.',
    uncertaintyBody: 'Tus datos siguen en el formulario. Podés reintentar o escribirnos por WhatsApp. Si el primer envío fue recibido, un reintento puede generar otra copia de la consulta.',
    rateHeading: 'El envío está temporalmente limitado.',
    rateBody: 'Tus datos siguen en el formulario. Intentá más tarde o escribinos por WhatsApp.',
    unavailableHeading: 'El formulario no está disponible.',
    unavailableBody: 'Podés escribirnos por WhatsApp, correo o teléfono. Los datos que completaste siguen en esta página.',
    requestTooLarge: 'La consulta es demasiado larga para enviarla. Acortá el mensaje e intentá nuevamente.',
    retry: 'Intentar nuevamente',
    invalidEmail: 'Ingresá un correo electrónico válido.',
    privacy: '/privacidad/',
    terms: '/terminos/',
  },
  {
    locale: 'en',
    route: stableRoutes.contact.en,
    language: 'en',
    heading: 'Tell us what you need to solve.',
    nameLabel: 'Name',
    formHeading: 'Start an inquiry',
    preHydrationFallback: 'Enable JavaScript to submit the form. You can also contact us on WhatsApp, by email or by phone.',
    termsLabel: 'Terms and Conditions',
    submit: 'Send inquiry',
    submitting: 'Sending...',
    acceptedHeading: 'Message accepted.',
    acceptedBody: 'Your inquiry was accepted for sending. If you need to confirm Samuel received it, use a direct contact option.',
    uncertaintyHeading: "We couldn't confirm your submission.",
    uncertaintyBody: 'Your information is still in the form. You can try again or contact us on WhatsApp. If the first submission was received, retrying may create another copy of your inquiry.',
    rateHeading: 'Submissions are temporarily limited.',
    rateBody: 'Your information is still in the form. Try later or contact us on WhatsApp.',
    unavailableHeading: 'The form is unavailable.',
    unavailableBody: 'You can contact us on WhatsApp, by email or by phone. The information you entered remains on this page.',
    requestTooLarge: 'This inquiry is too large to send. Shorten the message and try again.',
    retry: 'Try again',
    invalidEmail: 'Enter a valid email address.',
    privacy: '/en/privacy/',
    terms: '/en/terms/',
  },
] as const;

type ResponsePlan = { status: number; body: unknown; hold?: Promise<void> };

function providerBoundary(page: Page) {
  let plan: ResponsePlan = { status: 200, body: { ok: true } };
  const requests: string[] = [];
  const installed = page.route('https://formspree.io/**', async (route) => {
    const request = route.request();
    if (request.url() !== endpoint) {
      await route.abort();
      return;
    }
    requests.push(request.postData() ?? '');
    await plan.hold;
    await route.fulfill({ status: plan.status, contentType: 'application/json', body: JSON.stringify(plan.body) });
  });
  return {
    installed,
    requests,
    respond(next: ResponsePlan) {
      plan = next;
    },
  };
}

async function openContact(page: Page, copy: (typeof submissions)[number]) {
  await page.goto(appUrl(copy.route));
  await expect(page.locator('html')).toHaveAttribute('lang', copy.language);
  await expect(page.locator('form[data-contact-hydrated="true"]')).toBeVisible();
}

async function fillValidInquiry(page: Page) {
  await page.getByLabel(/^(Nombre|Name)/).fill('Ada Lovelace');
  await page.getByLabel(/^(Correo electrónico|Email)/).fill('ada@example.com');
  await page.getByLabel(/^(Empresa|Company)/).fill('Analytical Engines');
  await page.getByLabel(/^(¿Qué necesitás resolver\?|What do you need to solve\?)/).fill('Please help us scope a product idea.');
}

async function expectResult(page: Page, heading: string, body: string) {
  const result = page.locator('[data-contact-result]');
  await expect(result).toBeFocused();
  await expect(result).toHaveAttribute('role', 'region');
  await expect(result).toContainText(heading);
  await expect(result).toContainText(body);
  expect(await result.getAttribute('aria-live')).toBeNull();
}

for (const copy of submissions) {
  test(`${copy.locale} Contact selects approved commercial content, fields, direct routes, and passes axe`, async ({ page }) => {
    const boundary = providerBoundary(page);
    await openContact(page, copy);
    const main = page.getByRole('main');
    await expect(main.locator('h1')).toHaveText(copy.heading);
    await expect(main.getByRole('heading', { name: copy.formHeading })).toBeVisible();
    await expect(main.getByRole('button', { name: copy.submit })).toBeVisible();
    await expect(main.getByRole('link', { name: /Terms and Conditions|Términos y condiciones/ })).toHaveAttribute('href', appPathname(copy.terms));
    await expect(main.getByRole('link', { name: /Privacy Policy|Política de privacidad/ })).toHaveAttribute('href', appPathname(copy.privacy));
    await expect(main.getByRole('heading', { name: /demonstration|demostración/i })).toHaveCount(0);
    await expect(page.locator('[name="_gotcha"]')).toHaveAttribute('tabindex', '-1');
    await expect(page.locator('[name="_gotcha"]')).toHaveAttribute('autocomplete', 'off');
    await expect(page.locator('[name="_gotcha"]')).toHaveAttribute('aria-hidden', 'true');
    await expect(main.getByRole('link', { name: /Samuel/ }).last()).toBeVisible();
    await expect(main.locator('a[href^="https://wa.me"], a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(3);
    for (const alternative of await main.locator('a[href^="https://wa.me"], a[href^="mailto:"], a[href^="tel:"]').all()) {
      await expect(alternative).not.toHaveAttribute('href', /Ada|ada@example\.com/);
    }
    for (const [selector, units] of [['#contact-name', '200'], ['#contact-email', '508'], ['#contact-company', '240'], ['#contact-message', '8000']]) {
      await expect(page.locator(selector)).toHaveAttribute('maxlength', units);
    }
    expect(boundary.requests).toEqual([]);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(axe.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([]);
    await boundary.installed;
  });

  test(`${copy.locale} Contact accepts the complete code-point limits inside native UTF-16 bounds`, async ({ page }) => {
    const boundary = providerBoundary(page);
    await openContact(page, copy);
    const limits = [
      [/^(Nombre|Name)/, 200, '😀'.repeat(100)],
      [/^(Correo electrónico|Email)/, 508, 'a'.repeat(508)],
      [/^(Empresa|Company)/, 240, '😀'.repeat(120)],
      [/^(¿Qué necesitás resolver\?|What do you need to solve\?)/, 8000, '😀'.repeat(4000)],
    ] as const;

    for (const [label, maxLength, value] of limits) {
      const field = page.getByLabel(label);
      await expect(field).toHaveAttribute('maxlength', String(maxLength));
      await field.fill(value);
      await expect(field).toHaveValue(value);
    }

    expect(boundary.requests).toEqual([]);
    await boundary.installed;
  });

  test(`${copy.locale} Contact accepts once, carries the actual honeypot value, then resets only after acceptance`, async ({ page }) => {
    const boundary = providerBoundary(page);
    await openContact(page, copy);
    await fillValidInquiry(page);
    await page.locator('[name="_gotcha"]').evaluate((element) => {
      (element as HTMLInputElement).value = 'scanner-filled-trap';
    });
    const submit = page.getByRole('button', { name: copy.submit });
    await submit.evaluate((element) => {
      (element as HTMLButtonElement).click();
      (element as HTMLButtonElement).click();
    });
    await expectResult(page, copy.acceptedHeading, copy.acceptedBody);
    expect(boundary.requests).toHaveLength(1);
    expect(JSON.parse(boundary.requests[0])._gotcha).toBe('scanner-filled-trap');
    await expect(page.getByLabel(/^(Nombre|Name)/)).toHaveValue('');
    await expect(page.getByLabel(/^(Correo electrónico|Email)/)).toHaveValue('');
    await expect(page.getByLabel(/^(Empresa|Company)/)).toHaveValue('');
    await expect(page.getByLabel(/^(¿Qué necesitás resolver\?|What do you need to solve\?)/)).toHaveValue('');
    await boundary.installed;
  });

  test(`${copy.locale} Contact preserves values and retries after uncertain, limited and server outcomes`, async ({ page }) => {
    const boundary = providerBoundary(page);
    await openContact(page, copy);
    await fillValidInquiry(page);

    boundary.respond({ status: 200, body: { unexpected: true } });
    await page.getByRole('button', { name: copy.submit }).click();
    await expectResult(page, copy.uncertaintyHeading, copy.uncertaintyBody);
    await expect(page.getByLabel(/^(Nombre|Name)/)).toHaveValue('Ada Lovelace');
    await expect(page.getByLabel(/^(Correo electrónico|Email)/)).toHaveValue('ada@example.com');

    boundary.respond({ status: 429, body: {} });
    await page.getByRole('button', { name: copy.retry }).click();
    await expectResult(page, copy.rateHeading, copy.rateBody);
    await expect(page.getByLabel(/^(¿Qué necesitás resolver\?|What do you need to solve\?)/)).toHaveValue('Please help us scope a product idea.');

    boundary.respond({ status: 503, body: {} });
    await page.getByRole('button', { name: copy.retry }).click();
    await expectResult(page, copy.uncertaintyHeading, copy.uncertaintyBody);
    expect(boundary.requests).toHaveLength(3);
    await boundary.installed;
  });

  test(`${copy.locale} Contact shows unavailable configuration when the candidate endpoint is missing`, async ({ page }) => {
    test.skip(Boolean(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT), 'run with the commercial candidate endpoint unset');
    const boundary = providerBoundary(page);
    await openContact(page, copy);
    await fillValidInquiry(page);
    await page.getByRole('button', { name: copy.submit }).click();
    await expectResult(page, copy.unavailableHeading, copy.unavailableBody);
    await expect(page.getByLabel(/^(Nombre|Name)/)).toHaveValue('Ada Lovelace');
    expect(boundary.requests).toEqual([]);
    await boundary.installed;
  });

  test(`${copy.locale} Contact maps provider field rejection to one associated field error`, async ({ page }) => {
    const boundary = providerBoundary(page);
    boundary.respond({ status: 422, body: { errors: [{ field: 'email', code: 'INVALID_EMAIL' }] } });
    await openContact(page, copy);
    await fillValidInquiry(page);
    await page.getByRole('button', { name: copy.submit }).click();
    const email = page.getByLabel(/^(Correo electrónico|Email)/);
    await expect(email).toBeFocused();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    const errorId = await email.getAttribute('aria-describedby');
    expect(errorId).toContain('contact-email-error');
    await expect(page.locator('#contact-email-error')).toHaveText(copy.invalidEmail);
    await boundary.installed;
  });

  test(`${copy.locale} Contact reports an oversized serialized request on the message field without sending it`, async ({ page }) => {
    const boundary = providerBoundary(page);
    await openContact(page, copy);
    await fillValidInquiry(page);
    await page.locator('[name="_gotcha"]').evaluate((element) => {
      (element as HTMLInputElement).value = 'x'.repeat(25 * 1024);
    });
    await page.getByRole('button', { name: copy.submit }).click();
    const message = page.getByLabel(/^(¿Qué necesitás resolver\?|What do you need to solve\?)/);
    await expect(message).toBeFocused();
    await expect(message).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#contact-message-error')).toHaveText(copy.requestTooLarge);
    expect(boundary.requests).toEqual([]);
    await boundary.installed;
  });
}

for (const copy of submissions) {
  test(`${copy.locale} Contact no-JavaScript fallback preserves direct channels`, { tag: '@cross-browser' }, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(appUrl(copy.route));
    await expect(page.locator('html')).toHaveAttribute('lang', copy.language);
    await expect(page.locator('main h1')).toHaveText(copy.heading);
    await expect(page.getByText(copy.preHydrationFallback, { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: copy.submit })).toBeDisabled();
    await expect(page.getByRole('main').locator('a[href^="https://wa.me"], a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(3);
    await expect(page.getByRole('main').getByRole('link', { name: copy.termsLabel })).toHaveAttribute('href', appPathname(copy.terms));
    await expect(page.locator('[role="status"]')).toHaveCount(0);
    await context.close();
  });

  test(`${copy.locale} Contact validates focus, preserves failure, locks duplicates, and accepts retry`, { tag: '@cross-browser' }, async ({ page }) => {
    const boundary = providerBoundary(page);
    const name = page.getByLabel(copy.nameLabel);
    await openContact(page, copy);
    const submit = page.locator('form button[type="submit"]');
    await submit.click();
    await expect(name).toBeFocused();
    expect(boundary.requests).toEqual([]);

    await submit.focus();
    await submit.click();
    await expect(name).toBeFocused();
    expect(boundary.requests).toEqual([]);

    await fillValidInquiry(page);
    boundary.respond({ status: 503, body: {} });
    await page.getByRole('button', { name: copy.submit }).click();
    await expectResult(page, copy.uncertaintyHeading, copy.uncertaintyBody);
    await expect(name).toHaveValue('Ada Lovelace');

    let release: (() => void) | undefined;
    boundary.respond({ status: 200, body: { ok: true }, hold: new Promise<void>((resolve) => { release = resolve; }) });
    await page.getByRole('button', { name: copy.retry }).click();
    await expect(page.locator('form')).toHaveAttribute('aria-busy', 'true');
    await expect(submit).toHaveAttribute('aria-disabled', 'true');
    await expect(submit).toBeFocused();
    for (const field of [page.locator('#contact-name'), page.locator('#contact-email'), page.locator('#contact-company'), page.locator('#contact-message')]) {
      await expect(field).toBeDisabled();
    }
    await expect(submit).not.toHaveAttribute('disabled');
    await expect(page.locator('[data-contact-busy]')).toHaveAttribute('role', 'status');
    await expect(page.locator('[data-contact-busy]')).toHaveAttribute('aria-live', 'polite');
    await page.keyboard.press('Enter');
    await expect.poll(() => boundary.requests.length).toBe(2);
    await page.keyboard.press('Enter');
    expect(boundary.requests).toHaveLength(2);
    release?.();
    await expectResult(page, copy.acceptedHeading, copy.acceptedBody);
    await expect(name).toHaveValue('');
    await boundary.installed;
  });
}

// PLAN-SFC-V1 Task 12: with the live-graph policy fixture applied (the combined candidate) a browser that does not
// qualify for the optional renderer (Firefox and WebKit here have no approved software path) serves the same plain,
// healthy form: no page error, no optional-engine import (the dev-only counter, since next dev lists the engine chunk on
// every page), no request but the mocked endpoint, and the same focus.
for (const copy of submissions) {
  test(`${copy.locale} Contact stays a plain healthy form where no renderer qualifies, with the live policy on or off`, { tag: '@cross-browser' }, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const boundary = providerBoundary(page);
    await openContact(page, copy);
    await fillValidInquiry(page);
    await page.getByRole('button', { name: copy.submit }).click();
    await expectResult(page, copy.acceptedHeading, copy.acceptedBody);
    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
    // The hook exists only where the host mounted (the live policy fixture); either way nothing was imported.
    expect((await readConnected(page))?.imports ?? 0, 'no optional engine import without an eligible renderer').toBe(0);
    expect(boundary.requests).toHaveLength(1);
    await boundary.installed;
  });
}
