import { expect, test } from '@playwright/test';
import { appUrl, stableRoutes } from './support/paths';

const founderCases = [
  { locale: 'Spanish', route: stableRoutes.founder.es, biographyHeading: 'Biografía profesional' },
  { locale: 'English', route: stableRoutes.founder.en, biographyHeading: 'Professional biography' },
] as const;

for (const founderCase of founderCases) {
  test(`${founderCase.locale} Founder keeps biography after experience and capability references valid`, async ({ page }) => {
    await page.goto(appUrl(founderCase.route));

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

    const experience = page.getByRole('region', { name: founderCase.locale === 'Spanish' ? 'Experiencia profesional' : 'Professional experience' });
    const biography = page.locator('[data-founder-biography]');
    await expect(biography.getByRole('heading', { name: founderCase.biographyHeading })).toBeVisible();
    const experienceBox = await experience.boundingBox();
    const biographyBox = await biography.boundingBox();
    expect(experienceBox).not.toBeNull();
    expect(biographyBox).not.toBeNull();
    expect(biographyBox!.y).toBeGreaterThan(experienceBox!.y);

    const groups = page.locator('[data-founder-capability-group]');
    const references = await groups.evaluateAll((items) => items.map((item) => ({
      section: item.getAttribute('aria-labelledby'),
      heading: item.querySelector('h3')?.id,
    })));
    expect(references).toHaveLength(4);
    for (const reference of references) {
      expect(reference.section).toBe(reference.heading);
      expect(reference.section).not.toMatch(/\s/);
    }
  });
}
