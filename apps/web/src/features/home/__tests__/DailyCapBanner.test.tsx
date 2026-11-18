import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ runTicketError: null as string | null, hasPremium: false }));
vi.mock('../../../stores/gameStore.js', () => ({
  useGameStore: (selector: (s: { runTicketError: string | null }) => unknown) =>
    selector({ runTicketError: state.runTicketError }),
}));
vi.mock('../../../hooks/useEntitlements.js', () => ({
  useEntitlements: () => ({ hasPremium: state.hasPremium }),
}));
vi.mock('../../../components/BuyButton.js', () => ({ BuyButton: () => <button>Acceso Total</button> }));

const { DailyCapBanner } = await import('../DailyCapBanner.js');

afterEach(() => {
  cleanup();
  state.runTicketError = null;
  state.hasPremium = false;
});

describe('DailyCapBanner', () => {
  it('shows the cap only when the server rejected the run ticket with daily_cap', () => {
    state.runTicketError = 'daily_cap';
    render(<DailyCapBanner />);
    expect(screen.getByRole('status')).toHaveTextContent('Límite diario alcanzado');
  });

  it.each(['rate_limit', 'network', null])('stays hidden for ticket error %s', (error) => {
    state.runTicketError = error;
    render(<DailyCapBanner />);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('stays hidden for full-access players', () => {
    state.runTicketError = 'daily_cap';
    state.hasPremium = true;
    render(<DailyCapBanner />);
    expect(screen.queryByRole('status')).toBeNull();
  });
});
