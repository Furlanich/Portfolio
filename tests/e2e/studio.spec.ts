import { expect, test } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { appPathname, appUrl, stableRoutes } from './support/paths';

const studioCases = [
  {
    locale: 'Spanish',
    route: stableRoutes.studio.es,
    heading: 'Software a medida con responsabilidad técnica directa.',
    alternateLocale: 'en',
    alternateRoute: stableRoutes.studio.en,
    contactLabel: 'Contanos qué necesitás resolver',
    finalContactLabel: 'Iniciar una consulta',
    contactRoute: '/contacto/',
    founderLabel: 'Conocer a Samuel',
    founderRoute: stableRoutes.founder.es,
    navigationLabel: 'Navegación principal',
    studioLabel: 'El estudio',
    menuLabel: 'Abrir navegación principal',
    accountabilityLabel: 'Responsabilidad directa',
  },
  {
    locale: 'English',
    route: stableRoutes.studio.en,
    heading: 'Custom software with direct technical accountability.',
    alternateLocale: 'es-AR',
    alternateRoute: stableRoutes.studio.es,
    contactLabel: 'Tell us what you need to solve',
    finalContactLabel: 'Start an enquiry',
    contactRoute: '/en/contact/',
    founderLabel: 'Meet Samuel',
    founderRoute: stableRoutes.founder.en,
    navigationLabel: 'Primary navigation',
    studioLabel: 'About',
    menuLabel: 'Open primary navigation',
    accountabilityLabel: 'Direct accountability',
  },
] as const;

for (const studioCase of studioCases) {
  test(`${studioCase.locale} Studio renders its approved heading and equivalent actions`, async ({ page }) => {
    const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
    const response = await page.goto(appUrl(studioCase.route));

    expect(response?.ok()).toBe(true);
    await expect(page.locator('main h1:visible')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1, name: studioCase.heading })).toBeVisible();
    await expect(page.getByRole('main').getByRole('link', { name: studioCase.contactLabel })).toHaveAttribute(
      'href',
      appPathname(studioCase.contactRoute),
    );
    await expect(page.getByRole('main').getByRole('link', { name: studioCase.finalContactLabel })).toHaveAttribute(
      'href',
      appPathname(studioCase.contactRoute),
    );
    const founderActions = page.getByRole('main').getByRole('link', { name: studioCase.founderLabel });
    await expect(founderActions).toHaveCount(2);
    for (const founderAction of await founderActions.all()) {
      await expect(founderAction).toHaveAttribute('href', appPathname(studioCase.founderRoute));
    }

    await Promise.all([
      page.waitForURL((url) => url.pathname === appPathname(studioCase.alternateRoute)),
      page.getByRole('banner').locator(`a[hreflang="${studioCase.alternateLocale}"]`).click(),
    ]);
    assertNoBrowserErrors();
  });

  test(`${studioCase.locale} primary navigation targets Studio on desktop and compact layouts`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));
    const navigation = page.getByRole('navigation', { name: studioCase.navigationLabel });
    await expect(navigation.getByRole('link', { name: studioCase.studioLabel })).toHaveAttribute(
      'href',
      appPathname(studioCase.route),
    );

    await page.setViewportSize({ width: 320, height: 800 });
    const menu = page.locator(`summary[aria-label="${studioCase.menuLabel}"]`);
    await menu.focus();
    await page.keyboard.press('Enter');
    await expect(navigation).toBeVisible();
    await expect(navigation.getByRole('link', { name: studioCase.studioLabel })).toHaveAttribute(
      'href',
      appPathname(studioCase.route),
    );
  });

  test(`${studioCase.locale} footer keeps Founder distinct beside the professional profiles under direct accountability`, async ({ page }) => {
    await page.goto(appUrl(studioCase.route));
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('heading', { name: studioCase.accountabilityLabel })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Samuel Furlanich' })).toHaveAttribute(
      'href',
      appPathname(studioCase.founderRoute),
    );
    for (const professionalLink of ['LinkedIn', 'GitHub']) {
      const link = footer.getByRole('link', { name: professionalLink });
      await expect(link).toBeVisible();
      await expect(link).not.toHaveAttribute('target', '_blank');
    }
  });
}

