import { useEffect, useState } from 'react';
import { usePreferencesStore } from '../../../stores/preferencesStore.js';
import { crisisSecondsPerTurn } from '../../../lib/crisisExpress.js';

interface CountdownOptions {
  cardId: string | undefined;
  enabled: boolean;
  paused: boolean;
  onTimeout: () => void;
}

/** Crisis Express countdown: restarts on every new card and fires onTimeout when it reaches zero. */
export function useCrisisCountdown({ cardId, enabled, paused, onTimeout }: CountdownOptions): number {
  const totalSeconds = crisisSecondsPerTurn(usePreferencesStore((s) => s.extendedTime));
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

  return timeLeft;
}
