import { describe, expect, it } from 'vitest';
import { isRunConfig, isTurnDecision, MAX_RUN_DECISIONS } from '../runValidation.js';
import { initGame, drawNextCard } from '../gameLoop.js';
import { endTurn, replayRun, resolveTurn, type RunConfig } from '../run.js';
import { canonicalPresident, isPresidentId } from '../presidents.js';

describe('run data validation', () => {
  it.each(['unknown', 'constructor', '__proto__', 'toString'])(
    'rejects unknown president/scenario %s',
    (id) => {
      expect(isPresidentId(id)).toBe(false);
      expect(canonicalPresident(id)).toBe(id);
      expect(isRunConfig({ seed: 42, difficulty: 'normal', presidentId: id })).toBe(false);
      expect(isRunConfig({ seed: 42, difficulty: 'normal', scenarioId: id })).toBe(false);
    },
  );

  it.each([-1, 1.5, Infinity, NaN, '42'])('rejects invalid seed %s', (seed) => {
    expect(isRunConfig({ seed, difficulty: 'normal' })).toBe(false);
  });

  it('accepts optional defaults, aliases and complete configurations', () => {
    expect(isRunConfig({ seed: 0, difficulty: 'normal' })).toBe(true);
    expect(
      isRunConfig({
        seed: 42,
        difficulty: 'hard',
        presidentId: 'izquierda',
        language: 'en',
        crisisExpress: true,
        scenarioId: 'convertibilidad',
      }),
    ).toBe(true);
  });

  it('rejects malformed decisions before replay', () => {
    for (const choiceIndex of [-1, 0.5, 4, '0'])
      expect(isTurnDecision({ kind: 'choice', cardId: 'pol_001', choiceIndex })).toBe(false);
    expect(
      isTurnDecision({
        kind: 'congress',
        cardId: 'law_001',
        decisions: { actions: ['constructor'], swingChoices: [] },
      }),
    ).toBe(false);
    expect(
      isTurnDecision({
        kind: 'congress',
        cardId: 'law_001',
        decisions: { actions: [], swingChoices: ['invalid'] },
      }),
    ).toBe(false);
    expect(
      isTurnDecision({
        kind: 'congress',
        cardId: 'law_001',
        decisions: { actions: Array(10).fill('cadena'), swingChoices: [] },
      }),
    ).toBe(false);
    expect(() => replayRun({ seed: 42, difficulty: 'unknown' } as unknown as RunConfig, [])).toThrow(
      'Invalid run data',
    );
    expect(() =>
      replayRun(
        { seed: 42, difficulty: 'normal' },
        Array(MAX_RUN_DECISIONS + 1).fill({ kind: 'timeout', cardId: 'pol_001' }),
      ),
    ).toThrow('Invalid run data');
  });
});

describe('presidential starting effects and final scores', () => {
  it.each([
    ['ingeniero', 'milei', -10, 0, 0, 15],
    ['populista', 'massa', 15, 0, 0, -10],
    ['tecnocrata', 'bullrich', -10, 10, 5, 0],
    ['izquierda', 'bregman', 0, 15, 0, -15],
    ['federal', 'schiaretti', -10, 5, 10, 0],
    ['corporativo', 'larreta', -15, 0, 5, 10],
  ] as const)(
    'applies %s advertised effects once, including canonical IDs',
    (alias, canonical, popularity, stability, credibility, market) => {
      const baseline = initGame('normal', 42);
      const actual = initGame('normal', 42, 'es', undefined, alias);
      expect(actual.political.popularity).toBe(baseline.political.popularity + popularity);
      expect(actual.political.socialStability).toBe(baseline.political.socialStability + stability);
      expect(actual.political.mediaCredibility).toBe(baseline.political.mediaCredibility + credibility);
      expect(actual.economic.marketConfidence).toBe(baseline.economic.marketConfidence + market);
      expect(actual.political).toEqual(initGame('normal', 42, 'es', undefined, canonical).political);
      expect(actual.economic).toEqual(initGame('normal', 42, 'es', undefined, canonical).economic);
    },
  );

  it('keeps finished games unchanged when ending a turn', () => {
    const state = {
      ...initGame('normal', 42),
      isGameOver: true,
      gameOverReason: 'military_defeat' as const,
      score: 123,
    };
    expect(endTurn(state)).toBe(state);
    expect(endTurn(state, true)).toBe(state);
  });

  it('retains the Crisis Express score multiplier after advancing', () => {
    const state = initGame('normal', 42);
    const card = drawNextCard(state);
    const decided = resolveTurn(state, card, { kind: 'choice', cardId: card.id, choiceIndex: 0 }, true).state;
    expect(endTurn(decided, true).score).toBe(endTurn(decided).score * 2);
  });
});
