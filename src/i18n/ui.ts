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
    'hero.greeting': 'Hola, soy',
    'hero.tagline':
      'Diseño interfaces rápidas y expresivas donde el movimiento y el detalle hablan por sí solos.',
    'hero.cta.work': 'Ver mi trabajo',
    'hero.cta.contact': 'Hablemos',
    'hero.scroll': 'Scroll',

    // About
    'about.label': '(Sobre mí)',
    'about.lead':
      'Construyo interfaces cuidadas: rápidas, accesibles y discretamente expresivas.',
    'about.p1':
      'Durante los últimos años he colaborado con estudios y equipos de producto para crear experiencias web de alto nivel, desde sitios de marketing con sistemas de animación hasta paneles complejos con mucha densidad de datos.',
    'about.p2':
      'Me importan los detalles que casi nadie nota: las curvas de easing, los estados de foco, el ritmo del layout y recortar milisegundos del primer pintado.',
    'about.stack': '(Stack)',

    // Work
    'work.label': '(Proyectos seleccionados)',
    'work.heading': 'Cosas que he construido.',
    'work.intro':
      'Una selección de proyectos personales en los que he trabajado. Pasa el ratón por encima de cada disco y ábrelo para ver más.',
    'work.demo': 'Ver demo',
    'work.code': 'Código',
    'work.cursor.view': 'Ver',
    'work.cursor.play': 'Play',
    'work.cursor.drag': 'Arrastra',

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
    'hero.greeting': "Hi, I'm",
    'hero.tagline':
      'I craft fast, expressive interfaces where motion and detail do the talking.',
    'hero.cta.work': 'View my work',
    'hero.cta.contact': 'Get in touch',
    'hero.scroll': 'Scroll',

    // About
    'about.label': '(About)',
    'about.lead':
      'I build interfaces that feel considered — fast, accessible, and quietly expressive.',
    'about.p1':
      "For the last several years I've partnered with studios and product teams to ship high-end web experiences, from marketing sites with motion systems to complex, data-dense dashboards.",
    'about.p2':
      'I care about the details most people never notice: easing curves, focus states, layout rhythm, and shaving milliseconds off the first paint.',
    'about.stack': '(Stack)',

    // Work
    'work.label': '(Selected Work)',
    'work.heading': "Things I've built.",
    'work.intro':
      'A selection of personal projects I have worked on. Hover over each record and open it to see more.',
    'work.demo': 'Live demo',
    'work.code': 'Code',
    'work.cursor.view': 'View',
    'work.cursor.play': 'Play',
    'work.cursor.drag': 'Drag',

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
