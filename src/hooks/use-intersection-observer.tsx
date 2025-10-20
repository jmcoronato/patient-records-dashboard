/**
 * Reusable hook for IntersectionObserver
 * Useful for infinite scroll, lazy loading, etc.
 */

import { useEffect, useRef, RefObject } from "react";

interface UseIntersectionObserverOptions {
  /**
   * Callback when the element is visible
   */
  onIntersect: () => void;

  /**
   * If the observer is enabled
   */
  enabled?: boolean;

  /**
   * Root margin (useful for loading before the user reaches the end)
   */
  rootMargin?: string;

  /**
   * Threshold for intersection (0 to 1)
   */
  threshold?: number | number[];

  /**
   * Root element to observe (default the viewport)
   */
  root?: Element | null;
}

/**
 * Hook that observes when an element enters the viewport
 * @param options - Configuration options
 * @returns Ref para asignar al elemento a observar
 */
export function useIntersectionObserver<
  T extends HTMLElement = HTMLDivElement
>({
  onIntersect,
  enabled = true,
  rootMargin = "0px",
  threshold = 0,
  root = null,
}: UseIntersectionObserverOptions): RefObject<T> {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    const target = targetRef.current;

    // Do nothing if disabled or no element
    if (!enabled || !target) {
      return;
    }

    // create the observer
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        // If the element is visible, execute the callback
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    // Observe the element
    observer.observe(target);

    // Cleanup: stop observing
    return () => {
      observer.disconnect();
    };
  }, [enabled, onIntersect, rootMargin, threshold, root]);

  return targetRef;
}
