import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
      // Coverage thresholds tighten as more primitives land.
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
      },
    },
  },
});
