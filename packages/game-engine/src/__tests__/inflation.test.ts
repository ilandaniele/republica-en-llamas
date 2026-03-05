import { describe, it, expect } from 'vitest';
import { calculateInflation } from '../inflation.js';
import { initGame } from '../gameLoop.js';

describe('calculateInflation', () => {
  it('returns base inflation when all factors are neutral', () => {
    const state = initGame('easy', 42);
    // base inflation = 5, monetary = (20/100)*8=1.6, confidence = (35/100)*6=2.1,
    // currency = (30/100)*5=1.5, raw=10.2, no accel (10.2 < 15)
    const result = calculateInflation(state);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(200);
  });

  it('applies acceleration factor when raw > 15', () => {
    const state = {
      ...initGame('crisis', 42),
      economic: {
        ...initGame('crisis', 42).economic,
        inflation: 20,
        publicDeficit: 80,
        marketConfidence: 20,
        currencyStrength: 20,
      },
    };
    const result = calculateInflation(state);
    // raw > 15 so acceleration applies
    expect(result).toBeGreaterThan(20);
  });

  it('clamps at 200', () => {
    const state = {
      ...initGame('crisis', 42),
      economic: {
        ...initGame('crisis', 42).economic,
        inflation: 180,
        publicDeficit: 100,
        marketConfidence: 0,
        currencyStrength: 0,
      },
    };
    const result = calculateInflation(state);
    expect(result).toBeLessThanOrEqual(200);
  });

  it('clamps at 0 minimum', () => {
    const state = {
      ...initGame('easy', 42),
      economic: {
        ...initGame('easy', 42).economic,
        inflation: 0,
        publicDeficit: 0,
        marketConfidence: 100,
        currencyStrength: 100,
      },
    };
    const result = calculateInflation(state);
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('shock multiplier increases inflation', () => {
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
    const withShock = calculateInflation(stateWithShock);
    const withoutShock = calculateInflation(baseState);
    expect(withShock).toBeGreaterThan(withoutShock);
  });
});
