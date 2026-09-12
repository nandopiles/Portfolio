/**
 * Work experience shown in the timeline section.
 * Replace with your real roles.
 */
export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  description: string;
}

export const experience: ExperienceItem[] = [
  {
    period: '2023 — Now',
    role: 'Senior Frontend Developer',
    company: 'Studio Aurora',
    description:
      'Lead front-end for award-driven marketing sites: motion systems, WebGL, and performance budgets.',
  },
  {
    period: '2021 — 2023',
    role: 'Frontend Developer',
    company: 'Northwind Labs',
    description:
      'Built design systems and complex dashboards in React, shipping accessible, well-tested UI.',
  },
  {
    period: '2019 — 2021',
    role: 'Web Developer',
    company: 'Freelance',
    description:
      'Delivered end-to-end sites for small businesses, from design hand-off to deployment.',
  },
];
