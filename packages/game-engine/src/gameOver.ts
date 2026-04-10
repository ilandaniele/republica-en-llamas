import type { GameState, GameOverResult } from './types.js';
import { GAME_OVER } from './constants.js';
import { calculateScore } from './scoring.js';

export function checkGameOver(state: GameState): GameOverResult | null {
  const { political, economic, activeCrises, turn } = state;

  // In lame duck mode the countdown in advanceTurn handles the game over
  if (state.lameDuckMode) return null;

  // Win condition: survived all 50 turns
  if (turn >= GAME_OVER.MAX_TURNS) {
    return {
      reason: 'term_complete',
      score: calculateScore(state),
      turn,
      isWin: true,
    };
  }

  // Hyperinflation
  if (economic.inflation > GAME_OVER.MAX_INFLATION) {
    return {
      reason: 'hyperinflation',
      score: calculateScore(state),
      turn,
      isWin: false,
    };
  }

  // Deflationary spiral (3+ consecutive turns below -10%)
  if ((state.deflationStreakTurns ?? 0) >= 3 && economic.inflation < -10) {
    return {
      reason: 'deflation_spiral',
      score: calculateScore(state),
      turn,
      isWin: false,
    };
  }

  // Popularity collapse (3 consecutive turns below 5)
  if (
    political.popularity < GAME_OVER.MIN_POPULARITY &&
    political.popularityLowStreak >= GAME_OVER.MIN_POPULARITY_STREAK
  ) {
    return {
      reason: 'popularityCollapse',
      score: calculateScore(state),
      turn,
      isWin: false,
    };
  }

  // Social collapse
  if (political.socialStability <= GAME_OVER.MIN_SOCIAL_STABILITY) {
    return {
      reason: 'socialCollapse',
      score: calculateScore(state),
      turn,
      isWin: false,
    };
  }

  // Bankruptcy: no reserves + no market confidence
  if (
    economic.foreignReserves <= GAME_OVER.MIN_FOREIGN_RESERVES &&
    economic.marketConfidence < GAME_OVER.MIN_MARKET_CONFIDENCE_FOR_BANKRUPT
  ) {
    return {
      reason: 'bankrupt',
      score: calculateScore(state),
      turn,
      isWin: false,
    };
  }

  // Impeachment crisis unresolved
  const impeachment = activeCrises.find((c) => c.type === 'impeachmentAttempt');
  if (impeachment && impeachment.turnsActive >= GAME_OVER.IMPEACHMENT_RESOLVE_TURNS) {
    return {
      reason: 'impeachment',
      score: calculateScore(state),
      turn,
      isWin: false,
    };
  }

  // Presidential election: handled via pol_election_result card + lame duck mode in gameLoop

  return null;
}
