import type { GameState, Difficulty, Language, ChoiceEffect, TurnEvent, RecurringCharacter } from './types.js';
import { DIFFICULTY_PRESETS, DIFFICULTY_MODIFIERS, TOTAL_SEATS } from './constants.js';
import { calculateInflationBreakdown } from './inflation.js';
import { calculateScore } from './scoring.js';
import { detectCrises, tickCrises } from './crises.js';
import { checkGameOver } from './gameOver.js';
import { rollInternationalShock, tickShocks } from './shocks.js';
import { tickMediaEffects } from './media.js';
import { drawCard, getCard } from './events/index.js';
import { createRng, clamp, generateId } from './utils.js';

export function initGame(
  difficulty: Difficulty,
  seed: number,
  language: Language = 'es'
): GameState {
  const preset = DIFFICULTY_PRESETS[difficulty];
  if (!preset) throw new Error(`Unknown difficulty: ${difficulty}`);

  const governmentSeats = preset.governmentSeats;
  const oppositionSeats = preset.oppositionSeats;
  const independentSeats = TOTAL_SEATS - governmentSeats - oppositionSeats;

  return {
    id: generateId('run', createRng(seed)),
    seed,
    difficulty,
    turn: 1,
    language,
    political: {
      popularity: preset.popularity,
      socialStability: preset.socialStability,
      mediaCredibility: preset.mediaCredibility,
      emergencyDecreesUsed: 0,
      popularityLowStreak: 0,
    },
    economic: {
      inflation: preset.inflation,
      publicDeficit: preset.publicDeficit,
      marketConfidence: preset.marketConfidence,
      currencyStrength: preset.currencyStrength,
      foreignReserves: preset.foreignReserves,
      gdpGrowth: preset.gdpGrowth,
    },
    congress: {
      governmentSeats,
      oppositionSeats,
      independentSeats,
      coalitionTurnsRemaining: 0,
      independentSupportBonus: 0,
      lawsPassedThisRun: 0,
      pendingVote: null,
    },
    media: {
      currentHeadline: '',
      sentiment: 0,
      activeSpins: [],
    },
    activeCrises: [],
    activeShocks: [],
    drawnCardIds: [],
    history: [],
    isGameOver: false,
    gameOverReason: null,
    score: 0,
    characters: INITIAL_CHARACTERS,
  };
}

const INITIAL_CHARACTERS: RecurringCharacter[] = [
  { id: 'ministro',    name: 'Luis Caputo',        role: 'Ministro de Economía',          avatar: '💼', relationship: 0, memoryFlags: [] },
  { id: 'sindicalista',name: 'Pablo Moyano',        role: 'Líder de Camioneros',           avatar: '✊', relationship: 0, memoryFlags: [] },
  { id: 'periodista',  name: 'Cristina Pérez',      role: 'Periodista de Investigación',   avatar: '📰', relationship: 0, memoryFlags: [] },
  { id: 'embajador',   name: 'Kristalina Georgieva',role: 'Directora del FMI',             avatar: '🌐', relationship: 0, memoryFlags: [] },
  { id: 'gobernadora', name: 'Axel Kicillof',       role: 'Gobernador de Buenos Aires',    avatar: '🏛', relationship: 0, memoryFlags: [] },
];

export function applyChoice(
  state: GameState,
  cardId: string,
  choiceIndex: number
): GameState {
  const card = getCard(cardId);
  const choice = card.choices[choiceIndex];
  if (!choice) throw new Error(`Choice ${choiceIndex} not found on card ${cardId}`);

  let s = applyEffects(state, choice.effects);

  // Track card as drawn
  s = {
    ...s,
    drawnCardIds: [...s.drawnCardIds, cardId],
  };

  // Apply character memory if this is a character card
  if (card.characterId) {
    s = applyCharacterMemory(s, card.characterId, card.memoryFlagAdded, choice.effects);
  }

  // Record turn event
  const event: TurnEvent = {
    turn: s.turn,
    cardId,
    choiceIndex,
    effectsApplied: choice.effects,
  };

  s = {
    ...s,
    history: [...s.history, event],
  };

  return s;
}

function applyCharacterMemory(
  state: GameState,
  characterId: string,
  flagToAdd: string | undefined,
  effects: ChoiceEffect
): GameState {
  const characters = state.characters.map((char) => {
    if (char.id !== characterId) return char;
    const relDelta = (effects.popularityDelta ?? 0) > 0 ? 10 : -10;
    const newFlags = flagToAdd ? [...char.memoryFlags, flagToAdd] : char.memoryFlags;
    return {
      ...char,
      relationship: clamp(char.relationship + relDelta, -100, 100),
      memoryFlags: newFlags,
    };
  });
  return { ...state, characters };
}

