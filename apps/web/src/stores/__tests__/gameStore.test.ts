import { beforeEach, describe, expect, it, vi } from 'vitest';
import { drawNextCard, initGame } from '@republica/game-engine';
import { useGameStore } from '../gameStore.js';

vi.mock('../../lib/analytics.js', () => ({
  trackTurnCompleted: vi.fn(),
  trackCrisisTriggered: vi.fn(),
}));

describe('gameStore.confirmChoice', () => {
  beforeEach(() => {
    const gameState = initGame('normal', 42, 'es');
    useGameStore.setState({
      gameState,
      currentCard: drawNextCard(gameState),
      decisions: [],
      showTransition: false,
    });
  });

  it('ignores a second confirm while the turn transition is showing', () => {
    const { currentCard, selectChoice, confirmChoice } = useGameStore.getState();
    selectChoice(currentCard!.id, 0);
    confirmChoice();
    selectChoice(currentCard!.id, 1);
    confirmChoice();

    const { gameState, decisions } = useGameStore.getState();
    expect(decisions).toHaveLength(1);
    expect(gameState!.history).toHaveLength(1);
  });
});
