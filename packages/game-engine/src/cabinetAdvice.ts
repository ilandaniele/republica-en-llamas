import type { CharacterId, ChoiceEffect, EventCard, RecurringCharacter } from './types.js';

export interface CabinetAdvice {
  characterId: CharacterId;
  name: string;
  avatar: string;
  choiceIndex: number;
}

type Priorities = Partial<Record<keyof ChoiceEffect, number>>;

const PRIORITIES: Record<CharacterId, Priorities> = {
  ministro: { inflationDelta: -1, deficitDelta: -1, marketConfidenceDelta: 1, foreignReservesDelta: 0.5 },
  sindicalista: { popularityDelta: 1, stabilityDelta: 0.5, inflationDelta: -0.5 },
  periodista: { mediaCredibilityDelta: 1, popularityDelta: 0.5 },
  embajador: { marketConfidenceDelta: 1, foreignReservesDelta: 1, deficitDelta: -0.5 },
  gobernadora: { stabilityDelta: 1, popularityDelta: 0.5 },
};

function scoreFor(priorities: Priorities, effects: ChoiceEffect): number {
  return Object.entries(priorities).reduce(
    (sum, [field, weight]) => sum + weight * (effects[field as keyof ChoiceEffect] ?? 0),
    0,
  );
}

function adviceFrom(character: RecurringCharacter, card: EventCard) {
  const scores = card.choices.map((choice) => scoreFor(PRIORITIES[character.id], choice.effects));
  const best = Math.max(...scores);
  return {
    advice: {
      characterId: character.id,
      name: character.name,
      avatar: character.avatar,
      choiceIndex: scores.indexOf(best),
    },
    spread: best - Math.min(...scores),
  };
}

export function cabinetAdvice(
  card: EventCard,
  characters: readonly RecurringCharacter[],
  limit = 2,
): CabinetAdvice[] {
  if (card.isLaw || card.choices.length < 2) return [];
  return characters
    .map((character) => adviceFrom(character, card))
    .filter(({ spread }) => spread > 0)
    .sort((a, b) => b.spread - a.spread)
    .slice(0, limit)
    .map(({ advice }) => advice);
}
