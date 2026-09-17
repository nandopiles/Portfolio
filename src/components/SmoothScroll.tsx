import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Smooth scrolling via Lenis, synced with GSAP's ticker and ScrollTrigger.
 *
 * - Disabled entirely when the user prefers reduced motion (native scroll).
 * - The Lenis instance is exposed on `window.__lenis` so other islands
 *   (e.g. anchor links, the pinned Work section) can drive it.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    window.__lenis = lenis;

    // Drive Lenis from GSAP's ticker for a single, synced RAF loop.
    lenis.on('scroll', ScrollTrigger.update);
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Starting Lenis changes the scroll metrics, so refresh ScrollTrigger now,
    // after the next frame, and on every view-transition load so any trigger
    // is measured against the smooth-scroll setup. The pinned Work island
    // builds its own trigger on `astro:page-load` (see ProjectsHorizontal), so
    // this refresh simply keeps existing triggers in sync with Lenis.
    const refresh = () => ScrollTrigger.refresh();
    refresh();
    requestAnimationFrame(refresh);
    document.addEventListener('astro:page-load', refresh);

    // Fixed navbar height (matches the CSS scroll-margin-top on sections) so
    // the targeted section clears the header instead of hiding under it.
    const NAV_OFFSET = 96;

    /**
     * Resolve an element's absolute document Y, accounting for the pinned
     * "Work" section. That section is a ScrollTrigger pin whose scroll length
     * is measured asynchronously (after fonts/images), so on the very first
     * interaction the document may not yet be inflated and any target *after*
     * the pin would resolve to a stale (too-small) offset — Lenis then clamps
     * it and lands at the bottom of the page.
     *
     * We force a refresh, then wait until the target's measured position is
     * stable across two consecutive frames before scrolling. This guarantees
     * the pin has expanded the document and the offset is final.
     */
    // Smooth "settle" easing: quick, confident departure that eases gently
    // into the destination (expo-out). Gives the glide a polished feel rather
    // than a mechanical linear slide.
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const scrollToAnchor = (el: HTMLElement, animate = true) => {
      ScrollTrigger.refresh();

      let lastTop = Number.NaN;
      let settleTries = 0;

      const attempt = () => {
        const top =
          el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;

        // Position hasn't stabilised yet (pin still expanding). Try again next
        // frame, up to a small cap so we never loop forever.
        if (Math.abs(top - lastTop) > 1 && settleTries < 8) {
          lastTop = top;
          settleTries += 1;
          requestAnimationFrame(attempt);
          return;
        }

        const target = Math.max(0, top);

        if (!animate) {
          lenis.scrollTo(target, { immediate: true });
          return;
        }

        // Scale the glide duration to the distance travelled so short hops feel
        // snappy and long journeys (e.g. Hero → Contact) get a bit more air —
        // clamped so it's never sluggish or abrupt.
        const distance = Math.abs(target - window.scrollY);
        const duration = Math.min(1.8, Math.max(0.8, distance / 1600));

        lenis.scrollTo(target, { duration, easing: easeOutExpo });
      };

      requestAnimationFrame(attempt);
    };

    // Intercept in-page anchor links and hand them to Lenis.
    const onClick = (e: MouseEvent) => {
      // Respect modifier clicks (open in new tab, etc.).
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const anchor = (e.target as HTMLElement)?.closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      history.pushState(null, '', id);
      scrollToAnchor(el as HTMLElement);
    };
    document.addEventListener('click', onClick);

    // On initial load with a hash (e.g. someone opens /#experience directly),
    // scroll to it once the layout — including the pin — has settled. The
    // browser's native hash jump ran against the un-inflated document, so we
    // re-resolve it here.
    const initialHash = window.location.hash;
    if (initialHash && initialHash.length > 1) {
      const target = document.querySelector(initialHash);
      if (target) {
        // Land directly on the section (no glide) so a deep link doesn't play a
        // long animation from the top on load.
        requestAnimationFrame(() => scrollToAnchor(target as HTMLElement, false));
      }
    }

    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('astro:page-load', refresh);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