// DESIGN-SFC-V1 "Studio": identity → accountability/collaborators → principles → location → Founder bridge →
// Contact. The separate operating-model panel and the numbered section markers are gone.
const studioAnatomy = [
  {
    locale: 'Spanish',
    route: stableRoutes.studio.es,
    caption: 'Responsabilidad central, especialidades conectadas.',
    sectionHeadings: [
      'Dirección técnica de principio a fin',
      'Principios para trabajar con claridad',
      'Base en Buenos Aires, disponibilidad nacional e internacional',
      'La persona detrás de la dirección técnica',
      'Conversemos sobre lo que hoy frena a tu negocio',
    ],
    collaboratorHeading: 'Colaboración según el alcance',
    principleTitles: [
      'Entender antes de construir.',
      'Definir el alcance con claridad.',
      'Validar de forma incremental.',
      'Construir para mantener.',
    ],
    retiredPanel: 'Modelo de trabajo',
    staticLabel: 'Fondo estático',
    words: ['Responsabilidad', 'Alcance', 'Especialistas', 'Revisión'],
  },
  {
    locale: 'English',
    route: stableRoutes.studio.en,
    caption: 'Central accountability, connected specialties.',
    sectionHeadings: [
      'Technical direction from start to finish',
      'Principles for clear delivery',
      'Based in Buenos Aires, available nationally and internationally',
      'The person behind the technical direction',
      "Let's talk about what's holding your business back",
    ],
    collaboratorHeading: 'Collaboration shaped by the scope',
    principleTitles: [
      'Understand before building.',
      'Define the scope clearly.',
      'Validate incrementally.',
      'Build for maintainability.',
    ],
    retiredPanel: 'Operating model',
    staticLabel: 'Static background',
    words: ['Accountability', 'Scope', 'Specialists', 'Review'],
  },
] as const;

