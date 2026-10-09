import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { appPathname, appUrl, stableRoutes } from './support/paths';

// PLAN-SPF-V1 Task 4 / PC-4: the shared protected-mark Azure conclusion. The oracle for the approved
// copy is the IA table (docs/product/information-architecture.md, "Proposed Footer wording"); it is
// restated here on purpose so a drift in footer-content.ts cannot make its own test pass.

type FooterLocale = 'es' | 'en';

const copy = {
  es: {
    headline: 'Dale un próximo paso a tu proyecto.',
    introduction:
      'Contanos qué necesitás construir, conectar o mejorar. Samuel Furlanich es el responsable técnico directo.',
    whatsapp: 'Escribinos por WhatsApp',
    directContact: 'Contacto directo',
    contactRoute: 'Información de contacto',
    location: 'Buenos Aires, Argentina · Estudio liderado por su fundador',
    explore: 'Explorar',
    accountability: 'Responsabilidad directa',
    privacy: 'Privacidad',
    languageSwitchName: 'Ver sitio en inglés',
    alternateHreflang: 'en',
    navigation: ['Servicios', 'Proyectos', 'Cómo trabajamos', 'El estudio'],
    processAnchor: 'proceso',
  },
  en: {
    headline: 'Give your project a next step.',
    introduction:
      'Tell us what you need to build, connect or improve. Samuel Furlanich is the directly accountable technical lead.',
    whatsapp: 'Write on WhatsApp',
    directContact: 'Direct contact',
    contactRoute: 'Contact information',
    location: 'Buenos Aires, Argentina · Founder-led studio',
    explore: 'Explore',
    accountability: 'Direct accountability',
    privacy: 'Privacy',
    languageSwitchName: 'View site in Spanish',
    alternateHreflang: 'es-AR',
    navigation: ['Services', 'Work', 'How we work', 'About'],
    processAnchor: 'process',
  },
} as const;

const channels = {
  whatsapp: 'https://wa.me/5491150117565',
  email: 'mailto:samuelfurlanich@gmail.com',
  phone: 'tel:+5491150117565',
} as const;
const emailText = 'samuelfurlanich@gmail.com';
const phoneText = '+54 9 11 5011-7565';
const founderLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/samuel-furlanich/' },
  { name: 'GitHub', href: 'https://github.com/Furlanich' },
] as const;

const hosts = [
  { role: 'Home', route: stableRoutes.home },
  { role: 'Services', route: stableRoutes.services },
  { role: 'Projects', route: stableRoutes.projects },
  { role: 'Studio', route: stableRoutes.studio },
  { role: 'Founder', route: stableRoutes.founder },
  { role: 'Contact', route: stableRoutes.contact },
  { role: 'Privacy', route: stableRoutes.privacy },
] as const;
const locales: readonly FooterLocale[] = ['es', 'en'];

// The canonical protected mark (public/brand/furlanich-mark-bone-on-azure.svg), read from the asset
// so the Footer geometry is compared with the source, not with a second copy of its numbers.
const canonicalMark = readFileSync(
  path.join(process.cwd(), 'public/brand/furlanich-mark-bone-on-azure.svg'),
  'utf8',
);
const canonicalPoints = Array.from(canonicalMark.matchAll(/points="([^"]+)"/g), (match) => match[1]);

// The plain landmark, so a missing `data-site-footer` marker is reported by its own test and the
// invitation tests fail on the invitation itself.
function footerOf(page: Page): Locator {
  return page.locator('footer');
}

async function openFooter(page: Page, route: string) {
  await page.goto(appUrl(route));
  const footer = footerOf(page);
  await footer.scrollIntoViewIfNeeded();
  return footer;
}

test('shared footer exposes approved invitation and WhatsApp primary action in both locales', async ({ page }) => {
  for (const locale of locales) {
    const text = copy[locale];
    const footer = await openFooter(page, stableRoutes.services[locale]);

    await expect(footer).toHaveCount(1);
    await expect(footer.getByRole('heading', { level: 2, name: text.headline, exact: true })).toBeVisible();
    await expect(footer.getByText(text.introduction, { exact: true })).toBeVisible();

    const whatsapp = footer.getByRole('link', { name: text.whatsapp, exact: true });
    await expect(whatsapp).toBeVisible();
    await expect(whatsapp).toHaveAttribute('href', channels.whatsapp);
    // WhatsApp appears once, as the primary action (PC-4).
    await expect(footer.locator('a[href^="https://wa.me"]')).toHaveCount(1);
  }
});

