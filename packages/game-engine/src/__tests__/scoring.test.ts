import { describe, it, expect } from 'vitest';
import { calculateScore } from '../scoring.js';
import { initGame } from '../gameLoop.js';

describe('calculateScore', () => {
  it('returns expected score for initial state', () => {
    const state = initGame('normal', 42);
    const score = calculateScore(state);
    // turn(1)*100 + pop(50)*2 + stability(55)*1.5 + market(50)*1.5 + laws(0)*50
    // - decrees(0)*75 - inflation(12)*10 - deficit(40)*5
    // = 100 + 100 + 82.5 + 75 + 0 - 0 - 120 - 200 = 37.5 -> round = 38
    expect(score).toBeCloseTo(38, 0);
  });

  it('increases with more turns survived', () => {
    const state1 = { ...initGame('normal', 42), turn: 1 };
    const state10 = { ...initGame('normal', 42), turn: 10 };
    expect(calculateScore(state10)).toBeGreaterThan(calculateScore(state1));
  });

  it('decreases with high inflation', () => {
    const base = initGame('normal', 42);
    const highInflation = {
      ...base,
      economic: { ...base.economic, inflation: 100 },
    };
    expect(calculateScore(highInflation)).toBeLessThan(calculateScore(base));
  });

  it('decreases with emergency decrees used', () => {
    const base = initGame('normal', 42);
    const withDecrees = {
      ...base,
      political: { ...base.political, emergencyDecreesUsed: 5 },
    };
    expect(calculateScore(withDecrees)).toBeLessThan(calculateScore(base));
  });

  it('increases with laws passed', () => {
    const base = initGame('normal', 42);
    const withLaws = {
      ...base,
      congress: { ...base.congress, lawsPassedThisRun: 5 },
    };
    expect(calculateScore(withLaws)).toBeGreaterThan(calculateScore(base));
  });
});
