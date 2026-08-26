import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/hooks/useSmoothScroll';

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  stagger = 0.12,
  y = 40,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>('[data-reveal]');
    const items = targets.length ? Array.from(targets) : [el];

    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, y });
      ScrollTrigger.batch(items, {
        start: 'top 85%',
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger,
          }),
      });
    }, el);

    return () => ctx.revert();
  }, [stagger, y]);

  return ref;
}

export function useCounter(
  value: number,
  duration = 2,
  format: (n: number) => string = (n) => String(Math.round(n)),
) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: value,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = format(obj.val);
          },
        });
      },
    });

    return () => st.kill();
  }, [value, duration, format]);

  return ref;
}
