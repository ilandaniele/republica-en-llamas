import { describe, it, expect } from 'vitest';
import { checkGameOver } from '../gameOver.js';
import { initGame } from '../gameLoop.js';
import type { GameState } from '../types.js';

describe('checkGameOver', () => {
  it('returns null for a normal game state', () => {
    const state = initGame('normal', 42);
    expect(checkGameOver(state)).toBeNull();
  });

  it('returns hyperinflation when inflation > 150', () => {
    const state = {
      ...initGame('normal', 42),
      economic: { ...initGame('normal', 42).economic, inflation: 155 },
    };
    const result = checkGameOver(state);
    expect(result?.reason).toBe('hyperinflation');
    expect(result?.isWin).toBe(false);
  });

  it('returns popularityCollapse after 3 turns of low popularity', () => {
    const state = {
      ...initGame('normal', 42),
      political: {
        ...initGame('normal', 42).political,
        popularity: 3,
        popularityLowStreak: 3,
      },
    };
    const result = checkGameOver(state);
    expect(result?.reason).toBe('popularityCollapse');
  });

  it('returns socialCollapse when stability === 0', () => {
    const state = {
      ...initGame('normal', 42),
      political: {
        ...initGame('normal', 42).political,
        socialStability: 0,
      },
    };
    const result = checkGameOver(state);
    expect(result?.reason).toBe('socialCollapse');
  });

  it('returns bankrupt when no reserves and low confidence', () => {
    const state = {
      ...initGame('normal', 42),
      economic: {
        ...initGame('normal', 42).economic,
        foreignReserves: 0,
        marketConfidence: 5,
      },
    };
    const result = checkGameOver(state);
    expect(result?.reason).toBe('bankrupt');
  });

  it('returns impeachment when crisis active for 3+ turns', () => {
    const state: GameState = {
      ...initGame('normal', 42),
      activeCrises: [
        {
          type: 'impeachmentAttempt',
          startTurn: 1,
          turnsActive: 3,
          turnsToResolve: 3,
          resolved: false,
        },
      ],
    };
    const result = checkGameOver(state);
    expect(result?.reason).toBe('impeachment');
  });

  it('returns term_complete and isWin=true at turn 50', () => {
    const state = { ...initGame('normal', 42), turn: 50 };
    const result = checkGameOver(state);
    expect(result?.reason).toBe('term_complete');
    expect(result?.isWin).toBe(true);
  });
});
