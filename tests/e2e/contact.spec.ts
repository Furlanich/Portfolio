import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { appPathname, appUrl, stableRoutes } from './support/paths';

test.describe.configure({ timeout: 60_000 });

const cases = [
  { route: stableRoutes.contact.es, heading: 'Contanos qué necesitás resolver.', removedNoticeHeading: 'Demostración interactiva', removedNoticeBody: 'Este sitio es una muestra técnica. El formulario simula el envío en este navegador: no envía datos, no crea una consulta comercial y no llega a ninguna bandeja de entrada.', removedFailureHelper: 'Para probar el estado de error, usá failure@example.invalid como correo electrónico.', formHeading: 'Iniciar una consulta', submit: 'Simular envío', submitting: 'Simulando…', success: 'Demostración completada.', failure: 'La simulación no pudo completarse.', retry: 'Intentar nuevamente', language: 'es-AR' },
  { route: stableRoutes.contact.en, heading: 'Tell us what you need to solve.', removedNoticeHeading: 'Interactive demonstration', removedNoticeBody: 'This site is a technical showcase. The form simulates submission in this browser: it sends no data, creates no commercial inquiry, and reaches no inbox.', removedFailureHelper: 'To try the failure state, use failure@example.invalid as the email address.', formHeading: 'Start an inquiry', submit: 'Simulate submission', submitting: 'Simulating…', success: 'Demonstration complete.', failure: 'The simulation could not be completed.', retry: 'Try again', language: 'en' },
] as const;

const inquiry = { name: 'Ada Lovelace', email: 'success@example.invalid', company: 'Analytical Engines', message: 'Please help us scope a product idea.' };

async function fillInquiry(page: Page, email = inquiry.email) {
  await expect(page.locator('form[data-contact-hydrated="true"]')).toBeVisible();
  await page.getByLabel(/^(Nombre|Name)/).fill(inquiry.name);
  await page.getByLabel(/^(Correo electrónico|Email)/).fill(email);
  await page.getByLabel(/^(Empresa|Company)/).fill(inquiry.company);
  await page.getByLabel(/^(¿Qué necesitás resolver\?|What do you need to solve\?)/).fill(inquiry.message);
}

type RecordedRequest = { method: string; url: string; body: string | null };

function recordRequests(page: Page) {
  const requests: RecordedRequest[] = [];
  page.on('request', (request) => requests.push({ method: request.method(), url: request.url(), body: request.postData() }));
  return requests;
}

// ADR-CONTACT-INQUIRY-DEMO-MODE promises zero inquiry transmission, not zero requests: a production
// export's App Router prefetches route data and probes route documents with same-origin GET and
// HEAD fetches. Anything that could carry the inquiry (a method with a body, another origin, or a
// typed value in the URL or body) is flagged.
function inquiryTransmissions(requests: RecordedRequest[], origin: string) {
  const values = Object.values(inquiry);
  const decode = (text: string) => {
    try {
      return decodeURIComponent(text.replace(/\+/g, ' '));
    } catch {
      return text;
    }
  };
  return requests.filter(({ method, url, body }) => {
    const texts = [url, body ?? ''].flatMap((text) => [text, decode(text)]);
    return !['GET', 'HEAD'].includes(method) || new URL(url).origin !== origin || values.some((value) => texts.some((text) => text.includes(value)));
  });
}

async function gotoContact(page: Page, route: string, language: string) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.goto(appUrl(route));
    try {
      await expect(page.locator('html')).toHaveAttribute('lang', language, { timeout: 10_000 });
      return;
    } catch (error) {
      lastError = error;
      await page.reload();
    }
  }
  throw lastError;
}

