import { CARD_REGISTRY } from './events/index.js';
import type { ChoiceEffect, TurnEvent } from './types.js';

export interface KeyDecision {
  turn: number;
  cardId: string;
  titleKey: string;
  choiceKey: string;
  impact: number;
}

const IMPACT_FIELDS: (keyof ChoiceEffect)[] = [
  'popularityDelta',
  'stabilityDelta',
  'inflationDelta',
  'deficitDelta',
  'marketConfidenceDelta',
  'foreignReservesDelta',
];

function impactOf(effects: ChoiceEffect): number {
  return IMPACT_FIELDS.reduce((sum, field) => sum + Math.abs(effects[field] ?? 0), 0);
}

function toKeyDecision(event: TurnEvent): KeyDecision | null {
  const card = CARD_REGISTRY.get(event.cardId);
  const choice = card?.choices[event.choiceIndex];
  if (!card || !choice) return null;
  return {
    turn: event.turn,
    cardId: event.cardId,
    titleKey: card.titleKey,
    choiceKey: choice.textKey,
    impact: impactOf(event.effectsApplied),
  };
}

export function keyDecisions(history: readonly TurnEvent[], limit = 3): KeyDecision[] {
  return history
    .map(toKeyDecision)
    .filter((decision): decision is KeyDecision => decision !== null && decision.impact > 0)
    .sort((a, b) => b.impact - a.impact || a.turn - b.turn)
    .slice(0, limit)
    .sort((a, b) => a.turn - b.turn);
}
