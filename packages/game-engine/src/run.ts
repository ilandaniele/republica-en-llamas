import { resolveCongressSession } from './congressSession.js';
import type { CongressDecisions } from './congressSession.js';
import { advanceTurn, applyChoice, applyChoiceEffects, drawNextCard, initGame } from './gameLoop.js';
import { calculateScore } from './scoring.js';
import type { Difficulty, EventCard, GameState, Language, ScenarioId } from './types.js';

export type TurnDecision =
  | { kind: 'choice'; cardId: string; choiceIndex: number }
  | { kind: 'congress'; cardId: string; decisions: CongressDecisions }
  | { kind: 'timeout'; cardId: string };

export interface TurnResult {
  state: GameState;
  choiceIndex: number;
}

export interface RunConfig {
  seed: number;
  difficulty: Difficulty;
  language?: Language;
  scenarioId?: ScenarioId;
  crisisExpress?: boolean;
}

export const CRISIS_EXPRESS_TURNS = 15;
export const TIMEOUT_POPULARITY_PENALTY = 10;
const CRISIS_EXPRESS_DAMAGE_MULTIPLIER = 1.5;
const CRISIS_EXPRESS_SCORE_MULTIPLIER = 2;

function amplifyDrop(before: number, after: number): number {
  const delta = after - before;
  return delta < 0 ? Math.max(0, before + delta * CRISIS_EXPRESS_DAMAGE_MULTIPLIER) : after;
}

function amplifyRise(before: number, after: number): number {
  const delta = after - before;
  return delta > 0 ? before + delta * CRISIS_EXPRESS_DAMAGE_MULTIPLIER : after;
}

export function applyCrisisExpressMultiplier(before: GameState, after: GameState): GameState {
  return {
    ...after,
    political: {
      ...after.political,
      popularity: amplifyDrop(before.political.popularity, after.political.popularity),
      socialStability: amplifyDrop(before.political.socialStability, after.political.socialStability),
    },
    economic: {
      ...after.economic,
      marketConfidence: amplifyDrop(before.economic.marketConfidence, after.economic.marketConfidence),
      currencyStrength: amplifyDrop(before.economic.currencyStrength, after.economic.currencyStrength),
      foreignReserves: amplifyDrop(before.economic.foreignReserves, after.economic.foreignReserves),
      inflation: amplifyRise(before.economic.inflation, after.economic.inflation),
    },
  };
}

export function findWorstChoiceIndex(card: EventCard): number {
  let worstIdx = 0;
  let worstScore = Infinity;
  card.choices.forEach((choice, i) => {
    const e = choice.effects;
    const score =
      (e.popularityDelta ?? 0) +
      (e.stabilityDelta ?? 0) +
      (e.marketConfidenceDelta ?? 0) +
      (e.currencyStrengthDelta ?? 0) +
      (e.foreignReservesDelta ?? 0) -
      (e.inflationDelta ?? 0) -
      (e.deficitDelta ?? 0);
    if (score < worstScore) {
      worstScore = score;
      worstIdx = i;
    }
  });
  return worstIdx;
}

function applyTimeoutPenalty(state: GameState): GameState {
  return {
    ...state,
    political: {
      ...state.political,
      popularity: Math.max(0, state.political.popularity - TIMEOUT_POPULARITY_PENALTY),
    },
  };
}

function applyScoredChoice(
  before: GameState,
  cardId: string,
  choiceIndex: number,
  crisisExpress: boolean,
): TurnResult {
  let after = applyChoice(before, cardId, choiceIndex);
  if (crisisExpress) after = applyCrisisExpressMultiplier(before, after);
  const score = calculateScore(after);
  const finalScore = crisisExpress ? Math.round(score * CRISIS_EXPRESS_SCORE_MULTIPLIER) : score;
  return { state: { ...after, score: finalScore }, choiceIndex };
}

export function resolveTurn(
  state: GameState,
  card: EventCard,
  decision: TurnDecision,
  crisisExpress = false,
): TurnResult {
  if (decision.cardId !== card.id) {
    throw new Error(`Decision for ${decision.cardId} does not match current card ${card.id}`);
  }
  switch (decision.kind) {
    case 'choice': {
      if (card.isLaw) throw new Error(`Law card ${card.id} needs a congress decision`);
      if (!card.choices[decision.choiceIndex]) throw new Error(`Invalid choice ${decision.choiceIndex}`);
      return applyScoredChoice(state, card.id, decision.choiceIndex, crisisExpress);
    }
    case 'congress': {
      if (!card.isLaw) throw new Error(`Card ${card.id} is not a law`);
      const { choiceIndex, effects } = resolveCongressSession(state, decision.decisions);
      const withNegotiation = Object.keys(effects).length > 0 ? applyChoiceEffects(state, effects) : state;
      return applyScoredChoice(withNegotiation, card.id, choiceIndex, crisisExpress);
    }
    case 'timeout':
      return applyScoredChoice(
        applyTimeoutPenalty(state),
        card.id,
        findWorstChoiceIndex(card),
        crisisExpress,
      );
  }
}

export function endTurn(state: GameState, crisisExpress = false): GameState {
  const next = advanceTurn(state);
  if (crisisExpress && next.turn > CRISIS_EXPRESS_TURNS && !next.isGameOver) {
    return { ...next, isGameOver: true, gameOverReason: 'term_complete' };
  }
  return next;
}

export function replayRun(config: RunConfig, decisions: TurnDecision[]): GameState {
  const crisisExpress = config.crisisExpress ?? false;
  let state = initGame(config.difficulty, config.seed, config.language, config.scenarioId);
  for (const decision of decisions) {
    if (state.isGameOver) throw new Error('Decision after game over');
    const card = drawNextCard(state);
    state = endTurn(resolveTurn(state, card, decision, crisisExpress).state, crisisExpress);
  }
  return state;
}
