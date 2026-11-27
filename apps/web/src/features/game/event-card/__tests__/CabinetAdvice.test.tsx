import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { initGame } from '@republica/game-engine';
import { useGameStore } from '../../../../stores/gameStore.js';
import type { EventCard } from '@republica/game-engine';
import { CabinetAdvice } from '../CabinetAdvice.js';

function card(extra: Partial<EventCard> = {}): EventCard {
  return {
    id: 'test_card',
    category: 'economic',
    titleKey: 'event.test.title',
    bodyKey: 'event.test.body',
    weight: 1,
    choices: [
      { id: 'a', textKey: 'a', effects: { deficitDelta: -20 } },
      { id: 'b', textKey: 'b', effects: { popularityDelta: 15 } },
    ],
    ...extra,
  };
}

describe('CabinetAdvice', () => {
  beforeEach(() => {
    useGameStore.setState({ gameState: initGame('normal', 42, 'es') });
  });

  it('shows which choice each advisor backs', () => {
    render(<CabinetAdvice card={card()} />);
    expect(screen.getByText('Tu gabinete opina:')).toBeTruthy();
    expect(screen.getByText(/Luis Caputo → A/)).toBeTruthy();
  });

  it('renders nothing on law cards', () => {
    const { container } = render(<CabinetAdvice card={card({ isLaw: true })} />);
    expect(container.innerHTML).toBe('');
  });
});
