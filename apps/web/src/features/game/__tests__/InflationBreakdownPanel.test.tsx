import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { advanceTurn, applyChoice, initGame } from '@republica/game-engine';
import { InflationBreakdownPanel } from '../InflationBreakdownPanel.js';

afterEach(cleanup);

describe('inflation explanation', () => {
  it('distinguishes a direct price effect from the final inflation rate and uses percentage points', () => {
    const state = advanceTurn(applyChoice(initGame('normal', 42), 'eco_005', 0));
    const b = state.lastInflationBreakdown!;
    render(<InflationBreakdownPanel breakdown={b} />);
    expect(screen.getByText('Efecto directo de la decisión')).toBeTruthy();
    expect(screen.getByText('+4.0 pp')).toBeTruthy();
    expect(screen.getByText(`${b.newInflation.toFixed(1)}%`)).toBeTruthy();
  });

  it('explains that economic drift continues when a political choice has no direct effect', () => {
    const state = advanceTurn(applyChoice(initGame('normal', 42), 'int_003', 2));
    render(<InflationBreakdownPanel breakdown={state.lastInflationBreakdown!} />);
    expect(screen.getByText(/Efecto directo: 0.0 puntos porcentuales/)).toBeTruthy();
    expect(screen.queryByText('Efecto directo de la decisión')).toBeNull();
  });
});
