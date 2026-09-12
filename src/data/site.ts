/**
 * Global site configuration.
 * Edit these values to personalise the portfolio without touching components.
 */
export const site = {
  name: 'Ferran Piles Lablanca',
  initials: 'FPL',
  role: 'Frontend Developer',
  /** Short value proposition shown in the hero. */
  tagline: 'I craft fast, expressive interfaces where motion and detail do the talking.',
  location: 'Valencia, Spain',
  email: 'nandopiless@gmail.com',
  url: 'https://ferranpiles.dev',
  description:
    'Portfolio of Ferran Piles Lablanca, a Frontend Developer building high-end, performant and animated web experiences with modern tooling.',
  /** Used for Open Graph / Twitter cards. Place the image in /public. */
  ogImage: '/og.svg',
  socials: [
    { label: 'GitHub', href: 'https://github.com/nandopiles' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ferranpiles' },
    { label: 'Email', href: 'mailto:nandopiless@gmail.com' },
  ],
} as const;

export type Social = (typeof site.socials)[number];
