'use client';
import { useState, useEffect, useRef } from 'react';

export function useCounter(
  target: number,
  duration = 1400,
  active = true,
): number {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(from + (target - from) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, active]);

  return value;
}
