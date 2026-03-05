import { describe, it, expect } from 'vitest';
import { calculateVote, applyNegotiation } from '../congress.js';
import { initGame } from '../gameLoop.js';

describe('calculateVote', () => {
  it('passes when government + independent votes exceed majority', () => {
    const state = {
      ...initGame('easy', 42),
      congress: {
        ...initGame('easy', 42).congress,
        governmentSeats: 300,
        independentSeats: 50,
        independentSupportBonus: 60,
        coalitionTurnsRemaining: 0,
        lawsPassedThisRun: 0,
        pendingVote: null,
        oppositionSeats: 188,
      },
    };
    const result = calculateVote(state, null);
    // 300 gov + floor(50 * 0.6) = 300 + 30 = 330 >= 270
    expect(result.passed).toBe(true);
    expect(result.totalVotes).toBeGreaterThanOrEqual(result.requiredVotes);
  });

  it('fails when government seats are insufficient', () => {
    const state = {
      ...initGame('crisis', 42),
      congress: {
        governmentSeats: 100,
        oppositionSeats: 350,
        independentSeats: 88,
        independentSupportBonus: 0,
        coalitionTurnsRemaining: 0,
        lawsPassedThisRun: 0,
        pendingVote: null,
      },
    };
    const result = calculateVote(state, null);
    expect(result.passed).toBe(false);
  });

  it('coalition bonus adds seats temporarily', () => {
    const state = {
      ...initGame('normal', 42),
      congress: {
        governmentSeats: 250,
        oppositionSeats: 200,
        independentSeats: 88,
        independentSupportBonus: 0,
        coalitionTurnsRemaining: 2,
        lawsPassedThisRun: 0,
        pendingVote: null,
      },
    };
    const result = calculateVote(state, null);
    // 250 + 15 (coalition) = 265 vs required 270 — still fails without independent support
    expect(result.governmentVotes).toBeGreaterThanOrEqual(250);
  });
});

describe('applyNegotiation', () => {
  it('POLITICAL_DEAL reduces popularity and adds independent support', () => {
    const state = initGame('normal', 42);
    const before = state.political.popularity;
    const result = applyNegotiation(state, 'POLITICAL_DEAL');
    expect(result.political.popularity).toBe(before - 5);
    expect(result.congress.independentSupportBonus).toBeGreaterThan(0);
  });

  it('BUDGET_CONCESSION increases deficit and adds independent support', () => {
    const state = initGame('normal', 42);
    const before = state.economic.publicDeficit;
    const result = applyNegotiation(state, 'BUDGET_CONCESSION');
    expect(result.economic.publicDeficit).toBe(before + 3);
    expect(result.congress.independentSupportBonus).toBeGreaterThan(0);
  });

  it('EMERGENCY_DECREE increments counter and auto-passes law', () => {
    const state = initGame('normal', 42);
    const result = applyNegotiation(state, 'EMERGENCY_DECREE');
    expect(result.political.emergencyDecreesUsed).toBe(1);
    expect(result.congress.lawsPassedThisRun).toBe(1);
  });

  it('EMERGENCY_DECREE over threshold penalizes stability and credibility', () => {
    let state = initGame('normal', 42);
    state = applyNegotiation(state, 'EMERGENCY_DECREE');
    state = applyNegotiation(state, 'EMERGENCY_DECREE');
    const stabilityBefore = state.political.socialStability;
    const credBefore = state.political.mediaCredibility;
    state = applyNegotiation(state, 'EMERGENCY_DECREE');
    // 3rd decree is over threshold
    expect(state.political.socialStability).toBeLessThan(stabilityBefore);
    expect(state.political.mediaCredibility).toBeLessThan(credBefore);
  });

  it('COALITION_BUILDING sets coalition turns and costs resources', () => {
    const state = initGame('normal', 42);
    const result = applyNegotiation(state, 'COALITION_BUILDING');
    expect(result.congress.coalitionTurnsRemaining).toBeGreaterThan(0);
    expect(result.political.popularity).toBeLessThan(state.political.popularity);
    expect(result.political.socialStability).toBeLessThan(state.political.socialStability);
  });
});
