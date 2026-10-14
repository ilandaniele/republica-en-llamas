import { describe, expect, it } from 'vitest';
import { resolveCongressSession, LAW_CHOICE } from '../congressSession.js';
import { initGame } from '../gameLoop.js';
import type { GameState } from '../types.js';

function stateWithCongress(
  governmentSeats: number,
  oppositionSeats: number,
  independentSeats: number,
): GameState {
  const state = initGame('normal', 42);
  return {
    ...state,
    congress: {
      ...state.congress,
      governmentSeats,
      oppositionSeats,
      independentSeats,
      independentSupportBonus: 0,
    },
  };
}

describe('resolveCongressSession', () => {
  it('is deterministic for the same state and decisions', () => {
    const state = stateWithCongress(100, 100, 57);
    const decisions = { actions: ['radical', 'cadena'] as const, swingChoices: [] };
    const first = resolveCongressSession(state, { ...decisions, actions: [...decisions.actions] });
    const second = resolveCongressSession(state, { ...decisions, actions: [...decisions.actions] });
    expect(first).toEqual(second);
    expect(first.bonusVotes).toBeGreaterThanOrEqual(11);
    expect(first.bonusVotes).toBeLessThanOrEqual(19);
    expect(first.effects).toEqual({ popularityDelta: -5, mediaCredibilityDelta: -8 });
  });

  it('passes the law by decree and charges the decree costs', () => {
    const outcome = resolveCongressSession(stateWithCongress(50, 200, 7), {
      actions: ['decreto'],
      swingChoices: [],
    });
    expect(outcome.choiceIndex).toBe(LAW_CHOICE.decree);
    expect(outcome.passed).toBe(true);
    expect(outcome.swingCandidates).toEqual([]);
    expect(outcome.effects).toEqual({
      stabilityDelta: -15,
      mediaCredibilityDelta: -12,
      emergencyDecreeDelta: 1,
    });
  });

  it('rejects the law without enough votes', () => {
    const outcome = resolveCongressSession(stateWithCongress(50, 200, 7), { actions: [], swingChoices: [] });
    expect(outcome.choiceIndex).toBe(LAW_CHOICE.rejected);
  });

  it('offers swing legislators on a close vote and charges accepted demands', () => {
    const state = stateWithCongress(127, 130, 0);
    const outcome = resolveCongressSession(state, {
      actions: [],
      swingChoices: ['accept', 'accept', 'accept'],
    });
    expect(outcome.swingCandidates).toHaveLength(3);
    expect(outcome.finalYes).toBe(outcome.votingYes + 3);
    expect(outcome.choiceIndex).toBe(LAW_CHOICE.passed);
  });

  it('throws on invalid decisions', () => {
    const state = stateWithCongress(100, 100, 57);
    expect(() =>
      resolveCongressSession(state, { actions: ['radical', 'radical'], swingChoices: [] }),
    ).toThrow();
    expect(() =>
      resolveCongressSession(state, {
        actions: ['radical', 'cadena', 'presupuesto', 'gobernadores'],
        swingChoices: [],
      }),
    ).toThrow();
    expect(() =>
      resolveCongressSession(state, { actions: ['decreto', 'radical'], swingChoices: [] }),
    ).toThrow();
    expect(() =>
      resolveCongressSession(stateWithCongress(50, 200, 7), { actions: [], swingChoices: ['accept'] }),
    ).toThrow();
  });
});
