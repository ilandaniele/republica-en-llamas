import { describe, expect, it } from 'vitest';
import { advanceTurn, applyChoice, applyChoiceEffects, initGame } from '../gameLoop.js';
import { getCard } from '../events/index.js';
import { calculateInflationBreakdown } from '../inflation.js';
import { endTurn, resolveTurn } from '../run.js';
import type { GameState, InflationBreakdown } from '../types.js';

function expectAccounted(b: InflationBreakdown) {
  const total =
    b.directEffect +
    b.scenarioEffect +
    b.limitEffect +
    b.deficitPressure +
    b.marketDistrust +
    b.currencyWeakness +
    b.shockEffect +
    b.naturalDecay +
    b.accelerationEffect;
  expect(total).toBeCloseTo(b.delta, 10);
  expect(b.newInflation - b.previousInflation).toBeCloseTo(b.delta, 10);
}

describe('economic causality', () => {
  it.each([
    ['int_003', 2],
    ['hist_corral_002', 2],
    ['hist_rod_003', 0],
    ['hist_mal_003', 2],
    ['hist_hiper_002', 0],
    ['hist_hiper_002', 1],
    ['hist_hiper_002', 2],
    ['hist_kirch_003', 0],
    ['hist_kirch_003', 2],
    ['geo_002', 0],
    ['geo_002', 1],
    ['geo_002', 2],
    ['new_008', 2],
  ])('%s choice %i has no arbitrary direct price jump', (id, index) => {
    const state = initGame('normal', 42);
    const after = applyChoice(state, id as string, index as number);
    expect(after.economic.inflation).toBe(state.economic.inflation);
  });

  it('keeps ordinary economic evolution independent of purely political decisions', () => {
    const state = initGame('normal', 42);
    const after = advanceTurn(applyChoice(state, 'int_003', 2));
    expect(after.economic.inflation).toBe(advanceTurn(state).economic.inflation);
    expect(after.lastInflationBreakdown?.directEffect).toBe(0);
  });

  it('devaluation raises prices and weakens the currency; defending parity consumes reserves', () => {
    const state = initGame('normal', 42);
    const devalued = applyChoice(state, 'eco_005', 0);
    const defended = applyChoice(state, 'eco_005', 1);
    expect(devalued.economic.inflation).toBeGreaterThan(state.economic.inflation);
    expect(devalued.economic.currencyStrength).toBeLessThan(state.economic.currencyStrength);
    expect(defended.economic.inflation).toBe(state.economic.inflation);
    expect(defended.economic.currencyStrength).toBeGreaterThan(state.economic.currencyStrength);
    expect(defended.economic.foreignReserves).toBeLessThan(state.economic.foreignReserves);
  });

  it('higher interest rates have a disinflationary effect and a growth cost', () => {
    const state = initGame('normal', 42);
    const after = applyChoice(state, 'eco_chain_003', 0);
    expect(after.economic.inflation).toBeLessThan(state.economic.inflation);
    expect(after.economic.gdpGrowth).toBeLessThan(state.economic.gdpGrowth);
  });

  it('fiscal adjustment works through fundamentals without a second instant reward', () => {
    const state = initGame('normal', 42);
    const after = applyChoice(state, 'eco_009', 0);
    expect(after.economic.inflation).toBe(state.economic.inflation);
    expect(after.economic.publicDeficit).toBeLessThan(state.economic.publicDeficit);
    expect(advanceTurn(after).economic.inflation).toBeLessThan(advanceTurn(state).economic.inflation);
  });

  it('tariff rollback lowers prices while adding budget pressure', () => {
    const effects = getCard('hist_rod_001').choices[1]!.effects;
    expect(effects.inflationDelta).toBeLessThan(0);
    expect(effects.deficitDelta).toBeGreaterThan(0);
  });
});

describe('complete inflation accounting', () => {
  it('includes the actual express-mode multiplier in the direct effect', () => {
    const state = initGame('normal', 42);
    const card = getCard('eco_005');
    const result = resolveTurn(state, card, { kind: 'choice', cardId: card.id, choiceIndex: 0 }, true);
    const after = endTurn(result.state, true);
    expect(after.lastInflationBreakdown?.directEffect).toBe(6);
    expectAccounted(after.lastInflationBreakdown!);
  });
  it.each(['easy', 'normal', 'hard', 'crisis'] as const)(
    'includes scaled and clamped direct effects on %s',
    (difficulty) => {
      const initial = initGame(difficulty, 42);
      const state = { ...initial, economic: { ...initial.economic, inflation: 195 } };
      const decided = applyChoiceEffects(applyChoiceEffects(state, { inflationDelta: 12 }), {
        inflationDelta: -3,
      });
      const after = advanceTurn(decided);
      const b = after.lastInflationBreakdown!;
      expect(b.previousInflation).toBe(195);
      expect(b.directEffect).toBe(decided.economic.inflation - 195);
      expect(b.newInflation).toBe(after.economic.inflation);
      expect(after).not.toHaveProperty('pendingInflationBase');
      expectAccounted(b);
      expect(advanceTurn(after).lastInflationBreakdown?.directEffect).toBe(0);
    },
  );

  it('includes historical price pressure in the displayed total', () => {
    const initial = initGame('normal', 42, 'es', 'conflicto_iran_2024');
    const after = advanceTurn(applyChoiceEffects(initial, { inflationDelta: -5 }));
    const b = after.lastInflationBreakdown!;
    expect(b.scenarioEffect).toBeCloseTo(1.5);
    expect(b.newInflation).toBe(after.economic.inflation);
    expectAccounted(b);
  });

  it('a currency peg cannot erase an explicit devaluation', () => {
    const state = initGame('normal', 42, 'es', 'convertibilidad');
    const after = advanceTurn(applyChoice(state, 'hist_conv_003', 0));
    expect(after.economic.inflation).toBeGreaterThan(0);
    expect(after.lastInflationBreakdown?.directEffect).toBeGreaterThan(0);
    expectAccounted(after.lastInflationBreakdown!);
  });

  it('accounts for the indicator cap in extreme shocks', () => {
    const state = initGame('crisis', 42);
    const extreme: GameState = {
      ...state,
      economic: { ...state.economic, inflation: 199 },
      activeShocks: [
        {
          id: 'extreme',
          name: 'extreme',
          turnsRemaining: 1,
          inflationMod: 1000,
          marketConfidenceMod: 0,
          deficitMod: 0,
          popularityMod: 0,
        },
      ],
    };
    const b = calculateInflationBreakdown(extreme);
    expect(b.newInflation).toBe(200);
    expect(b.limitEffect).toBeLessThan(0);
    expectAccounted(b);
  });

  it('applies the final active shock turn exactly once before expiry', () => {
    const state = initGame('normal', 42);
    const shock = {
      id: 'final-turn',
      name: 'Test',
      turnsRemaining: 1,
      inflationMod: 10,
      marketConfidenceMod: 0,
      deficitMod: 0,
      popularityMod: 0,
    };
    const after = advanceTurn({ ...state, activeShocks: [shock] });
    expect(after.lastInflationBreakdown?.shockEffect).toBe(2);
    expect(after.activeShocks.some((s) => s.id === shock.id)).toBe(false);
    expect(advanceTurn(after).lastInflationBreakdown?.shockEffect).toBe(0);
  });
});
