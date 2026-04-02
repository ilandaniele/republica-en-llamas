import type { GameState, Difficulty, Language, ChoiceEffect, TurnEvent, RecurringCharacter, ScenarioId } from './types.js';
import { DIFFICULTY_PRESETS, DIFFICULTY_MODIFIERS, TOTAL_SEATS, CONGRESS_SESSION_INTERVAL, HISTORICAL_SCENARIOS } from './constants.js';
import { calculateInflationBreakdown } from './inflation.js';
import { calculateScore } from './scoring.js';
import { detectCrises, tickCrises } from './crises.js';
import { checkGameOver } from './gameOver.js';
import { rollInternationalShock, tickShocks } from './shocks.js';
import { tickMediaEffects } from './media.js';
import { drawCard, getCard, CARD_REGISTRY } from './events/index.js';
import { createRng, clamp, generateId } from './utils.js';

export function initGame(
  difficulty: Difficulty,
  seed: number,
  language: Language = 'es',
  scenarioId?: ScenarioId
): GameState {
  const preset = DIFFICULTY_PRESETS[difficulty];
  if (!preset) throw new Error(`Unknown difficulty: ${difficulty}`);

  const scenario = scenarioId ? HISTORICAL_SCENARIOS[scenarioId] : undefined;

  // Merge scenario stat overrides on top of difficulty preset
  const pop = scenario?.popularity ?? preset.popularity;
  const stability = scenario?.socialStability ?? preset.socialStability;
  const credibility = scenario?.mediaCredibility ?? preset.mediaCredibility;
  const inflation = scenario?.inflation ?? preset.inflation;
  const deficit = scenario?.publicDeficit ?? preset.publicDeficit;
  const confidence = scenario?.marketConfidence ?? preset.marketConfidence;
  const currency = scenario?.currencyStrength ?? preset.currencyStrength;
  const reserves = scenario?.foreignReserves ?? preset.foreignReserves;
  const gdp = scenario?.gdpGrowth ?? preset.gdpGrowth;
  const govSeats = scenario?.governmentSeats ?? preset.governmentSeats;
  const oppSeats = scenario?.oppositionSeats ?? preset.oppositionSeats;
  const independentSeats = TOTAL_SEATS - govSeats - oppSeats;

  // Scenario flag pushed to first character so requiredFlags cards can filter
  const scenarioFlag = scenarioId ? `scenario_${scenarioId}` : null;
  const initialCharacters: RecurringCharacter[] = INITIAL_CHARACTERS.map((c, i) =>
    i === 0 && scenarioFlag ? { ...c, memoryFlags: [scenarioFlag] } : c
  );

  // Historical scenario opening shocks
  const openingShocks = scenarioId ? getScenarioOpeningShocks(scenarioId) : [];

  return {
    id: generateId('run', createRng(seed)),
    seed,
    difficulty,
    ...(scenarioId !== undefined ? { activeScenario: scenarioId } : {}),
    turn: 1,
    language,
    political: {
      popularity: pop,
      socialStability: stability,
      mediaCredibility: credibility,
      emergencyDecreesUsed: 0,
      popularityLowStreak: 0,
    },
    economic: {
      inflation,
      publicDeficit: deficit,
      marketConfidence: confidence,
      currencyStrength: currency,
      foreignReserves: reserves,
      gdpGrowth: gdp,
    },
    congress: {
      governmentSeats: govSeats,
      oppositionSeats: oppSeats,
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
    activeShocks: openingShocks,
    drawnCardIds: [],
    history: [],
    isGameOver: false,
    gameOverReason: null,
    score: 0,
    characters: initialCharacters,
    cardCooldowns: {},
  };
}

const INITIAL_CHARACTERS: RecurringCharacter[] = [
  { id: 'ministro',    name: 'Luis Caputo',        role: 'Ministro de Economía',          avatar: '💼', relationship: 0, memoryFlags: [] },
  { id: 'sindicalista',name: 'Pablo Moyano',        role: 'Líder de Camioneros',           avatar: '✊', relationship: 0, memoryFlags: [] },
  { id: 'periodista',  name: 'Cristina Pérez',      role: 'Periodista de Investigación',   avatar: '📰', relationship: 0, memoryFlags: [] },
  { id: 'embajador',   name: 'Kristalina Georgieva',role: 'Directora del FMI',             avatar: '🌐', relationship: 0, memoryFlags: [] },
  { id: 'gobernadora', name: 'Axel Kicillof',       role: 'Gobernador de Buenos Aires',    avatar: '🏛', relationship: 0, memoryFlags: [] },
];

function getScenarioOpeningShocks(scenarioId: ScenarioId): import('./types.js').Shock[] {
  const shockMap: Record<ScenarioId, import('./types.js').Shock[]> = {
    hiperinflacion_1989: [
      { id: 'shock_hiper_saqueos', name: 'shock.hiper.saqueos', turnsRemaining: 3, inflationMod: 8, marketConfidenceMod: -20, deficitMod: 5, popularityMod: -25 },
      { id: 'shock_hiper_alfonsinexit', name: 'shock.hiper.alfonsinexit', turnsRemaining: 2, inflationMod: 5, marketConfidenceMod: -25, deficitMod: 5, popularityMod: -30 },
    ],
    corralito_2001: [
      { id: 'shock_corralito_freeze', name: 'shock.corralito.freeze', turnsRemaining: 4, inflationMod: 3, marketConfidenceMod: -30, deficitMod: 5, popularityMod: -20 },
      { id: 'shock_corralito_default', name: 'shock.corralito.default', turnsRemaining: 3, inflationMod: 2, marketConfidenceMod: -35, deficitMod: 0, popularityMod: -25 },
    ],
    convertibilidad: [
      { id: 'shock_convertib_overvalued', name: 'shock.convertib.overvalued', turnsRemaining: 3, inflationMod: -5, marketConfidenceMod: 10, deficitMod: 8, popularityMod: 0 },
      { id: 'shock_convertib_recession', name: 'shock.convertib.recession', turnsRemaining: 3, inflationMod: 0, marketConfidenceMod: -10, deficitMod: 10, popularityMod: -15 },
    ],
    rodrigazo_1975: [
      { id: 'shock_rodrigazo_huelga', name: 'shock.rodrigazo.huelga', turnsRemaining: 2, inflationMod: 0, marketConfidenceMod: -10, deficitMod: 5, popularityMod: -20 },
      { id: 'shock_rodrigazo_tarifazo', name: 'shock.rodrigazo.tarifazo', turnsRemaining: 1, inflationMod: 30, marketConfidenceMod: -20, deficitMod: 0, popularityMod: -25 },
    ],
    malvinas_1982: [
      { id: 'shock_malvinas_guerra', name: 'shock.malvinas.guerra', turnsRemaining: 5, inflationMod: 5, marketConfidenceMod: -15, deficitMod: 10, popularityMod: 10 },
      { id: 'shock_malvinas_derrota', name: 'shock.malvinas.derrota', turnsRemaining: 3, inflationMod: 10, marketConfidenceMod: -25, deficitMod: 8, popularityMod: -40 },
    ],
    kirchnerismo_boom: [
      { id: 'shock_kirchner_vientocola', name: 'shock.kirchner.vientocola', turnsRemaining: 8, inflationMod: 3, marketConfidenceMod: 20, deficitMod: -5, popularityMod: 15 },
      { id: 'shock_kirchner_inflsubestimada', name: 'shock.kirchner.inflsubestimada', turnsRemaining: 4, inflationMod: 25, marketConfidenceMod: -20, deficitMod: 5, popularityMod: 0 },
    ],
  };
  return shockMap[scenarioId] ?? [];
}

function applyScenarioMechanics(state: GameState): GameState {
  if (!state.activeScenario) return state;
  let s = state;

  switch (s.activeScenario) {
    case 'hiperinflacion_1989':
      // Inflation compounds every turn
      s = {
        ...s,
        economic: {
          ...s.economic,
          inflation: clamp(s.economic.inflation + Math.floor(s.economic.inflation * 0.02), 0, 200),
        },
      };
      break;

    case 'corralito_2001':
      // Reserves permanently capped
      s = {
        ...s,
        economic: {
          ...s.economic,
          foreignReserves: Math.min(s.economic.foreignReserves, 5),
        },
      };
      break;

    case 'convertibilidad':
      // Inflation frozen at 0, but reserves drain
      s = {
        ...s,
        economic: {
          ...s.economic,
          inflation: 0,
          foreignReserves: clamp(s.economic.foreignReserves - 3, 0, 100),
        },
      };
      break;

    case 'rodrigazo_1975':
      // One-time tarifazo on turn 1
      if (s.turn === 1) {
        s = {
          ...s,
          economic: {
            ...s.economic,
            publicDeficit: clamp(s.economic.publicDeficit + 40, 0, 100),
          },
          political: {
            ...s.political,
            popularity: clamp(s.political.popularity - 40, 0, 100),
          },
        };
      }
      break;

    case 'malvinas_1982':
      // Popularity surge while war continues, then collapse
      if (s.turn <= 3) {
        s = {
          ...s,
          political: {
            ...s.political,
            popularity: clamp(s.political.popularity + 20, 0, 100),
          },
        };
      } else {
        s = {
          ...s,
          political: {
            ...s.political,
            popularity: clamp(s.political.popularity - 15, 0, 100),
          },
        };
      }
      break;

    case 'kirchnerismo_boom':
      // Kirchner positive boom handled at effect-application level — no per-turn override here
      break;
  }

  return s;
}

export function applyChoice(
  state: GameState,
  cardId: string,
  choiceIndex: number
): GameState {
  const card = getCard(cardId);
  const choice = card.choices[choiceIndex];
  if (!choice) throw new Error(`Choice ${choiceIndex} not found on card ${cardId}`);

  let s = applyEffects(state, choice.effects);

  // Track card as drawn + record cooldown
  s = {
    ...s,
    drawnCardIds: [...s.drawnCardIds, cardId],
    cardCooldowns: { ...s.cardCooldowns, [cardId]: s.turn },
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

  // Apply scenario-specific per-turn mechanics
  s = applyScenarioMechanics(s);

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

  // Every CONGRESS_SESSION_INTERVAL turns, force a rotating session law card
  if (state.turn > 1 && state.turn % CONGRESS_SESSION_INTERVAL === 0) {
    const lawIndex = (Math.floor((state.turn - 1) / CONGRESS_SESSION_INTERVAL)) % 5;
    const sessionLawId = `session_law_00${lawIndex + 1}`;
    const sessionCard = CARD_REGISTRY.get(sessionLawId);
    if (sessionCard) return sessionCard;
  }

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

/** Apply raw ChoiceEffect to a GameState with difficulty scaling. */
export function applyChoiceEffects(state: GameState, effects: ChoiceEffect): GameState {
  return applyEffects(state, effects);
}

function applyEffects(state: GameState, effects: ChoiceEffect): GameState {
  const mod = DIFFICULTY_MODIFIERS[state.difficulty] ?? DIFFICULTY_MODIFIERS['normal']!;
  const m = mod.negativeEffectMultiplier;
  // Scale bad outcomes: negative deltas on "higher is better" vars, positive on "lower is better" vars
  const scaleNeg = (v: number | undefined) => !v ? 0 : v < 0 ? v * m : v;
  const scalePos = (v: number | undefined) => !v ? 0 : v > 0 ? v * m : v;

  // Kirchnerismo Boom: multiply positive economic effects by 1.5 for turns 1-8
  const kirchBoost =
    state.activeScenario === 'kirchnerismo_boom' && state.turn <= 8
      ? 1.5
      : 1.0;
  const kirchPos = (v: number | undefined): number => {
    if (!v) return 0;
    return v > 0 ? v * kirchBoost : v;
  };

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
      marketConfidence: clamp(state.economic.marketConfidence + kirchPos(scaleNeg(effects.marketConfidenceDelta)), 0, 100),
      currencyStrength: clamp(state.economic.currencyStrength + kirchPos(scaleNeg(effects.currencyStrengthDelta)), 0, 100),
      foreignReserves: clamp(state.economic.foreignReserves + kirchPos(scaleNeg(effects.foreignReservesDelta)), 0, 100),
      gdpGrowth: clamp(state.economic.gdpGrowth + kirchPos(scaleNeg(effects.gdpGrowthDelta)), -10, 10),
    },
    congress: {
      ...state.congress,
      governmentSeats: clamp(state.congress.governmentSeats + scaleNeg(effects.governmentSeatsDelta), 0, TOTAL_SEATS),
      lawsPassedThisRun: state.congress.lawsPassedThisRun + (effects.lawsPassedDelta ?? 0),
    },
  };
}
