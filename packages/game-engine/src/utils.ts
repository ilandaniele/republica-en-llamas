export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Seeded pseudo-random number generator (mulberry32).
 * Returns a function that yields numbers in [0, 1).
 */
export function createRng(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateId(prefix: string, rng: () => number): string {
  return `${prefix}_${Math.floor(rng() * 1e9)}`;
}
