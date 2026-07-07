import {defineConfig, devices} from '@playwright/test';

const responsiveViewport = {width: 430, height: 932};
const useProductionHost = ['1', 'true'].includes(process.env.USE_E2E_PRODUCTION_HOST ?? '');
const productionBaseURL = 'https://ryankoval.com';

let e2eBaseURL = productionBaseURL;
if (!useProductionHost) {
  ({baseURL: e2eBaseURL} = await import('./tests/e2e/docker-runtime'));
}

export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: useProductionHost ? undefined : './tests/e2e/global-setup.ts',
  globalTeardown: useProductionHost ? undefined : './tests/e2e/global-teardown.ts',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', {open: 'never'}]] : 'list',
  use: {
    baseURL: e2eBaseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'chromium-responsive',
      use: {...devices['Desktop Chrome'], viewport: responsiveViewport},
    },
    {
      name: 'webkit',
      use: {...devices['Desktop Safari']},
    },
    {
      name: 'webkit-responsive',
      use: {...devices['Desktop Safari'], viewport: responsiveViewport},
    },
  ],
});
