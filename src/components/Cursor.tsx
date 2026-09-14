import { useEffect, useRef, useState } from 'react';

/**
 * Custom cursor: a classic arrow pointer (white fill, dark outline) that trails
 * the pointer with easing/inertia. Over interactive elements it swaps to an
 * inked rubber-stamp label (e.g. "View →") that thumps down at a tilt,
 * matching the silk-screen poster concept of the Work section.
 *
 * - Only mounts on precise pointers (mouse). On touch devices it renders
 *   nothing and the native cursor is used.
 * - Respects prefers-reduced-motion by snapping instantly instead of lerping.
 * - Uses requestAnimationFrame for interpolation, driven by refs to avoid
 *   re-rendering on every mouse move.
 *
 * Interactive elements opt in via `data-cursor` (optional value = label),
 * e.g. `<a data-cursor="View">`. Any `a`, `button`, `[role=button]` also
 * triggers the hover state automatically.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState('');

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

    // The label pill only appears on elements that explicitly opt in with
    // `data-cursor` (e.g. project cards). Regular links/buttons keep the plain
    // arrow so the pill never covers small text CTAs.
    const interactiveSelector = '[data-cursor]';

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!visible.current) {
        visible.current = true;
        current.current = { x: e.clientX, y: e.clientY };
        if (dotRef.current) dotRef.current.style.opacity = '1';
      }

      const el = (e.target as HTMLElement)?.closest(interactiveSelector) as HTMLElement | null;
      if (el) {
        setHovering(true);
        const custom = el.getAttribute('data-cursor');
        setLabel(custom ?? '');
      } else {
        setHovering(false);
        setLabel('');
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
          offset shadow. Hidden while hovering an interactive element. */}
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
          opacity: hovering ? 0 : 1,
          transition: 'opacity 0.2s ease, transform 0.12s ease',
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

      {/* Rubber-stamp label — shown over interactive elements. Reads like an
          inked exhibition/print stamp: a tilted rectangle with a chunky double
          ink border, grain texture, and a small "thump" as it lands. Matches
          the silk-screen poster concept of the Work section. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'grid',
          placeItems: 'center',
          padding: hovering ? '10px 18px' : '0px',
          background: 'var(--color-accent)',
          color: 'var(--color-ink)',
          // Double ink border: solid inner + a second boxed outline for the
          // "pressed twice" stamp look.
          border: '2.5px solid var(--color-ink)',
          boxShadow:
            'inset 0 0 0 2px var(--color-accent), inset 0 0 0 4px var(--color-ink), 3px 4px 0 rgba(0,0,0,0.55)',
          transform: `translate(-50%, -50%) rotate(-8deg) scale(calc(var(--press, 1) * ${hovering ? 1 : 0.4}))`,
          transformOrigin: 'center',
          opacity: hovering ? 0.95 : 0,
          transition:
            'opacity 0.18s var(--ease-out-expo), transform 0.28s var(--ease-out-expo), padding 0.28s var(--ease-out-expo)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Uneven ink texture clipped to the stamp so the fill looks printed. */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.25,
            mixBlendMode: 'multiply',
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23s)'/%3E%3C/svg%3E\")",
            backgroundSize: '90px 90px',
          }}
        />
        {hovering && label && (
          <span
            style={{
              position: 'relative',
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            {label} →
          </span>
        )}
      </div>
    </div>
  );
}
