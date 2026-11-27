import { describe, expect, it } from 'vitest';
import type { EventCard } from '@republica/game-engine';
import { isTimedTurn } from '../crisisExpress.js';

const card = (category: EventCard['category']) => ({ category }) as EventCard;

describe('isTimedTurn', () => {
  it('times every Crisis Express card', () => {
    expect(isTimedTurn(card('economic'), true, 'normal')).toBe(true);
  });

  it('times crisis cards outside easy mode', () => {
    expect(isTimedTurn(card('crisis'), false, 'normal')).toBe(true);
    expect(isTimedTurn(card('crisis'), false, 'hard')).toBe(true);
    expect(isTimedTurn(card('crisis'), false, 'easy')).toBe(false);
  });

  it('leaves regular cards untimed', () => {
    expect(isTimedTurn(card('political'), false, 'normal')).toBe(false);
    expect(isTimedTurn(null, false, 'normal')).toBe(false);
  });
});
