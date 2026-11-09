import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export const COUNT_INTERVAL_MS = 700;

export function useElectionCount(lastStep: number) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [motionSkipped, setMotionSkipped] = useState(Boolean(reducedMotion));
  const [userPaused, setUserPaused] = useState(false);
  const [hidden, setHidden] = useState(() => document.visibilityState === 'hidden');
  const [speed, setSpeed] = useState<1 | 2>(1);
  if (reducedMotion && !motionSkipped) setMotionSkipped(true);
  const complete = motionSkipped || Boolean(reducedMotion) || step === lastStep;
  const paused = userPaused || hidden;
  useEffect(() => {
    const onVisibility = () => setHidden(document.visibilityState === 'hidden');
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);
  useEffect(() => {
    if (complete || paused) return;
    const interval = setInterval(
      () => setStep((value) => Math.min(lastStep, value + 1)),
      COUNT_INTERVAL_MS / speed,
    );
    return () => clearInterval(interval);
  }, [complete, lastStep, paused, speed]);
  return {
    step: complete ? lastStep : step,
    complete,
    paused,
    userPaused,
    speed,
    setSpeed,
    togglePause: () => setUserPaused((value) => !value),
    finish: () => setStep(lastStep),
  };
}
