import type { PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import type { Project } from '@/data/projects';

/** UI strings passed from the Astro layer so this island stays language-aware. */
export interface WorkStrings {
  label: string;
  heading: string;
  intro: string;
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
    const mql = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const usePin = mql.matches && !prefersReducedMotion();
    setPinned(usePin);

    if (!usePin) {
      // Mobile / reduced-motion fallback: projects are stacked vertically, so
      // derive the counter from how far the section has scrolled through the
      // viewport rather than from any horizontal offset.
      const section = sectionRef.current;
      if (!section) return;
      const onScroll = () => {
        const rect = section.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
        setCurrent(Math.min(total, Math.max(1, Math.round(p * (total - 1)) + 1)));
        if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(0.02, p)})`;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener('scroll', onScroll);
    }

    // Desktop pinned horizontal scroll.
    const section = sectionRef.current!;
    const track = trackRef.current!;

    const ctx = gsap.context(() => {
      const getScrollDistance = () => track.scrollWidth - window.innerWidth;

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

    return () => ctx.revert();
  }, [total]);

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-label="Selected work"
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

        {/* Track: an intro placard sits first (left), followed by the vinyl
            records. On desktop the first record ends up centred beside the
            placard; on mobile everything stacks vertically. */}
        <div
          ref={trackRef}
          className={
            pinned
              ? 'flex w-max items-center gap-16 px-[var(--spacing-gutter)] will-change-transform lg:gap-24'
              : 'flex flex-col items-stretch gap-20 px-[var(--spacing-gutter)]'
          }
          role="list"
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

            {/* Heading as a comic/sticker badge (see .sticker utility). */}
            <span className="sticker mt-5 px-5 py-3 text-[length:var(--text-section)] leading-[0.95]">
              {strings.heading}
            </span>

            <p className="mt-8 max-w-[42ch] leading-relaxed text-bone-dim">
              {strings.intro}
            </p>
          </div>

          {projects.map((project) => (
            <ProjectCard
              key={project.index}
              project={project}
              workBase={workBase}
              strings={strings}
              pinned={pinned}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * A single project rendered as an interactive 3D vinyl record.
 *
 * The disc is layered to read as a real pressed record: a beveled outer edge,
 * fine concentric grooves broken up by smooth "band" separators, a fixed
 * diagonal specular sheen (the pressing reflection — it does NOT follow the
 * cursor), and a raised centre label carrying the project image/logo.
 *
 * On hover the whole disc tilts in 3D towards the pointer (rotateX/rotateY
 * driven by the cursor position over the element). Leaving eases it back flat.
 *
 * Pointer tracking is done imperatively via a ref (CSS custom properties) to
 * avoid re-rendering on every mouse move. Respects reduced-motion.
 */
function ProjectCard({
  project,
  workBase,
  strings,
  pinned,
}: {
  project: Project;
  workBase: string;
  strings: WorkStrings;
  pinned: boolean;
}) {
  const discRef = useRef<HTMLDivElement | null>(null);

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = discRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    // Normalised position within the element, -0.5..0.5.
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const MAX = 20; // max tilt in degrees
    el.style.setProperty('--rx', `${(-py * MAX).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(px * MAX).toFixed(2)}deg`);
  };

  const onPointerLeave = () => {
    const el = discRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <article
      role="listitem"
      className={
        pinned
          ? 'group relative flex w-[86vw] max-w-[560px] shrink-0 snap-center flex-col items-center sm:w-[60vw] lg:w-[42vw]'
          : 'group relative flex w-full flex-col items-center'
      }
    >
      <a
        href={`${workBase}/${project.slug}`}
        data-cursor={project.cursorLabel ?? strings.demo}
        aria-label={project.title}
        className="block w-full"
        style={{ perspective: '1200px' }}
      >
        {/* Tilting disc */}
        <div
          ref={discRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="relative mx-auto aspect-square w-full max-w-[540px] rounded-full"
          style={{
            transformStyle: 'preserve-3d',
            // @ts-expect-error custom properties
            '--rx': '0deg',
            '--ry': '0deg',
            transform: 'rotateX(var(--rx)) rotateY(var(--ry))',
            transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
            filter: 'drop-shadow(8px 12px 0 rgba(0,0,0,0.5))',
          }}
        >
          {/* Beveled outer edge of the disc. */}
          <div
            className="absolute inset-0 rounded-full border-2 border-ink"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, #242424 0%, #0c0c0c 78%, #000 100%)',
            }}
          />

          {/* Groove field: fine concentric lines confined to the playable area. */}
          <div
            className="absolute inset-[5%] rounded-full"
            style={{
              background: `
                repeating-radial-gradient(circle at 50% 50%,
                  rgba(255,255,255,0.055) 0px,
                  rgba(255,255,255,0.055) 0.5px,
                  rgba(0,0,0,0) 1.5px,
                  rgba(0,0,0,0) 3px)
              `,
            }}
          />

          {/* Smooth "band" separators between song groups (darker rings). */}
          <div
            className="absolute inset-[5%] rounded-full"
            style={{
              background: `
                repeating-radial-gradient(circle at 50% 50%,
                  rgba(0,0,0,0) 0px,
                  rgba(0,0,0,0) 42px,
                  rgba(0,0,0,0.55) 43px,
                  rgba(0,0,0,0.55) 47px)
              `,
            }}
          />

          {/* Fixed specular sheen — a soft diagonal band of light across the
              disc, like the reflection on real vinyl. Does not track cursor. */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full mix-blend-screen"
            style={{
              background:
                'conic-gradient(from 210deg at 50% 50%, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.14) 32deg, rgba(255,255,255,0) 70deg, rgba(255,255,255,0) 200deg, rgba(255,255,255,0.08) 236deg, rgba(255,255,255,0) 270deg)',
            }}
          />

          {/* Inner + outer rim highlights for a crisp pressed edge. */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              boxShadow:
                'inset 0 0 0 3px rgba(255,255,255,0.05), inset 0 0 55px rgba(0,0,0,0.85)',
            }}
          />

          {/* Centre label — raised, carrying the project image / logo. */}
          <div
            className="absolute left-1/2 top-1/2 aspect-square w-[38%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-[3px] border-ink bg-ink-soft"
            style={{
              transform: 'translate(-50%, -50%) translateZ(28px)',
              boxShadow: '0 0 0 6px rgba(0,0,0,0.6), 0 8px 18px rgba(0,0,0,0.5)',
            }}
          >
            <img
              src={project.image}
              alt={`${project.title} — project preview`}
              loading="lazy"
              decoding="async"
              style={{ viewTransitionName: `project-${project.slug}` }}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Spindle hole, above the label. */}
          <span
            className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black"
            style={{
              transform: 'translate(-50%, -50%) translateZ(30px)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.9)',
            }}
          />
        </div>
      </a>

      {/* Footer: title + year only (replaces the old description/stack card). */}
      <div className="mt-8 flex w-full max-w-[540px] items-center justify-between gap-4">
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-bone sm:text-3xl">
          {project.title}
        </h3>
        <span className="shrink-0 text-sm text-bone-faint">{project.year}</span>
      </div>
    </article>
  );
}
