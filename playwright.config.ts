import { defineConfig, devices } from '@playwright/test';
import { normalizeBasePath } from './tests/e2e/support/paths';

const isCI = Boolean(process.env.CI);
const host = '127.0.0.1';
const port = Number(process.env.PLAYWRIGHT_PORT ?? 3100);
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? '');
const origin = process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${port}`;
const baseURL = new URL(`${basePath}/`, origin).toString();

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  outputDir: 'test-results',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: `npm run dev -- --hostname ${host} --port ${port}`,
    url: baseURL,
    env: {
      ...process.env,
      JITI_CACHE: process.env.JITI_CACHE ?? 'false',
      NEXT_PUBLIC_BASE_PATH: basePath,
    },
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium-desktop',
      testMatch: [
        /smoke\.spec\.ts/,
        /studio-founder\.spec\.ts/,
      ],
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'firefox-desktop',
      testMatch: /smoke\.spec\.ts/,
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'webkit-desktop',
      testMatch: /smoke\.spec\.ts/,
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-chromium',
      testMatch: /responsive\.spec\.ts/,
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'mobile-webkit',
      testMatch: /responsive\.spec\.ts/,
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'tablet-chromium',
      testMatch: /responsive\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } },
    },
    {
      name: 'wide-chromium',
      testMatch: /responsive\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'compact-320-chromium',
      testMatch: /studio-founder-responsive\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 800 } },
    },
    {
      name: 'tablet-portrait-chromium',
      testMatch: /studio-founder-responsive\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'accessibility-chromium',
      testMatch: /accessibility\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'visual-chromium',
      testMatch: /visual\/.*\.visual\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'light',
        deviceScaleFactor: 1,
        locale: 'es-AR',
        reducedMotion: 'reduce',
        timezoneId: 'UTC',
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
