import { describe, expect, it } from 'vitest';
import { advanceTurn, applyChoice, drawNextCard, initGame } from '../gameLoop.js';
import {
  CAREER_START_OFFICES,
  canAdvanceCareer,
  getCareerChoicePreview,
  type CareerStartOffice,
} from '../career.js';
import { endTurn, replayRun, resolveTurn, type RunConfig, type TurnDecision } from '../run.js';
import { PRESIDENT_IDS } from '../presidents.js';
import { isRunConfig } from '../runValidation.js';
import { es } from '../i18n/es.js';
import { en } from '../i18n/en.js';

function reachPresidency(office: CareerStartOffice, presidentId = 'massa') {
  const config: RunConfig = { difficulty: 'normal', seed: 42, presidentId, careerStart: office };
  let state = initGame(config.difficulty, config.seed, 'es', undefined, presidentId, office);
  const decisions: TurnDecision[] = [];
  while (state.career?.office !== 'president' && !state.isGameOver && decisions.length < 60) {
    const card = drawNextCard(state);
    const choiceIndex = card.id.endsWith('_promotion') ? 0 : state.career!.officeTurn % 5 === 0 ? 2 : 1;
    const decision: TurnDecision = { kind: 'choice', cardId: card.id, choiceIndex };
    state = endTurn(resolveTurn(state, card, decision).state);
    decisions.push(decision);
  }
  return { state, config, decisions };
}

describe('political career', () => {
  it('previews actual clamped resource costs rather than raw card values', () => {
    const initial = initGame('hard', 42, 'es', undefined, 'massa', 'mayor');
    const state = { ...initial, career: { ...initial.career!, budget: 2, integrity: 95 } };
    const before = structuredClone(state);
    const card = drawNextCard(state);
    expect(getCareerChoicePreview(state, card.id, 0).find((item) => item.key === 'budget')?.delta).toBe(-2);
    expect(getCareerChoicePreview(state, card.id, 2).find((item) => item.key === 'integrity')?.delta).toBe(5);
    expect(state).toEqual(before);
  });
  it.each(CAREER_START_OFFICES)(
    'starts as %s with its own cards and without national economic drift',
    (office) => {
      const state = initGame('normal', 42, 'es', undefined, 'massa', office);
      expect(state.career?.office).toBe(office);
      const card = drawNextCard(state);
      expect(card.careerOffice).toBe(office);
      expect(card.choices).toHaveLength(4);
      for (const dictionary of [es, en])
        for (const key of [card.titleKey, card.bodyKey, ...card.choices.map((choice) => choice.textKey)])
          expect(dictionary[key]).toBeTruthy();
      const next = advanceTurn(applyChoice(state, card.id, 1));
      expect(next.economic).toEqual(state.economic);
      expect(next.activeShocks).toHaveLength(0);
      expect(next.career?.management).toBeGreaterThan(state.career!.management);
      expect(state.career?.officeTurn).toBe(1);
    },
  );

  it.each(CAREER_START_OFFICES)(
    'can rise from %s and replays the entire career through the national game',
    (office) => {
      const { state: president, config, decisions } = reachPresidency(office);
      expect(president.career?.office).toBe('president');
      expect(president.turn).toBe(1);
      expect(president.history).toHaveLength(0);
      expect(president.career?.previousHistory).toHaveLength(decisions.length);
      expect(president.career?.completedTurns).toBe(decisions.length);
      expect(president.career?.promotions).toHaveLength(3 - CAREER_START_OFFICES.indexOf(office));
      expect(replayRun(config, decisions)).toEqual(president);
      const date = president.currentYear * 12 + president.currentMonth;
      let state = president;
      while (!state.isGameOver && decisions.length < 120) {
        const card = drawNextCard(state);
        expect(card.careerOffice).toBeUndefined();
        const decision: TurnDecision = card.isLaw
          ? { kind: 'congress', cardId: card.id, decisions: { actions: [], swingChoices: [] } }
          : { kind: 'choice', cardId: card.id, choiceIndex: state.turn % card.choices.length };
        state = endTurn(resolveTurn(state, card, decision).state);
        decisions.push(decision);
        expect(state.currentYear * 12 + state.currentMonth).toBeGreaterThanOrEqual(date);
      }
      expect(state.isGameOver).toBe(true);
      expect(replayRun(config, decisions)).toEqual(state);
    },
  );

  it.each(PRESIDENT_IDS)('preserves %s identity when assuming the presidency', (president) => {
    const { state } = reachPresidency('mayor', president);
    expect(state.career?.office).toBe('president');
    expect(state.presidentId).toBe(president);
    expect(state.seed).toBe(42);
    expect(state.career?.budget).toBe(33);
    expect(state.economic.foreignReserves).toBe(
      initGame('normal', 42, 'es', undefined, president).economic.foreignReserves,
    );
  });

  it('rejects premature promotion and does not allow a national card in a local office', () => {
    const state = initGame('normal', 42, 'es', undefined, 'massa', 'mayor');
    expect(() => applyChoice(state, 'career_mayor_promotion', 0)).toThrow();
    expect(() => applyChoice(state, 'eco_001', 0)).toThrow();
    const gate = { ...state, turn: 6, career: { ...state.career!, officeTurn: 6 } };
    expect(canAdvanceCareer(gate)).toBe(false);
    const result = endTurn(
      resolveTurn(gate, drawNextCard(gate), {
        kind: 'choice',
        cardId: 'career_mayor_promotion',
        choiceIndex: 0,
      }).state,
    );
    expect(result.career?.office).toBe('mayor');
    expect(result.career?.lastOutcome).toBe('not_ready');
    expect(result.political.popularity).toBeLessThan(gate.political.popularity);
    expect(result.isGameOver).toBe(false);
  });

  it('ends stalled or corrupt careers rather than automatically promoting them', () => {
    const state = initGame('normal', 42, 'es', undefined, 'massa', 'minister');
    const late = { ...state, turn: 15, career: { ...state.career!, officeTurn: 15 } };
    const card = drawNextCard(late);
    const ended = endTurn(resolveTurn(late, card, { kind: 'choice', cardId: card.id, choiceIndex: 1 }).state);
    expect(ended.isGameOver).toBe(true);
    expect(ended.career?.lastOutcome).toBe('stalled');
    let corrupt = state;
    for (let i = 0; i < 5 && !corrupt.isGameOver; i++)
      corrupt = advanceTurn(applyChoice(corrupt, drawNextCard(corrupt).id, 3));
    expect(corrupt.isGameOver).toBe(true);
    expect(corrupt.gameOverReason).toBe('impeachment');
    expect(corrupt.career?.office).toBe('minister');
  });

  it('rejects incompatible or unknown career configurations', () => {
    expect(isRunConfig({ seed: 42, difficulty: 'normal', careerStart: 'mayor' })).toBe(true);
    for (const extra of [
      { careerStart: 'senator' },
      { careerStart: 'mayor', crisisExpress: true },
      { careerStart: 'mayor', scenarioId: 'convertibilidad' },
    ])
      expect(isRunConfig({ seed: 42, difficulty: 'normal', ...extra })).toBe(false);
    expect(() => initGame('normal', 42, 'es', 'convertibilidad', 'massa', 'mayor')).toThrow();
  });
});
