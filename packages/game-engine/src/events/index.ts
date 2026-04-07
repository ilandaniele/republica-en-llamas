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
  ...INTERNATIONAL_CARDS,
  ...CRISIS_CARDS,
  ...CHARACTER_CARDS,
  ...LIFELINE_CARDS,
  ...ARGENTINA_CARDS,
  ...SCANDAL_CARDS,
  ...LAW_CARDS,
  ...NEW_CARDS,
  ...CONSPIRACION_CARDS,
  ...GEOPOLITICAL_CARDS,
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
 * Draw a card for the current turn using weighted random selection.
 * Priority: lifeline cards when 2+ variables in red zone (or forceLifeline), then weighted random.
 * Cooldown: cards cannot be redrawn within CARD_COOLDOWN_TURNS turns.
 * Weight decay: cards drawn within CARD_WEIGHT_DECAY_WINDOW turns have 30% of their normal weight.
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

  // Apply weight decay for recently-played cards (within CARD_WEIGHT_DECAY_WINDOW turns)
  const effectiveWeight = (card: EventCard): number => {
    const lastFiredTurn = cooldowns[card.id];
    let w = card.weight;
    if (lastFiredTurn !== undefined && (state.turn - lastFiredTurn) < CARD_WEIGHT_DECAY_WINDOW) {
      w *= 0.3;
    }
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
