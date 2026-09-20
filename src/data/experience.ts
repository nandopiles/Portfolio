import type { Lang } from '@/i18n/ui';

/**
 * Work experience shown in the timeline section.
 * Replace with your real roles. Translatable fields (period, role, description)
 * are provided per language; the company name stays the same across languages.
 */
export interface ExperienceContent {
  period: string;
  role: string;
  description: string;
}

export interface ExperienceSource {
  company: string;
  i18n: Record<Lang, ExperienceContent>;
}

export interface ExperienceItem extends ExperienceContent {
  company: string;
}

const experienceSources: ExperienceSource[] = [
  {
    company: 'Hiberus',
    i18n: {
      en: {
        period: 'Oct 2025 — Now',
        role: 'Frontend Developer',
        description:
          'Rebuild legacy apps into scalable products from scratch with Angular and Next.js. Frontend lead on a logistics project, having also worked on projects in the travel and public-sector fields.',
      },
      es: {
        period: 'Oct 2025 — Actualidad',
        role: 'Frontend Developer',
        description:
          'Reconstruyo aplicaciones legacy en productos escalables desde cero con Angular y Next.js. Frontend lead en un proyecto de logística, habiendo trabajado también en proyectos de los sectores de viajes y administración pública.',
      },
    },
  },
  {
    company: 'Conmuta',
    i18n: {
      en: {
        period: 'Sep 2024 — Oct 2025',
        role: 'Frontend Developer',
        description:
          'Built a customizable e-commerce product and business modules for orders, billing, and clients. Refactored the app architecture and migrated legacy code to modern Angular.',
      },
      es: {
        period: 'Sep 2024 — Oct 2025',
        role: 'Frontend Developer',
        description:
          'Desarrollé un e-commerce personalizable y módulos de negocio de pedidos, facturación y clientes. Refactoricé la arquitectura de la app y migré código legacy a Angular moderno.',
      },
    },
  },
  {
    company: 'Onestic',
    i18n: {
      en: {
        period: 'Jan 2024 — Jul 2024',
        role: 'Frontend Developer',
        description:
          'Built an internal Angular tool that centralized the issues surfaced by another in-house service, which monitored websites to detect bugs and unexpected behavior. Also maintained and improved the Astro sites of several online fashion brands.',
      },
      es: {
        period: 'Ene 2024 — Jul 2024',
        role: 'Frontend Developer',
        description:
          'Desarrollé una herramienta interna en Angular que centralizaba los fallos detectados por otro servicio de la empresa, encargado de monitorizar webs para detectar errores y comportamientos inesperados. También mantuve y mejoré las webs en Astro de varias marcas de moda online.',
      },
    },
  },
];

/** Resolve every experience item for a given language. */
export function getExperience(lang: Lang): ExperienceItem[] {
  return experienceSources.map(({ company, i18n }) => ({
    company,
    ...i18n[lang],
  }));
}
