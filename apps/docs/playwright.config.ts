import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    // `vite preview` doesn't know about adapter-cloudflare's output. The
    // Playwright suite runs against the dev server, which faithfully reproduces
    // SSR + hydration. CI builds the docs site separately for size budgets.
    command: 'pnpm exec vite dev --port 4173 --strictPort',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'a11y',
      testMatch: /.*\.a11y\.test\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'e2e',
      testMatch: /.*\.e2e\.test\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'screen-reader',
      // Guidepup runs only on macos-latest / windows-latest in CI.
      // Locally, this project is skipped unless GUIDEPUP=1 is set.
      testMatch: /.*\.sr\.test\.ts/,
      use: { ...devices['Desktop Chrome'] },
      grep: process.env.GUIDEPUP ? undefined : /^$/,
    },
  ],
});
