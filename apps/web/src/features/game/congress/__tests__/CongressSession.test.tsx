import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LazyMotion, domAnimation } from 'framer-motion';
import {
  ALL_CARDS,
  initGame,
  resolveCongressSession,
  replayRun,
  drawNextCard,
  resolveTurn,
  endTurn,
  getSafestChoiceIndex,
  type CongressDecisions,
  type TurnDecision,
} from '@republica/game-engine';
import { CongressSession } from '../../CongressSession.js';
import { CardArea } from '../../screen/CardArea.js';
import { useGameStore } from '../../../../stores/gameStore.js';
import { initI18n } from '../../../../lib/i18n.js';

vi.mock('framer-motion', async (original) => ({
  ...(await original<typeof import('framer-motion')>()),
  useReducedMotion: () => false,
}));
vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));
vi.mock('../../../../lib/analytics.js', async (original) => ({
  ...(await original<typeof import('../../../../lib/analytics.js')>()),
  trackCongressSession: vi.fn(),
}));

const card = ALL_CARDS.find((card) => card.id === 'law_001')!;
function chamber(governmentSeats: number) {
  const state = initGame('normal', 42, 'es', undefined, 'populista');
  return {
    ...state,
    congress: {
      ...state.congress,
      governmentSeats,
      oppositionSeats: 538 - governmentSeats - 58,
      independentSeats: 58,
      independentSupportBonus: 0,
    },
  };
}
function renderSession(governmentSeats: number) {
  const state = chamber(governmentSeats);
  const done = vi.fn();
  render(
    <LazyMotion features={domAnimation}>
      <CongressSession card={card} gameState={state} presidentId="populista" onComplete={done} />
    </LazyMotion>,
  );
  return { state, done };
}

beforeEach(async () => {
  await initI18n();
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Congress session flow', () => {
  it.each([
    [280, 'LEY APROBADA'],
    [210, 'LEY RECHAZADA'],
  ])('counts a chamber with %i government seats and commits only on continue', (governmentSeats, title) => {
    const { done } = renderSession(governmentSeats as number);
    const vote = screen.getByRole('button', { name: /Llamar a votar/ });
    act(() => {
      fireEvent.click(vote);
      fireEvent.click(vote);
    });
    expect(screen.getByText('Hemiciclo en vivo')).toBeTruthy();
    expect(done).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText(title)).toBeTruthy();
    const next = screen.getByRole('button', { name: /Continuar con el gobierno/ });
    act(() => {
      fireEvent.click(next);
      fireEvent.click(next);
    });
    expect(done).toHaveBeenCalledExactlyOnceWith({ actions: [], swingChoices: [] });
  });

  it('ends the visual tally with the exact engine count and negotiates all three swing votes', () => {
    const { state, done } = renderSession(269);
    fireEvent.click(screen.getByRole('button', { name: /Llamar a votar/ }));
    act(() => vi.advanceTimersByTime(2432));
    expect(screen.getByText('SÍ: 269')).toBeTruthy();
    expect(screen.getByText('NO: 269')).toBeTruthy();
    act(() => vi.advanceTimersByTime(300));
    fireEvent.click(screen.getByRole('button', { name: /Acepto la demanda/ }));
    fireEvent.click(screen.getByRole('button', { name: /Me niego/ }));
    fireEvent.click(screen.getByRole('button', { name: /Dejarlo decidir solo/ }));
    const decisions: CongressDecisions = { actions: [], swingChoices: ['accept', 'refuse', 'decide'] };
    const expected = resolveCongressSession(state, decisions);
    expect(screen.getByText(expected.passed ? 'LEY APROBADA' : 'LEY RECHAZADA')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Continuar con el gobierno/ }));
    expect(done).toHaveBeenCalledExactlyOnceWith(decisions);
  });

  it('skips the visual animation without skipping a close-vote negotiation', () => {
    renderSession(269);
    fireEvent.click(screen.getByRole('button', { name: /Llamar a votar/ }));
    fireEvent.click(screen.getByRole('button', { name: /Completar recuento/ }));
    expect(screen.getByRole('button', { name: /Acepto la demanda/ })).toBeTruthy();
    expect(screen.queryByText('Hemiciclo en vivo')).toBeNull();
  });

  it('completes a decree immediately and disables it when negotiation points are exhausted', () => {
    const { done } = renderSession(210);
    fireEvent.click(screen.getByRole('button', { name: /Amenazar con decreto/ }));
    expect(screen.getByText('DECRETO DE NECESIDAD Y URGENCIA')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Continuar con el gobierno/ }));
    expect(done).toHaveBeenCalledExactlyOnceWith({ actions: ['decreto'], swingChoices: [] });
    cleanup();
    renderSession(210);
    for (const name of [/Llamar al bloque radical/, /Ofrecer partida presupuestaria/, /Cadena nacional/]) {
      fireEvent.click(screen.getByRole('button', { name }));
    }
    expect(screen.getByRole('button', { name: /Amenazar con decreto/ })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /Llamar a votar/ }));
    fireEvent.click(screen.getByRole('button', { name: /Completar recuento/ }));
    expect(screen.getByRole('button', { name: /Continuar con el gobierno/ })).toBeTruthy();
  });

  it('saves one congressional decision, advances one turn and resumes from replay', () => {
    const config = {
      seed: 42,
      difficulty: 'normal' as const,
      language: 'es' as const,
      presidentId: 'populista',
    };
    let state = initGame(config.difficulty, config.seed, config.language, undefined, config.presidentId);
    const decisions: TurnDecision[] = [];
    let law = drawNextCard(state);
    while (!state.isGameOver && !law.isLaw && decisions.length < 50) {
      const decision: TurnDecision = {
        kind: 'choice',
        cardId: law.id,
        choiceIndex: getSafestChoiceIndex(law),
      };
      decisions.push(decision);
      state = endTurn(resolveTurn(state, law, decision).state);
      law = drawNextCard(state);
    }
    expect(law.isLaw).toBe(true);
    useGameStore.getState().resetGame();
    useGameStore.setState({
      gameState: state,
      currentCard: law,
      runConfig: config,
      decisions,
      isAnimating: false,
      showTransition: false,
      isCrisisExpress: false,
    });
    render(
      <LazyMotion features={domAnimation}>
        <CardArea gameState={state} />
      </LazyMotion>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Llamar a votar/ }));
    fireEvent.click(screen.getByRole('button', { name: /Completar recuento/ }));
    for (let index = 0; index < 3; index++) {
      const accept = screen.queryByRole('button', { name: /Acepto la demanda/ });
      if (accept) fireEvent.click(accept);
    }
    fireEvent.click(screen.getByRole('button', { name: /Continuar con el gobierno/ }));
    const committed = useGameStore.getState();
    expect(committed.decisions).toHaveLength(decisions.length + 1);
    expect(committed.gameState?.turn).toBe(state.turn + 1);
    expect(committed.showTransition).toBe(true);
    expect(committed.gameState).toEqual(replayRun(config, committed.decisions));
    act(() => committed.dismissTransition());
    expect(useGameStore.getState().showTransition).toBe(false);
    expect(useGameStore.getState().currentCard).toBeTruthy();
  });
});
