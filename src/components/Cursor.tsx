import { useEffect, useRef, useState } from 'react';

/**
 * Custom cursor: a dot that trails the pointer with easing/inertia and grows
 * (showing a label) over interactive elements.
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

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    // Start centred so the first frame doesn't jump from 0,0.
    target.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    current.current = { ...target.current };

    const interactiveSelector = 'a, button, [role="button"], [data-cursor], input, textarea, select';

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

    const onDown = () => dotRef.current?.style.setProperty('--press', '0.85');
    const onUp = () => dotRef.current?.style.setProperty('--press', '1');

    const render = () => {
      const ease = reduce ? 1 : 0.18;
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
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
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          width: hovering ? 72 : 12,
          height: hovering ? 72 : 12,
          borderRadius: 9999,
          background: hovering ? 'var(--color-bone)' : 'transparent',
          border: hovering ? 'none' : '1.5px solid var(--color-bone)',
          color: 'var(--color-ink)',
          transition:
            'width 0.35s var(--ease-out-expo), height 0.35s var(--ease-out-expo), background 0.35s var(--ease-out-expo)',
          transform: 'scale(var(--press, 1))',
          mixBlendMode: hovering ? 'normal' : 'difference',
        }}
      >
        {hovering && label && (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
