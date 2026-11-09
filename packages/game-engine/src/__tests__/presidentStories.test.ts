import { describe, expect, it } from 'vitest';
import { initGame, applyChoice } from '../gameLoop.js';
import { ALL_CARDS, drawCard } from '../events/index.js';
import { PRESIDENT_STORY_CARDS } from '../events/presidentStories.js';
import { matchesStoryRequirements } from '../events/storyRequirements.js';
import { es } from '../i18n/es.js';
import { en } from '../i18n/en.js';
import { replayRun, resolveTurn, endTurn, type TurnDecision } from '../run.js';
import { drawNextCard } from '../gameLoop.js';

const PRESIDENTS = [
  ['ingeniero', 'milei'],
  ['populista', 'massa'],
  ['tecnocrata', 'bullrich'],
  ['izquierda', 'bregman'],
  ['federal', 'schiaretti'],
  ['corporativo', 'larreta'],
  ['nestor', 'nestor'],
  ['cristina', 'cristina'],
  ['macri', 'macri'],
  ['del_cano', 'del_cano'],
];

describe('personal presidential story deck', () => {
  it('adds 100 unique localized cards, ten for each president', () => {
    expect(PRESIDENT_STORY_CARDS).toHaveLength(100);
    expect(new Set(ALL_CARDS.map((c) => c.id)).size).toBe(ALL_CARDS.length);
    for (const [, president] of PRESIDENTS)
      expect(PRESIDENT_STORY_CARDS.filter((c) => c.requiredPresident === president)).toHaveLength(10);
    for (const card of PRESIDENT_STORY_CARDS) {
      expect(card.choices).toHaveLength(3);
      for (const dictionary of [es, en])
        for (const key of [card.titleKey, card.bodyKey, ...card.choices.map((c) => c.textKey)])
          expect(dictionary[key]).toBeTruthy();
      const state = initGame('normal', 42);
      const outcomes = card.choices.map((_, i) => {
        const result = applyChoice(state, card.id, i);
        return JSON.stringify([result.political, result.economic, result.congress]);
      });
      expect(new Set(outcomes).size).toBe(3);
      expect(state.history).toHaveLength(0);
    }
  });

  it.each(PRESIDENTS)(
    '%s can draw every personal card and never another president’s story',
    (selection, president) => {
      const own = PRESIDENT_STORY_CARDS.filter((c) => c.requiredPresident === president);
      const initial = own.filter((c) => !c.requiredChoice);
      const state = {
        ...initGame('normal', 42, 'es', undefined, selection),
        turn: 30,
        history: initial.map((c) => ({ turn: 20, cardId: c.id, choiceIndex: 0, effectsApplied: {} })),
      };
      const draws = Array.from({ length: 2000 }, (_, i) => drawCard(state, () => i / 2000));
      expect(draws.every((c) => !c.requiredPresident || c.requiredPresident === president)).toBe(true);
      for (const card of own) expect(draws.some((c) => c.id === card.id)).toBe(true);
      const fallback = { ...state, drawnCardIds: ALL_CARDS.map((c) => c.id), history: [] };
      for (let i = 0; i < 200; i++) {
        const card = drawCard(fallback, () => i / 200);
        expect(matchesStoryRequirements(card, fallback)).toBe(true);
      }
    },
  );

  it('requires a recent actual approval, delays consequences, and respects a later cancellation', () => {
    const card = PRESIDENT_STORY_CARDS.find((c) => c.id === 'pres_macri_infraestructura_followup')!;
    const state = { ...initGame('normal', 42, 'es', undefined, 'macri'), turn: 12 };
    expect(matchesStoryRequirements(card, state)).toBe(false);
    for (const index of [0, 1, 2]) {
      const decision = {
        turn: 10,
        cardId: card.requiredChoice!.cardId,
        choiceIndex: index,
        effectsApplied: {},
      };
      expect(matchesStoryRequirements(card, { ...state, history: [decision] })).toBe(index !== 2);
      expect(matchesStoryRequirements(card, { ...state, turn: 11, history: [decision] })).toBe(false);
      expect(
        matchesStoryRequirements(card, {
          ...state,
          history: [decision, { ...decision, turn: 11, choiceIndex: 2 }],
        }),
      ).toBe(false);
    }
    expect(
      matchesStoryRequirements(card, {
        ...initGame('normal', 42),
        turn: 12,
        history: [{ turn: 10, cardId: card.requiredChoice!.cardId, choiceIndex: 0, effectsApplied: {} }],
      }),
    ).toBe(false);
  });

  it('keeps deterministic replay with the expanded draw pool', () => {
    const config = { seed: 42, difficulty: 'normal' as const, presidentId: 'del_cano' };
    let state = initGame('normal', 42, 'es', undefined, config.presidentId);
    const decisions: TurnDecision[] = [];
    for (let i = 0; i < 4 && !state.isGameOver; i++) {
      const card = drawNextCard(state);
      if (card.isLaw) break;
      const decision = { kind: 'choice' as const, cardId: card.id, choiceIndex: i % card.choices.length };
      decisions.push(decision);
      state = endTurn(resolveTurn(state, card, decision).state);
    }
    expect(decisions.length).toBeGreaterThan(1);
    expect(replayRun(config, decisions)).toEqual(state);
  });
});
