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
          'Modernize legacy apps into scalable, from-scratch products with a modern architecture. Lead the frontend on the main project, owning technical direction and best practices.',
      },
      es: {
        period: 'Oct 2025 — Actualidad',
        role: 'Frontend Developer',
        description:
          'Modernizo aplicaciones legacy en productos escalables construidos desde cero con arquitectura moderna. Lidero el frontend del proyecto principal, definiendo dirección técnica y buenas prácticas.',
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
          'Built internal apps with Angular and REST APIs for bookings and promotions. Designed reusable components for better usability and shipped an automated notifications module that boosted engagement.',
      },
      es: {
        period: 'Ene 2024 — Jul 2024',
        role: 'Frontend Developer',
        description:
          'Creé apps internas con Angular y APIs REST para reservas y promociones. Diseñé componentes reutilizables que mejoraron la usabilidad e implementé un módulo de notificaciones automáticas que aumentó la participación.',
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
