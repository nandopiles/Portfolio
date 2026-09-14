import type { PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import type { Project } from '@/data/projects';

/** UI strings passed from the Astro layer so this island stays language-aware. */
export interface WorkStrings {
  label: string;
  heading: string;
  /** Short poster kicker, e.g. "Project" / "Proyecto". */
  item: string;
  demo: string;
  code: string;
}

interface Props {
  projects: Project[];
  /** Base path for project detail links, e.g. '/work' or '/en/work'. */
  workBase: string;
  strings: WorkStrings;
}

/**
 * The "Work" section.
 *
 * Desktop (pointer: fine, >= 768px, motion allowed):
 *   The section pins to the viewport and vertical scroll is translated into
 *   horizontal movement of the project track via GSAP ScrollTrigger
 *   (pin + scrub). A progress bar and "01 / 06" counter reflect progress.
 *
 * Mobile / reduced-motion:
 *   Falls back to native horizontal scrolling with CSS scroll-snap — no pin,
 *   which keeps the touch experience intact and honours motion preferences.
 */
export default function ProjectsHorizontal({ projects, workBase, strings }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(1);
  const [pinned, setPinned] = useState(false);

  const total = projects.length;
  const pad = (n: number) => String(n).padStart(2, '0');

  useEffect(() => {
    // The pinned horizontal experience is desktop-only: it requires a wide
    // viewport AND a real (hovering, precise) pointer. Touch devices — phones
    // and tablets — always get the vertical stack, regardless of width or
    // orientation. `hover: hover` reliably excludes touchscreens even when
    // they report `pointer: fine` (e.g. some Android/stylus devices).
    const mql = window.matchMedia(
      '(min-width: 768px) and (hover: hover) and (pointer: fine)'
    );

    // Re-evaluate whenever the match state changes (resize, rotate, moving the
    // window between displays) so we never get stuck in the wrong mode.
    let cleanupMode: (() => void) | undefined;

    const applyMode = () => {
      cleanupMode?.();
      cleanupMode = undefined;

      const usePin = mql.matches && !prefersReducedMotion();
      setPinned(usePin);

      if (!usePin) {
        // Mobile / reduced-motion fallback: projects are stacked vertically, so
        // derive the counter from how far the section has scrolled through the
        // viewport rather than from any horizontal offset.
        const section = sectionRef.current;
        if (!section) return;
        // Read layout inside rAF and coalesce bursts of scroll events into a
        // single measurement per frame, so we never force a synchronous reflow
        // on the scroll thread (avoids Lighthouse "forced reflow" warnings).
        let ticking = false;
        const measure = () => {
          ticking = false;
          const rect = section.getBoundingClientRect();
          const scrollable = rect.height - window.innerHeight;
          const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
          setCurrent(Math.min(total, Math.max(1, Math.round(p * (total - 1)) + 1)));
          if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(0.02, p)})`;
        };
        const onScroll = () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(measure);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        measure();
        cleanupMode = () => window.removeEventListener('scroll', onScroll);
        return;
      }

      // Desktop pinned horizontal scroll.
      const section = sectionRef.current!;
      const track = trackRef.current!;

      // The horizontal distance depends on the track's final laid-out width,
      // which is only correct once fonts and every poster image have loaded.
      // We create the trigger after the first paint, then force ScrollTrigger
      // to re-measure whenever something that affects layout finishes loading
      // (fonts, window load, each image). Without these refreshes the trigger
      // can be built against a too-small/zero scroll distance and the pinned
      // section appears not to work at all.
      let rafId = 0;
      let ctx: gsap.Context | undefined;
      const cleanups: Array<() => void> = [];

      const build = () => {
        ctx = gsap.context(() => {
          const getScrollDistance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth);

          const tween = gsap.to(track, {
            x: () => -getScrollDistance(),
            ease: 'none',
          });

          ScrollTrigger.create({
            animation: tween,
            trigger: section,
            // Pin a bit before the section reaches the very top so the header
            // ("Selected work") keeps some breathing room below the navbar.
            start: 'top top+=60',
            end: () => `+=${getScrollDistance()}`,
            pin: pinRef.current,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setCurrent(Math.min(total, Math.floor(self.progress * total) + 1));
              if (barRef.current) {
                barRef.current.style.transform = `scaleX(${Math.max(0.02, self.progress)})`;
              }
            },
          });
        }, section);

        // Re-measure once everything that changes the track width has settled.
        const refresh = () => ScrollTrigger.refresh();

        if (document.fonts?.ready) {
          document.fonts.ready.then(refresh).catch(() => {});
        }
        if (document.readyState !== 'complete') {
          window.addEventListener('load', refresh, { once: true });
          cleanups.push(() => window.removeEventListener('load', refresh));
        }
        // Any poster image that finishes loading shifts the layout width.
        const imgs = Array.from(track.querySelectorAll('img'));
        for (const img of imgs) {
          if (img.complete) continue;
          img.addEventListener('load', refresh, { once: true });
          img.addEventListener('error', refresh, { once: true });
          cleanups.push(() => {
            img.removeEventListener('load', refresh);
            img.removeEventListener('error', refresh);
          });
        }
        // After an Astro view-transition navigation back to this page, layout
        // metrics can be stale until the new document settles — refresh then.
        document.addEventListener('astro:page-load', refresh);
        cleanups.push(() =>
          document.removeEventListener('astro:page-load', refresh)
        );

        // One more measurement on the next frame, after layout has painted.
        requestAnimationFrame(refresh);
      };

      // Wait two frames so the browser has laid out the freshly-rendered track
      // before we measure it for the first time.
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(build);
      });

      cleanupMode = () => {
        cancelAnimationFrame(rafId);
        for (const fn of cleanups) fn();
        ctx?.revert();
      };
    };

    applyMode();
    mql.addEventListener('change', applyMode);

    return () => {
      mql.removeEventListener('change', applyMode);
      cleanupMode?.();
    };
  }, [total]);

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-label={strings.label}
      className="relative bg-transparent"
    >
      <div
        ref={pinRef}
        className={
          pinned
            ? 'relative flex min-h-svh flex-col justify-center overflow-hidden'
            : 'relative py-24'
        }
      >
        {/* Progress counter — floats top-right while the section is pinned. */}
        <div
          className="container-gutter absolute inset-x-0 top-10 hidden items-center justify-end gap-4 sm:flex"
          aria-hidden="true"
        >
          <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-bone">
            {pad(current)}
          </span>
          <span className="h-px w-24 overflow-hidden bg-ink-line">
            <span
              ref={barRef}
              className="block h-full origin-left bg-bone"
              style={{ transform: 'scaleX(0.02)' }}
            />
          </span>
          <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-bone-faint">
            {pad(total)}
          </span>
        </div>

        {/* Track: an intro placard sits first (left), followed by the project
            posters. On desktop the first poster ends up centred beside the
            placard; on mobile everything stacks vertically. */}
        <div
          ref={trackRef}
          className={
            pinned
              ? 'flex w-max items-center gap-16 px-[var(--spacing-gutter)] will-change-transform lg:gap-24'
              : 'flex flex-col items-stretch gap-20 px-[var(--spacing-gutter)]'
          }
        >
          {/* Intro placard */}
          <div
            className={
              pinned
                ? 'group flex w-[70vw] max-w-[420px] shrink-0 flex-col justify-center sm:w-[42vw] lg:w-[30vw]'
                : 'group flex flex-col'
            }
          >
            <h2 className="text-sm uppercase tracking-[0.25em] text-bone-faint">
              {strings.label}
            </h2>

            {/* Heading as a comic/sticker badge (see .sticker utility).
                Capped to the placard width so it never overflows on mobile;
                the text wraps inside the badge instead of stretching wide. */}
            <span className="sticker mt-5 block max-w-full px-5 py-3 text-[length:var(--text-section)] leading-[0.95] [text-wrap:balance]">
              {strings.heading}
            </span>
          </div>

          {projects.map((project, i) => (
            <ProjectCard
              key={project.index}
              project={project}
              workBase={workBase}
              strings={strings}
              pinned={pinned}
              // Alternate the resting tilt so the wall of posters looks hand-pinned.
              restTilt={i % 2 === 0 ? -2.5 : 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * A single project rendered as an interactive silk-screen poster.
 *
 * Each project reads like a pinned-up exhibition / gig poster: a paper canvas
 * with a hard offset shadow, a strip of tape on the top edge, a large printed
 * image panel, a poster-type title, a short line of copy, and a footer band
 * listing the stack + year. A big edition number ("01") sits like a print-run
 * mark. It hangs at a slight resting angle (the sticker language used across
 * the site) and straightens + tilts in 3D towards the pointer on hover.
 *
 * On hover the whole poster tilts in 3D towards the pointer (rotateX/rotateY
 * driven by the cursor position over the element) and lifts. Leaving eases it
 * back to its resting angle.
 *
 * Pointer tracking is done imperatively via a ref (CSS custom properties) to
 * avoid re-rendering on every mouse move. Respects reduced-motion.
 */
function ProjectCard({
  project,
  workBase,
  strings,
  pinned,
  restTilt,
}: {
  project: Project;
  workBase: string;
  strings: WorkStrings;
  pinned: boolean;
  /** Resting rotation (deg) so posters hang at slightly different angles. */
  restTilt: number;
}) {
  const posterRef = useRef<HTMLDivElement | null>(null);

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = posterRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    // Normalised position within the element, -0.5..0.5.
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const MAX = 12; // max tilt in degrees
    el.style.setProperty('--rx', `${(-py * MAX).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(px * MAX).toFixed(2)}deg`);
    // Straighten out of the resting angle and lift while hovered.
    el.style.setProperty('--rz', '0deg');
    el.style.setProperty('--lift', '-6px');
  };

  const onPointerLeave = () => {
    const el = posterRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rz', `${restTilt}deg`);
    el.style.setProperty('--lift', '0px');
  };

  return (
    <article
      className={
        pinned
          ? 'group relative flex w-[80vw] max-w-[440px] shrink-0 snap-center flex-col items-center sm:w-[52vw] lg:w-[34vw]'
          : 'group relative flex w-full flex-col items-center'
      }
    >
      <a
        href={`${workBase}/${project.slug}`}
        data-cursor={project.cursorLabel ?? strings.demo}
        aria-label={project.title}
        className="block w-full"
        style={{ perspective: '1400px' }}
      >
        {/* Tilting poster */}
        <div
          ref={posterRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="relative mx-auto flex aspect-[3/4] w-full max-w-[420px] flex-col overflow-hidden border-2 border-ink bg-bone p-4 text-ink"
          style={{
            transformStyle: 'preserve-3d',
            // @ts-expect-error custom properties
            '--rx': '0deg',
            '--ry': '0deg',
            '--rz': `${restTilt}deg`,
            '--lift': '0px',
            transform:
              'translateY(var(--lift)) rotateZ(var(--rz)) rotateX(var(--rx)) rotateY(var(--ry))',
            transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '8px 10px 0 rgba(0,0,0,0.6)',
          }}
        >
          {/* Grain wash over the paper so the poster matches the site texture. */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E\")",
              backgroundSize: '140px 140px',
            }}
          />

          {/* Strip of tape holding the poster to the wall. */}
          <span
            className="pointer-events-none absolute -top-3 left-1/2 h-7 w-24 border border-white/25 bg-bone-dim/40 backdrop-blur-[1px]"
            style={{
              transform: 'translate(-50%, 0) translateZ(30px) rotate(-3deg)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.35)',
            }}
            aria-hidden="true"
          />

          {/* Header row: a short "Project" kicker + edition number, like a
              numbered print in a series. Avoids repeating the section label. */}
          <div className="relative z-10 flex items-start justify-between">
            <span className="font-[family-name:var(--font-accent)] text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ink/70">
              {strings.item}
            </span>
            <span className="font-[family-name:var(--font-display)] text-3xl font-black leading-none text-ink">
              {project.index}
            </span>
          </div>

          {/* Image panel — the printed artwork of the poster. */}
          <div className="relative z-10 mt-3 aspect-[4/3] w-full overflow-hidden border-2 border-ink bg-ink-soft">
            <img
              src={project.image}
              alt={`${project.title} — project preview`}
              // In the pinned horizontal layout every poster contributes to the
              // track width that ScrollTrigger measures, so images must load
              // up front (they're lightweight SVGs) to keep that width stable.
              loading={pinned ? 'eager' : 'lazy'}
              decoding="async"
              style={{ viewTransitionName: `project-${project.slug}` }}
              className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          </div>

          {/* Poster type: the big title. */}
          <h3 className="poster-title relative z-10 mt-4 text-[clamp(1.6rem,4vw,2.4rem)] uppercase text-ink">
            {project.title}
          </h3>

          {/* Short summary line, kept to a couple of lines. */}
          <p className="relative z-10 mt-2 line-clamp-2 text-sm leading-snug text-ink/70">
            {project.summary}
          </p>

          {/* Footer band: stack + year, like a gig-poster credits strip. */}
          <div className="relative z-10 mt-auto flex items-end justify-between gap-3 border-t-2 border-ink pt-3">
            <span className="max-w-[70%] text-[0.7rem] font-semibold uppercase tracking-wide text-ink/70">
              {project.stack.join(' · ')}
            </span>
            <span className="font-[family-name:var(--font-display)] text-lg font-black leading-none text-ink">
              {project.year}
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}
