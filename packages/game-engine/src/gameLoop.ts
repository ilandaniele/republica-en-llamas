import type {
  GameState,
  Difficulty,
  Language,
  ChoiceEffect,
  TurnEvent,
  RecurringCharacter,
  ScenarioId,
  ScenarioCalendar,
} from './types.js';
import {
  DIFFICULTY_PRESETS,
  DIFFICULTY_MODIFIERS,
  TOTAL_SEATS,
  CONGRESS_SESSION_INTERVAL,
  PRESIDENTIAL_ELECTION_TURN,
  HISTORICAL_SCENARIOS,
  SCENARIO_CALENDARS,
  SCENARIO_ARCS,
} from './constants.js';
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
  scenarioId?: ScenarioId,
): GameState {
  const preset = DIFFICULTY_PRESETS[difficulty];
  if (!preset) throw new Error(`Unknown difficulty: ${difficulty}`);

  const scenario = scenarioId ? HISTORICAL_SCENARIOS[scenarioId] : undefined;

  // Scenario starting stats replace the difficulty preset
  const stats = scenario ?? preset;
  // Add ±8 random variance to starting congress composition (seeded for determinism)
  const congrRng = createRng(seed + 77);
  const congrVariance = Math.floor((congrRng() - 0.5) * 16);
  const finalGovSeats = clamp(stats.governmentSeats + congrVariance, 50, 480);
  const independentSeats = TOTAL_SEATS - finalGovSeats - stats.oppositionSeats;

  const initialCharacters = initialCharactersFor(scenarioId);
  const openingShocks = scenarioId ? getScenarioOpeningShocks(scenarioId) : [];

  const calendar = calendarFor(scenarioId);

  return {
    id: generateId('run', createRng(seed)),
    seed,
    difficulty,
    ...(scenarioId !== undefined ? { activeScenario: scenarioId } : {}),
    turn: 1,
    language,
    political: {
      popularity: stats.popularity,
      socialStability: stats.socialStability,
      mediaCredibility: stats.mediaCredibility,
      emergencyDecreesUsed: 0,
      popularityLowStreak: 0,
    },
    economic: {
      inflation: stats.inflation,
      publicDeficit: stats.publicDeficit,
      marketConfidence: stats.marketConfidence,
      currencyStrength: stats.currencyStrength,
      foreignReserves: stats.foreignReserves,
      gdpGrowth: stats.gdpGrowth,
    },
    congress: {
      governmentSeats: finalGovSeats,
      oppositionSeats: stats.oppositionSeats,
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
    currentMonth: calendar.startMonth,
    currentYear: calendar.startYear,
    characters: initialCharacters,
    cardCooldowns: {},
    scenarioArcPhase: 0,
    deflationStreakTurns: 0,
    positiveStreak: 0,
  };
}

const DEFAULT_CALENDAR: ScenarioCalendar = { startMonth: 1, startYear: 2024, turnsPerMonth: 3 };

function calendarFor(scenarioId: ScenarioId | undefined): ScenarioCalendar {
  return scenarioId ? SCENARIO_CALENDARS[scenarioId] : DEFAULT_CALENDAR;
}

// Scenario flag pushed to first character so requiredFlags cards can filter
function initialCharactersFor(scenarioId: ScenarioId | undefined): RecurringCharacter[] {
  if (!scenarioId) return INITIAL_CHARACTERS;
  const scenarioFlag = `scenario_${scenarioId}`;
  return INITIAL_CHARACTERS.map((c, i) => (i === 0 ? { ...c, memoryFlags: [scenarioFlag] } : c));
}

const INITIAL_CHARACTERS: RecurringCharacter[] = [
  {
    id: 'ministro',
    name: 'Luis Caputo',
    role: 'Ministro de Economía',
    avatar: '💼',
    relationship: 0,
    memoryFlags: [],
  },
  {
    id: 'sindicalista',
    name: 'Pablo Moyano',
    role: 'Líder de Camioneros',
    avatar: '✊',
    relationship: 0,
    memoryFlags: [],
  },
  {
    id: 'periodista',
    name: 'Cristina Pérez',
    role: 'Periodista de Investigación',
    avatar: '📰',
    relationship: 0,
    memoryFlags: [],
  },
  {
    id: 'embajador',
    name: 'Kristalina Georgieva',
    role: 'Directora del FMI',
    avatar: '🌐',
    relationship: 0,
    memoryFlags: [],
  },
  {
    id: 'gobernadora',
    name: 'Axel Kicillof',
    role: 'Gobernador de Buenos Aires',
    avatar: '🏛',
    relationship: 0,
    memoryFlags: [],
  },
];

function getScenarioOpeningShocks(scenarioId: ScenarioId): import('./types.js').Shock[] {
  const shockMap: Record<ScenarioId, import('./types.js').Shock[]> = {
    hiperinflacion_1989: [
      {
        id: 'shock_hiper_saqueos',
        name: 'shock.hiper.saqueos',
        turnsRemaining: 3,
        inflationMod: 8,
        marketConfidenceMod: -20,
        deficitMod: 5,
        popularityMod: -25,
      },
      {
        id: 'shock_hiper_alfonsinexit',
        name: 'shock.hiper.alfonsinexit',
        turnsRemaining: 2,
        inflationMod: 5,
        marketConfidenceMod: -25,
        deficitMod: 5,
        popularityMod: -30,
      },
    ],
    corralito_2001: [
      {
        id: 'shock_corralito_freeze',
        name: 'shock.corralito.freeze',
        turnsRemaining: 4,
        inflationMod: 3,
        marketConfidenceMod: -30,
        deficitMod: 5,
        popularityMod: -20,
      },
      {
        id: 'shock_corralito_default',
        name: 'shock.corralito.default',
        turnsRemaining: 3,
        inflationMod: 2,
        marketConfidenceMod: -35,
        deficitMod: 0,
        popularityMod: -25,
      },
    ],
    convertibilidad: [
      {
        id: 'shock_convertib_overvalued',
        name: 'shock.convertib.overvalued',
        turnsRemaining: 3,
        inflationMod: -5,
        marketConfidenceMod: 10,
        deficitMod: 8,
        popularityMod: 0,
      },
      {
        id: 'shock_convertib_recession',
        name: 'shock.convertib.recession',
        turnsRemaining: 3,
        inflationMod: 0,
        marketConfidenceMod: -10,
        deficitMod: 10,
        popularityMod: -15,
      },
    ],
    rodrigazo_1975: [
      {
        id: 'shock_rodrigazo_huelga',
        name: 'shock.rodrigazo.huelga',
        turnsRemaining: 2,
        inflationMod: 0,
        marketConfidenceMod: -10,
        deficitMod: 5,
        popularityMod: -20,
      },
      {
        id: 'shock_rodrigazo_tarifazo',
        name: 'shock.rodrigazo.tarifazo',
        turnsRemaining: 1,
        inflationMod: 30,
        marketConfidenceMod: -20,
        deficitMod: 0,
        popularityMod: -25,
      },
    ],
    malvinas_1982: [
      {
        id: 'shock_malvinas_guerra',
        name: 'shock.malvinas.guerra',
        turnsRemaining: 5,
        inflationMod: 5,
        marketConfidenceMod: -15,
        deficitMod: 10,
        popularityMod: 10,
      },
      {
        id: 'shock_malvinas_derrota',
        name: 'shock.malvinas.derrota',
        turnsRemaining: 3,
        inflationMod: 10,
        marketConfidenceMod: -25,
        deficitMod: 8,
        popularityMod: -40,
      },
    ],
    kirchnerismo_boom: [
      {
        id: 'shock_kirchner_vientocola',
        name: 'shock.kirchner.vientocola',
        turnsRemaining: 8,
        inflationMod: 3,
        marketConfidenceMod: 20,
        deficitMod: -5,
        popularityMod: 15,
      },
      {
        id: 'shock_kirchner_inflsubestimada',
        name: 'shock.kirchner.inflsubestimada',
        turnsRemaining: 4,
        inflationMod: 25,
        marketConfidenceMod: -20,
        deficitMod: 5,
        popularityMod: 0,
      },
    ],
    libertad_avanza_2023: [
      {
        id: 'shock_lla_herencia',
        name: 'shock.lla.herencia',
        turnsRemaining: 4,
        inflationMod: 15,
        marketConfidenceMod: -15,
        deficitMod: 5,
        popularityMod: -10,
      },
      {
        id: 'shock_lla_devaluacion',
        name: 'shock.lla.devaluacion',
        turnsRemaining: 3,
        inflationMod: 20,
        marketConfidenceMod: 10,
        deficitMod: -5,
        popularityMod: -20,
      },
    ],
    guerra_ucrania_2022: [
      {
        id: 'shock_ucrania_invasion',
        name: 'shock.ucrania.invasion',
        turnsRemaining: 5,
        inflationMod: 8,
        marketConfidenceMod: -25,
        deficitMod: 8,
        popularityMod: -5,
      },
      {
        id: 'shock_ucrania_energia',
        name: 'shock.ucrania.energia',
        turnsRemaining: 4,
        inflationMod: 6,
        marketConfidenceMod: -15,
        deficitMod: 5,
        popularityMod: -10,
      },
    ],
    conflicto_iran_2024: [
      {
        id: 'shock_iran_petroleo',
        name: 'shock.iran.petroleo',
        turnsRemaining: 4,
        inflationMod: 10,
        marketConfidenceMod: -20,
        deficitMod: 6,
        popularityMod: -8,
      },
      {
        id: 'shock_iran_misiles',
        name: 'shock.iran.misiles',
        turnsRemaining: 3,
        inflationMod: 5,
        marketConfidenceMod: -30,
        deficitMod: 4,
        popularityMod: -15,
      },
    ],
  };
  return shockMap[scenarioId] ?? [];
}

function withEconomic(s: GameState, economic: Partial<GameState['economic']>): GameState {
  return { ...s, economic: { ...s.economic, ...economic } };
}

function withPolitical(s: GameState, political: Partial<GameState['political']>): GameState {
  return { ...s, political: { ...s.political, ...political } };
}

// Per-turn mechanics of each historical scenario. kirchnerismo_boom is handled at effect-application level.
const SCENARIO_MECHANICS: Partial<Record<ScenarioId, (s: GameState) => GameState>> = {
  // Inflation compounds every turn
  hiperinflacion_1989: (s) =>
    withEconomic(s, {
      inflation: clamp(s.economic.inflation + Math.floor(s.economic.inflation * 0.02), 0, 200),
    }),
  // Reserves permanently capped
  corralito_2001: (s) => withEconomic(s, { foreignReserves: Math.min(s.economic.foreignReserves, 5) }),
  // Inflation frozen at 0, but reserves drain
  convertibilidad: (s) =>
    withEconomic(s, { inflation: 0, foreignReserves: clamp(s.economic.foreignReserves - 3, 0, 100) }),
  // One-time tarifazo on turn 1
  rodrigazo_1975: (s) =>
    s.turn === 1
      ? withPolitical(withEconomic(s, { publicDeficit: clamp(s.economic.publicDeficit + 40, 0, 100) }), {
          popularity: clamp(s.political.popularity - 40, 0, 100),
        })
      : s,
  // Popularity surge while war continues, then collapse
  malvinas_1982: (s) =>
    withPolitical(s, { popularity: clamp(s.political.popularity + (s.turn <= 3 ? 20 : -15), 0, 100) }),
  // Motosierra: each turn cuts deficit but hits popularity
  libertad_avanza_2023: (s) =>
    withPolitical(withEconomic(s, { publicDeficit: clamp(s.economic.publicDeficit - 1.5, 0, 100) }), {
      popularity: clamp(s.political.popularity - 1, 0, 100),
    }),
  // Energy import cost drains reserves every turn
  guerra_ucrania_2022: (s) =>
    withEconomic(s, {
      foreignReserves: clamp(s.economic.foreignReserves - 2, 0, 100),
      inflation: clamp(s.economic.inflation + 0.5, -20, 200),
    }),
  // Oil price pressure adds inflation each turn
  conflicto_iran_2024: (s) =>
    withEconomic(s, {
      inflation: clamp(s.economic.inflation + 1.5, -20, 200),
      marketConfidence: clamp(s.economic.marketConfidence - 0.5, 0, 100),
    }),
};

function applyScenarioMechanics(state: GameState): GameState {
  const mechanic = state.activeScenario ? SCENARIO_MECHANICS[state.activeScenario] : undefined;
  return mechanic ? mechanic(state) : state;
}

export function applyChoice(state: GameState, cardId: string, choiceIndex: number): GameState {
  const card = getCard(cardId);
  const choice = card.choices[choiceIndex];
  if (!choice) throw new Error(`Choice ${choiceIndex} not found on card ${cardId}`);

  // Instant game over — skip normal effect application
  // Special case: election_loss enters lame-duck mode instead of ending the game
  if (choice.instantGameOver) {
    if (choice.instantGameOver === 'election_loss') {
      // Enter 8-turn lame duck survival mode
      const newState: GameState = {
        ...state,
        drawnCardIds: [...state.drawnCardIds, cardId],
        cardCooldowns: { ...state.cardCooldowns, [cardId]: state.turn },
        history: [
          ...state.history,
          { turn: state.turn, cardId, choiceIndex, effectsApplied: choice.effects },
        ],
        lameDuckMode: true,
        lameDuckTurnsRemaining: 8,
        political: {
          ...state.political,
          popularity: clamp(state.political.popularity - 15, 0, 100),
          socialStability: clamp(state.political.socialStability - 10, 0, 100),
        },
        economic: {
          ...state.economic,
          publicDeficit: clamp(state.economic.publicDeficit + 5, 0, 100),
        },
      };
      return newState;
    }
    return {
      ...state,
      drawnCardIds: [...state.drawnCardIds, cardId],
      cardCooldowns: { ...state.cardCooldowns, [cardId]: state.turn },
      history: [...state.history, { turn: state.turn, cardId, choiceIndex, effectsApplied: choice.effects }],
      isGameOver: true,
      gameOverReason: choice.instantGameOver,
    };
  }

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
  } else if (card.memoryFlagAdded && s.characters.length > 0) {
    // Non-character chained card: store global flag on first character so requiredFlags checks find it
    s = {
      ...s,
      characters: s.characters.map((char, i) =>
        i === 0 ? { ...char, memoryFlags: [...char.memoryFlags, card.memoryFlagAdded!] } : char,
      ),
    };
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
  effects: ChoiceEffect,
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
  let s = tickCrises(tickMediaEffects(tickShocks({ ...state })));
  s = tickCongress(s);
  s = applyInflation(s);
  s = applyScenarioMechanics(s);
  s = applyShockEffects(s);
  s = rollNewShock(s);
  s = updateStreaks(state, s);

  // Lame duck mode: apply per-turn penalties; game over when countdown reaches zero
  if (s.lameDuckMode) {
    s = applyLameDuckPenalty(s);
    if ((s.lameDuckTurnsRemaining ?? 0) <= 0) {
      return { ...s, isGameOver: true, gameOverReason: 'election_loss', score: calculateScore(s) };
    }
  }

  s = advanceArcPhase(s);

  const newCrises = detectCrises(s);
  if (newCrises.length > 0) {
    s = { ...s, activeCrises: [...s.activeCrises, ...newCrises] };
  }

  return settleScore(advanceCalendar(s));
}

// Ticks the coalition countdown and resets the per-turn independent support bonus
function tickCongress(s: GameState): GameState {
  const { coalitionTurnsRemaining } = s.congress;
  return {
    ...s,
    congress: {
      ...s.congress,
      coalitionTurnsRemaining:
        coalitionTurnsRemaining > 0 ? coalitionTurnsRemaining - 1 : coalitionTurnsRemaining,
      independentSupportBonus: 0,
    },
  };
}

// Applies the new inflation and keeps its breakdown for the UI
function applyInflation(s: GameState): GameState {
  const breakdown = calculateInflationBreakdown(s);
  return { ...withEconomic(s, { inflation: breakdown.newInflation }), lastInflationBreakdown: breakdown };
}

function applyShockEffects(state: GameState): GameState {
  let s = state;
  for (const shock of s.activeShocks) {
    s = withPolitical(
      withEconomic(s, {
        marketConfidence: clamp(s.economic.marketConfidence + shock.marketConfidenceMod * 0.1, 0, 100),
        publicDeficit: clamp(s.economic.publicDeficit + shock.deficitMod * 0.1, 0, 100),
      }),
      { popularity: clamp(s.political.popularity + shock.popularityMod * 0.1, 0, 100) },
    );
  }
  return s;
}

function rollNewShock(s: GameState): GameState {
  const rng = createRng(s.seed + s.turn * 1000);
  const newShock = rollInternationalShock(s.turn, rng);
  return newShock ? { ...s, activeShocks: [...s.activeShocks, newShock] } : s;
}

// A good turn moves every key metric in the right direction compared with the previous turn
function isGoodTurn(prev: GameState, s: GameState): boolean {
  return (
    s.political.popularity >= prev.political.popularity &&
    s.political.socialStability >= prev.political.socialStability &&
    s.economic.marketConfidence >= prev.economic.marketConfidence &&
    s.economic.foreignReserves >= prev.economic.foreignReserves &&
    s.economic.inflation <= prev.economic.inflation &&
    s.economic.publicDeficit <= prev.economic.publicDeficit
  );
}

function updateStreaks(prev: GameState, state: GameState): GameState {
  const isLow = state.political.popularity < 5;
  const s = withPolitical(state, {
    popularityLowStreak: isLow ? state.political.popularityLowStreak + 1 : 0,
  });
  const isDeflating = s.economic.inflation < -10;
  return {
    ...s,
    deflationStreakTurns: isDeflating ? (s.deflationStreakTurns ?? 0) + 1 : 0,
    positiveStreak: isGoodTurn(prev, s) ? (s.positiveStreak ?? 0) + 1 : 0,
  };
}

function applyLameDuckPenalty(s: GameState): GameState {
  return {
    ...withPolitical(s, {
      popularity: clamp(s.political.popularity - 3, 0, 100),
      socialStability: clamp(s.political.socialStability - 2, 0, 100),
    }),
    lameDuckTurnsRemaining: (s.lameDuckTurnsRemaining ?? 0) - 1,
  };
}

// Advances the narrative arc phase of scenario runs
function advanceArcPhase(s: GameState): GameState {
  const arcs = s.activeScenario ? SCENARIO_ARCS[s.activeScenario] : undefined;
  if (!arcs) return s;
  const phase = s.scenarioArcPhase ?? 0;
  const currentPhase = arcs[phase];
  if (!currentPhase || s.turn <= currentPhase.maxTurn || phase >= arcs.length - 1) return s;
  return { ...s, scenarioArcPhase: phase + 1 };
}

function advanceCalendar(s: GameState): GameState {
  const calendar = calendarFor(s.activeScenario);
  const nextTurn = s.turn + 1;
  const turnsElapsed = nextTurn - 1; // turns completed
  const monthsElapsed = Math.floor(turnsElapsed / calendar.turnsPerMonth);
  const totalMonths = calendar.startMonth - 1 + monthsElapsed;
  return {
    ...s,
    turn: nextTurn,
    currentMonth: (totalMonths % 12) + 1,
    currentYear: calendar.startYear + Math.floor(totalMonths / 12),
  };
}

function settleScore(s: GameState): GameState {
  const gameOverResult = checkGameOver(s);
  if (!gameOverResult) return { ...s, score: calculateScore(s) };
  return { ...s, isGameOver: true, gameOverReason: gameOverResult.reason, score: gameOverResult.score };
}

export function drawNextCard(state: GameState): ReturnType<typeof drawCard> {
  const mod = DIFFICULTY_MODIFIERS[state.difficulty] ?? DIFFICULTY_MODIFIERS['normal']!;
  const rng = createRng(state.seed + state.turn * 777);

  // Force presidential election card at turn 40
  if (state.turn === PRESIDENTIAL_ELECTION_TURN) {
    const elCard = CARD_REGISTRY.get('pol_election_result');
    if (elCard) return elCard;
  }

  // Every CONGRESS_SESSION_INTERVAL turns, force a rotating session law card
  if (state.turn > 1 && state.turn % CONGRESS_SESSION_INTERVAL === 0) {
    const lawIndex = Math.floor((state.turn - 1) / CONGRESS_SESSION_INTERVAL) % 5;
    const sessionLawId = `session_law_00${lawIndex + 1}`;
    const sessionCard = CARD_REGISTRY.get(sessionLawId);
    if (sessionCard) return sessionCard;
  }

  // Guarantee a lifeline card every N turns (easy/normal only)
  const forceLifeline =
    state.turn > 1 && mod.lifelineGuaranteeEvery < 99 && state.turn % mod.lifelineGuaranteeEvery === 0;
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
  const scaleNeg = (v: number | undefined) => (!v ? 0 : v < 0 ? v * m : v);
  const scalePos = (v: number | undefined) => (!v ? 0 : v > 0 ? v * m : v);

  // Kirchnerismo Boom: multiply positive economic effects by 1.5 for turns 1-8
  const kirchBoost = state.activeScenario === 'kirchnerismo_boom' && state.turn <= 8 ? 1.5 : 1.0;
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
      mediaCredibility: clamp(
        state.political.mediaCredibility + scaleNeg(effects.mediaCredibilityDelta),
        0,
        100,
      ),
      emergencyDecreesUsed: state.political.emergencyDecreesUsed + (effects.emergencyDecreeDelta ?? 0),
    },
    economic: {
      ...state.economic,
      inflation: clamp(state.economic.inflation + scalePos(effects.inflationDelta), 0, 200),
      publicDeficit: clamp(state.economic.publicDeficit + scalePos(effects.deficitDelta), 0, 100),
      marketConfidence: clamp(
        state.economic.marketConfidence + kirchPos(scaleNeg(effects.marketConfidenceDelta)),
        0,
        100,
      ),
      currencyStrength: clamp(
        state.economic.currencyStrength + kirchPos(scaleNeg(effects.currencyStrengthDelta)),
        0,
        100,
      ),
      foreignReserves: clamp(
        state.economic.foreignReserves + kirchPos(scaleNeg(effects.foreignReservesDelta)),
        0,
        100,
      ),
      gdpGrowth: clamp(state.economic.gdpGrowth + kirchPos(scaleNeg(effects.gdpGrowthDelta)), -10, 10),
    },
    congress: {
      ...state.congress,
      governmentSeats: clamp(
        state.congress.governmentSeats + scaleNeg(effects.governmentSeatsDelta),
        0,
        TOTAL_SEATS,
      ),
      lawsPassedThisRun: state.congress.lawsPassedThisRun + (effects.lawsPassedDelta ?? 0),
    },
  };
}
