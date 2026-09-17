import type { Lang } from '@/i18n/ui';

/**
 * Project data for the horizontal "Work" section.
 * Replace these placeholder projects with your real work.
 *
 * Non-translatable fields (slug, stack, year, image, urls) live once; the
 * translatable copy (title, summary, description, cursorLabel) is provided per
 * language under `i18n`.
 *
 * `image` points to a file in /public (an SVG placeholder is generated for each).
 */
export interface ProjectContent {
  title: string;
  summary: string;
  /** Longer paragraph shown on the detail page. */
  description?: string;
  /** Cursor label shown on hover. */
  cursorLabel?: string;
}

export interface ProjectSource {
  /** Two-digit index shown in the UI, e.g. "01". */
  index: string;
  /** URL-friendly identifier used for the detail page route. */
  slug: string;
  /** Tech stack, rendered as "React · Node · PostgreSQL". */
  stack: string[];
  year: string;
  /** Poster artwork shown in the horizontal "Work" section (e.g. a logo). */
  image: string;
  /** Wide artwork shown on the detail page. Falls back to `image` if unset. */
  cover?: string;
  /**
   * How the poster image fills its panel. `cover` (default) crops to fill;
   * `contain` fits the whole image inside — useful for logos with padding.
   */
  imageFit?: 'cover' | 'contain';
  /**
   * Aspect ratio of the poster image panel, independent of `imageFit`. Defaults
   * to `square` for `contain` logos and `4/3` for `cover` artwork, but can be
   * set explicitly — e.g. a logo shown whole (`contain`) inside a `4/3` panel.
   */
  posterAspect?: 'square' | '4/3';
  demo?: string;
  repo?: string;
  i18n: Record<Lang, ProjectContent>;
}

/** A project resolved for a single language (flat, ready to render). */
export interface Project {
  index: string;
  slug: string;
  stack: string[];
  year: string;
  image: string;
  cover?: string;
  imageFit?: 'cover' | 'contain';
  posterAspect?: 'square' | '4/3';
  demo?: string;
  repo?: string;
  title: string;
  summary: string;
  description?: string;
  cursorLabel?: string;
}

