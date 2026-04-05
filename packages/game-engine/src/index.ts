// Public API for @republica/game-engine
export type {
  GameState,
  PoliticalVars,
  EconomicVars,
  CongressState,
  MediaState,
  Crisis,
  Shock,
  EventCard,
  Choice,
  ChoiceEffect,
  TurnEvent,
  VoteResult,
  NegotiationResult,
  GameOverResult,
  DifficultyPreset,
  Difficulty,
  Language,
  CardCategory,
  CrisisType,
  GameOverReason,
  NegotiationType,
  RecurringCharacter,
  CharacterId,
  InflationBreakdown,
  ScenarioId,
  HistoricalScenarioConfig,
  ScenarioCalendar,
} from './types.js';

export { DIFFICULTY_PRESETS, DIFFICULTY_MODIFIERS, CRISIS_THRESHOLDS, GAME_OVER, SCORE_CONFIG, HISTORICAL_SCENARIOS, SCENARIO_CALENDARS } from './constants.js';
export type { DifficultyModifiers } from './constants.js';

export { calculateInflation, calculateInflationBreakdown } from './inflation.js';
export { calculateVote, applyNegotiation } from './congress.js';
export { applyMediaSpin } from './media.js';
export { calculateScore } from './scoring.js';
export { detectCrises, isCrisisResolved } from './crises.js';
export { checkGameOver } from './gameOver.js';
export { rollInternationalShock } from './shocks.js';
export { initGame, applyChoice, advanceTurn, drawNextCard, getSafestChoiceIndex, applyChoiceEffects } from './gameLoop.js';
export { ALL_CARDS, CARD_REGISTRY, getCard, drawCard } from './events/index.js';
export type { EntitlementId, EntitlementProduct } from './entitlements.js';
export { ENTITLEMENT_PRODUCTS, FREE_TIER, isFree, entitlementsForFeature } from './entitlements.js';
export { es } from './i18n/es.js';
export { en } from './i18n/en.js';
export { clamp, createRng } from './utils.js';
export { getFatalDecision, getCounterfactual, getBestMomentTurn } from './postMortem.js';
export { getContextPrefix } from './contextPrefixes.js';
export { getAnibalLine } from './anibal.js';
