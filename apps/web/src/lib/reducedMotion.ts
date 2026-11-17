export const REDUCE_MOTION_CLASS = 'reduce-motion';

export function prefersReducedMotion(): boolean {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains(REDUCE_MOTION_CLASS)) {
    return true;
  }
  return (
    typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  );
}