test('every host page has exactly one footer and it carries the data-site-footer marker', async ({ page }) => {
  for (const host of hosts) {
    for (const locale of locales) {
      await page.goto(appUrl(host.route[locale]));
      await expect(page.locator('footer'), `${locale} ${host.role}`).toHaveCount(1);
      await expect(page.locator('footer[data-site-footer]'), `${locale} ${host.role}`).toHaveCount(1);
    }
  }
});

for (const host of hosts) {
  for (const locale of locales) {
    test(`${locale} ${host.role} footer carries the approved composition, links and order`, async ({ page }) => {
      const text = copy[locale];
      const home = stableRoutes.home[locale];
      const footer = await openFooter(page, host.route[locale]);

      const signature = footer.getByRole('link', { name: 'FURLANICH', exact: true });
      await expect(signature).toHaveAttribute('href', appPathname(home));
      const headline = footer.getByRole('heading', { level: 2, name: text.headline, exact: true });
      const introduction = footer.getByText(text.introduction, { exact: true });
      const whatsapp = footer.getByRole('link', { name: text.whatsapp, exact: true });
      const directHeading = footer.getByRole('heading', { level: 3, name: text.directContact, exact: true });
      const email = footer.getByRole('link', { name: emailText, exact: true });
      const phone = footer.getByRole('link', { name: phoneText, exact: true });
      const contactRoute = footer.getByRole('link', { name: text.contactRoute, exact: true });
      const location = footer.getByText(text.location, { exact: true });
      const exploreHeading = footer.getByRole('heading', { level: 3, name: text.explore, exact: true });
      const exploreLinks = text.navigation.map((name) => footer.getByRole('link', { name, exact: true }));
      const accountabilityHeading = footer.getByRole('heading', { level: 3, name: text.accountability, exact: true });
      const founder = footer.getByRole('link', { name: 'Samuel Furlanich', exact: true });
      const profiles = founderLinks.map((link) => footer.getByRole('link', { name: link.name, exact: true }));
      const copyright = footer.getByText(/^© \d{4} FURLANICH$/);
      const privacy = footer.getByRole('link', { name: text.privacy, exact: true });
      const languageSwitch = footer.locator(`a[hreflang="${text.alternateHreflang}"]`);

      // Approved destinations.
      await expect(email).toHaveAttribute('href', channels.email);
      await expect(phone).toHaveAttribute('href', channels.phone);
      await expect(contactRoute).toHaveAttribute('href', appPathname(stableRoutes.contact[locale]));
      await expect(exploreLinks[0]).toHaveAttribute('href', appPathname(stableRoutes.services[locale]));
      await expect(exploreLinks[1]).toHaveAttribute('href', appPathname(stableRoutes.projects[locale]));
      await expect(exploreLinks[2]).toHaveAttribute('href', `${appPathname(home)}#${text.processAnchor}`);
      await expect(exploreLinks[3]).toHaveAttribute('href', appPathname(stableRoutes.studio[locale]));
      await expect(founder).toHaveAttribute('href', appPathname(stableRoutes.founder[locale]));
      for (const [index, link] of founderLinks.entries()) {
        await expect(profiles[index]).toHaveAttribute('href', link.href);
      }
      await expect(privacy).toHaveAttribute('href', appPathname(stableRoutes.privacy[locale]));
      await expect(languageSwitch).toHaveCount(1);
      await expect(languageSwitch).toHaveAttribute('href', appPathname(host.route[locale === 'es' ? 'en' : 'es']));
      await expect(languageSwitch).toHaveAttribute('aria-label', text.languageSwitchName);

      // Direct channels keep the content-owned order: WhatsApp, email, phone.
      const channelHrefs = await footer
        .locator('a[href^="https://wa.me"], a[href^="mailto:"], a[href^="tel:"]')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
      expect(channelHrefs).toEqual([channels.whatsapp, channels.email, channels.phone]);

      // "Enlaces profesionales" is replaced, not duplicated (inventory row, studio-founder).
      await expect(footer.getByRole('heading', { name: /enlaces profesionales|professional links/i })).toHaveCount(0);

      // DOM order matches PC-4: signature, invitation, direct contact, explore, accountability, utility.
      const ordered = [
        signature, headline, introduction, whatsapp,
        directHeading, email, phone, contactRoute, location,
        exploreHeading, ...exploreLinks,
        accountabilityHeading, founder, ...profiles,
        copyright, privacy, languageSwitch,
      ];
      const positions = await Promise.all(
        ordered.map((target) =>
          target.first().evaluate((element) => {
            const all = Array.from(element.closest('footer')!.querySelectorAll('*'));
            return all.indexOf(element);
          }),
        ),
      );
      expect(positions.every((position) => position >= 0), 'every composition element is inside the footer').toBe(true);
      expect(positions, 'footer DOM order').toEqual([...positions].sort((a, b) => a - b));
      expect(new Set(positions).size).toBe(positions.length);

      // Landmark: one contentinfo, and the explore group is a named navigation.
      await expect(page.getByRole('contentinfo')).toHaveCount(1);
      await expect(footer.getByRole('navigation')).toHaveCount(1);
      await expect(footer.getByRole('navigation', { name: text.explore, exact: true })).toBeVisible();
    });
  }
}