for (const pageCase of cases) {
  test(pageCase.language + ' Contact renders the local-only demonstration and ordered fallbacks', async ({ page }) => {
    await gotoContact(page, pageCase.route, pageCase.language);
    await expect(page.locator('main h1')).toHaveText(pageCase.heading);
    const opaqueIntake = page.getByRole('main').locator('[data-connected-opaque-plate]');
    await expect(opaqueIntake).toHaveCount(1);
    await expect(opaqueIntake.locator('form')).toHaveCount(1);
    await expect(opaqueIntake.locator('aside')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: pageCase.removedNoticeHeading })).toHaveCount(0);
    await expect(page.getByText(pageCase.removedNoticeBody, { exact: true })).toHaveCount(0);
    await expect(page.getByText(pageCase.removedFailureHelper, { exact: true })).toHaveCount(0);
    await expect(page.getByRole('main').locator('a[href^="https://wa.me"], a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(3);
    await expect(page.getByRole('main').getByRole('link', { name: /Privacy Policy|Política de privacidad/ })).toHaveAttribute(
      'href',
      appPathname(pageCase.language === 'en' ? '/en/privacy/' : '/privacidad/'),
    );
    await expect(page.getByRole('main').getByRole('link', { name: /Terms and Conditions|Términos y condiciones/ })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Samuel/ }).last()).toBeVisible();
  });

  test(pageCase.language + ' Contact validates every applicable field and focuses the first invalid control', async ({ page }) => {
    await gotoContact(page, pageCase.route, pageCase.language);
    await page.getByRole('button', { name: pageCase.submit }).click();
    await expect(page.getByText(pageCase.language === 'en' ? 'Enter your name.' : 'Ingresá tu nombre.')).toBeVisible();
    await expect(page.getByText(pageCase.language === 'en' ? 'Enter your email address.' : 'Ingresá tu correo electrónico.')).toBeVisible();
    await expect(page.locator('#contact-message-error')).toHaveText(pageCase.language === 'en' ? 'Tell us what you need to solve.' : 'Contanos qué necesitás resolver.');
    await expect(page.getByLabel(/^(Nombre|Name)/)).toBeFocused();
    await expect(page.getByLabel(/^(Nombre|Name)/)).toHaveAttribute('aria-invalid', 'true');
  });

  test(pageCase.language + ' Contact refocuses the first invalid control on repeated submissions', async ({ page }) => {
    await gotoContact(page, pageCase.route, pageCase.language);
    const name = page.getByLabel(/^(Nombre|Name)/);
    const submit = page.getByRole('button', { name: pageCase.submit });

    await submit.click();
    await expect(name).toBeFocused();
    await submit.focus();
    await submit.click();
    await expect(name).toBeFocused();
  });

  test(pageCase.language + ' Contact simulates success, blocks duplicates, resets values, and transmits no inquiry', async ({ page }) => {
    await gotoContact(page, pageCase.route, pageCase.language);
    const requests = recordRequests(page);
    await fillInquiry(page);
    const button = page.getByRole('button', { name: pageCase.submit });
    await button.evaluate((element) => {
      (element as HTMLButtonElement).click();
      (element as HTMLButtonElement).click();
    });
    const result = page.locator('[data-contact-result]');
    await expect(result).toContainText(pageCase.success);
    await expect(result).toBeFocused();
    await expect(page.getByLabel(/^(Nombre|Name)/)).toHaveValue('');
    await expect(page.getByLabel(/^(Correo electrónico|Email)/)).toHaveValue('');
    await expect(page.getByLabel(/^(Empresa|Company)/)).toHaveValue('');
    await expect(page.getByLabel(/^(¿Qué necesitás resolver\?|What do you need to solve\?)/)).toHaveValue('');
    expect(inquiryTransmissions(requests, new URL(page.url()).origin)).toEqual([]);
  });

  test(pageCase.language + ' Contact preserves values through failure and retry', async ({ page }) => {
    await gotoContact(page, pageCase.route, pageCase.language);
    await fillInquiry(page, 'failure@example.invalid');
    await page.getByRole('button', { name: pageCase.submit }).click();
    const result = page.locator('[data-contact-result]');
    await expect(result).toContainText(pageCase.failure);
    await expect(page.getByLabel(/^(Nombre|Name)/)).toHaveValue('Ada Lovelace');
    await expect(page.getByLabel(/^(Correo electrónico|Email)/)).toHaveValue('failure@example.invalid');
    await expect(result).toBeFocused();
    await expect(page.getByRole('button', { name: pageCase.retry })).toBeVisible();
    await page.getByLabel(/^(Correo electrónico|Email)/).fill('success@example.invalid');
    await page.getByRole('button', { name: pageCase.retry }).click();
    await expect(page.locator('[data-contact-result]')).toContainText(pageCase.success);
  });
}

