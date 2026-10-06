import { defineConfig, devices } from '@playwright/test';
import { normalizeBasePath } from './tests/e2e/support/paths';

const isCI = Boolean(process.env.CI);
const host = '127.0.0.1';
const port = Number(process.env.PLAYWRIGHT_PORT ?? 3100);
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? '');
const origin = process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${port}`;
const baseURL = new URL(`${basePath}/`, origin).toString();
// PLAYWRIGHT_SERVE_EXPORT=1 serves the clean static export (`out/`) instead of `next dev` and defines only
// the connected production project (docs/testing/playwright.md, "Production serving").
const serveExport = process.env.PLAYWRIGHT_SERVE_EXPORT === '1';

// Connected-studio spec families (PLAN-SPF-V1 Task 2). The unanchored /responsive\.spec\.ts/ and
// /accessibility\.spec\.ts/ patterns already match their connected specs on mobile-chromium, mobile-webkit,
// tablet-chromium and wide-chromium, and on accessibility-chromium.
const connectedStatic = /connected-studio-static\.spec\.ts/;
const connectedServices = /connected-studio-services\.spec\.ts/;
const connectedFooter = /connected-studio-footer\.spec\.ts/;
const connectedNavigation = /connected-studio-navigation\.spec\.ts/;
const connectedResponsive = /connected-studio-responsive\.spec\.ts/;
const connectedRuntime = /connected-studio-runtime\.spec\.ts/;

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
  webServer: serveExport
    ? {
        command: 'node scripts/serve-static-export.mjs',
        url: baseURL,
        env: {
          ...process.env,
          HOST: host,
          PLAYWRIGHT_PORT: String(port),
          NEXT_PUBLIC_BASE_PATH: basePath,
        },
        // Never reuse a running server: a leftover `next dev` on this port would silently stand in for the export.
        reuseExistingServer: false,
        timeout: 30_000,
      }
    : {
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
  projects: serveExport
    ? [
        {
          name: 'connected-production-chromium',
          testMatch: /connected-studio-production\.spec\.ts/,
          use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
        },
      ]
    : [
    {
      name: 'chromium-desktop',
      testMatch: [
        /smoke\.spec\.ts/,
        /immersive-home-static\.spec\.ts/,
        /studio-founder\.spec\.ts/,
        /privacy\.spec\.ts/,
        /contact\.spec\.ts/,
        /marketing-navigation\.spec\.ts/,
        /marketing-projects\.spec\.ts/,
        /marketing-services\.spec\.ts/,
        /app-bar\.spec\.ts/,
        /home-sections\.spec\.ts/,
        connectedStatic,
        connectedServices,
        connectedFooter,
        connectedNavigation,
      ],
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'firefox-desktop',
      testMatch: [/smoke\.spec\.ts/, /privacy\.spec\.ts/, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/, /app-bar\.spec\.ts/, /home-sections\.spec\.ts/, connectedStatic, connectedServices, connectedFooter, connectedNavigation],
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'webkit-desktop',
      testMatch: [/smoke\.spec\.ts/, /privacy\.spec\.ts/, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/, /app-bar\.spec\.ts/, /home-sections\.spec\.ts/, connectedStatic, connectedServices, connectedFooter, connectedNavigation],
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-chromium',
      testMatch: [/responsive\.spec\.ts/, /privacy\.spec\.ts/, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/, /app-bar\.spec\.ts/, /home-sections\.spec\.ts/, connectedStatic, connectedServices, connectedFooter, connectedNavigation],
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'mobile-webkit',
      testMatch: [/responsive\.spec\.ts/, /privacy\.spec\.ts/, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/, /app-bar\.spec\.ts/, connectedStatic],
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'tablet-chromium',
      testMatch: [/responsive\.spec\.ts/, /privacy\.spec\.ts/, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/, /app-bar\.spec\.ts/, /home-sections\.spec\.ts/, connectedStatic],
      use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } },
    },
    {
      name: 'wide-chromium',
      testMatch: [/responsive\.spec\.ts/, /privacy\.spec\.ts/, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/],
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'compact-320-chromium',
      testMatch: [/studio-founder-responsive\.spec\.ts/, /privacy\.spec\.ts/, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/, /app-bar\.spec\.ts/, /home-sections\.spec\.ts/, connectedStatic, connectedServices, connectedFooter, connectedResponsive],
      use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 800 } },
    },
    {
      name: 'tablet-portrait-chromium',
      testMatch: [/studio-founder-responsive\.spec\.ts/, /privacy\.spec\.ts/, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/, /app-bar\.spec\.ts/, connectedStatic, connectedServices, connectedResponsive],
      use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'accessibility-chromium',
      testMatch: /accessibility\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      // WebGL in headless Chromium needs the software (SwiftShader) backend.
      name: 'immersive-chromium',
      testMatch: [/immersive-home\.spec\.ts/, /immersive-home-acceptance\.spec\.ts/, /sky-chart-acceptance\.spec\.ts/, connectedRuntime],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
      },
    },
    {
      name: 'visual-chromium',
      snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}-{platform}{ext}',
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
