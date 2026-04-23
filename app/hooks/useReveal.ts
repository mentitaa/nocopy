'use client';
import { useEffect, useRef, RefObject } from 'react';

export function useReveal<T extends HTMLElement>(
  threshold = 0.15,
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          obs.unobserve(el);
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return ref;
}

// Observe multiple children of a container
export function useRevealChildren(selector = '.reveal', threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const els = container.querySelectorAll<HTMLElement>(selector);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [selector, threshold]);

  return ref;
}
