// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio.nandopiless.workers.dev',
  // Spanish is the default (served at `/`); English is served under `/en/`.
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [react(), sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } } })],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    // Prefetch on hover/tap intent rather than eagerly for every link in the
    // viewport. On the home page that avoids firing 6 project-detail prefetches
    // at once while keeping navigation feeling instant.
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
