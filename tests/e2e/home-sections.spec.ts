import { expect, test, type Locator, type Page } from '@playwright/test';
import { observeUnexpectedBrowserErrors } from './support/console-errors';
import { appUrl, stableRoutes } from './support/paths';

/**
 * SKY-CHART-V2 Task 9 / PR 9. Covers D-13 to D-19 (Problems, Services, Position fix,
 * Proof, Process, Founder, Dawn CTA) plan section 21's RED list.
 *
 * This spec runs on every project registered in playwright.config.ts for
 * home-sections.spec.ts (chromium-desktop/firefox-desktop/webkit-desktop at 1440,
 * mobile-chromium at 390, tablet-chromium at 1024, compact-320-chromium at 320), so
 * width-dependent assertions branch on `page.viewportSize()` rather than assuming one
 * width.
 */

type LocaleCase = {
  locale: 'es' | 'en';
  route: string;
  processId: 'proceso' | 'process';
  problemsSituations: [string, string, string];
  servicesLeadTitle: string;
  proofLogLabel: string;
  proofLogTerms: [string, string, string];
  processStepsCount: 4;
  founderActionLabel: string;
  impact: {
    heading: string;
    illustrativeTag: string;
    groupLabel: string;
    separateLabel: string;
    connectedLabel: string;
    announcement: { separate: string; connected: string };
    sourceNames: [string, string, string, string, string];
  };
  readout: {
    problems: string;
    services: string;
    impact: string;
    proof: string;
    process: string;
    founder: string;
    contact: string;
  };
};

const CASES: LocaleCase[] = [
  {
    locale: 'es',
    route: stableRoutes.home.es,
    processId: 'proceso',
    problemsSituations: [
      'Pedidos y reservas que se reorganizan a mano.',
      'Consultas repetidas que interrumpen el trabajo.',
      'Sistemas que no comparten información o necesitan mejoras.',
    ],
    servicesLeadTitle: 'Sitios y aplicaciones web comerciales',
    proofLogLabel: 'Dónde se aplica la responsabilidad',
    proofLogTerms: ['Definir', 'Decidir', 'Revisar'],
    processStepsCount: 4,
    founderActionLabel: 'Conocer a Samuel',
    impact: {
      heading: 'Menos lugares que revisar para saber en qué estado está un pedido',
      illustrativeTag: 'Escenario ilustrativo',
      groupLabel: 'Escenario',
      separateLabel: 'Fuentes separadas',
      connectedLabel: 'Registro conectado',
      announcement: { separate: 'Mostrando: Fuentes separadas', connected: 'Mostrando: Registro conectado' },
      sourceNames: ['Chat de WhatsApp', 'Cuaderno de pedidos', 'Planilla', 'Correo', 'Llamada'],
    },
    readout: {
      problems: 'Problemas',
      services: 'Servicios',
      impact: 'Posición',
      proof: 'Responsabilidad',
      process: 'Proceso',
      founder: 'Fundador',
      contact: 'Contacto',
    },
  },
  {
    locale: 'en',
    route: stableRoutes.home.en,
    processId: 'process',
    problemsSituations: [
      'Orders and bookings reorganized by hand.',
      'Repeated questions that interrupt work.',
      'Systems that do not share information or need improvement.',
    ],
    servicesLeadTitle: 'Business websites and web applications',
    proofLogLabel: 'Where accountability applies',
    proofLogTerms: ['Define', 'Decide', 'Review'],
    processStepsCount: 4,
    founderActionLabel: 'Meet Samuel',
    impact: {
      heading: 'Fewer places to check before you know where an order stands',
      illustrativeTag: 'Illustrative scenario',
      groupLabel: 'Scenario',
      separateLabel: 'Separate sources',
      connectedLabel: 'Connected record',
      announcement: { separate: 'Showing: Separate sources', connected: 'Showing: Connected record' },
      sourceNames: ['WhatsApp thread', 'Paper order book', 'Spreadsheet', 'Email', 'Phone call'],
    },
    readout: {
      problems: 'Problems',
      services: 'Services',
      impact: 'Position fix',
      proof: 'Accountability',
      process: 'Process',
      founder: 'Founder',
      contact: 'Contact',
    },
  },
];

function viewportWidth(page: Page): number {
  return page.viewportSize()?.width ?? 1440;
}

