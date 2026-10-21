import { describe, it, expect } from 'vitest';
import { calculateInflation, calculateInflationBreakdown } from '../inflation.js';
import { applyChoiceEffects, initGame } from '../gameLoop.js';
import type { GameState } from '../types.js';

function withEconomy(state: GameState, economic: Partial<GameState['economic']>): GameState {
  return { ...state, economic: { ...state.economic, ...economic } };
}

describe('calculateInflation', () => {
  it('keeps the normal starting economy close to its current inflation', () => {
    const state = initGame('normal', 42);
    expect(Math.abs(calculateInflation(state) - state.economic.inflation)).toBeLessThan(2);
  });

  it('lowers inflation when the fundamentals are healthy', () => {
    const state = withEconomy(initGame('normal', 42), {
      inflation: 40,
      publicDeficit: 10,
      marketConfidence: 85,
      currencyStrength: 85,
    });
    expect(calculateInflation(state)).toBeLessThan(40);
  });

  it('raises inflation when the fundamentals are broken', () => {
    const state = withEconomy(initGame('crisis', 42), {
      inflation: 20,
      publicDeficit: 80,
      marketConfidence: 20,
      currencyStrength: 20,
    });
    expect(calculateInflation(state)).toBeGreaterThan(20);
  });

  it('adds expectations once the acceleration turn is reached', () => {
    const state = withEconomy(initGame('crisis', 42), {
      inflation: 20,
      publicDeficit: 80,
      marketConfidence: 20,
      currencyStrength: 20,
    });
    expect(calculateInflationBreakdown({ ...state, turn: 0 }).accelerationEffect).toBe(0);
    expect(calculateInflationBreakdown({ ...state, turn: 5 }).accelerationEffect).toBeGreaterThan(0);
  });

  it('breakdown factors add up to the turn delta', () => {
    const b = calculateInflationBreakdown(initGame('hard', 42));
    const sum =
      b.deficitPressure +
      b.marketDistrust +
      b.currencyWeakness +
      b.shockEffect +
      b.naturalDecay +
      b.accelerationEffect;
    expect(sum).toBeCloseTo(b.delta);
  });

  it('clamps at 200', () => {
    const state = withEconomy(initGame('crisis', 42), {
      inflation: 200,
      publicDeficit: 100,
      marketConfidence: 0,
      currencyStrength: 0,
    });
    expect(calculateInflation({ ...state, turn: 10 })).toBeLessThanOrEqual(200);
  });

  it('clamps at -20 minimum (deflation floor)', () => {
    const state = withEconomy(initGame('easy', 42), { inflation: -20 });
    expect(calculateInflation(state)).toBeGreaterThanOrEqual(-20);
  });

  it('shock increases inflation', () => {
    const baseState = initGame('normal', 42);
    const stateWithShock = {
      ...baseState,
      activeShocks: [
        {
          id: 'test_shock',
          name: 'Test Shock',
          turnsRemaining: 3,
          inflationMod: 10,
          marketConfidenceMod: -5,
          deficitMod: 0,
          popularityMod: 0,
        },
      ],
    };
    expect(calculateInflation(stateWithShock)).toBeGreaterThan(calculateInflation(baseState));
  });

  it('lets card effects push inflation below zero', () => {
    const state = withEconomy(initGame('easy', 42), { inflation: 2 });
    expect(applyChoiceEffects(state, { inflationDelta: -5 }).economic.inflation).toBe(-3);
  });
});
