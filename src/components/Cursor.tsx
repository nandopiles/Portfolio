import { useEffect, useRef, useState } from 'react';

/**
 * Custom cursor: a classic arrow pointer (white fill, dark outline) that trails
 * the pointer with easing/inertia, matching the silk-screen poster concept of
 * the Work section.
 *
 * - Only mounts on precise pointers (mouse). On touch devices it renders
 *   nothing and the native cursor is used.
 * - Respects prefers-reduced-motion by snapping instantly instead of lerping.
 * - Uses requestAnimationFrame for interpolation, driven by refs to avoid
 *   re-rendering on every mouse move.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  // Mutable animation state kept in refs (no re-render on move).
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const visible = useRef(false);
  const raf = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    // Start centred so the first frame doesn't jump from 0,0.
    target.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    current.current = { ...target.current };

    // Reveal immediately on hydration. Previously the cursor stayed at opacity 0
    // until the first `mousemove`; when this island hydrates late (client:idle),
    // an early mouse movement can happen before the listener exists and the
    // cursor appears "missing" until the pointer moves again. Showing it now
    // (already centred) guarantees it's visible as soon as the island is ready.
    visible.current = true;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!visible.current) {
        visible.current = true;
        current.current = { x: e.clientX, y: e.clientY };
        if (dotRef.current) dotRef.current.style.opacity = '1';
      }
    };

    const onLeave = () => {
      visible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };

    const onDown = () => dotRef.current?.style.setProperty('--press', '0.82');
    const onUp = () => dotRef.current?.style.setProperty('--press', '1');

    // Follow "stiffness": higher = snappier. Framerate-independent easing so
    // the motion feels identically smooth on 60Hz, 120Hz or 144Hz displays.
    const STIFFNESS = 18;

    const render = (now: number) => {
      const prev = lastTime.current ?? now;
      // Clamp dt so returning to the tab after a pause doesn't cause a jump.
      const dt = Math.min((now - prev) / 1000, 0.05);
      lastTime.current = now;

      // Reveal on the first frame if we're meant to be visible (set at
      // hydration or on first move) but the element is still transparent.
      if (visible.current && dotRef.current && dotRef.current.style.opacity !== '1') {
        dotRef.current.style.opacity = '1';
      }

      // Exponential smoothing: frame-rate independent version of a lerp.
      const ease = reduce ? 1 : 1 - Math.exp(-STIFFNESS * dt);
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    raf.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      if (raf.current) cancelAnimationFrame(raf.current);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0,
        // @ts-expect-error custom property
        '--press': 1,
      }}
    >
      {/* Arrow pointer — comic/sticker style: chunky, bold outline, hard
          offset shadow. Always shown; trails the pointer with easing. */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          // Hotspot at the tip (top-left), matching a native arrow cursor.
          transformOrigin: '3px 2px',
          transform: `scale(var(--press, 1))`,
          transition: 'transform 0.12s ease',
          filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,0.9))',
        }}
      >
        <path
          d="M3 2 L3 20 L8 15 L11.5 22.5 L14.5 21 L11 13.5 L18 13.5 Z"
          fill="#f5f5f0"
          stroke="#0a0a0a"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