test('the footer signature is a Footer-only mark: no App Bar marker, canonical geometry, no transform', async ({ page }) => {
  expect(canonicalPoints).toHaveLength(3);
  const footer = await openFooter(page, stableRoutes.services.es);

  // Home's App Bar detection reads [data-app-bar-brand]; the Footer must never carry it.
  await expect(footer.locator('[data-app-bar-brand]')).toHaveCount(0);

  const marks = await footer.locator('svg').evaluateAll((svgs) =>
    svgs.map((svg) => ({
      viewBox: svg.getAttribute('viewBox'),
      ariaHidden: svg.getAttribute('aria-hidden'),
      points: Array.from(svg.querySelectorAll('polyline'), (line) => line.getAttribute('points')),
      stroke: Array.from(svg.querySelectorAll('g'), (group) => ({
        strokeWidth: group.getAttribute('stroke-width'),
        linecap: group.getAttribute('stroke-linecap'),
        linejoin: group.getAttribute('stroke-linejoin'),
        miter: group.getAttribute('stroke-miterlimit'),
      })),
      transformAttributes: [svg, ...Array.from(svg.querySelectorAll('*'))].filter((node) => node.hasAttribute('transform')).length,
      box: (() => {
        const rect = svg.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      })(),
    })),
  );
  const markSvgs = marks.filter((mark) => mark.points.length > 0);
  // Exactly two whole marks: the foreground signature and the static watermark.
  expect(markSvgs).toHaveLength(2);
  for (const mark of markSvgs) {
    expect(mark.viewBox).toBe('0 0 256 256');
    expect(mark.points).toEqual(canonicalPoints);
    expect(mark.stroke).toEqual([{ strokeWidth: '30', linecap: 'butt', linejoin: 'miter', miter: '4' }]);
    expect(mark.transformAttributes).toBe(0);
    expect(mark.ariaHidden).toBe('true');
    // A uniform scale only: the rendered box stays square.
    expect(Math.abs(mark.box.width - mark.box.height)).toBeLessThan(1);
  }
});

