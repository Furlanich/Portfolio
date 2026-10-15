import { defineConfig, devices } from '@playwright/test';
import { normalizeBasePath } from './tests/e2e/support/paths';

const isCI = Boolean(process.env.CI);
const host = '127.0.0.1';
const port = Number(process.env.PLAYWRIGHT_PORT ?? 3100);
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? '');
const origin = process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${port}`;
const baseURL = new URL(`${basePath}/`, origin).toString();
// PLAYWRIGHT_SERVE_EXPORT=1 serves the clean static export (`out/`) instead of `next dev` and defines only
// the production projects (docs/testing/playwright.md, "Production serving").
const serveExport = process.env.PLAYWRIGHT_SERVE_EXPORT === '1';
// SFC_TEST_MODE=candidate selects the commercial-inquiry and new-route runtime test families, which need
// the QA candidate patches from scripts/prepare-sfc-candidate.mjs applied to a disposable checkout. It
// selects tests only: it never changes the application's mode (PLAN-SFC-V1, "Reproducible candidate").
const sfcCandidate = process.env.SFC_TEST_MODE === 'candidate';

// Connected-studio spec families (PLAN-SPF-V1 Task 2). The unanchored /responsive\.spec\.ts/ and
// /accessibility\.spec\.ts/ patterns already match their connected specs on mobile-chromium, mobile-webkit,
// tablet-chromium and wide-chromium, and on accessibility-chromium. They also match the PLAN-SFC-V1
// responsive counterparts (studio-responsive, founder-responsive) and sfc-accessibility.spec.ts.
const connectedStatic = /connected-studio-static\.spec\.ts/;
const connectedServices = /connected-studio-services\.spec\.ts/;
const connectedFooter = /connected-studio-footer\.spec\.ts/;
const connectedNavigation = /connected-studio-navigation\.spec\.ts/;
const connectedResponsive = /connected-studio-responsive\.spec\.ts/;
const connectedRuntime = /connected-studio-runtime\.spec\.ts/;

// PLAN-SFC-V1 page-owned families, anchored on the path separator so a longer name never matches.
const studioSpec = /[\\/]studio\.spec\.ts$/;
const founderSpec = /[\\/]founder\.spec\.ts$/;
const studioResponsive = /[\\/]studio-responsive\.spec\.ts$/;
const founderResponsive = /[\\/]founder-responsive\.spec\.ts$/;
// Legal pages (Privacy and Terms) run wherever the Privacy spec runs.
const legalSpec = /[\\/]legal\.spec\.ts$/;
// Candidate-only families and the production family.
const contactCommercial = /[\\/]contact-commercial\.spec\.ts$/;
const sfcRuntime = /[\\/]sfc-runtime\.spec\.ts$/;
const sfcProduction = /[\\/]sfc-production\.spec\.ts$/;

// The cross-browser smoke tag. Chromium owns the exhaustive state permutations; a case runs on Firefox and
// WebKit only when it carries `{ tag: '@cross-browser' }`, e.g. `test('submits and recovers', { tag: '@cross-browser' }, ...)`.
// Untagged cases are Chromium-only, which keeps the candidate list inside its 180-case planning envelope.
const crossBrowserSmoke = /@cross-browser/;

const swiftshader = { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] };

// The three project sets, selected at the bottom. Kept in one object so every project is declared at one
// indent: scripts/surfaces.test.mjs reads individual project blocks from this file as text.
const projectSets = {
  production: [
    {
      name: 'connected-production-chromium',
      testMatch: /connected-studio-production\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'sfc-production-chromium',
      testMatch: sfcProduction,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'sfc-production-firefox',
      testMatch: sfcProduction,
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'sfc-production-webkit',
      testMatch: sfcProduction,
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
  ],
  // Only defined with SFC_TEST_MODE=candidate. Chromium owns the exhaustive state permutations; Firefox and
  // WebKit run the real form, navigation and focus behavior through the tagged cross-browser cases.
  candidate: [
    {
      name: 'contact-commercial-chromium',
      testMatch: contactCommercial,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'contact-commercial-firefox',
      testMatch: contactCommercial,
      grep: crossBrowserSmoke,
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'contact-commercial-webkit',
      testMatch: contactCommercial,
      grep: crossBrowserSmoke,
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
    {
      // WebGL in headless Chromium needs the software (SwiftShader) backend.
      name: 'sfc-runtime-chromium',
      testMatch: sfcRuntime,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, launchOptions: swiftshader },
    },
  ],
  default: [
    {
      name: 'chromium-desktop',
      testMatch: [
        /smoke\.spec\.ts/,
        /immersive-home-static\.spec\.ts/,
        studioSpec,
        founderSpec,
        /privacy\.spec\.ts/,
        legalSpec,
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
      testMatch: [/smoke\.spec\.ts/, /privacy\.spec\.ts/, legalSpec, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/, /app-bar\.spec\.ts/, /home-sections\.spec\.ts/, connectedStatic, connectedServices, connectedFooter, connectedNavigation],
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'webkit-desktop',
      testMatch: [/smoke\.spec\.ts/, /privacy\.spec\.ts/, legalSpec, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/, /app-bar\.spec\.ts/, /home-sections\.spec\.ts/, connectedStatic, connectedServices, connectedFooter, connectedNavigation],
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-chromium',
      testMatch: [/responsive\.spec\.ts/, /privacy\.spec\.ts/, legalSpec, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/, /app-bar\.spec\.ts/, /home-sections\.spec\.ts/, connectedStatic, connectedServices, connectedFooter, connectedNavigation],
      use: {
        browserName: 'chromium' as const,
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'mobile-webkit',
      testMatch: [/responsive\.spec\.ts/, /privacy\.spec\.ts/, legalSpec, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/, /app-bar\.spec\.ts/, connectedStatic],
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'tablet-chromium',
      testMatch: [/responsive\.spec\.ts/, /privacy\.spec\.ts/, legalSpec, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/, /app-bar\.spec\.ts/, /home-sections\.spec\.ts/, connectedStatic],
      use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } },
    },
    {
      name: 'wide-chromium',
      testMatch: [/responsive\.spec\.ts/, /privacy\.spec\.ts/, legalSpec, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/],
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'compact-320-chromium',
      testMatch: [studioResponsive, founderResponsive, /privacy\.spec\.ts/, legalSpec, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/, /app-bar\.spec\.ts/, /home-sections\.spec\.ts/, connectedStatic, connectedServices, connectedFooter, connectedResponsive],
      use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 800 } },
    },
    {
      name: 'tablet-portrait-chromium',
      testMatch: [studioResponsive, founderResponsive, /privacy\.spec\.ts/, legalSpec, /contact\.spec\.ts/, /marketing-navigation\.spec\.ts/, /marketing-projects\.spec\.ts/, /marketing-services\.spec\.ts/, /app-bar\.spec\.ts/, connectedStatic, connectedServices, connectedResponsive],
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
        launchOptions: swiftshader,
      },
    },
    {
      name: 'visual-chromium',
      snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}-{platform}{ext}',
      testMatch: /visual\/.*\.visual\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'light' as const,
        deviceScaleFactor: 1,
        locale: 'es-AR',
        reducedMotion: 'reduce' as const,
        timezoneId: 'UTC',
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
};



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
  projects: serveExport ? projectSets.production : sfcCandidate ? projectSets.candidate : projectSets.default,
});
