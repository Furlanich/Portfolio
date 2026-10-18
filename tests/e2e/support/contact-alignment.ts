import { expect, type Page } from '@playwright/test';

export async function expectContactAlignment(page: Page) {
  const links = page.locator('[data-contact-channels] ul a');
  await expect(links).toHaveCount(3);
  for (const link of await links.all()) {
    await expect(link.locator('svg')).toHaveCount(1);
    await expect(link.locator('svg')).toHaveAttribute('aria-hidden', 'true');
    await expect(link.locator('svg')).toHaveAttribute('focusable', 'false');
  }

  const measurements = await links.evaluateAll((elements) => elements.map((element) => {
    const button = element.getBoundingClientRect();
    const icon = element.querySelector('svg')!.getBoundingClientRect();
    const label = element.querySelector('span')!.getBoundingClientRect();
    return {
      left: button.left, right: button.right, height: button.height,
      iconLeft: icon.left, iconWidth: icon.width, iconHeight: icon.height,
      iconInset: icon.left - button.left,
      iconCenterOffset: icon.top + icon.height / 2 - (button.top + button.height / 2),
      labelCenterOffset: label.left + label.width / 2 - (button.left + button.width / 2),
      labelGap: label.left - icon.right,
      contained: element.scrollWidth <= element.clientWidth,
    };
  }));
  for (const measurement of measurements) {
    for (const key of ['left', 'right', 'height', 'iconLeft'] as const) {
      expect(Math.abs(measurement[key] - measurements[0][key])).toBeLessThan(1);
    }
    expect(measurement.height).toBeGreaterThanOrEqual(48);
    expect(measurement.iconInset).toBeCloseTo(17, 0);
    expect(measurement.iconWidth).toBe(20);
    expect(measurement.iconHeight).toBe(20);
    expect(Math.abs(measurement.iconCenterOffset)).toBeLessThan(1);
    expect(Math.abs(measurement.labelCenterOffset)).toBeLessThan(1);
    expect(measurement.labelGap).toBeGreaterThanOrEqual(12);
    expect(measurement.contained).toBe(true);
  }
}