test('the watermark is one static, decorative, pointer-inert mark that sits behind the right-hand groups', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const footer = await openFooter(page, stableRoutes.services.es);
  const watermark = footer.locator('[data-footer-watermark]');
  await expect(watermark).toHaveCount(1);
  await expect(watermark).toHaveAttribute('aria-hidden', 'true');

  const style = await watermark.evaluate((element) => {
    const computed = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      pointerEvents: computed.pointerEvents,
      position: computed.position,
      opacity: Number(computed.opacity),
      animationName: computed.animationName,
      transitionDuration: computed.transitionDuration,
      rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
    };
  });
  expect(style.pointerEvents).toBe('none');
  expect(style.position).toBe('absolute');
  expect(style.animationName).toBe('none');
  expect(style.opacity).toBeCloseTo(0.085, 3);

  // Behind columns 3-5: it overlaps the direct-contact group and the accountability group, and stays
  // clear of the invitation column's left edge.
  const overlaps = async (locator: Locator) => {
    const box = (await locator.boundingBox())!;
    return box.x < style.rect.right && box.x + box.width > style.rect.left && box.y < style.rect.bottom && box.y + box.height > style.rect.top;
  };
  expect(await overlaps(footer.getByRole('link', { name: emailText, exact: true }))).toBe(true);
  expect(await overlaps(footer.getByRole('link', { name: 'Samuel Furlanich', exact: true }))).toBe(true);
  expect(await overlaps(footer.getByRole('link', { name: copy.es.whatsapp, exact: true }))).toBe(false);

  // Compact: the watermark moves behind the direct-contact group and lightens to about 0.06.
  await page.setViewportSize({ width: 390, height: 844 });
  await footer.scrollIntoViewIfNeeded();
  const compact = await watermark.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { opacity: Number(getComputedStyle(element).opacity), rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom } };
  });
  expect(compact.opacity).toBeCloseTo(0.06, 3);
  // It sits behind the direct-contact group (as in the 390px reference, centered a little below the
  // group's middle): the contact-route link and the location line are inside its box, and it never
  // reaches the invitation's WhatsApp button above.
  const contactBox = (await footer.getByRole('link', { name: copy.es.contactRoute, exact: true }).boundingBox())!;
  const locationBox = (await footer.getByText(copy.es.location, { exact: true }).boundingBox())!;
  const whatsappBox = (await footer.getByRole('link', { name: copy.es.whatsapp, exact: true }).boundingBox())!;
  for (const box of [contactBox, locationBox]) {
    const middle = box.y + box.height / 2;
    expect(middle).toBeGreaterThan(compact.rect.top);
    expect(middle).toBeLessThan(compact.rect.bottom);
  }
  expect(whatsappBox.y + whatsappBox.height).toBeLessThan(compact.rect.top);
});

test('every text element over the watermark measures at least 4.5:1 (3:1 for large text)', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 320, height: 700 }]) {
    await page.setViewportSize(viewport);
    for (const locale of locales) {
      await openFooter(page, stableRoutes.services[locale]);
      const failures = await page.evaluate(() => {
        const footer = document.querySelector<HTMLElement>('footer[data-site-footer]')!;
        const watermark = footer.querySelector<SVGElement>('[data-footer-watermark]')!;
        const parse = (value: string) => {
          const channels = value.match(/[\d.]+/g)!.map(Number);
          return { r: channels[0], g: channels[1], b: channels[2], a: channels[3] ?? 1 };
        };
        const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
          const linear = [r, g, b].map((channel) => {
            const unit = channel / 255;
            return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
        };
        const background = parse(getComputedStyle(footer).backgroundColor);
        const stroke = parse(getComputedStyle(watermark).color);
        const opacity = Number(getComputedStyle(watermark).opacity);
        // Worst case: the brightest background a glyph can sit on is the Azure with the watermark stroke
        // composited at its opacity.
        const under = {
          r: background.r * (1 - opacity) + stroke.r * opacity,
          g: background.g * (1 - opacity) + stroke.g * opacity,
          b: background.b * (1 - opacity) + stroke.b * opacity,
        };
        const results: string[] = [];
        const walker = document.createTreeWalker(footer, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          if (!node.textContent?.trim()) continue;
          const element = node.parentElement!;
          if (watermark.contains(element)) continue;
          const computed = getComputedStyle(element);
          const color = parse(computed.color);
          const size = parseFloat(computed.fontSize);
          const weight = Number(computed.fontWeight);
          const large = size >= 24 || (size >= 18.66 && weight >= 700);
          // Text on its own opaque surface (the Bone button) is measured against that surface; every
          // other glyph sits on the Footer, so it is measured against the watermarked worst case.
          let surface = under;
          for (let ancestor: HTMLElement | null = element; ancestor && ancestor !== footer; ancestor = ancestor.parentElement) {
            const fill = parse(getComputedStyle(ancestor).backgroundColor);
            if (fill.a === 1) {
              surface = fill;
              break;
            }
          }
          const lighter = Math.max(luminance(color), luminance(surface));
          const darker = Math.min(luminance(color), luminance(surface));
          const ratio = (lighter + 0.05) / (darker + 0.05);
          if (ratio < (large ? 3 : 4.5)) results.push(`${node.textContent.trim().slice(0, 40)} ${ratio.toFixed(2)}`);
        }
        return results;
      });
      expect(failures, `${locale} ${viewport.width}px`).toEqual([]);
    }
  }
});

