/**
 * Lighthouse CI configuration for the Kumiki docs site.
 *
 * Runs against the locally-built `apps/docs` using `vite preview`. Per-page
 * budgets are intentionally lenient at v1.0 — we'll tighten as the docs
 * site ships more content. Update by editing assertions below; treat any
 * regression as a hard fail in CI.
 *
 * @see docs/design/15-roadmap.md §15.4 (Phase 0c QA gate)
 * @see https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 */
module.exports = {
  ci: {
    collect: {
      // Spawn `vite preview` on a free port; lhci waits for /200 then runs.
      startServerCommand: 'pnpm --filter @kumiki/docs preview --port=4173',
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/sandbox/toggle',
        'http://localhost:4173/sandbox/dialog',
        'http://localhost:4173/sandbox/combobox',
        'http://localhost:4173/sizes',
      ],
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox',
      },
    },
    assert: {
      assertions: {
        // Performance budget — lenient at v1.0, tighten incrementally.
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],

        // Specific Web Vitals limits.
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
