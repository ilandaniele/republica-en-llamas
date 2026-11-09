import { describe, expect, it } from 'vitest';
import { applyChoice, drawNextCard, initGame } from '../gameLoop.js';
import { ALL_CARDS, drawCard } from '../events/index.js';
import { PRESIDENT_EXPANSION_CARDS } from '../events/presidentExpansion.js';
import { EXPANSION_AGENDAS } from '../events/expansionAgendas.js';
import { matchesStoryRequirements } from '../events/storyRequirements.js';
import { es } from '../i18n/es.js';
import { en } from '../i18n/en.js';
import { endTurn, replayRun, resolveTurn, type TurnDecision } from '../run.js';

const SELECTIONS = [
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
  ['kicillof', 'kicillof'],
  ['grabois', 'grabois'],
];

describe('presidential expansion', () => {
  it('registers 1,200 additional cards with complete bilingual copy and distinct decisions', () => {
    expect(PRESIDENT_EXPANSION_CARDS).toHaveLength(1200);
    expect(ALL_CARDS.filter((card) => card.requiredPresident)).toHaveLength(1300);
    expect(new Set(ALL_CARDS.map((card) => card.id)).size).toBe(ALL_CARDS.length);
    for (const agenda of EXPANSION_AGENDAS) {
      const own = PRESIDENT_EXPANSION_CARDS.filter((card) => card.requiredPresident === agenda.id);
      expect(own.filter((card) => !card.requiredChoice)).toHaveLength(50);
      expect(own.filter((card) => card.requiredChoice)).toHaveLength(50);
    }
    const state = initGame('normal', 17);
    for (const card of PRESIDENT_EXPANSION_CARDS) {
      expect(ALL_CARDS).toContain(card);
      for (const dictionary of [es, en]) {
        for (const key of [card.titleKey, card.bodyKey, ...card.choices.map((choice) => choice.textKey)]) {
          expect(dictionary[key]).toBeTruthy();
          expect(dictionary[key]).not.toMatch(/undefined|TODO|placeholder/);
        }
      }
      expect(card.choices).toHaveLength(3);
      expect(card.weight).toBeLessThanOrEqual(3);
      const outcomes = card.choices.map((_, index) => {
        const result = applyChoice(state, card.id, index);
        return JSON.stringify([result.economic, result.political, result.congress]);
      });
      expect(new Set(outcomes).size).toBe(3);
    }
    expect(state.history).toHaveLength(0);
  });

  it.each(SELECTIONS)('%s draws all 100 own cards and preserves shared events', (selection, president) => {
    const own = PRESIDENT_EXPANSION_CARDS.filter((card) => card.requiredPresident === president);
    const state = {
      ...initGame('normal', 17, 'es', undefined, selection),
      turn: 30,
      history: own
        .filter((card) => !card.requiredChoice)
        .map((card) => ({
          turn: 20,
          cardId: card.id,
          choiceIndex: 1,
          effectsApplied: {},
        })),
    };
    const draws = Array.from({ length: 5000 }, (_, index) => drawCard(state, () => index / 5000));
    for (const card of own) expect(draws.some((draw) => draw.id === card.id)).toBe(true);
    expect(draws.some((card) => !card.requiredPresident)).toBe(true);
    expect(draws.every((card) => !card.requiredPresident || card.requiredPresident === president)).toBe(true);
    const exhausted = { ...state, drawnCardIds: ALL_CARDS.map((card) => card.id), history: [] };
    for (let i = 0; i < 200; i++)
      expect(
        matchesStoryRequirements(
          drawCard(exhausted, () => i / 200),
          exhausted,
        ),
      ).toBe(true);
  });

  it('gates every continuation on the latest accepted decision and its two-turn delay', () => {
    for (const card of PRESIDENT_EXPANSION_CARDS.filter((card) => card.requiredChoice)) {
      const state = { ...initGame('normal', 17, 'es', undefined, card.requiredPresident), turn: 30 };
      const decision = { turn: 28, cardId: card.requiredChoice!.cardId, choiceIndex: 0, effectsApplied: {} };
      expect(matchesStoryRequirements(card, state)).toBe(false);
      for (const choiceIndex of [0, 1, 2]) {
        const history = [{ ...decision, choiceIndex }];
        expect(matchesStoryRequirements(card, { ...state, history })).toBe(choiceIndex !== 2);
        expect(matchesStoryRequirements(card, { ...state, turn: 29, history })).toBe(false);
      }
      expect(
        matchesStoryRequirements(card, {
          ...state,
          history: [decision, { ...decision, turn: 29, choiceIndex: 2 }],
        }),
      ).toBe(false);
      expect(
        matchesStoryRequirements(card, {
          ...initGame('normal', 17),
          turn: 30,
          history: [decision],
        }),
      ).toBe(false);
    }
  });

  it('respects release turns, cancellations and deduplication in actual draws', () => {
    const own = PRESIDENT_EXPANSION_CARDS.filter((card) => card.requiredPresident === 'macri');
    const initial = own.filter((card) => !card.requiredChoice);
    const state = {
      ...initGame('normal', 17, 'es', undefined, 'macri'),
      drawnCardIds: initial.map((card) => card.id),
      history: initial.map((card) => ({ turn: 0, cardId: card.id, choiceIndex: 2, effectsApplied: {} })),
    };
    for (const turn of [1, 5, 9, 13, 17, 30]) {
      for (let i = 0; i < 200; i++) {
        const card = drawCard({ ...state, turn }, () => i / 200);
        expect(card.minTurn ?? 0).toBeLessThanOrEqual(turn);
        expect(card.id.startsWith('exp_macri_')).toBe(false);
      }
    }
  });

  it.each(SELECTIONS)('replays %s exactly with the enlarged deck', (selection) => {
    const config = { seed: 117, difficulty: 'normal' as const, presidentId: selection };
    let state = initGame('normal', config.seed, 'es', undefined, selection);
    const decisions: TurnDecision[] = [];
    for (let turn = 0; turn < 5 && !state.isGameOver; turn++) {
      const card = drawNextCard(state);
      if (card.isLaw) break;
      const decision = { kind: 'choice' as const, cardId: card.id, choiceIndex: turn % card.choices.length };
      decisions.push(decision);
      state = endTurn(resolveTurn(state, card, decision).state);
    }
    expect(decisions.length).toBeGreaterThan(0);
    expect(replayRun(config, decisions)).toEqual(state);
  });
});
