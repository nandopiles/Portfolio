# Portfolio — Frontend Developer

A dark, minimal, editorial portfolio built as a high-end "creative developer" experience.

## Stack

- **Astro 7** — static site generation with client islands
- **React 19** — only for interactive islands (custom cursor, horizontal work section, smooth scroll)
- **Tailwind CSS v4** — design tokens defined in `src/styles/global.css` via `@theme`
- **GSAP + ScrollTrigger** — scroll reveals, hero intro, and the pinned horizontal Work section
- **Lenis** — smooth scrolling, synced with GSAP's ticker
- **TypeScript** — throughout

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check (astro check) + production build
npm run preview  # preview the production build
```

## Editing content

All content lives in `src/data/` so you can update it without touching components:

| File                    | What it controls                                             |
| ----------------------- | ----------------------------------------------------------- |
| `src/data/site.ts`      | Name, role, tagline, email, social links, SEO defaults      |
| `src/data/projects.ts`  | The Work section cards and their detail pages (`/work/<slug>`) |
| `src/data/experience.ts`| The experience timeline                                     |
| `src/data/skills.ts`    | The About marquee items                                     |

Project images are SVG placeholders in `public/projects/`. Replace them with your
own images (any web format) and update the `image` path in `projects.ts`.

## Key implementation notes

- **Custom cursor** (`src/components/Cursor.tsx`): trails the pointer with easing,
  grows and shows a label over interactive elements. Add `data-cursor="Label"` to any
  element to customise the hover label. Disabled on touch devices and when the user
  prefers reduced motion.
- **Horizontal Work section** (`src/components/ProjectsHorizontal.tsx`): pins and
  converts vertical scroll into horizontal movement on desktop via GSAP ScrollTrigger.
  Falls back to native scroll-snap on mobile and with reduced motion.
- **Accessibility**: semantic HTML, visible focus states, a skip link, image alt text,
  and full `prefers-reduced-motion` support (animations are disabled, native scroll used).
- **SEO**: per-page titles/descriptions, Open Graph + Twitter cards, canonical URLs,
  and an auto-generated sitemap. Update `site` in `astro.config.mjs` and
  `src/data/site.ts` to your real domain.

## Deployment

This is a fully static site (`dist/`). Deploy to any static host (Netlify, Vercel,
Cloudflare Pages, GitHub Pages). Set the `site` URL in `astro.config.mjs` first so
canonical URLs and the sitemap are correct.
