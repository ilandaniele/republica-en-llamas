import { describe, expect, it } from 'vitest';
import { initGame, applyChoice, drawNextCard } from '../gameLoop.js';
import { drawCard, ALL_CARDS } from '../events/index.js';
import { PARTY_CARDS } from '../events/parties.js';
import { partyForPresident } from '../parties.js';
import { replayRun, resolveTurn, endTurn } from '../run.js';
import { es } from '../i18n/es.js';
import { en } from '../i18n/en.js';

describe('party agendas', () => {
  it.each(['nestor', 'cristina', 'macri', 'del_cano', 'ingeniero', 'federal'])(
    '%s draws only its own agenda',
    (president) => {
      const state = { ...initGame('normal', 42, 'es', undefined, president), turn: 8 };
      const drawn = Array.from({ length: 2000 }, (_, i) => drawCard(state, () => i / 2000));
      expect(drawn.some((c) => c.requiredParty === partyForPresident(president))).toBe(true);
      expect(drawn.every((c) => !c.requiredParty || c.requiredParty === partyForPresident(president))).toBe(
        true,
      );
      const exhausted = { ...state, drawnCardIds: ALL_CARDS.map((c) => c.id) };
      expect(drawCard(exhausted, () => 0).requiredParty).toBe(partyForPresident(president));
    },
  );

  it('offers distinct consequences and complete translations', () => {
    for (const card of PARTY_CARDS) {
      for (const dictionary of [es, en]) {
        for (const key of [card.titleKey, card.bodyKey, ...card.choices.map((c) => c.textKey)])
          expect(dictionary[key]).toBeTruthy();
      }
      const state = initGame('normal', 42);
      const a = applyChoice(state, card.id, 0);
      const b = applyChoice(state, card.id, 1);
      expect([a.political, a.economic]).not.toEqual([b.political, b.economic]);
      expect(state.history).toHaveLength(0);
    }
  });

  it('replays a president-specific run deterministically', () => {
    const config = { difficulty: 'normal' as const, seed: 42, presidentId: 'cristina' };
    const state = initGame('normal', 42, 'es', undefined, config.presidentId);
    const card = drawNextCard(state);
    const decision = { kind: 'choice' as const, cardId: card.id, choiceIndex: 0 };
    expect(replayRun(config, [decision])).toEqual(endTurn(resolveTurn(state, card, decision).state));
  });
});
