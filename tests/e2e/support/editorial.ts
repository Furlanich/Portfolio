import { expect, type Locator } from '@playwright/test';

export const IDENTITY_TINT = 'rgb(231, 238, 245)';

// Text rendered in IBM Plex Mono. DESIGN-VISUAL limits mono to short sequence labels and
// compact metadata, so every returned string must stay short.
export async function monoTexts(scope: Locator): Promise<string[]> {
  return scope.evaluate((root) =>
    [...root.querySelectorAll<HTMLElement>('*')]
      .filter((element) => [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()))
      .filter((element) => /plexMono/i.test(getComputedStyle(element).fontFamily))
      .map((element) => element.textContent?.trim() ?? '')
      .filter(Boolean),
  );
}

export async function expectShortMonoOnly(scope: Locator, maxLength = 64) {
  const texts = await monoTexts(scope);
  for (const text of texts) {
    expect(text.length, `mono text is short metadata: "${text}"`).toBeLessThanOrEqual(maxLength);
  }
  return texts;
}

export async function expectSequenceMarker(scope: Locator, sequence: string) {
  const marker = scope.locator('[data-sequence]').first();
  await expect(marker).toHaveText(sequence);
  await expect(marker).toHaveAttribute('aria-hidden', 'true');
  expect(await marker.evaluate((element) => getComputedStyle(element).fontFamily)).toMatch(/plexMono/i);
}

export async function backgroundOf(locator: Locator) {
  return locator.evaluate((element) => getComputedStyle(element).backgroundColor);
}
