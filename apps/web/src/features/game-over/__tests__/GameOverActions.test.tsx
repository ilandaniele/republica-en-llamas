import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RunConfig } from '@republica/game-engine';
import { initI18n } from '../../../lib/i18n.js';
import { ApiError } from '../../../lib/api.js';
import { useGameStore } from '../../../stores/gameStore.js';
import { GameOverActions } from '../GameOverActions.js';

const apiSend = vi.hoisted(() => vi.fn());
vi.mock('../../../lib/api.js', async (importOriginal) => ({
  ApiError: (await importOriginal<typeof import('../../../lib/api.js')>()).ApiError,
  isOfflineMode: false,
  apiSend,
}));
vi.mock('../../../lib/playtest.js', () => ({ isPlaytestMode: false }));
vi.mock('../../../hooks/useAuth.js', () => ({ useAuth: () => ({ user: { id: 'u1' } }) }));
vi.mock('../../../app/routes.js', () => ({ prefetchOnIntent: () => ({}) }));

const config: RunConfig = { difficulty: 'normal', seed: 42 };

function renderActions() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <GameOverActions />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeAll(async () => {
  await initI18n();
});
beforeEach(() => {
  vi.clearAllMocks();
  useGameStore.setState({
    runConfig: config,
    runTicketId: null,
    runTicketError: null,
    decisions: [],
    isCounterfactual: false,
  });
});
afterEach(cleanup);

describe('GameOverActions', () => {
  it('tells the player why a run without a ticket was not saved', () => {
    useGameStore.setState({ runTicketError: 'daily_cap' });
    renderActions();
    expect(screen.getByRole('status')).toHaveTextContent('límite diario');
    expect(screen.queryByRole('button', { name: /GUARDAR/ })).toBeNull();
  });

  it('shows a save failure and lets the player retry', async () => {
    useGameStore.setState({ runTicketId: 'ticket-1' });
    apiSend.mockRejectedValueOnce(new ApiError(500, 'Request failed'));
    renderActions();
    fireEvent.click(screen.getByRole('button', { name: /GUARDAR/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo guardar la partida');
    expect(screen.getByRole('button', { name: /GUARDAR/ })).toBeEnabled();
  });

  it('explains a rate-limited save', async () => {
    useGameStore.setState({ runTicketId: 'ticket-1' });
    apiSend.mockRejectedValueOnce(new ApiError(429, 'Too many requests'));
    renderActions();
    fireEvent.click(screen.getByRole('button', { name: /GUARDAR/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Demasiados intentos de guardado');
  });

  it('offers to rewind the last decision and labels the alternative run', () => {
    const rewindLastDecision = vi.fn();
    useGameStore.setState({
      decisions: [{ kind: 'timeout', cardId: 'eco_001' }],
      isCounterfactual: true,
      rewindLastDecision,
    });
    renderActions();
    fireEvent.click(screen.getByRole('button', { name: /Y SI ELEGÍAS/ }));
    expect(rewindLastDecision).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent('no cuenta para el ranking');
  });

  it('hides the rewind button without decisions', () => {
    renderActions();
    expect(screen.queryByRole('button', { name: /Y SI ELEGÍAS/ })).toBeNull();
  });
});