const projectSources: ProjectSource[] = [
  {
    index: '01',
    slug: 'a11ylens',
    stack: ['Astro', 'React', 'TypeScript', 'axe-core', 'Vitest', 'WCAG 2.2'],
    year: '2026',
    image: '/projects/a11ylens-logo.webp',
    cover: '/projects/a11ylens-cover.webp',
    imageFit: 'contain',
    posterAspect: '4/3',
    demo: 'https://a11ylens.nandopiless.workers.dev',
    repo: 'https://github.com/nandopiles/A11yLens',
    i18n: {
      en: {
        title: 'A11yLens',
        summary: 'A web accessibility simulator that lets you feel how others browse the web.',
        description:
          'An interactive accessibility simulator built around WCAG 2.2. A11yLens recreates how people with different visual, motor, and cognitive abilities experience digital products, running real checks with axe-core and offering preconfigured test environments so teams can catch friction before it reaches production.',
        cursorLabel: 'Try',
      },
      es: {
        title: 'A11yLens',
        summary: 'Un simulador de accesibilidad web que te hace sentir cómo navegan otras personas.',
        description:
          'Un simulador de accesibilidad interactivo construido en torno a WCAG 2.2. A11yLens recrea cómo experimentan los productos digitales las personas con distintas capacidades visuales, motoras y cognitivas, ejecuta comprobaciones reales con axe-core y ofrece entornos de prueba preconfigurados para detectar la fricción antes de que llegue a producción.',
        cursorLabel: 'Probar',
      },
    },
  },
  {
    index: '02',
    slug: 'nebula-analytics',
    stack: ['Angular', 'TypeScript', 'D3', 'WebSocket'],
    year: '2025',
    image: '/projects/nebula.svg',
    demo: 'https://example.com/nebula',
    repo: 'https://github.com/nandopiles/nebula-analytics',
    i18n: {
      en: {
        title: 'Nebula Analytics',
        summary: 'Real-time analytics dashboard with live charts and a command palette.',
        description:
          'A real-time analytics product for teams. Built around a streaming data layer with WebSockets, virtualised tables for large datasets, and a keyboard-first command palette. Focused on sub-second interactions and a dense, legible dark UI.',
        cursorLabel: 'View',
      },
      es: {
        title: 'Nebula Analytics',
        summary: 'Panel de analítica en tiempo real con gráficos en vivo y paleta de comandos.',
        description:
          'Un producto de analítica en tiempo real para equipos. Construido sobre una capa de datos en streaming con WebSockets, tablas virtualizadas para grandes volúmenes y una paleta de comandos pensada para el teclado. Enfocado en interacciones de menos de un segundo y una interfaz oscura densa y legible.',
        cursorLabel: 'Ver',
      },
    },
  },
  {
    index: '03',
    slug: 'atlas-store',
    stack: ['Astro', 'Stripe', 'Tailwind', 'Sanity'],
    year: '2025',
    image: '/projects/atlas.svg',
    demo: 'https://example.com/atlas',
    repo: 'https://github.com/nandopiles/atlas-store',
    i18n: {
      en: {
        title: 'Atlas Store',
        summary: 'Headless e-commerce storefront built for speed and conversion.',
        description:
          'A headless storefront pairing Astro for static speed with a Sanity content model and Stripe checkout. Ships with edge-cached product pages, optimistic cart updates, and a Lighthouse score in the high 90s.',
        cursorLabel: 'View',
      },
      es: {
        title: 'Atlas Store',
        summary: 'Tienda e-commerce headless creada para la velocidad y la conversión.',
        description:
          'Un escaparate headless que combina Astro para la velocidad estática con un modelo de contenido en Sanity y checkout con Stripe. Incluye páginas de producto cacheadas en el edge, actualizaciones optimistas del carrito y una puntuación Lighthouse en los 90 altos.',
        cursorLabel: 'Ver',
      },
    },
  },
  {
    index: '04',
    slug: 'kinetic',
    stack: ['GSAP', 'Three.js', 'Vite', 'TypeScript'],
    year: '2024',
    image: '/projects/kinetic.svg',
    demo: 'https://example.com/kinetic',
    repo: 'https://github.com/nandopiles/kinetic',
    i18n: {
      en: {
        title: 'Kinetic',
        summary: 'An award-style landing with GSAP scroll storytelling and WebGL accents.',
        description:
          'A promotional landing page built as a scroll-driven narrative. GSAP ScrollTrigger orchestrates pinned scenes and text reveals, with subtle Three.js accents. Motion respects reduced-motion and never blocks reading.',
        cursorLabel: 'Play',
      },
      es: {
        title: 'Kinetic',
        summary: 'Una landing de estilo award con narrativa por scroll en GSAP y toques WebGL.',
        description:
          'Una landing promocional construida como una narrativa guiada por el scroll. GSAP ScrollTrigger orquesta escenas fijadas y revelados de texto, con sutiles toques de Three.js. El movimiento respeta reduced-motion y nunca bloquea la lectura.',
        cursorLabel: 'Play',
      },
    },
  },
  {
    index: '05',
    slug: 'cadence',
    stack: ['React', 'Node', 'PostgreSQL', 'Prisma'],
    year: '2024',
    image: '/projects/cadence.svg',
    demo: 'https://example.com/cadence',
    repo: 'https://github.com/nandopiles/cadence',
    i18n: {
      en: {
        title: 'Cadence',
        summary: 'A collaborative music-planning app with drag-and-drop timelines.',
        description:
          'A collaborative planning tool for musicians. Features a drag-and-drop timeline, real-time presence, and a Prisma/PostgreSQL backend. Interaction design centred on fluid, forgiving drag mechanics.',
        cursorLabel: 'Drag',
      },
      es: {
        title: 'Cadence',
        summary: 'Una app colaborativa de planificación musical con líneas de tiempo drag-and-drop.',
        description:
          'Una herramienta colaborativa de planificación para músicos. Incluye una línea de tiempo con arrastrar y soltar, presencia en tiempo real y un backend en Prisma/PostgreSQL. El diseño de interacción se centra en un arrastre fluido y tolerante.',
        cursorLabel: 'Arrastra',
      },
    },
  },
  {
    index: '06',
    slug: 'monolith-docs',
    stack: ['Next.js', 'MDX', 'Algolia', 'Tailwind'],
    year: '2023',
    image: '/projects/monolith.svg',
    demo: 'https://example.com/monolith',
    repo: 'https://github.com/nandopiles/monolith-docs',
    i18n: {
      en: {
        title: 'Monolith Docs',
        summary: 'A documentation platform with instant search and MDX authoring.',
        description:
          'A documentation platform with MDX authoring, versioned content, and Algolia-powered instant search. Designed for fast reading with a focus on typography, code readability, and accessible navigation.',
        cursorLabel: 'View',
      },
      es: {
        title: 'Monolith Docs',
        summary: 'Una plataforma de documentación con búsqueda instantánea y edición en MDX.',
        description:
          'Una plataforma de documentación con edición en MDX, contenido versionado y búsqueda instantánea con Algolia. Diseñada para una lectura rápida, con foco en la tipografía, la legibilidad del código y una navegación accesible.',
        cursorLabel: 'Ver',
      },
    },
  },
  {
    index: '07',
    slug: 'halcyon',
    stack: ['Vue', 'Vite', 'IndexedDB', 'Workbox'],
    year: '2023',
    image: '/projects/halcyon.svg',
    demo: 'https://example.com/halcyon',
    repo: 'https://github.com/nandopiles/halcyon',
    i18n: {
      en: {
        title: 'Halcyon',
        summary: 'A meditation companion PWA with offline support and soundscapes.',
        description:
          'An offline-first meditation PWA. Layered soundscapes, background timers, and full offline support via Workbox and IndexedDB. Built to feel calm: minimal UI, gentle transitions, and no dark patterns.',
        cursorLabel: 'View',
      },
      es: {
        title: 'Halcyon',
        summary: 'Una PWA de meditación con soporte offline y paisajes sonoros.',
        description:
          'Una PWA de meditación con enfoque offline-first. Paisajes sonoros por capas, temporizadores en segundo plano y soporte offline completo con Workbox e IndexedDB. Pensada para transmitir calma: interfaz mínima, transiciones suaves y sin patrones oscuros.',
        cursorLabel: 'Ver',
      },
    },
  },
];

/** Resolve every project for a given language into a flat, render-ready shape. */
export function getProjects(lang: Lang): Project[] {
  return projectSources.map(({ i18n, ...rest }) => ({
    ...rest,
    ...i18n[lang],
  }));
}

/** Look up a single project by slug for a given language. */
export function getProject(slug: string, lang: Lang): Project | undefined {
  return getProjects(lang).find((p) => p.slug === slug);
}

/** All slugs (language-independent) for static path generation. */
export const projectSlugs = projectSources.map((p) => p.slug);
