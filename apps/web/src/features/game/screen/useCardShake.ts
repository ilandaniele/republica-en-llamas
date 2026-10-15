import { useEffect, useState } from 'react';
import type { EventCard } from '@republica/game-engine';

const SHAKE_DURATION_MS = 500;

/** Shakes the screen briefly when a crisis card appears. */
export function useCardShake(card: EventCard | null): boolean {
  const [settledCardId, setSettledCardId] = useState<string | null>(null);
  const cardId = card?.id ?? null;
  const isCrisis = card?.category === 'crisis';

  useEffect(() => {
    if (!isCrisis) return;
    const timer = setTimeout(() => setSettledCardId(cardId), SHAKE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [cardId, isCrisis]);

  return isCrisis && settledCardId !== cardId;
}
