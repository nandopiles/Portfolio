import type { Lang } from '@/i18n/ui';

/**
 * Global site configuration.
 * Shared fields (name, email, socials…) are language-independent.
 * Language-dependent copy (role, tagline, description) lives under `i18n`.
 */
export const site = {
  name: 'Ferran Piles Lablanca',
  initials: 'FPL',
  location: 'Valencia, Spain',
  email: 'nandopiless@gmail.com',
  url: 'https://ferranpiles.dev',
  /** Used for Open Graph / Twitter cards. Place the image in /public. */
  ogImage: '/og.svg',
  socials: [
    { label: 'GitHub', href: 'https://github.com/nandopiles' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ferranpiles' },
    { label: 'Email', href: 'mailto:nandopiless@gmail.com' },
  ],
  i18n: {
    es: {
      role: 'Frontend Developer',
      tagline:
        'Diseño interfaces rápidas y expresivas donde el movimiento y el detalle hablan por sí solos.',
      description:
        'Portfolio de Ferran Piles Lablanca, Frontend Developer que crea experiencias web de alto nivel, rápidas y animadas con herramientas modernas.',
    },
    en: {
      role: 'Frontend Developer',
      tagline:
        'I craft fast, expressive interfaces where motion and detail do the talking.',
      description:
        'Portfolio of Ferran Piles Lablanca, a Frontend Developer building high-end, performant and animated web experiences with modern tooling.',
    },
  },
} as const;

export type Social = (typeof site.socials)[number];

/** Convenience accessor for language-dependent site copy. */
export function getSiteMeta(lang: Lang) {
  return site.i18n[lang];
}