export function advanceTurn(state: GameState): GameState {
  let s = { ...state };

  // Tick time-based effects
  s = tickShocks(s);
  s = tickMediaEffects(s);
  s = tickCrises(s);

  // Tick coalition
  if (s.congress.coalitionTurnsRemaining > 0) {
    s = {
      ...s,
      congress: {
        ...s.congress,
        coalitionTurnsRemaining: s.congress.coalitionTurnsRemaining - 1,
      },
    };
  }

  // Reset per-turn independent support bonus
  s = {
    ...s,
    congress: {
      ...s.congress,
      independentSupportBonus: 0,
    },
  };

  // Apply new inflation (capture breakdown for UI)
  const breakdown = calculateInflationBreakdown(s);
  s = {
    ...s,
    economic: {
      ...s.economic,
      inflation: breakdown.newInflation,
    },
    lastInflationBreakdown: breakdown,
  };

  // Apply shock effects to economic vars
  for (const shock of s.activeShocks) {
    s = {
      ...s,
      economic: {
        ...s.economic,
        marketConfidence: clamp(s.economic.marketConfidence + shock.marketConfidenceMod * 0.1, 0, 100),
        publicDeficit: clamp(s.economic.publicDeficit + shock.deficitMod * 0.1, 0, 100),
      },
      political: {
        ...s.political,
        popularity: clamp(s.political.popularity + shock.popularityMod * 0.1, 0, 100),
      },
    };
  }

  // Roll international shock
  const rng = createRng(s.seed + s.turn * 1000);
  const newShock = rollInternationalShock(s.turn, rng);
  if (newShock) {
    s = { ...s, activeShocks: [...s.activeShocks, newShock] };
  }

  // Update popularity low streak
  const isLow = s.political.popularity < 5;
  s = {
    ...s,
    political: {
      ...s.political,
      popularityLowStreak: isLow ? s.political.popularityLowStreak + 1 : 0,
    },
  };

  // Detect new crises
  const newCrises = detectCrises(s);
  if (newCrises.length > 0) {
    s = { ...s, activeCrises: [...s.activeCrises, ...newCrises] };
  }

  // Advance turn counter
  s = { ...s, turn: s.turn + 1 };

  // Check game over
  const gameOverResult = checkGameOver(s);
  if (gameOverResult) {
    s = {
      ...s,
      isGameOver: true,
      gameOverReason: gameOverResult.reason,
      score: gameOverResult.score,
    };
  } else {
    s = { ...s, score: calculateScore(s) };
  }

  return s;
}

export function drawNextCard(state: GameState): ReturnType<typeof drawCard> {
  const mod = DIFFICULTY_MODIFIERS[state.difficulty] ?? DIFFICULTY_MODIFIERS['normal']!;
  const rng = createRng(state.seed + state.turn * 777);
  // Guarantee a lifeline card every N turns (easy/normal only)
  const forceLifeline =
    state.turn > 1 &&
    mod.lifelineGuaranteeEvery < 99 &&
    state.turn % mod.lifelineGuaranteeEvery === 0;
  return drawCard(state, rng, forceLifeline);
}

/**
 * Returns the index of the choice with the lowest total negative impact.
 * Used by the easy-mode advisor (⭐ indicator).
 */
export function getSafestChoiceIndex(card: { choices: Array<{ effects: ChoiceEffect }> }): number {
  if (card.choices.length === 0) return 0;
  let safest = 0;
  let lowestDanger = Infinity;
  for (let i = 0; i < card.choices.length; i++) {
    const e = card.choices[i]!.effects;
    const danger =
      Math.min(0, e.popularityDelta ?? 0) * -1 +
      Math.min(0, e.stabilityDelta ?? 0) * -1 +
      Math.min(0, e.mediaCredibilityDelta ?? 0) * -1 +
      Math.min(0, e.marketConfidenceDelta ?? 0) * -1 +
      Math.min(0, e.currencyStrengthDelta ?? 0) * -1 +
      Math.min(0, e.foreignReservesDelta ?? 0) * -1 +
      Math.min(0, e.gdpGrowthDelta ?? 0) * -1 +
      Math.max(0, e.inflationDelta ?? 0) +
      Math.max(0, e.deficitDelta ?? 0);
    if (danger < lowestDanger) {
      lowestDanger = danger;
      safest = i;
    }
  }
  return safest;
}

function applyEffects(state: GameState, effects: ChoiceEffect): GameState {
  const mod = DIFFICULTY_MODIFIERS[state.difficulty] ?? DIFFICULTY_MODIFIERS['normal']!;
  const m = mod.negativeEffectMultiplier;
  // Scale bad outcomes: negative deltas on "higher is better" vars, positive on "lower is better" vars
  const scaleNeg = (v: number | undefined) => !v ? 0 : v < 0 ? v * m : v;
  const scalePos = (v: number | undefined) => !v ? 0 : v > 0 ? v * m : v;
  return {
    ...state,
    political: {
      ...state.political,
      popularity: clamp(state.political.popularity + scaleNeg(effects.popularityDelta), 0, 100),
      socialStability: clamp(state.political.socialStability + scaleNeg(effects.stabilityDelta), 0, 100),
      mediaCredibility: clamp(state.political.mediaCredibility + scaleNeg(effects.mediaCredibilityDelta), 0, 100),
      emergencyDecreesUsed: state.political.emergencyDecreesUsed + (effects.emergencyDecreeDelta ?? 0),
    },
    economic: {
      ...state.economic,
      inflation: clamp(state.economic.inflation + scalePos(effects.inflationDelta), 0, 200),
      publicDeficit: clamp(state.economic.publicDeficit + scalePos(effects.deficitDelta), 0, 100),
      marketConfidence: clamp(state.economic.marketConfidence + scaleNeg(effects.marketConfidenceDelta), 0, 100),
      currencyStrength: clamp(state.economic.currencyStrength + scaleNeg(effects.currencyStrengthDelta), 0, 100),
      foreignReserves: clamp(state.economic.foreignReserves + scaleNeg(effects.foreignReservesDelta), 0, 100),
      gdpGrowth: clamp(state.economic.gdpGrowth + scaleNeg(effects.gdpGrowthDelta), -10, 10),
    },
    congress: {
      ...state.congress,
      governmentSeats: clamp(state.congress.governmentSeats + scaleNeg(effects.governmentSeatsDelta), 0, TOTAL_SEATS),
      lawsPassedThisRun: state.congress.lawsPassedThisRun + (effects.lawsPassedDelta ?? 0),
    },
  };
}
