import type { EventCard, GameState, CrisisType, Difficulty } from '../types.js';
import { POLITICAL_CARDS } from './political.js';
import { ECONOMIC_CARDS } from './economic.js';
import { SOCIAL_CARDS } from './social.js';
import { INTERNATIONAL_CARDS } from './international.js';
import { CRISIS_CARDS } from './crisis/index.js';
import { CHARACTER_CARDS } from './characters.js';
import { LIFELINE_CARDS } from './lifelines.js';
import { ARGENTINA_CARDS } from './argentina.js';
import { SCANDAL_CARDS } from './scandals.js';

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'normal', 'hard', 'crisis'];

function difficultyAtLeast(current: Difficulty, min: Difficulty): boolean {
  return DIFFICULTY_ORDER.indexOf(current) >= DIFFICULTY_ORDER.indexOf(min);
}

export const ALL_CARDS: EventCard[] = [
  ...POLITICAL_CARDS,
  ...ECONOMIC_CARDS,
  ...SOCIAL_CARDS,
  ...INTERNATIONAL_CARDS,
  ...CRISIS_CARDS,
  ...CHARACTER_CARDS,
  ...LIFELINE_CARDS,
  ...ARGENTINA_CARDS,
  ...SCANDAL_CARDS,
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
 */
export function drawCard(state: GameState, rng: () => number, forceLifeline = false): EventCard {
  const activeCrisisTypes = new Set<CrisisType>(state.activeCrises.map((c) => c.type));

  // Eligible cards (base filter)
  const eligible = ALL_CARDS.filter((card) => {
    if (state.drawnCardIds.includes(card.id)) return false;
    if (card.minTurn !== undefined && state.turn < card.minTurn) return false;
    if (card.maxTurn !== undefined && state.turn > card.maxTurn) return false;
    if (card.requiredCrisis !== undefined && !activeCrisisTypes.has(card.requiredCrisis)) return false;
    if (card.category === 'crisis' && card.requiredCrisis === undefined) return false;
    if (card.minDifficulty !== undefined && !difficultyAtLeast(state.difficulty, card.minDifficulty)) return false;
    if (!isCharacterCardEligible(card, state)) return false;
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

  const totalWeight = eligible.reduce((s, c) => s + c.weight, 0);
  let roll = rng() * totalWeight;

  for (const card of eligible) {
    roll -= card.weight;
    if (roll <= 0) return card;
  }

  return eligible[eligible.length - 1]!;
}
