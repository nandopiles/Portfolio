/**
 * Project data for the horizontal "Work" section.
 * Replace these placeholder projects with your real work.
 *
 * `image` points to a file in /public (an SVG placeholder is generated for each).
 */
export interface Project {
  /** Two-digit index shown in the UI, e.g. "01". */
  index: string;
  title: string;
  /** One short descriptive line. */
  summary: string;
  /** Tech stack, rendered as "React · Node · PostgreSQL". */
  stack: string[];
  year: string;
  image: string;
  /** Live demo URL. */
  demo?: string;
  /** Source repository URL. */
  repo?: string;
  /** Cursor label shown on hover. */
  cursorLabel?: string;
}

export const projects: Project[] = [
  {
    index: '01',
    title: 'Nebula Analytics',
    summary: 'Real-time analytics dashboard with live charts and a command palette.',
    stack: ['React', 'TypeScript', 'D3', 'WebSocket'],
    year: '2025',
    image: '/projects/nebula.svg',
    demo: 'https://example.com/nebula',
    repo: 'https://github.com/nandopiles/nebula-analytics',
    cursorLabel: 'View',
  },
  {
    index: '02',
    title: 'Atlas Store',
    summary: 'Headless e-commerce storefront built for speed and conversion.',
    stack: ['Astro', 'Stripe', 'Tailwind', 'Sanity'],
    year: '2025',
    image: '/projects/atlas.svg',
    demo: 'https://example.com/atlas',
    repo: 'https://github.com/nandopiles/atlas-store',
    cursorLabel: 'View',
  },
  {
    index: '03',
    title: 'Kinetic',
    summary: 'An award-style landing with GSAP scroll storytelling and WebGL accents.',
    stack: ['GSAP', 'Three.js', 'Vite', 'TypeScript'],
    year: '2024',
    image: '/projects/kinetic.svg',
    demo: 'https://example.com/kinetic',
    repo: 'https://github.com/nandopiles/kinetic',
    cursorLabel: 'Play',
  },
  {
    index: '04',
    title: 'Cadence',
    summary: 'A collaborative music-planning app with drag-and-drop timelines.',
    stack: ['React', 'Node', 'PostgreSQL', 'Prisma'],
    year: '2024',
    image: '/projects/cadence.svg',
    demo: 'https://example.com/cadence',
    repo: 'https://github.com/nandopiles/cadence',
    cursorLabel: 'Drag',
  },
  {
    index: '05',
    title: 'Monolith Docs',
    summary: 'A documentation platform with instant search and MDX authoring.',
    stack: ['Next.js', 'MDX', 'Algolia', 'Tailwind'],
    year: '2023',
    image: '/projects/monolith.svg',
    demo: 'https://example.com/monolith',
    repo: 'https://github.com/nandopiles/monolith-docs',
    cursorLabel: 'View',
  },
  {
    index: '06',
    title: 'Halcyon',
    summary: 'A meditation companion PWA with offline support and soundscapes.',
    stack: ['Vue', 'Vite', 'IndexedDB', 'Workbox'],
    year: '2023',
    image: '/projects/halcyon.svg',
    demo: 'https://example.com/halcyon',
    repo: 'https://github.com/nandopiles/halcyon',
    cursorLabel: 'View',
  },
];
