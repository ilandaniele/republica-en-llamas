import { describe, expect, it } from 'vitest';
import { cabinetAdvice } from '../cabinetAdvice.js';
import { initGame } from '../gameLoop.js';
import type { ChoiceEffect, EventCard } from '../types.js';

function card(effects: ChoiceEffect[], extra: Partial<EventCard> = {}): EventCard {
  return {
    id: 'test_card',
    category: 'economic',
    titleKey: 'event.test.title',
    bodyKey: 'event.test.body',
    weight: 1,
    choices: effects.map((choiceEffects, index) => ({
      id: `c${index}`,
      textKey: `c${index}`,
      effects: choiceEffects,
    })),
    ...extra,
  };
}

const { characters } = initGame('normal', 42, 'es');

describe('cabinetAdvice', () => {
  it('lets each advisor back the choice that suits their portfolio', () => {
    const advice = cabinetAdvice(
      card([
        { inflationDelta: -10, popularityDelta: -15 },
        { inflationDelta: 8, popularityDelta: 12 },
      ]),
      characters,
      5,
    );
    const byId = Object.fromEntries(advice.map((entry) => [entry.characterId, entry.choiceIndex]));
    expect(byId.ministro).toBe(0);
    expect(byId.sindicalista).toBe(1);
    expect(advice[0]).toMatchObject({ name: expect.any(String), avatar: expect.any(String) });
  });

  it('keeps the advisors with the strongest opinion first', () => {
    const advice = cabinetAdvice(card([{ deficitDelta: -20 }, { stabilityDelta: 2 }]), characters);
    expect(advice).toHaveLength(2);
    expect(advice[0]?.characterId).toBe('ministro');
  });

  it('stays silent on laws, single choices and choices that do not touch any portfolio', () => {
    expect(cabinetAdvice(card([{ popularityDelta: 5 }, {}], { isLaw: true }), characters)).toEqual([]);
    expect(cabinetAdvice(card([{ popularityDelta: 5 }]), characters)).toEqual([]);
    expect(cabinetAdvice(card([{ gdpGrowthDelta: 3 }, { gdpGrowthDelta: -3 }]), characters)).toEqual([]);
  });
});
