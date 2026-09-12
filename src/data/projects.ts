/**
 * Project data for the horizontal "Work" section.
 * Replace these placeholder projects with your real work.
 *
 * `image` points to a file in /public (an SVG placeholder is generated for each).
 */
export interface Project {
  /** Two-digit index shown in the UI, e.g. "01". */
  index: string;
  /** URL-friendly identifier used for the detail page route. */
  slug: string;
  title: string;
  /** One short descriptive line. */
  summary: string;
  /** Longer paragraph shown on the detail page. */
  description?: string;
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
    slug: 'nebula-analytics',
    title: 'Nebula Analytics',
    summary: 'Real-time analytics dashboard with live charts and a command palette.',
    description:
      'A real-time analytics product for teams. Built around a streaming data layer with WebSockets, virtualised tables for large datasets, and a keyboard-first command palette. Focused on sub-second interactions and a dense, legible dark UI.',
    stack: ['React', 'TypeScript', 'D3', 'WebSocket'],
    year: '2025',
    image: '/projects/nebula.svg',
    demo: 'https://example.com/nebula',
    repo: 'https://github.com/nandopiles/nebula-analytics',
    cursorLabel: 'View',
  },
  {
    index: '02',
    slug: 'atlas-store',
    title: 'Atlas Store',
    summary: 'Headless e-commerce storefront built for speed and conversion.',
    description:
      'A headless storefront pairing Astro for static speed with a Sanity content model and Stripe checkout. Ships with edge-cached product pages, optimistic cart updates, and a Lighthouse score in the high 90s.',
    stack: ['Astro', 'Stripe', 'Tailwind', 'Sanity'],
    year: '2025',
    image: '/projects/atlas.svg',
    demo: 'https://example.com/atlas',
    repo: 'https://github.com/nandopiles/atlas-store',
    cursorLabel: 'View',
  },
  {
    index: '03',
    slug: 'kinetic',
    title: 'Kinetic',
    summary: 'An award-style landing with GSAP scroll storytelling and WebGL accents.',
    description:
      'A promotional landing page built as a scroll-driven narrative. GSAP ScrollTrigger orchestrates pinned scenes and text reveals, with subtle Three.js accents. Motion respects reduced-motion and never blocks reading.',
    stack: ['GSAP', 'Three.js', 'Vite', 'TypeScript'],
    year: '2024',
    image: '/projects/kinetic.svg',
    demo: 'https://example.com/kinetic',
    repo: 'https://github.com/nandopiles/kinetic',
    cursorLabel: 'Play',
  },
  {
    index: '04',
    slug: 'cadence',
    title: 'Cadence',
    summary: 'A collaborative music-planning app with drag-and-drop timelines.',
    description:
      'A collaborative planning tool for musicians. Features a drag-and-drop timeline, real-time presence, and a Prisma/PostgreSQL backend. Interaction design centred on fluid, forgiving drag mechanics.',
    stack: ['React', 'Node', 'PostgreSQL', 'Prisma'],
    year: '2024',
    image: '/projects/cadence.svg',
    demo: 'https://example.com/cadence',
    repo: 'https://github.com/nandopiles/cadence',
    cursorLabel: 'Drag',
  },
  {
    index: '05',
    slug: 'monolith-docs',
    title: 'Monolith Docs',
    summary: 'A documentation platform with instant search and MDX authoring.',
    description:
      'A documentation platform with MDX authoring, versioned content, and Algolia-powered instant search. Designed for fast reading with a focus on typography, code readability, and accessible navigation.',
    stack: ['Next.js', 'MDX', 'Algolia', 'Tailwind'],
    year: '2023',
    image: '/projects/monolith.svg',
    demo: 'https://example.com/monolith',
    repo: 'https://github.com/nandopiles/monolith-docs',
    cursorLabel: 'View',
  },
  {
    index: '06',
    slug: 'halcyon',
    title: 'Halcyon',
    summary: 'A meditation companion PWA with offline support and soundscapes.',
    description:
      'An offline-first meditation PWA. Layered soundscapes, background timers, and full offline support via Workbox and IndexedDB. Built to feel calm: minimal UI, gentle transitions, and no dark patterns.',
    stack: ['Vue', 'Vite', 'IndexedDB', 'Workbox'],
    year: '2023',
    image: '/projects/halcyon.svg',
    demo: 'https://example.com/halcyon',
    repo: 'https://github.com/nandopiles/halcyon',
    cursorLabel: 'View',
  },
];

/** Look up a single project by its slug. */
export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
