import { createContext, useContext, useEffect } from 'react';

export interface SoundCtx {
  soundEnabled: boolean;
  toggleSound: () => void;
  playCardFlip: () => void;
  playCrisisAlert: () => void;
  playGameOver: () => void;
  playVictoryTick: () => void;
  playVoteTick: (frequency: number) => void;
}

export const SoundContext = createContext<SoundCtx>({
  soundEnabled: false,
  toggleSound: () => {},
  playCardFlip: () => {},
  playCrisisAlert: () => {},
  playGameOver: () => {},
  playVictoryTick: () => {},
  playVoteTick: () => {},
});

export function useSounds() {
  return useContext(SoundContext);
}

export type SoundCue = 'playCardFlip' | 'playCrisisAlert' | 'playGameOver' | 'playVictoryTick';

export function useSoundCue(cue: SoundCue, trigger?: unknown) {
  const sounds = useSounds();
  useEffect(() => {
    sounds[cue]();
  }, [cue, trigger]); // eslint-disable-line react-hooks/exhaustive-deps
}
