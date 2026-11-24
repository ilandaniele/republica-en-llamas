import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { initGame } from '@republica/game-engine';
import { ShareImageCard } from '../ShareImageCard.js';

describe('ShareImageCard', () => {
  it('shows stats as whole numbers', () => {
    const base = initGame('normal', 42);
    const gameState = {
      ...base,
      economic: { ...base.economic, inflation: 43.77698455116164, marketConfidence: 70.5 },
    };
    render(<ShareImageCard gameState={gameState} presidentId="populista" score={3563} />);
    expect(screen.getByText('44')).toBeInTheDocument();
    expect(screen.getByText('71')).toBeInTheDocument();
    expect(screen.queryByText(/\d+\.\d+/)).not.toBeInTheDocument();
  });

  it('points players to the host serving the game', () => {
    render(<ShareImageCard gameState={initGame('normal', 42)} presidentId="populista" score={0} />);
    expect(screen.getByText(`REPÚBLICA EN LLAMAS — JUGÁ EN ${window.location.host}`)).toBeInTheDocument();
  });
});
