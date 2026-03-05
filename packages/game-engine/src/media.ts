import type { GameState } from './types.js';
import { clamp } from './utils.js';

export type MediaAction = 'PRESS_CONFERENCE' | 'MEDIA_BLACKOUT' | 'SPIN_CAMPAIGN' | 'TRANSPARENCY';

interface MediaActionConfig {
  popularityDelta: number;
  stabilityDelta: number;
  credibilityDelta: number;
  sentimentDelta: number;
  durationTurns: number;
}

const MEDIA_ACTIONS: Record<MediaAction, MediaActionConfig> = {
  PRESS_CONFERENCE: {
    popularityDelta: 5,
    stabilityDelta: 3,
    credibilityDelta: -5,
    sentimentDelta: 10,
    durationTurns: 2,
  },
  MEDIA_BLACKOUT: {
    popularityDelta: -8,
    stabilityDelta: -5,
    credibilityDelta: -15,
    sentimentDelta: -20,
    durationTurns: 3,
  },
  SPIN_CAMPAIGN: {
    popularityDelta: 8,
    stabilityDelta: 2,
    credibilityDelta: -10,
    sentimentDelta: 15,
    durationTurns: 2,
  },
  TRANSPARENCY: {
    popularityDelta: 3,
    stabilityDelta: 5,
    credibilityDelta: 15,
    sentimentDelta: 8,
    durationTurns: 4,
  },
};

export function applyMediaSpin(state: GameState, action: MediaAction): GameState {
  const cfg = MEDIA_ACTIONS[action];

  const newSpin = {
    id: `spin_${state.turn}_${action}`,
    turnsRemaining: cfg.durationTurns,
    popularityMod: cfg.popularityDelta,
    stabilityMod: cfg.stabilityDelta,
    credibilityMod: cfg.credibilityDelta,
  };

  return {
    ...state,
    political: {
      ...state.political,
      popularity: clamp(state.political.popularity + cfg.popularityDelta, 0, 100),
      socialStability: clamp(state.political.socialStability + cfg.stabilityDelta, 0, 100),
      mediaCredibility: clamp(state.political.mediaCredibility + cfg.credibilityDelta, 0, 100),
    },
    media: {
      ...state.media,
      sentiment: clamp(state.media.sentiment + cfg.sentimentDelta, -100, 100),
      activeSpins: [...state.media.activeSpins, newSpin],
    },
  };
}

export function tickMediaEffects(state: GameState): GameState {
  const updatedSpins = state.media.activeSpins
    .map((spin) => ({ ...spin, turnsRemaining: spin.turnsRemaining - 1 }))
    .filter((spin) => spin.turnsRemaining > 0);

  return {
    ...state,
    media: {
      ...state.media,
      activeSpins: updatedSpins,
    },
  };
}
