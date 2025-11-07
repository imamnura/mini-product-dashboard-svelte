import { onMount } from 'svelte';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export function useIntersectionObserver(
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverOptions
) {
  let element: Element | null = null;
  let observer: IntersectionObserver | null = null;

  function observe(el: Element) {
    element = el;
    if (!element) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          callback(entry.isIntersecting);
          if (entry.isIntersecting && observer) {
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: options?.root ?? null,
        rootMargin: options?.rootMargin ?? '0px',
        threshold: options?.threshold ?? 0.1
      }
    );

    observer.observe(element);
  }

  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  onMount(() => {
    return cleanup;
  });

  return { observe, cleanup };
}
