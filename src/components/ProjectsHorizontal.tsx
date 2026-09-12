import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import type { Project } from '@/data/projects';

interface Props {
  projects: Project[];
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
export default function ProjectsHorizontal({ projects }: Props) {
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
      // Native-scroll fallback: update counter from the scroll container.
      const scroller = trackRef.current;
      if (!scroller) return;
      const onScroll = () => {
        const max = scroller.scrollWidth - scroller.clientWidth;
        const p = max > 0 ? scroller.scrollLeft / max : 0;
        setCurrent(Math.min(total, Math.max(1, Math.round(p * (total - 1)) + 1)));
        if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(0.02, p)})`;
      };
      scroller.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => scroller.removeEventListener('scroll', onScroll);
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
        start: 'top top',
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
      className="relative bg-ink"
    >
      <div ref={pinRef} className="min-h-svh overflow-hidden">
        {/* Section header + progress */}
        <div className="container-gutter flex items-end justify-between pt-28 pb-10">
          <div>
            <h2 className="text-sm uppercase tracking-[0.25em] text-bone-faint">
              (Selected Work)
            </h2>
            <p className="mt-3 max-w-[20ch] text-[length:var(--text-section)] leading-none text-bone">
              Things I've built.
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-4 sm:flex" aria-hidden="true">
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
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          className={
            pinned
              ? 'flex w-max items-stretch gap-6 px-[var(--spacing-gutter)] will-change-transform'
              : 'flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto px-[var(--spacing-gutter)] pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          }
          role="list"
        >
          {projects.map((project) => (
            <ProjectCard key={project.index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const href = project.demo ?? project.repo ?? '#';
  return (
    <article
      role="listitem"
      className="group relative flex w-[82vw] max-w-[540px] shrink-0 snap-center flex-col sm:w-[46vw] lg:w-[38vw]"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor={project.cursorLabel ?? 'View'}
        aria-label={`${project.title} — open project`}
        className="block overflow-hidden rounded-xl border border-ink-line bg-ink-soft"
      >
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={project.image}
            alt={`${project.title} — project preview`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        </div>
      </a>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-bone">
            {project.title}
          </h3>
          <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-bone-dim">
            {project.summary}
          </p>
        </div>
        <span className="shrink-0 text-sm text-bone-faint">{project.year}</span>
      </div>

      <p className="mt-4 text-xs uppercase tracking-wider text-bone-faint">
        {project.stack.join(' · ')}
      </p>

      <div className="mt-4 flex gap-5 text-sm">
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-bone"
          >
            Live demo
          </a>
        )}
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-bone-dim"
          >
            Code
          </a>
        )}
      </div>
    </article>
  );
}
