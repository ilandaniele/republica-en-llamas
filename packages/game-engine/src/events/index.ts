import type { EventCard, GameState, CrisisType, Difficulty } from '../types.js';
import { CARD_COOLDOWN_TURNS, CARD_WEIGHT_DECAY_WINDOW, SCENARIO_ARCS } from '../constants.js';
import { POLITICAL_CARDS, POLITICAL_CHAINED_CARDS } from './political.js';
import { ECONOMIC_CARDS, ECONOMIC_CHAINED_CARDS } from './economic.js';
import { SOCIAL_CARDS, SOCIAL_CHAINED_CARDS } from './social.js';
import { INTERNATIONAL_CARDS } from './international.js';
import { CRISIS_CARDS } from './crisis/index.js';
import { CHARACTER_CARDS } from './characters.js';
import { LIFELINE_CARDS } from './lifelines.js';
import { ARGENTINA_CARDS } from './argentina.js';
import { SCANDAL_CARDS } from './scandals.js';
import { LAW_CARDS } from './laws.js';
import { NEW_CARDS } from './new.js';
import { CONSPIRACION_CARDS } from './conspiraciones.js';
import { GEOPOLITICAL_CARDS } from './geopolitical.js';
import { GUERRA_CARDS } from './guerra.js';
import { MALVINAS_CARDS } from './malvinas.js';

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'normal', 'hard', 'crisis'];

function difficultyAtLeast(current: Difficulty, min: Difficulty): boolean {
  return DIFFICULTY_ORDER.indexOf(current) >= DIFFICULTY_ORDER.indexOf(min);
}

export const ALL_CARDS: EventCard[] = [
  ...POLITICAL_CARDS,
  ...POLITICAL_CHAINED_CARDS,
  ...ECONOMIC_CARDS,
  ...ECONOMIC_CHAINED_CARDS,
  ...SOCIAL_CARDS,
  ...SOCIAL_CHAINED_CARDS,
  // International cards are exogenous: the world calls regardless of domestic health
  ...INTERNATIONAL_CARDS.map((c) => ({ ...c, isExogenous: true as const })),
  ...CRISIS_CARDS,
  ...CHARACTER_CARDS,
  ...LIFELINE_CARDS,
  ...ARGENTINA_CARDS,
  ...SCANDAL_CARDS,
  ...LAW_CARDS,
  ...NEW_CARDS,
  ...CONSPIRACION_CARDS,
  ...GEOPOLITICAL_CARDS,
  ...GUERRA_CARDS,
  ...MALVINAS_CARDS,
];

export const CARD_REGISTRY = new Map<string, EventCard>(
  ALL_CARDS.map((card) => [card.id, card])
);

export function getCard(id: string): EventCard {
  const card = CARD_REGISTRY.get(id);
  if (!card) throw new Error(`Card not found: ${id}`);
  return card;
}

function getVariablesInRedZone(state: GameState): string[] {
  const vars: string[] = [];
  if (state.political.popularity < 25) vars.push('popularity');
  if (state.political.socialStability < 25) vars.push('socialStability');
  if (state.economic.marketConfidence < 25) vars.push('marketConfidence');
  if (state.economic.currencyStrength < 25) vars.push('currencyStrength');
  if (state.economic.foreignReserves < 25) vars.push('foreignReserves');
  return vars;
}

function isCharacterCardEligible(card: EventCard, state: GameState): boolean {
  if (!card.characterId) return true;
  const character = state.characters.find((c) => c.id === card.characterId);
  if (!character) return true;
  if (card.requiredFlags?.some((f) => !character.memoryFlags.includes(f))) return false;
  if (card.forbiddenFlags?.some((f) => character.memoryFlags.includes(f))) return false;
  return true;
}

/**
 * Returns a state-aware weight multiplier for a card category based on current game health.
 *
 * - Economic crisis cards surge when inflation/deficit/reserves are bad.
 * - Social crisis cards surge when popularity/stability are low.
 * - Political cards are always relevant but more common in bad times.
 * - International cards are slightly boosted in stability (diplomacy time).
 * - Exogenous, lifeline and crisis cards are never adjusted (return 1.0).
 */
