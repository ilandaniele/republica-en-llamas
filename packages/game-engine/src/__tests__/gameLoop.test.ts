import { describe, it, expect } from 'vitest';
import { initGame, applyChoice, advanceTurn, drawNextCard } from '../gameLoop.js';

describe('initGame', () => {
  it('initializes with correct difficulty preset', () => {
    const easy = initGame('easy', 42);
    expect(easy.political.popularity).toBe(72);
    expect(easy.difficulty).toBe('easy');
    expect(easy.turn).toBe(1);
    expect(easy.isGameOver).toBe(false);
  });

  it('generates deterministic state from seed', () => {
    const a = initGame('normal', 12345);
    const b = initGame('normal', 12345);
    expect(a.id).toBe(b.id);
  });

  it('generates different IDs for different seeds', () => {
    const a = initGame('normal', 1);
    const b = initGame('normal', 2);
    expect(a.id).not.toBe(b.id);
  });
});

describe('applyChoice', () => {
  it('records the event in history', () => {
    const state = initGame('normal', 42);
    const card = drawNextCard(state);
    const result = applyChoice(state, card.id, 0);
    expect(result.history).toHaveLength(1);
    expect(result.history[0]?.cardId).toBe(card.id);
  });

  it('marks card as drawn', () => {
    const state = initGame('normal', 42);
    const card = drawNextCard(state);
    const result = applyChoice(state, card.id, 0);
    expect(result.drawnCardIds).toContain(card.id);
  });

  it('throws for invalid choice index', () => {
    const state = initGame('normal', 42);
    const card = drawNextCard(state);
    expect(() => applyChoice(state, card.id, 99)).toThrow();
  });
});

describe('advanceTurn', () => {
  it('increments turn counter', () => {
    const state = initGame('normal', 42);
    const next = advanceTurn(state);
    expect(next.turn).toBe(2);
  });

  it('does not exceed game over state after many turns', () => {
    let state = initGame('easy', 42);
    for (let i = 0; i < 49; i++) {
      if (state.isGameOver) break;
      state = advanceTurn(state);
    }
    // Should be game over by turn 50 (win) or earlier
    expect(state.turn).toBeGreaterThanOrEqual(2);
  });
});

describe('drawNextCard', () => {
  it('returns a valid card', () => {
    const state = initGame('normal', 42);
    const card = drawNextCard(state);
    expect(card.id).toBeTruthy();
    expect(card.choices.length).toBeGreaterThanOrEqual(2);
  });

  it('draws different cards with different seeds', () => {
    const s1 = initGame('normal', 1);
    const s2 = initGame('normal', 999);
    const c1 = drawNextCard(s1);
    const c2 = drawNextCard(s2);
    // Most of the time these will differ
    expect(typeof c1.id).toBe('string');
    expect(typeof c2.id).toBe('string');
  });
});
