import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export interface UseSmoothScrollOptions {
  duration?: number;
  lerp?: number;
  smoothWheel?: boolean;
}

/**
 * Custom React hook that initializes a Lenis smooth scroll instance
 * on the targeted container element with 60/120fps hardware-accelerated interpolation.
 */
export function useSmoothScroll<T extends HTMLElement = HTMLDivElement>(
  options?: UseSmoothScrollOptions
) {
  const containerRef = useRef<T>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const wrapper = containerRef.current;
    if (!wrapper) return;

    // Use wrapper's first element child or fallback to wrapper for dimension observation
    const content = (wrapper.firstElementChild as HTMLElement) || wrapper;

    const lenis = new Lenis({
      wrapper,
      content,
      eventsTarget: wrapper,
      smoothWheel: options?.smoothWheel ?? true,
      duration: options?.duration ?? 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoRaf: true,
      overscroll: true,
      allowNestedScroll: true,
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [options?.duration, options?.lerp, options?.smoothWheel]);

  return { containerRef, lenisRef };
}

export default useSmoothScroll;
