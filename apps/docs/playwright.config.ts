import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    // `vite preview` can serve adapter-static's `build/` output, but the
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
      name: 'keyboard',
      // Hand-transcribed APG keyboard contracts driven through the harness.
      // See docs/design/05-accessibility.md §5.4.
      testMatch: /.*\.kb\.test\.ts/,
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
    {
      // SSR smoke test — visits every sandbox with JavaScript disabled to
      // assert each Layer 4 / 5 component renders server-side without throwing.
      // See `docs/release/v1-execution-plan.md` Track A-3 #2.
      name: 'ssr',
      testMatch: /.*\.ssr\.test\.ts/,
      use: { ...devices['Desktop Chrome'], javaScriptEnabled: false },
    },
  ],
});
