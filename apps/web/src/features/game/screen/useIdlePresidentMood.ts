import { useEffect } from 'react';
import { useTransientValue } from '../../../hooks/useTransientValue.js';
import type { PortraitMood } from '../../../components/illustrations/PixelPortrait.js';

const IDLE_MS = 10000;
const PANIC_MS = 2000;

/** Easter egg: after 10s without input the president panics. */
export function useIdlePresidentMood(): PortraitMood | null {
  const [mood, showMood, hideMood] = useTransientValue<PortraitMood | null>(null);

  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const resetIdle = () => {
      clearTimeout(idleTimer);
      hideMood();
      idleTimer = setTimeout(() => showMood('panic', PANIC_MS), IDLE_MS);
    };
    resetIdle();
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
    };
  }, [hideMood, showMood]);

  return mood;
}
