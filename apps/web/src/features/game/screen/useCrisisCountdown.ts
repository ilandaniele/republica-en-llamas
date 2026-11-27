import { useEffect, useState } from 'react';
import type { EventCard } from '@republica/game-engine';
import { useGameStore } from '../../../stores/gameStore.js';
import { usePreferencesStore } from '../../../stores/preferencesStore.js';
import { crisisSecondsPerTurn, isTimedTurn } from '../../../lib/crisisExpress.js';

interface CountdownOptions {
  card: EventCard | null;
  isCrisisExpress: boolean;
  paused: boolean;
  onTimeout: () => void;
}

/** Turn countdown (Crisis Express, crisis cards): restarts on every new card, fires onTimeout at zero, null when the turn is untimed. */
export function useCrisisCountdown({
  card,
  isCrisisExpress,
  paused,
  onTimeout,
}: CountdownOptions): number | null {
  const difficulty = useGameStore((s) => s.gameState?.difficulty);
  const totalSeconds = crisisSecondsPerTurn(usePreferencesStore((s) => s.extendedTime));
  const cardId = card?.id;
  const enabled = isTimedTurn(card, isCrisisExpress, difficulty);
  const [countdown, setCountdown] = useState({ cardId, timeLeft: totalSeconds });
  const timeLeft = countdown.cardId === cardId ? countdown.timeLeft : totalSeconds;
  const running = enabled && cardId !== undefined && !paused;

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        const current = prev.cardId === cardId ? prev.timeLeft : totalSeconds;
        return { cardId, timeLeft: Math.max(0, current - 1) };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, cardId, totalSeconds]);

  useEffect(() => {
    if (running && timeLeft === 0) onTimeout();
  }, [running, timeLeft, onTimeout]);

  return enabled ? timeLeft : null;
}
