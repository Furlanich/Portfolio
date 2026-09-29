import type { Page, Response } from '@playwright/test';

/**
 * `page.goto` that survives the `next dev` parallel-compile race recorded in the Sky Chart plan
 * (Deviations, "Pre-existing dev-server race in parallel e2e runs"): under parallel workers the
 * dev server sometimes answers a not-yet-compiled route with a 5xx (`SyntaxError: Unexpected end
 * of JSON input`) that a second request does not reproduce. A 5xx response is retried up to
 * `attempts` times; every other outcome is returned untouched, so a genuine failure (404, a
 * broken page, a wrong assertion on the loaded page) still fails the test that called it.
 */
export async function gotoResilient(page: Page, url: string, attempts = 3): Promise<Response | null> {
  let response: Response | null = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    response = await page.goto(url);
    if (!response || response.status() < 500) return response;
    await page.waitForTimeout(500 * attempt);
  }
  return response;
}
