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

    // This island and the pinned Work island hydrate independently (idle vs
    // visible), so their init order isn't deterministic. Starting Lenis also
    // changes the scroll metrics. Refresh ScrollTrigger now — and again after
    // the next frame and on view-transition loads — so any trigger that was
    // created before Lenis was ready (e.g. the pinned horizontal section) is
    // re-measured against the smooth-scroll setup instead of being left dead.
    const refresh = () => ScrollTrigger.refresh();
    refresh();
    requestAnimationFrame(refresh);
    document.addEventListener('astro:page-load', refresh);

    // Intercept in-page anchor links and hand them to Lenis.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.2 });
      history.pushState(null, '', id);
    };
    document.addEventListener('click', onClick);

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
