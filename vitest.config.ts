/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

/**
 * Vitest configuration for unit tests.
 *
 * Scope: pure logic, data, and i18n helpers under `src/`. Component tests can
 * use the jsdom environment and Testing Library, which are already installed.
 * Astro `.astro` files and end-to-end flows are intentionally out of scope.
 */
export default defineConfig({
  resolve: {
    alias: {
      // Mirror the `@/*` -> `src/*` alias declared in tsconfig.json.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // Use describe/it/expect without importing them, matching common setups.
    globals: true,
    // jsdom gives component tests a DOM; pure-logic tests ignore it.
    environment: 'jsdom',
    // Register jest-dom matchers for future component tests.
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
