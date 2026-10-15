import { useEffect, useMemo, useState } from 'react';
import type { GameState } from '@republica/game-engine';
import type { VarSnapshot } from '../../../stores/gameStore.js';
import type { FlashDir } from './Meter.js';

export type FlashMap = Record<string, FlashDir>;

const FLASH_DURATION_MS = 650;
const NO_FLASH: FlashMap = {};

function computeFlashMap(state: GameState, prevSnapshot: VarSnapshot): FlashMap {
  const { political, economic } = state;
  const checks: Array<{ key: string; curr: number; prev: number; inverse?: boolean }> = [
    { key: 'popularity', curr: political.popularity, prev: prevSnapshot.popularity },
    { key: 'socialStability', curr: political.socialStability, prev: prevSnapshot.socialStability },
    { key: 'marketConfidence', curr: economic.marketConfidence, prev: prevSnapshot.marketConfidence },
    { key: 'currencyStrength', curr: economic.currencyStrength, prev: prevSnapshot.currencyStrength },
    { key: 'foreignReserves', curr: economic.foreignReserves, prev: prevSnapshot.foreignReserves },
    { key: 'inflation', curr: economic.inflation, prev: prevSnapshot.inflation, inverse: true },
    {
      key: 'publicDeficit',
      curr: economic.publicDeficit,
      prev: prevSnapshot.publicDeficit ?? economic.publicDeficit,
      inverse: true,
    },
  ];
  const flashMap: FlashMap = {};
  for (const { key, curr, prev, inverse } of checks) {
    const delta = curr - prev;
    if (Math.abs(delta) >= 1) {
      const isGood = inverse ? delta < 0 : delta > 0;
      flashMap[key] = isGood ? 'up' : 'down';
    }
  }
  return flashMap;
}

/** Flashes each variable that moved since the previous snapshot, for a short moment. */
export function useFlashMap(state: GameState, prevSnapshot: VarSnapshot | null): FlashMap {
  const [expiredSnapshot, setExpiredSnapshot] = useState<VarSnapshot | null>(null);

  useEffect(() => {
    if (!prevSnapshot) return;
    const timer = setTimeout(() => setExpiredSnapshot(prevSnapshot), FLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [prevSnapshot]);

  const flashMap = useMemo(
    () => (prevSnapshot ? computeFlashMap(state, prevSnapshot) : NO_FLASH),
    [state, prevSnapshot],
  );
  return prevSnapshot === expiredSnapshot ? NO_FLASH : flashMap;
}