/**
 * RED item 8: at most 3 content surfaces using backdrop-filter may intersect the
 * viewport at once (D-08), the App Bar excluded. `PlottingSheet`/`AtlasPlate`
 * (`blur={true}`, the default) are the only surfaces that use backdrop-filter; process
 * step plates use `blur={false}` precisely to stay under this budget (D-17).
 */
async function countIntersectingBackdropFilterSurfaces(page: Page): Promise<number> {
  return page.evaluate(() => {
    const viewportHeight = window.innerHeight;
    const viewportWidthPx = window.innerWidth;
    let count = 0;
    for (const element of Array.from(document.querySelectorAll<HTMLElement>('main *'))) {
      if (element.closest('[data-app-bar]')) continue;
      const style = window.getComputedStyle(element);
      const backdropFilter = style.backdropFilter || (style as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter;
      if (!backdropFilter || backdropFilter === 'none') continue;
      const rect = element.getBoundingClientRect();
      const intersects = rect.bottom > 0 && rect.top < viewportHeight && rect.right > 0 && rect.left < viewportWidthPx;
      if (intersects) count += 1;
    }
    return count;
  });
}

async function scrollToSection(page: Page, id: string) {
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
}

for (const testCase of CASES) {
  test.describe(`${testCase.locale} Home sections`, () => {
    test('sections render in the approved order: problems, services, impact, proof, process, founder, cta', async ({ page }) => {
      await page.goto(appUrl(testCase.route));
      const main = page.getByRole('main');
      const ids = await main.locator(':scope > section').evaluateAll((sections) => sections.map((section) => section.id));
      const homeSectionIds = ['problems', 'services', 'impact', 'proof', testCase.processId, 'founder', 'cta'];
      for (const id of homeSectionIds) {
        expect(ids).toContain(id);
      }
      const orderedIndexes = homeSectionIds.map((id) => ids.indexOf(id));
      const sortedIndexes = [...orderedIndexes].sort((a, b) => a - b);
      expect(orderedIndexes).toEqual(sortedIndexes);
    });

    test('Problems is a plotting-sheet cascade of three sheets with the exact situation text', async ({ page }) => {
      await page.goto(appUrl(testCase.route));
      const sheets = page.locator('#problems li');
      await expect(sheets).toHaveCount(3);

      const width = viewportWidth(page);
      const expectedOffsets = width >= 1024 ? ['0px', '56px', '112px'] : ['0px', '0px', '0px'];

      for (let index = 0; index < 3; index += 1) {
        const sheet = sheets.nth(index);
        await expect(sheet.locator('svg[aria-hidden="true"]')).toHaveCount(1);
        await expect(sheet.locator('[aria-hidden="true"]').filter({ hasText: /^[αβγ]$/ })).toHaveCount(1);
        await expect(sheet).toContainText(testCase.problemsSituations[index]);
        const marginLeft = await sheet.evaluate((el) => window.getComputedStyle(el).marginLeft);
        expect(marginLeft).toBe(expectedOffsets[index]);
      }
    });

    // Owner decision E5 (2026-10-04): the IBM Plex Mono subset has no Greek, so the Bayer
    // letters get their own serif Greek stack (as printed star atlases set them) instead of
    // whatever monospace fallback happens to cover α, β, γ.
    test('Problems Bayer letters use the serif Greek stack at 17px, Azure, not uppercased', async ({ page }) => {
      await page.goto(appUrl(testCase.route));
      const letters = page.locator('#problems li [data-bayer-letter]');
      await expect(letters).toHaveCount(3);
      for (let index = 0; index < 3; index += 1) {
        const style = await letters.nth(index).evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return { family: computed.fontFamily, size: computed.fontSize, transform: computed.textTransform, hidden: el.getAttribute('aria-hidden') };
        });
        expect(style.family.split(',')[0].trim().replace(/["']/g, '')).toBe('Georgia');
        expect(style.family).toMatch(/serif$/);
        expect(style.size).toBe('17px');
        expect(style.transform).toBe('none');
        expect(style.hidden).toBe('true');
      }
    });

    test('Services: the lead plate is at least 420px high and spans two rows at 1440', async ({ page }) => {
      await page.goto(appUrl(testCase.route));
      const width = viewportWidth(page);
      test.skip(width < 1024, 'the two-row lead plate layout only applies at >=1024');

      const leadPlate = page.locator('#services article').first();
      await expect(leadPlate).toContainText(testCase.servicesLeadTitle);
      const box = await leadPlate.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(420);
      const gridRow = await leadPlate.evaluate((el) => window.getComputedStyle(el).gridRowEnd);
      expect(gridRow).toContain('span 2');
    });

    test.describe('Impact (Position fix)', () => {
      test('both SVGs render, visible, without JavaScript', async ({ browser }) => {
        const context = await browser.newContext({ javaScriptEnabled: false });
        const page = await context.newPage();
        await page.goto(appUrl(testCase.route));

        const svgs = page.locator('#impact svg');
        await expect(svgs).toHaveCount(2);
        await expect(svgs.nth(0)).toBeVisible();
        await expect(svgs.nth(1)).toBeVisible();
        // No JS: no segmented control exists at all (progressive enhancement).
        await expect(page.locator('#impact [role="group"]')).toHaveCount(0);

        await context.close();
      });

      test('the toggle switches hidden state, aria-pressed and the live-region text', async ({ page }) => {
        await page.goto(appUrl(testCase.route));
        const group = page.locator('#impact [role="group"]');
        await expect(group).toHaveAccessibleName(testCase.impact.groupLabel);

        const separateButton = group.getByRole('button', { name: testCase.impact.separateLabel });
        const connectedButton = group.getByRole('button', { name: testCase.impact.connectedLabel });
        await expect(separateButton).toHaveAttribute('aria-pressed', 'true');
        await expect(connectedButton).toHaveAttribute('aria-pressed', 'false');

        await connectedButton.click();
        await expect(connectedButton).toHaveAttribute('aria-pressed', 'true');
        await expect(separateButton).toHaveAttribute('aria-pressed', 'false');
        await expect(page.locator('#impact [aria-live="polite"]')).toHaveText(testCase.impact.announcement.connected);

        await separateButton.click();
        await expect(separateButton).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('#impact [aria-live="polite"]')).toHaveText(testCase.impact.announcement.separate);
      });

      test('the visible source list shows all five sources', async ({ page }) => {
        await page.goto(appUrl(testCase.route));
        const items = page.locator('#impact ol li');
        await expect(items).toHaveCount(5);
        for (const name of testCase.impact.sourceNames) {
          await expect(page.locator('#impact')).toContainText(name);
        }
      });

      test('the "Illustrative scenario" tag appears twice, and the counts are 5 and 1', async ({ page }) => {
        await page.goto(appUrl(testCase.route));
        await expect(page.locator('#impact').getByText(testCase.impact.illustrativeTag, { exact: true })).toHaveCount(2);
        await expect(page.locator('#impact b')).toHaveText(['5', '1']);
      });

      test('rendered on-chart label text stays at or above 12px at 390px', async ({ page }) => {
        await page.goto(appUrl(testCase.route));
        test.skip(viewportWidth(page) !== 390, 'this legibility floor is specifically asserted at the 390px project');

        const measurement = await page.evaluate(() => {
          const svg = document.querySelector('#impact svg[role="img"]');
          if (!svg) return null;
          const svgRect = svg.getBoundingClientRect();
          const visibleTextNodes = Array.from(svg.querySelectorAll<SVGTextElement>('text')).filter((node) => {
            const style = window.getComputedStyle(node);
            return style.display !== 'none' && style.visibility !== 'hidden';
          });
          if (visibleTextNodes.length === 0) return null;
          const fontSizePx = Math.min(
            ...visibleTextNodes.map((node) => parseFloat(window.getComputedStyle(node).fontSize)),
          );
          // The SVG's own viewBox is 600 user units wide (lib/impact/position-fix.ts
          // POSITION_FIX_VIEW_BOX); font-size is declared in that same user-unit space,
          // so the rendered pixel size is fontSize * (renderedWidth / 600).
          const viewBox = svg.getAttribute('viewBox');
          const viewBoxWidth = viewBox ? parseFloat(viewBox.split(/\s+/)[2]) : 600;
          return (fontSizePx * svgRect.width) / viewBoxWidth;
        });

        expect(measurement).not.toBeNull();
        expect(measurement as number).toBeGreaterThanOrEqual(11.9);
      });
    });

    test('Proof: the accountability log has an accessible name and three items', async ({ page }) => {
      await page.goto(appUrl(testCase.route));
      const log = page.getByRole('list', { name: testCase.proofLogLabel });
      await expect(log).toBeVisible();
      const items = log.locator('li');
      await expect(items).toHaveCount(3);
      for (const term of testCase.proofLogTerms) {
        await expect(log).toContainText(term);
      }
    });

    test('Process: an ordered list of four steps; the arc is visible only at >=1024 and is aria-hidden', async ({ page }) => {
      await page.goto(appUrl(testCase.route));
      const steps = page.locator(`#${testCase.processId} ol > li`);
      await expect(steps).toHaveCount(4);

      const arc = page.locator(`#${testCase.processId} svg[aria-hidden="true"]`);
      await expect(arc).toHaveCount(1);
      const width = viewportWidth(page);
      if (width >= 1024) {
        await expect(arc).toBeVisible();
      } else {
        await expect(arc).toBeHidden();
      }
    });

    test('Dawn CTA: the primary action carries the Ink focus ring', async ({ page }) => {
      await page.goto(appUrl(testCase.route));
      const primaryAction = page.locator('#cta a').first();
      await primaryAction.focus();
      const outline = await primaryAction.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return { color: style.outlineColor, width: style.outlineWidth };
      });
      expect(outline.width).toBe('3px');
      expect(outline.color).toBe('rgb(9, 36, 61)');
    });

    test('at most three intersecting backdrop-filter surfaces per section (App Bar excluded)', async ({ page }) => {
      await page.goto(appUrl(testCase.route));
      for (const id of ['problems', 'services', 'impact', 'proof', testCase.processId, 'founder', 'cta']) {
        await scrollToSection(page, id);
        const count = await countIntersectingBackdropFilterSurfaces(page);
        expect(count, `section #${id} exceeds the D-08 backdrop-filter budget`).toBeLessThanOrEqual(3);
      }
    });

    test('every [data-readout] value on Home comes from content', async ({ page }) => {
      await page.goto(appUrl(testCase.route));
      const expectations: [string, string][] = [
        ['problems', testCase.readout.problems],
        ['services', testCase.readout.services],
        ['impact', testCase.readout.impact],
        ['proof', testCase.readout.proof],
        [testCase.processId, testCase.readout.process],
        ['founder', testCase.readout.founder],
        ['cta', testCase.readout.contact],
      ];
      for (const [id, readout] of expectations) {
        await expect(page.locator(`#${id}`)).toHaveAttribute('data-readout', readout);
      }
    });

    test('keyboard tab order follows Problems, Services, Position fix toggle, Proof, Process, Founder, CTA', async ({ page }) => {
      await page.goto(appUrl(testCase.route));
      // PositionFixToggle only renders its <button>s after client-side hydration
      // (progressive enhancement); wait for it so this check does not race hydration.
      await page.locator('#impact [role="group"] button').first().waitFor();

      function firstFocusableSelector(id: string): string {
        return `#${id} a, #${id} button`;
      }

      const order = await page.evaluate((selectors: string[]) => {
        const positions: number[] = [];
        let previous: Element | null = null;
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (!element) {
            positions.push(-1);
            continue;
          }
          if (previous) {
            const relation = previous.compareDocumentPosition(element);
            // DOCUMENT_POSITION_FOLLOWING = 4: `element` comes after `previous`.
            positions.push(relation & 4 ? 1 : -1);
          } else {
            positions.push(0);
          }
          previous = element;
        }
        return positions;
      }, [
        firstFocusableSelector('problems'),
        firstFocusableSelector('services'),
        '#impact [role="group"] button',
        firstFocusableSelector('proof'),
        firstFocusableSelector(testCase.processId),
        firstFocusableSelector('founder'),
        firstFocusableSelector('cta'),
      ]);

      expect(order[0]).toBe(0);
      for (const relation of order.slice(1)) {
        expect(relation).toBe(1);
      }
    });

    test('Home loads without unexpected console or page errors', async ({ page }) => {
      const assertNoBrowserErrors = observeUnexpectedBrowserErrors(page);
      await page.goto(appUrl(testCase.route));
      await page.locator('#cta').scrollIntoViewIfNeeded();
      assertNoBrowserErrors();
    });

    test('forced colours: surfaces render a CanvasText border', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'forced-colors emulation is only supported in Chromium');
      await page.goto(appUrl(testCase.route));
      await page.emulateMedia({ forcedColors: 'active' });

      const plate = page.locator('#services article').first();
      const sheet = page.locator('#problems li').first();
      for (const surface of [plate, sheet] as Locator[]) {
        const style = await surface.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return { borderStyle: computed.borderTopStyle, backgroundImage: computed.backgroundImage };
        });
        expect(style.borderStyle).toBe('solid');
        expect(style.backgroundImage).toBe('none');
      }
    });
  });
}
