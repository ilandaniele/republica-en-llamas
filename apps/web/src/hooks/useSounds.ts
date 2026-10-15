import { createContext, useContext } from 'react';

export interface SoundCtx {
  soundEnabled: boolean;
  toggleSound: () => void;
  playCardFlip: () => void;
  playCrisisAlert: () => void;
  playGameOver: () => void;
  playVictoryTick: () => void;
}

export const SoundContext = createContext<SoundCtx>({
  soundEnabled: false,
  toggleSound: () => {},
  playCardFlip: () => {},
  playCrisisAlert: () => {},
  playGameOver: () => {},
  playVictoryTick: () => {},
});

export function useSounds() {
  return useContext(SoundContext);
}
