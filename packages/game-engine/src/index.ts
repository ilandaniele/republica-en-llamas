// Public API for @republica/game-engine
export {
  CAREER_START_OFFICES,
  CAREER_LABELS,
  canAdvanceCareer,
  getCareerChoicePreview,
  getCareerRequirements,
  isCareerStartOffice,
  isLowerOffice,
} from './career.js';
export type { CareerState, CareerOffice, CareerStartOffice } from './career.js';
export {
  getElectionNight,
  electionLeader,
  ELECTION_DISTRICTS,
  ELECTION_PARTIES,
  ELECTION_COUNT_STEPS,
} from './electionNight.js';
export type { ElectionNight, ElectionCountFrame, DistrictCount, PartyVotes } from './electionNight.js';
export { DEBATE_START_TURN, getDebateRound, isDebateCard, resolveDebateReply } from './debate.js';
export type { DebateState, DebateRound, DebateResult, DebateReply, DebateStrategy } from './debate.js';
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

export {
  DIFFICULTY_PRESETS,
  DIFFICULTY_MODIFIERS,
  CRISIS_THRESHOLDS,
  GAME_OVER,
  SCORE_CONFIG,
  HISTORICAL_SCENARIOS,
  SCENARIO_CALENDARS,
} from './constants.js';
export type { DifficultyModifiers } from './constants.js';

export { calculateInflation, calculateInflationBreakdown } from './inflation.js';
export { calculateVote, applyNegotiation, calculateElectionResult } from './congress.js';
export { applyMediaSpin } from './media.js';
export { calculateScore } from './scoring.js';
export { detectCrises, isCrisisResolved } from './crises.js';
export { checkGameOver } from './gameOver.js';
export { rollInternationalShock } from './shocks.js';
export {
  initGame,
  applyChoice,
  advanceTurn,
  drawNextCard,
  getSafestChoiceIndex,
  applyChoiceEffects,
} from './gameLoop.js';
export { ALL_CARDS, CARD_REGISTRY, getCard, drawCard } from './events/index.js';
export type { EntitlementId, EntitlementProduct } from './entitlements.js';
export {
  ENTITLEMENT_PRODUCTS,
  FREE_TIER,
  isFree,
  entitlementsForFeature,
  canPlayPresident,
} from './entitlements.js';
export { es } from './i18n/es.js';
export { en } from './i18n/en.js';
export { clamp, createRng } from './utils.js';
export { getFatalDecision, getCounterfactual, getBestMomentTurn } from './postMortem.js';
export { getContextPrefix } from './contextPrefixes.js';
export {
  resolveCongressSession,
  CONGRESS_ACTIONS,
  CONGRESS_ACTION_POINTS,
  SWING_LEGISLATORS,
  LAW_CHOICE,
} from './congressSession.js';
export type {
  CongressActionId,
  SwingLegislatorId,
  SwingChoice,
  CongressDecisions,
  CongressOutcome,
} from './congressSession.js';
export { getAnibalLine } from './anibal.js';
export {
  replayRun,
  resolveTurn,
  endTurn,
  applyCrisisExpressMultiplier,
  findWorstChoiceIndex,
  CRISIS_EXPRESS_TURNS,
  TIMEOUT_POPULARITY_PENALTY,
} from './run.js';
export type { TurnDecision, TurnResult, RunConfig } from './run.js';

export { PARTIES, partyForPresident } from './parties.js';
export type { PartyId } from './parties.js';
export { PRESIDENT_EXPANSION_ART } from './events/presidentExpansion.js';
export { isRunConfig, isTurnDecision, MAX_RUN_DECISIONS } from './runValidation.js';
export { canonicalPresident, isPresidentId, PRESIDENT_IDS, PRESIDENT_LABELS } from './presidents.js';