test('the long email wraps without clipping and nothing overflows at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  for (const locale of locales) {
    const footer = await openFooter(page, stableRoutes.contact[locale]);
    const overflow = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      footer: (() => {
        const element = document.querySelector<HTMLElement>('footer[data-site-footer]')!;
        return element.scrollWidth - element.clientWidth;
      })(),
    }));
    expect(overflow.document, `${locale} document overflow`).toBeLessThanOrEqual(0);
    expect(overflow.footer, `${locale} footer overflow`).toBeLessThanOrEqual(0);

    const links = footer.locator('a');
    for (let index = 0; index < (await links.count()); index += 1) {
      const box = await links.nth(index).boundingBox();
      if (!box) continue;
      expect(box.x, `link ${index} left edge`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `link ${index} right edge`).toBeLessThanOrEqual(320);
    }
    const email = footer.getByRole('link', { name: emailText, exact: true });
    const emailBox = (await email.boundingBox())!;
    expect(emailBox.height).toBeGreaterThanOrEqual(44);
  }
});

// Visual matrix (packet): every host role, both locales, at 390 and 1440. These are layout facts, not
// pixels: the page never scrolls sideways and the composition reads in the specified direction.
test('no host page overflows sideways with the footer at 390px and 1440px', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const host of hosts) {
      for (const locale of locales) {
        await openFooter(page, host.route[locale]);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${locale} ${host.role} at ${width}px`).toBeLessThanOrEqual(0);
        await expect(footerOf(page).getByRole('heading', { level: 2 })).toBeVisible();
      }
    }
  }
});

// The Services host at 320, 390, 768, 1024 and 1440: stacked below 768px, two columns from 768px up.
for (const width of [320, 390, 768, 1024, 1440]) {
  test(`the Services host footer composes for ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of locales) {
      const footer = await openFooter(page, stableRoutes.services[locale]);
      const invitation = (await footer.getByRole('heading', { level: 2 }).boundingBox())!;
      const direct = (await footer.getByRole('heading', { level: 3, name: copy[locale].directContact, exact: true }).boundingBox())!;
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${locale} overflow`).toBeLessThanOrEqual(0);
      if (width < 768) {
        expect(direct.y, `${locale} direct contact stacks under the invitation`).toBeGreaterThan(invitation.y + invitation.height);
        expect(Math.abs(direct.x - invitation.x), `${locale} one column`).toBeLessThan(2);
      } else {
        expect(direct.x, `${locale} direct contact sits beside the invitation`).toBeGreaterThan(invitation.x + invitation.width * 0.5);
        expect(direct.y, `${locale} same band`).toBeLessThan(invitation.y + invitation.height + 120);
      }
    }
  });
}

test('reflows at an equivalent 200% zoom (720px) without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 450 });
  const footer = await openFooter(page, stableRoutes.services.es);
  await expect(footer.getByRole('link', { name: copy.es.whatsapp, exact: true })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('the primary action and every footer link are keyboard reachable with a visible focus indicator', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const footer = await openFooter(page, stableRoutes.services.es);
  const whatsapp = footer.getByRole('link', { name: copy.es.whatsapp, exact: true });
  await whatsapp.focus();
  await expect(whatsapp).toBeFocused();
  const outline = await whatsapp.evaluate((element) => {
    const computed = getComputedStyle(element);
    return { style: computed.outlineStyle, width: parseFloat(computed.outlineWidth) };
  });
  expect(outline.style).not.toBe('none');
  expect(outline.width).toBeGreaterThanOrEqual(2);

  const links = footer.locator('a');
  const count = await links.count();
  for (let index = 0; index < count; index += 1) {
    const box = await links.nth(index).boundingBox();
    expect(box?.height ?? 0, `link ${index} target height`).toBeGreaterThanOrEqual(44);
  }
});

test('forced colors removes the watermark and keeps the text on system colors', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  const footer = await openFooter(page, stableRoutes.services.es);
  await expect(footer.locator('[data-footer-watermark]')).toBeHidden();
  await expect(footer.getByRole('link', { name: copy.es.whatsapp, exact: true })).toBeVisible();
});

test('reduced motion leaves no footer transition or animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const footer = await openFooter(page, stableRoutes.services.es);
  const durations = await footer.locator('a, [data-footer-watermark]').evaluateAll((elements) =>
    elements.map((element) => {
      const computed = getComputedStyle(element);
      return { transition: computed.transitionDuration, animation: computed.animationName };
    }),
  );
  for (const entry of durations) {
    expect(entry.animation).toBe('none');
    expect(entry.transition.split(',').every((duration) => parseFloat(duration) === 0)).toBe(true);
  }
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  for (const locale of locales) {
    test(`${locale} footer is complete server HTML`, async ({ page }) => {
      const text = copy[locale];
      const footer = await openFooter(page, stableRoutes.services[locale]);
      await expect(footer.getByRole('heading', { level: 2, name: text.headline, exact: true })).toBeVisible();
      await expect(footer.getByRole('link', { name: text.whatsapp, exact: true })).toHaveAttribute('href', channels.whatsapp);
      await expect(footer.getByRole('link', { name: emailText, exact: true })).toHaveAttribute('href', channels.email);
      await expect(footer.getByRole('link', { name: phoneText, exact: true })).toHaveAttribute('href', channels.phone);
      await expect(footer.locator(`a[hreflang="${text.alternateHreflang}"]`)).toHaveAttribute(
        'href',
        appPathname(stableRoutes.services[locale === 'es' ? 'en' : 'es']),
      );
      await expect(footer.locator('[data-footer-watermark]')).toHaveCount(1);
    });
  }
});

test('every internal footer link resolves at the served base path', async ({ page, request }) => {
  for (const locale of locales) {
    const footer = await openFooter(page, stableRoutes.home[locale]);
    const hrefs = await footer.locator('a[href^="/"]').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href') as string),
    );
    expect(hrefs.length).toBeGreaterThanOrEqual(7);
    const origin = new URL(page.url()).origin;
    for (const href of hrefs) {
      const expectedPrefix = appPathname('/').replace(/\/$/, '');
      expect(href.startsWith(`${expectedPrefix}/`), `${href} carries the base path`).toBe(true);
      const response = await request.get(new URL(href, origin).toString());
      expect(response.status(), href).toBe(200);
    }
  }
});

test('the global demonstration disclosure stays where it is, and the footer adds no new claim', async ({ page }) => {
  await page.goto(appUrl(stableRoutes.home.es));
  await expect(page.getByText('Explorá las opciones de contacto y probá el formulario de demostración.', { exact: false })).toHaveCount(1);
  await page.goto(appUrl(stableRoutes.home.en));
  await expect(page.getByText('Explore the contact options and try the demonstration form.', { exact: false })).toHaveCount(1);
  await page.goto(appUrl(stableRoutes.contact.es));
  await expect(page.getByRole('heading', { name: 'Demostración interactiva' })).toBeVisible();
  await page.goto(appUrl(stableRoutes.contact.en));
  await expect(page.getByRole('heading', { name: 'Interactive demonstration' })).toBeVisible();

  const footerText = (await footerOf(page).innerText()).toLowerCase();
  expect(footerText).not.toMatch(/respuesta|response time|sla|agend|schedule/);
});

test('visiting the footer and scrolling back leaves the Home App Bar unchanged', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(appUrl(stableRoutes.home.es));
  const appBarState = () =>
    page.evaluate(() => {
      const header = document.querySelector<HTMLElement>('[data-app-bar]')!;
      return {
        attributes: Object.fromEntries(Array.from(header.attributes, (attribute) => [attribute.name, attribute.value])),
        readout: header.querySelector('[data-app-bar-readout]')?.textContent ?? null,
        brandLinks: document.querySelectorAll('[data-app-bar-brand]').length,
      };
    });
  // Sample only after the App Bar has hydrated and published its state; before that it has neither
  // `data-docked` nor a readout, which would make the comparison measure hydration, not the Footer.
  await expect(page.locator('[data-app-bar]')).toHaveAttribute('data-docked', /true|false/);
  await expect.poll(() => page.locator('[data-app-bar-readout]').textContent()).toMatch(/^\d{2} · /);
  await page.evaluate(() => window.scrollTo(0, 0));
  const before = await appBarState();
  expect(before.brandLinks, 'the App Bar owns the only brand marker').toBe(1);

  await footerOf(page).scrollIntoViewIfNeeded();
  await expect(footerOf(page).getByRole('heading', { level: 2 })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  await expect.poll(appBarState).toEqual(before);
});
