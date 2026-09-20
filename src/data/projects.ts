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
  /** Two-digit position label ("01", "02"…), derived from array order. */
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
    slug: 'spotfinder',
    stack: ['Angular 19', 'TypeScript', 'Leaflet', 'RxJS', 'Tailwind', 'jsPDF'],
    year: '2026',
    image: '/projects/spotfinder-logo.webp',
    cover: '/projects/spotfinder-cover.webp',
    imageFit: 'contain',
    posterAspect: '4/3',
    demo: 'https://spotfinder.nandopiless.workers.dev',
    repo: 'https://github.com/nandopiles/SpotFinder',
    i18n: {
      en: {
        title: 'SpotFinder',
        summary: 'Plan day-by-day trip itineraries on an interactive map.',
        description:
          'A trip planner that turns a city into a day-by-day itinerary on an interactive map. Add stops by category — food, culture, nature, leisure, or shopping — searching by name or dropping them straight on the map. SpotFinder draws the real street route between stops, suggests the best transport mode and travel time for each leg, and lets you drag stops to reorder the trip while it recalculates schedules on the fly. When the plan is ready, export it to a clean, printable PDF.',
      },
      es: {
        title: 'SpotFinder',
        summary: 'Planifica itinerarios de viaje día a día sobre un mapa interactivo.',
        description:
          'Un planificador de viajes que convierte una ciudad en un itinerario día a día sobre un mapa interactivo. Añade paradas por categoría —gastronomía, cultura, naturaleza, ocio o compras— buscándolas por nombre o marcándolas directamente en el mapa. SpotFinder dibuja la ruta real por calles entre paradas, recomienda el mejor medio de transporte y el tiempo de cada tramo, y te deja reordenar el recorrido arrastrando las paradas mientras recalcula los horarios al momento. Cuando el plan está listo, lo exportas a un PDF limpio y listo para imprimir.',
      },
    },
  },
  {
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
      },
      es: {
        title: 'A11yLens',
        summary: 'Un simulador de accesibilidad web que te hace sentir cómo navegan otras personas.',
        description:
          'Un simulador de accesibilidad interactivo construido en torno a WCAG 2.2. A11yLens recrea cómo experimentan los productos digitales las personas con distintas capacidades visuales, motoras y cognitivas, ejecuta comprobaciones reales con axe-core y ofrece entornos de prueba preconfigurados para detectar la fricción antes de que llegue a producción.',
      },
    },
  },
  {
    slug: 'cosmos',
    stack: ['Vite', 'React 19', 'TypeScript', 'Tailwind', 'Web Audio API', 'Canvas 2D'],
    year: '2026',
    image: '/projects/cosmos-logo.webp',
    cover: '/projects/cosmos-cover.webp',
    imageFit: 'contain',
    posterAspect: '4/3',
    demo: 'https://cosmos.nandopiless.workers.dev',
    repo: 'https://github.com/nandopiles/Cosmos',
    i18n: {
      en: {
        title: 'Cosmos',
        summary: "An interactive Solar System you don't scroll through — you explore it.",
        description:
          'A playable landing page where the Solar System is something you handle, not something you read. Every planet is a physical object with mass, inertia, and gravity: drag it, throw it, and watch the map rearrange itself around it. It all lives on an infinite canvas fed with real data from NASA and ESA, so learning astronomy feels less like studying and more like playing with the universe in your hands.',
      },
      es: {
        title: 'Cosmos',
        summary: 'Un Sistema Solar interactivo que no se recorre con scroll: se explora.',
        description:
          'Una landing page jugable donde el Sistema Solar es algo que manejas, no algo que lees. Cada planeta es un objeto físico con masa, inercia y gravedad: lo arrastras, lo lanzas y ves cómo el mapa se reorganiza solo a su alrededor. Todo ocurre sobre un lienzo infinito alimentado con datos reales de la NASA y la ESA, para que aprender astronomía se sienta menos como estudiar y más como jugar con el universo entre las manos.',
      },
    },
  },
];

/** Resolve every project for a given language into a flat, render-ready shape. */
export function getProjects(lang: Lang): Project[] {
  return projectSources.map(({ i18n, ...rest }, i) => ({
    // The two-digit edition number is derived from array order, so adding or
    // reordering a project never requires renumbering by hand.
    index: String(i + 1).padStart(2, '0'),
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
