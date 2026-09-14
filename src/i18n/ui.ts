/**
 * UI translation dictionary.
 *
 * `es` is the default language (served at `/`); `en` is served under `/en/`.
 * Keys are shared across languages so components can look up strings by key.
 * Keep this file as the single source of truth for interface copy.
 */
export const languages = {
  es: 'ES',
  en: 'EN',
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

export const ui = {
  es: {
    // Navigation
    'nav.about': 'Sobre mí',
    'nav.work': 'Proyectos',
    'nav.contact': 'Contacto',
    'nav.home': 'Inicio',
    'nav.langLabel': 'Cambiar idioma',

    // Hero
    'hero.sticker': 'Yee!! soy Ferran.',
    // Big poster headline, one word per line for maximum impact.
    'hero.title.1': 'Frontend',
    'hero.title.2': 'Product &',
    'hero.title.3': 'Craft',
    'hero.cta.work': 'Ver mi trabajo',
    'hero.cta.contact': 'Hablemos',
    'hero.scroll': 'Scroll',

    // About
    'about.label': '(Sobre mí)',
    'about.lead':
      'Ayudo a equipos a llevar productos digitales a la vida.',
    'about.lead2':
      'Disfruto trabajando en equipo, cuidando el detalle y convirtiendo lo complejo en algo simple.',
    'about.stack': '(Stack)',

    // Work
    'work.label': '(Proyectos seleccionados)',
    'work.heading': 'Cosas que he construido.',
    'work.intro':
      'Una selección de proyectos personales en los que he trabajado. Pasa el ratón por encima de cada disco y ábrelo para ver más.',
    'work.item': 'Proyecto',
    'work.demo': 'Ver demo',
    'work.code': 'Código',

    // Experience
    'exp.label': '(Experiencia)',

    // Contact
    'contact.label': '(Hablemos)',
    'contact.headline.1': 'Construyamos',
    'contact.headline.2': 'algo juntos.',
    'contact.rights': 'Todos los derechos reservados',

    // Project detail
    'project.back': '← Volver a proyectos',
    'project.stack': '(Stack)',
    'project.overview': '(Resumen)',
    'project.demo': 'Ver demo ↗',
    'project.source': 'Código ↗',
    'project.cursor.back': 'Atrás',
    'project.cursor.open': 'Abrir',
    'project.cursor.code': 'Código',

    // Misc / a11y
    'a11y.skip': 'Saltar al contenido',
  },
  en: {
    // Navigation
    'nav.about': 'About',
    'nav.work': 'Work',
    'nav.contact': 'Contact',
    'nav.home': 'Home',
    'nav.langLabel': 'Switch language',

    // Hero
    'hero.sticker': "Yee!! I'm Ferran.",
    // Big poster headline, one word per line for maximum impact.
    'hero.title.1': 'Frontend',
    'hero.title.2': 'Product &',
    'hero.title.3': 'Craft',
    'hero.cta.work': 'View my work',
    'hero.cta.contact': 'Get in touch',
    'hero.scroll': 'Scroll',

    // About
    'about.label': '(About)',
    'about.lead':
      'I help teams bring digital products to life.',
    'about.lead2':
      'I enjoy working as a team, sweating the details, and turning complexity into something simple.',
    'about.stack': '(Stack)',

    // Work
    'work.label': '(Selected Work)',
    'work.heading': "Things I've built.",
    'work.intro':
      'A selection of personal projects I have worked on. Hover over each record and open it to see more.',
    'work.item': 'Project',
    'work.demo': 'Live demo',
    'work.code': 'Code',

    // Experience
    'exp.label': '(Experience)',

    // Contact
    'contact.label': "(Let's talk)",
    'contact.headline.1': "Let's build",
    'contact.headline.2': 'something.',
    'contact.rights': 'All rights reserved',

    // Project detail
    'project.back': '← Back to work',
    'project.stack': '(Stack)',
    'project.overview': '(Overview)',
    'project.demo': 'Live demo ↗',
    'project.source': 'Source ↗',
    'project.cursor.back': 'Back',
    'project.cursor.open': 'Open',
    'project.cursor.code': 'Code',

    // Misc / a11y
    'a11y.skip': 'Skip to content',
  },
} as const;

export type UIKey = keyof (typeof ui)[typeof defaultLang];