test('Contact transmission check flags inquiry submissions but not same-origin router prefetches', async ({ page }) => {
  await gotoContact(page, stableRoutes.contact.en, 'en');
  const sink = 'https://inquiry-sink.invalid';
  await page.route(`${sink}/**`, (route) => route.fulfill({ status: 204 }));
  await page.route('**/inquiry-probe/**', (route) => route.fulfill({ status: 204 }));
  const requests = recordRequests(page);
  await fillInquiry(page);
  await page.locator('form').evaluate((form, sinkOrigin) => {
    form.addEventListener('submit', () => {
      const email = (form.querySelector('input[type="email"]') as HTMLInputElement).value;
      void fetch(`${sinkOrigin}/formspree`, { method: 'POST', body: new FormData(form as HTMLFormElement) }).catch(() => undefined);
      navigator.sendBeacon('./inquiry-probe/beacon', '{}');
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `./inquiry-probe/echo?email=${encodeURIComponent(email)}`);
      xhr.send();
      new Image().src = `${sinkOrigin}/pixel.gif`;
      void fetch('./inquiry-probe/prefetch.txt').catch(() => undefined);
      void fetch('./inquiry-probe/', { method: 'HEAD' }).catch(() => undefined);
    });
  }, sink);
  await page.getByRole('button', { name: 'Simulate submission' }).click();
  await expect(page.locator('[data-contact-result]')).toContainText('Demonstration complete.');
  await expect.poll(() => requests.filter(({ url }) => /\/inquiry-probe\/(prefetch\.txt)?$/.test(url)).length).toBe(2);
  await expect
    .poll(() => inquiryTransmissions(requests, new URL(page.url()).origin).map(({ method, url }) => `${method} ${new URL(url).pathname.split('/').pop()}`).sort())
    .toEqual(['GET echo', 'GET pixel.gif', 'POST beacon', 'POST formspree']);
});

