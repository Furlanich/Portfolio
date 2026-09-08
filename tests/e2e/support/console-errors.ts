import { expect, type Page } from '@playwright/test';

export function observeUnexpectedBrowserErrors(page: Page) {
  const errors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

  return () => expect(errors, 'unexpected browser errors').toEqual([]);
}
