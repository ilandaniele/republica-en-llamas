import { describe, it, expect } from 'vitest';
import { detectCrises, isCrisisResolved } from '../crises.js';
import { initGame } from '../gameLoop.js';
import type { GameState } from '../types.js';

function makeState(overrides: Partial<GameState['political']> = {}, economicOverrides: Partial<GameState['economic']> = {}, congressOverrides: Partial<GameState['congress']> = {}): GameState {
  const base = initGame('normal', 42);
  return {
    ...base,
    turn: 15, // past crisisMinTurn (5) and impeachmentMinTurn (10)
    political: { ...base.political, ...overrides },
    economic: { ...base.economic, ...economicOverrides },
    congress: { ...base.congress, ...congressOverrides },
  };
}

describe('detectCrises', () => {
  it('detects debtCrisis when deficit >= 70 and confidence <= 30', () => {
    const state = makeState({}, { publicDeficit: 75, marketConfidence: 25 });
    const crises = detectCrises(state);
    expect(crises.some((c) => c.type === 'debtCrisis')).toBe(true);
  });

  it('does not detect debtCrisis when only one condition is met', () => {
    const state = makeState({}, { publicDeficit: 75, marketConfidence: 50 });
    const crises = detectCrises(state);
    expect(crises.some((c) => c.type === 'debtCrisis')).toBe(false);
  });

  it('detects hyperinflationSpiral when inflation >= 40 and currency <= 25', () => {
    const state = makeState({}, { inflation: 45, currencyStrength: 20 });
    const crises = detectCrises(state);
    expect(crises.some((c) => c.type === 'hyperinflationSpiral')).toBe(true);
  });

  it('detects socialUnrest when stability <= 20 and popularity <= 15', () => {
    const state = makeState({ socialStability: 15, popularity: 10 });
    const crises = detectCrises(state);
    expect(crises.some((c) => c.type === 'socialUnrest')).toBe(true);
  });

  it('detects impeachmentAttempt when all three conditions are met', () => {
    const state = makeState({
      popularity: 8,
      mediaCredibility: 15,
      socialStability: 20,
    });
    const crises = detectCrises(state);
    expect(crises.some((c) => c.type === 'impeachmentAttempt')).toBe(true);
  });

  it('does not detect crisis if already active', () => {
    const state = {
      ...makeState({}, { publicDeficit: 75, marketConfidence: 25 }),
      activeCrises: [{
        type: 'debtCrisis' as const,
        startTurn: 1,
        turnsActive: 1,
        turnsToResolve: 4,
        resolved: false,
      }],
    };
    const crises = detectCrises(state);
    expect(crises.some((c) => c.type === 'debtCrisis')).toBe(false);
  });
});

describe('isCrisisResolved', () => {
  it('debtCrisis resolves when deficit drops significantly', () => {
    const crisis = {
      type: 'debtCrisis' as const,
      startTurn: 1,
      turnsActive: 2,
      turnsToResolve: 4,
      resolved: false,
    };
    const state = makeState({}, { publicDeficit: 55, marketConfidence: 50 });
    expect(isCrisisResolved(crisis, state)).toBe(true);
  });

  it('debtCrisis does not resolve when conditions persist', () => {
    const crisis = {
      type: 'debtCrisis' as const,
      startTurn: 1,
      turnsActive: 2,
      turnsToResolve: 4,
      resolved: false,
    };
    const state = makeState({}, { publicDeficit: 72, marketConfidence: 28 });
    expect(isCrisisResolved(crisis, state)).toBe(false);
  });
});
