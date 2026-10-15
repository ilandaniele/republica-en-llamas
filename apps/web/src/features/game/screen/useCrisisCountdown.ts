import { useEffect, useState } from 'react';

const CRISIS_SECONDS = 45;

interface CountdownOptions {
  cardId: string | undefined;
  enabled: boolean;
  paused: boolean;
  onTimeout: () => void;
}

/** Crisis Express countdown: restarts on every new card and fires onTimeout when it reaches zero. */
export function useCrisisCountdown({ cardId, enabled, paused, onTimeout }: CountdownOptions): number {
  const [countdown, setCountdown] = useState({ cardId, timeLeft: CRISIS_SECONDS });
  const timeLeft = countdown.cardId === cardId ? countdown.timeLeft : CRISIS_SECONDS;
  const running = enabled && cardId !== undefined && !paused;

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        const current = prev.cardId === cardId ? prev.timeLeft : CRISIS_SECONDS;
        return { cardId, timeLeft: Math.max(0, current - 1) };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, cardId]);

  useEffect(() => {
    if (running && timeLeft === 0) onTimeout();
  }, [running, timeLeft, onTimeout]);

  return timeLeft;
}
