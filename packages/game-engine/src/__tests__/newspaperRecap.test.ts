import { describe, expect, it } from 'vitest';
import { keyDecisions } from '../newspaperRecap.js';
import type { TurnEvent } from '../types.js';

function event(
  turn: number,
  cardId: string,
  choiceIndex: number,
  effectsApplied: TurnEvent['effectsApplied'],
) {
  return { turn, cardId, choiceIndex, effectsApplied };
}

describe('keyDecisions', () => {
  it('keeps the highest-impact decisions in turn order', () => {
    const decisions = keyDecisions(
      [
        event(1, 'eco_001', 0, { inflationDelta: -2 }),
        event(2, 'eco_003', 1, { popularityDelta: -20, marketConfidenceDelta: 10 }),
        event(3, 'pol_001', 2, { stabilityDelta: 5 }),
        event(4, 'soc_001', 0, { inflationDelta: 15 }),
      ],
      2,
    );
    expect(decisions.map((decision) => decision.turn)).toEqual([2, 4]);
    expect(decisions[0]).toMatchObject({
      cardId: 'eco_003',
      titleKey: 'event.eco_003.title',
      choiceKey: 'event.eco_003.choice_b',
      impact: 30,
    });
  });

  it('skips unknown cards, missing choices and decisions without impact', () => {
    expect(
      keyDecisions([
        event(1, 'missing_card', 0, { popularityDelta: 50 }),
        event(2, 'eco_001', 9, { popularityDelta: 50 }),
        event(3, 'eco_001', 0, {}),
      ]),
    ).toEqual([]);
  });
});