test('Contact remains readable with JavaScript disabled and does not show a false success state', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(appUrl(stableRoutes.contact.en));
  await expect(page.locator('main h1')).toHaveText('Tell us what you need to solve.');
  await expect(page.getByRole('heading', { name: 'Interactive demonstration' })).toHaveCount(0);
  await expect(page.getByText('This site is a technical showcase. The form simulates submission in this browser: it sends no data, creates no commercial inquiry, and reaches no inbox.', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('main').getByRole('link', { name: 'Write on WhatsApp' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: 'Send an email' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: 'Call' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Simulate submission' })).toBeDisabled();
  await expect(page.locator('[data-contact-busy]')).toHaveCount(0);
  await context.close();
});

test('Contact native bounds allow the complete approved Unicode code-point limits', async ({ page }) => {
  await gotoContact(page, stableRoutes.contact.en, 'en');
  await expect(page.locator('form[data-contact-hydrated="true"]')).toBeVisible();
  const limits = [
    ['#contact-name', 200, '😀'.repeat(100)],
    ['#contact-email', 508, 'a'.repeat(508)],
    ['#contact-company', 240, '😀'.repeat(120)],
    ['#contact-message', 8000, '😀'.repeat(4000)],
  ] as const;

  for (const [selector, maxLength, value] of limits) {
    const field = page.locator(selector);
    await expect(field).toHaveAttribute('maxlength', String(maxLength));
    await field.fill(value);
    await expect(field).toHaveValue(value);
  }
});

test('Contact gives native field errors one associated focus target and global results one nonlive region', async ({ page }) => {
  await gotoContact(page, stableRoutes.contact.en, 'en');
  await page.getByRole('button', { name: 'Simulate submission' }).click();
  const first = page.locator('#contact-name');
  await expect(first).toBeFocused();
  await expect(first).toHaveAttribute('aria-describedby', /contact-name-error/);

  await fillInquiry(page);
  await page.getByRole('button', { name: 'Simulate submission' }).click();
  const result = page.locator('[data-contact-result]');
  await expect(result).toBeFocused();
  await expect(result).toHaveAttribute('role', 'region');
  await expect(result).not.toHaveAttribute('aria-live', /.+/);
  await expect(result).not.toHaveAttribute('role', 'status');
  await expect(page.locator('[data-contact-busy]')).toHaveAttribute('aria-atomic', 'true');
});

function contrastRatio(foreground: string, background: string) {
  const channel = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  const luminance = (color: string) => {
    const [red, green, blue] = (color.match(/\d+(?:\.\d+)?/g) ?? []).slice(0, 3).map(Number);
    return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
  };
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((left, right) => right - left);
  return (lighter + 0.05) / (darker + 0.05);
}

for (const pageCase of cases) {
  test(pageCase.language + ' Contact has no serious or critical axe violations', async ({ page }) => {
    await gotoContact(page, pageCase.route, pageCase.language);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([]);
  });

  test(pageCase.language + ' Contact field boundaries meet non-text contrast and fallbacks keep their order', async ({ page }) => {
    await gotoContact(page, pageCase.route, pageCase.language);
    const main = page.getByRole('main');

    for (const control of await main.locator('form input, form textarea').all()) {
      const { border, background } = await control.evaluate((element) => {
        const style = getComputedStyle(element);
        return { border: style.borderTopColor, background: style.backgroundColor };
      });
      expect(contrastRatio(border, background), 'field boundary contrast').toBeGreaterThanOrEqual(3);
    }

    const hrefs = await main.locator('a[href^="https://wa.me"], a[href^="mailto:"], a[href^="tel:"]').evaluateAll(
      (links) => links.map((link) => link.getAttribute('href')?.split(':')[0]),
    );
    expect(hrefs).toEqual(['https', 'mailto', 'tel']);

    const formHeading = main.getByRole('heading', { name: pageCase.formHeading });
    const firstField = main.locator('#contact-name');
    expect(await formHeading.evaluate((heading, field) => Boolean(heading.compareDocumentPosition(field as Node) & Node.DOCUMENT_POSITION_FOLLOWING), await firstField.elementHandle())).toBe(true);
  });

  test(pageCase.language + ' Contact can be completed with the keyboard alone', async ({ page }) => {
    await gotoContact(page, pageCase.route, pageCase.language);
    await expect(page.locator('form[data-contact-hydrated="true"]')).toBeVisible();

    for (let presses = 0; presses < 60; presses += 1) {
      if (await page.evaluate(() => document.activeElement?.id === 'contact-name')) break;
      await page.keyboard.press('Tab');
    }
    await expect(page.locator('#contact-name')).toBeFocused();
    await page.keyboard.type('Ada Lovelace');
    await page.keyboard.press('Tab');
    await page.keyboard.type('success@example.invalid');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Analytical Engines');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Please help us scope a product idea.');

    for (let presses = 0; presses < 5; presses += 1) {
      await page.keyboard.press('Tab');
      if (await page.evaluate(() => document.activeElement?.getAttribute('type') === 'submit')) break;
    }
    await expect(page.getByRole('button', { name: pageCase.submit })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: pageCase.success })).toBeVisible();
    await expect(page.locator('[data-contact-result]')).toBeFocused();
  });

  test(pageCase.language + ' Contact stacks below 820px, splits at 820px, and stays inside the viewport', async ({ page }) => {
    await gotoContact(page, pageCase.route, pageCase.language);
    const formPanel = page.locator('main section[aria-labelledby$="-form-heading"]');
    const alternativesPanel = page.getByRole('complementary').filter({ has: page.locator('a[href^="https://wa.me"]') });

    for (const width of [320, 390, 768, 819, 820, 1023, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      const [formBox, alternativesBox] = await Promise.all([
        formPanel.boundingBox(),
        alternativesPanel.boundingBox(),
      ]);
      expect(formBox, `${width}px form panel`).not.toBeNull();
      expect(alternativesBox, `${width}px alternatives panel`).not.toBeNull();
      if (!formBox || !alternativesBox) continue;

      if (width < 820) {
        expect(alternativesBox.y).toBeGreaterThanOrEqual(formBox.y + formBox.height);
      } else {
        expect(Math.abs(alternativesBox.y - formBox.y)).toBeLessThanOrEqual(2);
        expect(alternativesBox.x).toBeGreaterThanOrEqual(formBox.x + formBox.width);
      }

      for (const action of await page.locator('main aside a[href^="https://wa.me"], main aside a[href^="mailto:"], main aside a[href^="tel:"]').all()) {
        const box = await action.boundingBox();
        expect(box?.height ?? 0, `${width}px direct-channel target`).toBeGreaterThanOrEqual(44);
      }
    }
  });
}
