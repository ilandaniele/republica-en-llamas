import type { DifficultyPreset, CrisisType } from './types.js';

// ─── Difficulty presets ───────────────────────────────────────────────────────

export const DIFFICULTY_PRESETS: Record<string, DifficultyPreset> = {
  easy: {
    label: 'Fácil',
    flavorKey: 'difficulty.easy.flavor',
    popularity: 72,
    socialStability: 75,
    mediaCredibility: 65,
    inflation: 4,
    publicDeficit: 15,
    marketConfidence: 72,
    currencyStrength: 75,
    foreignReserves: 80,
    gdpGrowth: 3.5,
    governmentSeats: 310,
    oppositionSeats: 150,
    independentSeats: 78,
  },
  normal: {
    label: 'Normal',
    flavorKey: 'difficulty.normal.flavor',
    popularity: 50,
    socialStability: 55,
    mediaCredibility: 45,
    inflation: 12,
    publicDeficit: 40,
    marketConfidence: 50,
    currencyStrength: 55,
    foreignReserves: 50,
    gdpGrowth: 1.0,
    governmentSeats: 240,
    oppositionSeats: 210,
    independentSeats: 88,
  },
  hard: {
    label: 'Difícil',
    flavorKey: 'difficulty.hard.flavor',
    popularity: 35,
    socialStability: 40,
    mediaCredibility: 30,
    inflation: 22,
    publicDeficit: 55,
    marketConfidence: 35,
    currencyStrength: 40,
    foreignReserves: 30,
    gdpGrowth: -0.5,
    governmentSeats: 200,
    oppositionSeats: 240,
    independentSeats: 98,
  },
  crisis: {
    label: 'Crisis',
    flavorKey: 'difficulty.crisis.flavor',
    popularity: 20,
    socialStability: 25,
    mediaCredibility: 15,
    inflation: 38,
    publicDeficit: 68,
    marketConfidence: 20,
    currencyStrength: 25,
    foreignReserves: 15,
    gdpGrowth: -2.0,
    governmentSeats: 160,
    oppositionSeats: 270,
    independentSeats: 108,
  },
};

// ─── Difficulty modifiers (per-difficulty gameplay tuning) ────────────────────

export interface DifficultyModifiers {
  negativeEffectMultiplier: number;
  crisisMinTurn: number;
  impeachmentMinTurn: number;
  inflationAccelerationTurn: number;
  lifelineGuaranteeEvery: number;
}

export const DIFFICULTY_MODIFIERS: Record<string, DifficultyModifiers> = {
  easy:   { negativeEffectMultiplier: 0.5, crisisMinTurn: 8,  impeachmentMinTurn: 15, inflationAccelerationTurn: 10, lifelineGuaranteeEvery: 3 },
  normal: { negativeEffectMultiplier: 1.0, crisisMinTurn: 4,  impeachmentMinTurn: 8,  inflationAccelerationTurn: 5,  lifelineGuaranteeEvery: 6 },
  hard:   { negativeEffectMultiplier: 1.3, crisisMinTurn: 2,  impeachmentMinTurn: 5,  inflationAccelerationTurn: 3,  lifelineGuaranteeEvery: 10 },
  crisis: { negativeEffectMultiplier: 1.6, crisisMinTurn: 1,  impeachmentMinTurn: 3,  inflationAccelerationTurn: 1,  lifelineGuaranteeEvery: 99 },
};

// ─── Crisis thresholds ────────────────────────────────────────────────────────

export const CRISIS_THRESHOLDS: Record<CrisisType, Record<string, number>> = {
  debtCrisis: { publicDeficit: 70, marketConfidence: 30 },
  hyperinflationSpiral: { inflation: 40, currencyStrength: 25 },
  socialUnrest: { socialStability: 20, popularity: 15 },
  legislativeRebellion: { governmentSeats: 80, socialStability: 30 },
  impeachmentAttempt: { popularity: 10, mediaCredibility: 20, socialStability: 25 },
};

export const CRISIS_RESOLVE_TURNS: Record<CrisisType, number> = {
  debtCrisis: 4,
  hyperinflationSpiral: 3,
  socialUnrest: 5,
  legislativeRebellion: 3,
  impeachmentAttempt: 3,
};

// ─── Game over thresholds ─────────────────────────────────────────────────────

export const GAME_OVER = {
  MAX_INFLATION: 150,
  MIN_POPULARITY: 5,
  MIN_POPULARITY_STREAK: 3,
  MIN_SOCIAL_STABILITY: 0,
  MIN_FOREIGN_RESERVES: 0,
  MIN_MARKET_CONFIDENCE_FOR_BANKRUPT: 10,
  IMPEACHMENT_RESOLVE_TURNS: 3,
  MAX_TURNS: 50,
} as const;

// ─── Congress seat totals ─────────────────────────────────────────────────────

export const TOTAL_SEATS = 538;

// ─── Negotiation costs & effects ─────────────────────────────────────────────

export const NEGOTIATION_CONFIG = {
  POLITICAL_DEAL: {
    popularityDelta: -5,
    independentSupportBonus: 20,
    durationTurns: 1,
  },
  BUDGET_CONCESSION: {
    deficitDelta: 3,
    independentSupportBonus: 30,
    durationTurns: 1,
  },
  EMERGENCY_DECREE: {
    emergencyDecreeDelta: 1,
    instabilityPenaltyThreshold: 2,
    instabilityPenalty: 5,
    credibilityPenalty: 10,
    passesAutomatically: true,
  },
  COALITION_BUILDING: {
    popularityDelta: -8,
    stabilityDelta: -5,
    governmentSeatsDelta: 15,
    durationTurns: 3,
  },
} as const;

// ─── Card draw weights ────────────────────────────────────────────────────────

export const BASE_CATEGORY_WEIGHTS: Record<string, number> = {
  political: 25,
  economic: 25,
  social: 25,
  international: 20,
  crisis: 5,
};

// ─── Score multipliers ────────────────────────────────────────────────────────

export const SCORE_CONFIG = {
  TURN_MULTIPLIER: 100,
  POPULARITY_MULTIPLIER: 2,
  STABILITY_MULTIPLIER: 1.5,
  MARKET_CONFIDENCE_MULTIPLIER: 1.5,
  LAW_PASSED_BONUS: 50,
  EMERGENCY_DECREE_PENALTY: 75,
  INFLATION_PENALTY: 10,
  DEFICIT_PENALTY: 5,
} as const;
