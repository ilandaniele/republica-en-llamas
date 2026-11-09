import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { drawNextCard, initGame, type GameState } from '@republica/game-engine';
import { CardArea } from '../../screen/CardArea.js';
import { DebateSummary } from '../DebateSummary.js';
import { useGameStore } from '../../../../stores/gameStore.js';
import { initI18n } from '../../../../lib/i18n.js';

vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));

const original = useGameStore.getState();
function startState(): GameState {
  const state = initGame('normal', 42, 'es', undefined, 'kicillof');
  return {
    ...state,
    turn: 37,
    political: { ...state.political, popularity: 60, mediaCredibility: 70, socialStability: 70 },
    economic: {
      ...state.economic,
      inflation: 15,
      publicDeficit: 25,
      marketConfidence: 70,
      foreignReserves: 70,
      currencyStrength: 70,
    },
  };
}

beforeEach(async () => {
  localStorage.setItem('language', 'es');
  await initI18n();
  useGameStore.setState(original, true);
});
afterEach(() => {
  cleanup();
  useGameStore.setState(original, true);
});

describe('debate through the real game store', () => {
  it('shows four candidates, rival exchanges and four selectable replies with confirmation', () => {
    const state = startState();
    useGameStore.setState({ gameState: state, currentCard: drawNextCard(state), presidentId: 'kicillof' });
    const { container } = render(<CardArea gameState={state} />);
    expect(screen.getByText('Cruce 1 de 3')).toBeTruthy();
    expect(container.querySelectorAll('.debate-exchanges li')).toHaveLength(3);
    expect(screen.getAllByRole('img')).toHaveLength(4);
    expect(container.querySelectorAll('.debate-option')).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'Responder en el debate' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /Defender mi gestión/ }));
    expect(useGameStore.getState().pendingChoiceIndex).not.toBeNull();
    expect(useGameStore.getState().gameState?.debate).toBeUndefined();
  });

  it('commits one reply, preserves the round across redraw, and reaches the actual election', () => {
    let state = startState();
    useGameStore.setState({ gameState: state, currentCard: drawNextCard(state), presidentId: 'kicillof' });
    const { rerender } = render(<CardArea gameState={state} />);
    for (let round = 1; round <= 3; round++) {
      fireEvent.click(screen.getByRole('button', { name: /Defender mi gestión/ }));
      fireEvent.click(screen.getByRole('button', { name: 'Responder en el debate' }));
      state = useGameStore.getState().gameState!;
      expect(state.debate?.rounds).toHaveLength(round);
      expect(useGameStore.getState().decisions).toHaveLength(round);
      useGameStore.getState().dismissTransition();
      rerender(<CardArea gameState={state} />);
    }
    expect(state.debate?.outcome).toBe('win');
    const skipCount = screen.queryByRole('button', { name: 'Ver resultado completo' });
    if (skipCount) fireEvent.click(skipCount);
    expect(screen.getByText('EL ELECTORADO RENUEVA TU MANDATO')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Reconocer el resultado/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Aceptar el nuevo mandato' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar el escrutinio' }));
    expect(useGameStore.getState().gameState?.gameOverReason).toBe('term_complete');
    expect(useGameStore.getState().decisions).toHaveLength(4);
  });

  it('displays the feedback, final result and score impact', () => {
    let state = startState();
    useGameStore.setState({ gameState: state, currentCard: drawNextCard(state), presidentId: 'kicillof' });
    for (let i = 0; i < 3; i++) {
      const store = useGameStore.getState();
      const index = store.currentCard!.choices.findIndex(
        (choice) => choice.textKey === 'debate.reply.defend',
      );
      store.selectChoice(store.currentCard!.id, index);
      useGameStore.getState().confirmChoice();
      useGameStore.getState().dismissTransition();
    }
    state = useGameStore.getState().gameState!;
    render(<DebateSummary debate={state.debate!} />);
    expect(screen.getByText('GANASTE EL DEBATE')).toBeTruthy();
    expect(screen.getByText(/Puntaje por resultado del debate: 60/)).toBeTruthy();
    expect(screen.getByText(/ganar el debate no garantiza ganar las urnas/)).toBeTruthy();
  });

  it('shows only the losing electoral result when support is insufficient', () => {
    const initial = startState();
    const state = { ...initial, turn: 40, political: { ...initial.political, popularity: 25 } };
    useGameStore.setState({ gameState: state, currentCard: drawNextCard(state) });
    render(<CardArea gameState={state} />);
    const skipCount = screen.queryByRole('button', { name: 'Ver resultado completo' });
    if (skipCount) fireEvent.click(skipCount);
    expect(screen.getByText('LA OPOSICIÓN GANA LAS ELECCIONES')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Aceptar el nuevo mandato' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Reconocer el resultado y preparar la transición' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar el escrutinio' }));
    expect(useGameStore.getState().gameState?.lameDuckMode).toBe(true);
  });
});
