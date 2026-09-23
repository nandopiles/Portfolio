# Portfolio — Frontend Developer

A dark, minimal, editorial portfolio built as a high-end "creative developer" experience.

## Stack

- **Astro 7** — static site generation with client islands
- **React 19** — only for interactive islands (custom cursor, smooth scroll)
- **Tailwind CSS v4** — design tokens defined in `src/styles/global.css` via `@theme`
- **GSAP + ScrollTrigger** — scroll reveals and the hero intro
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

- **Custom cursor** (`src/components/Cursor.astro`): a framework-free cursor built
  with a small vanilla TypeScript script (no React island). A single chunky
  comic/sticker arrow (bone fill, bold black outline, hard offset shadow) that
  trails the pointer with frame-rate-independent easing for a fluid feel, plus a
  subtle press-scale on click. Disabled on touch devices and when the user prefers
  reduced motion, and it re-initialises correctly across Astro view transitions.
- **Work index** (`src/components/ProjectsIndex.astro`): a typographic index of
  projects (edition number, poster-type title, stack). It's server-rendered with
  no client JS — on hover-capable pointers each row reveals its poster as a
  floating preview via pure CSS (`group-hover`); touch devices get an inline
  thumbnail per row. No pinning, no scroll math, so it can't mis-size or break.
- **Accessibility**: semantic HTML, visible focus states, a skip link, image alt text,
  and full `prefers-reduced-motion` support (animations are disabled, native scroll used).
- **SEO**: per-page titles/descriptions, Open Graph + Twitter cards, canonical URLs,
  and an auto-generated sitemap. Update `site` in `astro.config.mjs` and
  `src/data/site.ts` to your real domain.

## Deployment

This is a fully static site (`dist/`). Deploy to any static host (Netlify, Vercel,
Cloudflare Pages, GitHub Pages). Set the `site` URL in `astro.config.mjs` first so
canonical URLs and the sitemap are correct.