for (const anatomy of studioAnatomy) {
  test(`${anatomy.locale} Studio keeps the approved reading sequence without a duplicated operating model`, async ({ page }) => {
    await page.goto(appUrl(anatomy.route));
    const main = page.getByRole('main');

    await expect(main.locator('h2')).toHaveText([...anatomy.sectionHeadings]);
    await expect(main.getByRole('heading', { level: 3, name: anatomy.collaboratorHeading })).toHaveCount(1);
    await expect(main.getByRole('heading', { name: anatomy.retiredPanel })).toHaveCount(0);
    await expect(main.locator('[data-sequence]')).toHaveCount(0);
    await expect(main.getByRole('complementary')).toHaveCount(0);

    // Document order: H1 → caption → accountability → collaborators → principles → location → Founder → Contact.
    const headings = anatomy.sectionHeadings;
    const order = await main.evaluate((root, caption) => {
      const entries = [...root.querySelectorAll('h1, h2, h3, p')]
        .filter((element) => !element.closest('ul'))
        .map((element) => ({ element, text: element.textContent?.trim() ?? '' }))
        .filter(({ element, text }) => element.tagName !== 'P' || text === caption)
        .map(({ element, text }) => (element.tagName === 'P' ? 'caption' : element.tagName.toLowerCase() + ':' + text));
      return entries;
    }, anatomy.caption);
    expect(order).toEqual([
      expect.stringMatching(/^h1:/),
      'caption',
      'h2:' + headings[0],
      'h3:' + anatomy.collaboratorHeading,
      'h2:' + headings[1],
      'h2:' + headings[2],
      'h2:' + headings[3],
      'h2:' + headings[4],
    ]);
  });

  test(`${anatomy.locale} Studio principles are one semantic list of four complete principles`, async ({ page }) => {
    await page.goto(appUrl(anatomy.route));
    const principles = page.getByRole('region', { name: anatomy.sectionHeadings[1] });
    const list = principles.getByRole('list');
    await expect(list).toHaveCount(1);
    await expect(list.getByRole('listitem')).toHaveCount(4);
    await expect(list.getByRole('heading', { level: 3 })).toHaveText([...anatomy.principleTitles]);
    for (const item of await list.getByRole('listitem').all()) {
      expect((await item.innerText()).split('\n').filter(Boolean).length).toBeGreaterThanOrEqual(2);
    }
  });

  test(`${anatomy.locale} Studio is a connected page with a decorative ground, four word bindings and no missing images`, async ({ page }) => {
    const connectedRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/brand/connected-studio/')) connectedRequests.push(request.url());
    });
    const failures: string[] = [];
    page.on('response', (response) => {
      if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(appUrl(anatomy.route), { waitUntil: 'networkidle' });

    const main = page.locator('main');
    await expect(main).toHaveAttribute('data-connected-page', /.*/);
    await expect(main).toHaveAttribute('data-connected-route', 'studio');
    await expect(main).toHaveAttribute('data-connected-locale', anatomy.route === stableRoutes.studio.es ? 'es' : 'en');

    const ground = main.locator('[data-connected-ground]');
    await expect(ground).toHaveCount(1);
    await expect(ground).toHaveAttribute('aria-hidden', 'true');
    await expect(ground).toHaveAttribute('data-connected-route', 'studio');
    const bindings = JSON.parse((await main.locator('[data-connected-mount]').getAttribute('data-word-bindings')) ?? '[]');
    expect(bindings).toEqual(['n0', 'n4', 'n8', 'n12'].map((nodeId, index) => ({ nodeId, word: anatomy.words[index] })));
    await expect(main.locator('canvas')).toHaveCount(0);

    expect(connectedRequests, 'no poster is requested while unpublished').toEqual([]);
    expect(failures).toEqual([]);
  });

  test(`${anatomy.locale} Studio reserves a 44px Pause slot with the quiet static-background label`, async ({ page }) => {
    await page.goto(appUrl(anatomy.route));
    const slot = page.locator('#connected-pause-studio');
    await expect(slot).toHaveCount(1);
    await expect(slot).toHaveAttribute('data-connected-pause-slot', /.*/);
    await expect(slot).toHaveText(anatomy.staticLabel);

    const geometry = await slot.evaluate((element) => {
      const slotBox = element.getBoundingClientRect();
      const actions = [...element.parentElement!.querySelectorAll('a')].map((link) => link.getBoundingClientRect().bottom);
      return { height: slotBox.height, top: slotBox.top, actionsBottom: Math.max(...actions), fontSize: parseFloat(getComputedStyle(element.firstElementChild!).fontSize) };
    });
    expect(geometry.height).toBeGreaterThanOrEqual(44);
    expect(geometry.top - geometry.actionsBottom).toBeGreaterThanOrEqual(11);
    expect(geometry.top - geometry.actionsBottom).toBeLessThanOrEqual(13);
    expect(geometry.fontSize).toBe(14);
    // The slot follows the introduction's actions, inside the opaque introduction plate.
    await expect(slot.locator('xpath=ancestor::*[@data-connected-opaque-plate]')).toHaveCount(1);
  });

  test(`${anatomy.locale} Studio marks its opaque plates and 24px reading scrims for the connected host`, async ({ page }) => {
    await page.goto(appUrl(anatomy.route));
    const main = page.locator('main');
    expect(await main.locator('[data-connected-opaque-plate]').count()).toBeGreaterThanOrEqual(3);
    const scrims = main.locator('[data-connected-reading-mask]');
    expect(await scrims.count()).toBeGreaterThanOrEqual(3);
    for (const scrim of await scrims.all()) {
      await expect(scrim).toHaveAttribute('data-connected-clearance', '24');
    }
    const plateStyle = await main.locator('[data-connected-opaque-plate]').first().evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, radius: style.borderTopLeftRadius, border: style.borderTopColor, shadow: style.boxShadow, blur: style.backdropFilter };
    });
    expect(plateStyle).toEqual({ background: 'rgb(10, 30, 51)', radius: '16px', border: 'rgb(54, 83, 108)', shadow: 'none', blur: 'none' });
  });

  test(`${anatomy.locale} Studio is complete without JavaScript`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    await page.goto(appUrl(anatomy.route));
    const main = page.getByRole('main');
    await expect(main.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(main.locator('h2')).toHaveText([...anatomy.sectionHeadings]);
    await expect(main.getByText(anatomy.caption)).toBeVisible();
    for (const principle of anatomy.principleTitles) await expect(main.getByText(principle)).toBeVisible();
    await expect(main.getByRole('link')).toHaveCount(4);
    await expect(page.locator('#connected-pause-studio')).toHaveText(anatomy.staticLabel);
    await context.close();
  });
}

test('Studio stays inside the viewport at every approved width', async ({ page }) => {
  for (const route of [stableRoutes.studio.es, stableRoutes.studio.en]) {
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(appUrl(route));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(0);
    }
  }
});

// DESIGN-SFC-V1: at 320px and 200% text zoom, complete words and natural flow outrank forced layout, and the
// page-level horizontal clip must never hide meaningful text. Document scroll width cannot see that (the clip
// suppresses it), so this measures every rendered text rectangle against the viewport and its own plate.
// The expansion is a deterministic text-only simulation (every element's font size and line height doubled at
// an unchanged 320px layout), not a native browser text-zoom run.
type TextBounds = { text: string; left: number; right: number; limitLeft: number; limitRight: number };

