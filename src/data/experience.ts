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
    company: 'Studio Aurora',
    i18n: {
      en: {
        period: '2023 — Now',
        role: 'Senior Frontend Developer',
        description:
          'Lead front-end for award-driven marketing sites: motion systems, WebGL, and performance budgets.',
      },
      es: {
        period: '2023 — Actualidad',
        role: 'Frontend Developer Senior',
        description:
          'Lidero el front-end de sitios de marketing orientados a premios: sistemas de animación, WebGL y presupuestos de rendimiento.',
      },
    },
  },
  {
    company: 'Northwind Labs',
    i18n: {
      en: {
        period: '2021 — 2023',
        role: 'Frontend Developer',
        description:
          'Built design systems and complex dashboards in React, shipping accessible, well-tested UI.',
      },
      es: {
        period: '2021 — 2023',
        role: 'Frontend Developer',
        description:
          'Desarrollé sistemas de diseño y paneles complejos en React, entregando interfaces accesibles y bien testeadas.',
      },
    },
  },
  {
    company: 'Freelance',
    i18n: {
      en: {
        period: '2019 — 2021',
        role: 'Web Developer',
        description:
          'Delivered end-to-end sites for small businesses, from design hand-off to deployment.',
      },
      es: {
        period: '2019 — 2021',
        role: 'Desarrollador Web',
        description:
          'Entregué sitios de principio a fin para pequeñas empresas, desde la entrega de diseño hasta el despliegue.',
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