function stateAwareMultiplier(state: GameState, card: EventCard): number {
  // Never adjust exogenous events, lifelines, or crisis-gated cards
  if (card.isExogenous || card.isLifeline || card.category === 'crisis') return 1.0;

  const { political, economic } = state;

  // econHealth ∈ [0, 1]: 0 = collapse, 1 = fully healthy
  const infScore  = economic.inflation < 20   ? 1 : economic.inflation < 45  ? 0.5 : 0;
  const defScore  = economic.publicDeficit < 30 ? 1 : economic.publicDeficit < 55 ? 0.5 : 0;
  const confScore = economic.marketConfidence > 55 ? 1 : economic.marketConfidence > 35 ? 0.5 : 0;
  const resScore  = economic.foreignReserves > 50  ? 1 : economic.foreignReserves > 25  ? 0.5 : 0;
  const curScore  = economic.currencyStrength > 50 ? 1 : economic.currencyStrength > 25 ? 0.5 : 0;
  const econHealth = (infScore + defScore + confScore + resScore + curScore) / 5;

  // polHealth ∈ [0, 1]
  const popScore  = political.popularity > 55       ? 1 : political.popularity > 30       ? 0.5 : 0;
  const stabScore = political.socialStability > 55  ? 1 : political.socialStability > 30  ? 0.5 : 0;
  const polHealth  = (popScore + stabScore) / 2;

  // Overall weighted health (economy counts 3, politics counts 2)
  const overallHealth = (econHealth * 3 + polHealth * 2) / 5;

  switch (card.category) {
    // Economic chaos cards: rare at 5% inflation, dominant at 90%
    case 'economic':
      return 0.25 + (1 - econHealth) * 1.75;       // range [0.25, 2.0]

    // Social unrest cards: rare when popular, dominant when hated
    case 'social':
      return 0.25 + (1 - polHealth) * 1.75;         // range [0.25, 2.0]

    // Political cards: always relevant, slightly more in crisis
    case 'political':
      return 0.5 + (1 - overallHealth) * 1.0;       // range [0.5, 1.5]

    // International cards: slightly more diplomatic activity when stable
    case 'international':
      return 0.7 + overallHealth * 0.6;             // range [0.7, 1.3]

    default:
      return 1.0;
  }
}

/**
 * Draw a card for the current turn using weighted random selection.
 * Priority: lifeline cards when 2+ variables in red zone (or forceLifeline), then weighted random.
 * Cooldown: cards cannot be redrawn within CARD_COOLDOWN_TURNS turns.
 * Weight decay: cards drawn within CARD_WEIGHT_DECAY_WINDOW turns have 30% of their normal weight.
 * State-aware: card category weights shift based on current economic and political health.
 */
export function drawCard(state: GameState, rng: () => number, forceLifeline = false): EventCard {
  const activeCrisisTypes = new Set<CrisisType>(state.activeCrises.map((c) => c.type));
  const cooldowns = state.cardCooldowns ?? {};

  // Eligible cards (base filter + cooldown)
  const eligible = ALL_CARDS.filter((card) => {
    if (state.drawnCardIds.includes(card.id)) return false;
    if (card.minTurn !== undefined && state.turn < card.minTurn) return false;
    if (card.maxTurn !== undefined && state.turn > card.maxTurn) return false;
    if (card.requiredCrisis !== undefined && !activeCrisisTypes.has(card.requiredCrisis)) return false;
    if (card.category === 'crisis' && card.requiredCrisis === undefined) return false;
    if (card.minDifficulty !== undefined && !difficultyAtLeast(state.difficulty, card.minDifficulty)) return false;
    if (!isCharacterCardEligible(card, state)) return false;
    // For non-character chained cards: requiredFlags must appear in any character's memoryFlags
    if (!card.characterId && card.requiredFlags && card.requiredFlags.length > 0) {
      const allFlags = state.characters.flatMap((c) => c.memoryFlags);
      if (card.requiredFlags.some((f) => !allFlags.includes(f))) return false;
    }
    // Cooldown: skip if fired too recently
    const lastFiredTurn = cooldowns[card.id];
    if (lastFiredTurn !== undefined && (state.turn - lastFiredTurn) < CARD_COOLDOWN_TURNS) return false;
    return true;
  });

  if (eligible.length === 0) {
    const fallback = ALL_CARDS.filter(
      (c) => c.category !== 'crisis' &&
      (c.minTurn === undefined || state.turn >= c.minTurn)
    );
    const idx = Math.floor(rng() * fallback.length);
    return fallback[idx] ?? ALL_CARDS[0]!;
  }

  // Priority: lifeline cards when 2+ variables in red zone, or when forced (guaranteed lifeline turn)
  const redZone = getVariablesInRedZone(state);
  if (redZone.length >= 2 || forceLifeline) {
    const eligibleLifelines = eligible.filter((c) => c.isLifeline);
    const targeted = eligibleLifelines.find((c) => c.lifelineFor?.some((v) => redZone.includes(v)));
    const lifeline = targeted ?? eligibleLifelines[0];
    if (lifeline) return lifeline;
  }

  // Apply weight decay + state-aware multiplier for all cards
  const effectiveWeight = (card: EventCard): number => {
    const lastFiredTurn = cooldowns[card.id];
    let w = card.weight;
    if (lastFiredTurn !== undefined && (state.turn - lastFiredTurn) < CARD_WEIGHT_DECAY_WINDOW) {
      w *= 0.3;
    }
    // State-aware: shift category weights based on current game health
    // (exogenous, lifeline, and crisis cards are never modified)
    w *= stateAwareMultiplier(state, card);
    // Narrative arc boost: 3× weight for categories matching current scenario phase
    if (state.activeScenario) {
      const arcs = SCENARIO_ARCS[state.activeScenario];
      if (arcs) {
        const phase = arcs[state.scenarioArcPhase ?? 0];
        if (phase?.weightedCategories.includes(card.category)) {
          w *= 3;
        }
      }
    }
    return w;
  };

  const totalWeight = eligible.reduce((s, c) => s + effectiveWeight(c), 0);
  let roll = rng() * totalWeight;

  for (const card of eligible) {
    roll -= effectiveWeight(card);
    if (roll <= 0) return card;
  }

  return eligible[eligible.length - 1]!;
}