async function overflowingText(page: import('@playwright/test').Page): Promise<string[]> {
  return page.locator('main').evaluate((root) => {
    const problems: TextBounds[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent?.trim();
      const element = node.parentElement;
      if (!text || !element || element.closest('[aria-hidden="true"]')) continue;
      const container = element.closest('[data-connected-opaque-plate]');
      const limits = container ? container.getBoundingClientRect() : { left: 0, right: window.innerWidth };
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (rect.width === 0) continue;
        if (rect.left < limits.left - 0.5 || rect.right > limits.right + 0.5 || rect.left < -0.5 || rect.right > window.innerWidth + 0.5) {
          problems.push({ text: text.slice(0, 40), left: Math.round(rect.left), right: Math.round(rect.right), limitLeft: Math.round(limits.left), limitRight: Math.round(limits.right) });
        }
      }
    }
    return problems.map((problem) => `${problem.text} [${problem.left}..${problem.right}] outside [${problem.limitLeft}..${problem.limitRight}]`);
  });
}

for (const route of [stableRoutes.studio.es, stableRoutes.studio.en]) {
  test(`Studio keeps every word inside its box at 320px with 200% text expansion (${route})`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(appUrl(route));
    expect(await overflowingText(page), 'default size').toEqual([]);

    await page.locator('main').evaluate((root) => {
      const elements = [...root.querySelectorAll<HTMLElement>('*')];
      const sizes = elements.map((element) => {
        const style = getComputedStyle(element);
        return { fontSize: parseFloat(style.fontSize), lineHeight: parseFloat(style.lineHeight) };
      });
      elements.forEach((element, index) => {
        element.style.fontSize = `${sizes[index].fontSize * 2}px`;
        if (Number.isFinite(sizes[index].lineHeight)) element.style.lineHeight = `${sizes[index].lineHeight * 2}px`;
      });
    });
    expect(await overflowingText(page), '200% text expansion').toEqual([]);
  });

  test(`Studio keeps every word inside its box at 320px with the WCAG text-spacing override (${route})`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(appUrl(route));
    await page.addStyleTag({
      content: 'main * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } main p { margin-bottom: 2em !important; }',
    });
    expect(await overflowingText(page)).toEqual([]);
  });
}

// The approved written rendering (docs/reviews/studio-founder-contact-design-2026-10-14/assets/written-studio-es-*)
// sets the category line and the chart caption in IBM Plex Mono at a small size, and the second introduction
// action as an underlined text link beside the solid primary action. DESIGN-SFC-V1 reserves mono for restrained
// chart metadata and keeps underlined text links identifiable.
for (const anatomy of studioAnatomy) {
  test(`${anatomy.locale} Studio sets its category line and caption as restrained mono and its Founder links as underlined text`, async ({ page }) => {
    await page.goto(appUrl(anatomy.route));
    const main = page.locator('main');
    const style = (locator: ReturnType<typeof main.locator>) =>
      locator.evaluate((element) => {
        const computed = getComputedStyle(element);
        return {
          mono: /plexMono/i.test(computed.fontFamily),
          size: parseFloat(computed.fontSize),
          transform: computed.textTransform,
          underline: computed.textDecorationLine,
          border: computed.borderTopColor,
          background: computed.backgroundColor,
        };
      });

    const eyebrow = await style(main.locator('[data-connected-opaque-plate] h1').locator('xpath=preceding-sibling::p[1]'));
    expect(eyebrow).toMatchObject({ mono: true, transform: 'none' });
    expect(eyebrow.size).toBeGreaterThanOrEqual(14);
    expect(eyebrow.size).toBeLessThanOrEqual(15);

    const caption = await style(main.getByText(anatomy.caption, { exact: true }));
    expect(caption).toMatchObject({ mono: true, transform: 'none' });
    expect(caption.size).toBeGreaterThanOrEqual(14);
    expect(caption.size).toBeLessThanOrEqual(15);

    const founderLinks = main.locator('a[href*="samuel-furlanich"]');
    await expect(founderLinks).toHaveCount(2);
    for (const link of await founderLinks.all()) {
      const linkStyle = await style(link);
      expect(linkStyle.underline).toBe('underline');
      expect(linkStyle.border, 'no visible border').toBe('rgba(0, 0, 0, 0)');
      expect(linkStyle.background).toBe('rgba(0, 0, 0, 0)');
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
  });
}
