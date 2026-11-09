import type { GameState } from './types.js';
import { SCORE_CONFIG } from './constants.js';

export function calculateScore(state: GameState): number {
  if (state.career && state.career.office !== 'president') {
    const career = state.career;
    return Math.round(
      state.turn * 100 +
        career.management * 2 +
        career.alliances +
        career.integrity +
        career.budget +
        state.political.popularity * 2,
    );
  }
  return Math.round(
    state.turn * SCORE_CONFIG.TURN_MULTIPLIER +
      state.political.popularity * SCORE_CONFIG.POPULARITY_MULTIPLIER +
      state.political.socialStability * SCORE_CONFIG.STABILITY_MULTIPLIER +
      state.economic.marketConfidence * SCORE_CONFIG.MARKET_CONFIDENCE_MULTIPLIER +
      state.congress.lawsPassedThisRun * SCORE_CONFIG.LAW_PASSED_BONUS -
      state.political.emergencyDecreesUsed * SCORE_CONFIG.EMERGENCY_DECREE_PENALTY -
      state.economic.inflation * SCORE_CONFIG.INFLATION_PENALTY -
      state.economic.publicDeficit * SCORE_CONFIG.DEFICIT_PENALTY +
      (state.debate?.scoreBonus ?? 0) +
      (state.career?.completedTurns ?? 0) * 100 +
      (state.career?.promotions.length ?? 0) * 100,
  );
}
