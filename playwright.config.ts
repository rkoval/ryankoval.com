import {defineConfig, devices} from '@playwright/test';
import {baseURL} from './tests/e2e/docker-runtime';

const responsiveViewport = {width: 430, height: 932};

export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: './tests/e2e/global-setup.ts',
  globalTeardown: './tests/e2e/global-teardown.ts',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', {open: 'never'}]] : 'list',
  use: {
    baseURL,
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
