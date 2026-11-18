import { beforeEach, describe, expect, it, vi } from 'vitest';
import { drawNextCard, initGame, replayRun } from '@republica/game-engine';
import { useGameStore } from '../gameStore.js';
import { restoreGameStore } from '../restoreGameStore.js';
import { requestRunTicket } from '../../lib/runTicket.js';
import type { RunTicketResult } from '../../lib/runTicket.js';
import { trackTurnCompleted } from '../../lib/analytics.js';

vi.mock('../../lib/runTicket.js', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/runTicket.js')>()),
  requestRunTicket: vi.fn(),
}));

vi.mock('../../lib/analytics.js', () => ({
  trackTurnCompleted: vi.fn(),
  trackCrisisTriggered: vi.fn(),
}));

describe('gameStore.confirmChoice', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
    vi.clearAllMocks();
    vi.mocked(requestRunTicket).mockResolvedValue({ ticket: { id: 'ticket-1', seed: 42 }, error: null });
    const gameState = initGame('normal', 42, 'es');
    useGameStore.setState({
      gameState,
      currentCard: drawNextCard(gameState),
      decisions: [],
      showTransition: false,
      presidentId: 'populista',
      isCrisisExpress: false,
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

  it.each([
    'ingeniero',
    'populista',
    'tecnocrata',
    'izquierda',
    'federal',
    'corporativo',
    'nestor',
    'cristina',
    'macri',
    'del_cano',
  ])('starts and replays as the selected president %s', async (president) => {
    await useGameStore.getState().startNewGame('normal');
    useGameStore.getState().setPresidentId(president);
    const { gameState, runConfig, currentCard, runTicketId } = useGameStore.getState();
    expect(gameState).toEqual(replayRun(runConfig!, []));
    expect(gameState?.presidentId).toBe(president);
    expect(currentCard).toEqual(drawNextCard(gameState!));
    expect(runTicketId).toBe('ticket-1');
  });

  it('synchronizes Crisis Express before the first decision and locks identity after it', async () => {
    await useGameStore.getState().startNewGame('normal');
    useGameStore.getState().setCrisisExpress(true);
    expect(useGameStore.getState().runConfig?.crisisExpress).toBe(true);
    const card = useGameStore.getState().currentCard!;
    useGameStore.getState().selectChoice(card.id, 0);
    useGameStore.getState().confirmChoice();
    const before = useGameStore.getState();
    before.setPresidentId('macri');
    before.setCrisisExpress(false);
    expect(useGameStore.getState().presidentId).toBe(before.presidentId);
    expect(useGameStore.getState().isCrisisExpress).toBe(true);
  });

  it('advances only once and records each accepted decision once', async () => {
    await useGameStore.getState().startNewGame('normal');
    const card = useGameStore.getState().currentCard!;
    useGameStore.getState().selectChoice(card.id, 0);
    useGameStore.getState().confirmChoice();
    useGameStore.getState().dismissTransition();
    const after = useGameStore.getState().gameState;
    useGameStore.getState().dismissTransition();
    expect(useGameStore.getState().gameState).toBe(after);
    expect(trackTurnCompleted).toHaveBeenCalledTimes(1);
    expect(after).toEqual(replayRun(useGameStore.getState().runConfig!, useGameStore.getState().decisions));
  });

  it('ignores stale cards and invalid choices', () => {
    const card = useGameStore.getState().currentCard!;
    useGameStore.getState().selectChoice('old_card', 0);
    useGameStore.getState().selectChoice(card.id, -1);
    useGameStore.getState().selectChoice(card.id, 99);
    expect(useGameStore.getState().pendingChoiceIndex).toBeNull();
    useGameStore.getState().commitDecision({ kind: 'choice', cardId: 'old_card', choiceIndex: 0 });
    expect(useGameStore.getState().decisions).toHaveLength(0);
  });

  it('reloads during a transition into the next turn with no duplicated decision', async () => {
    await useGameStore.getState().startNewGame('normal');
    const card = useGameStore.getState().currentCard!;
    useGameStore.getState().selectChoice(card.id, 0);
    useGameStore.getState().confirmChoice();
    expect(useGameStore.getState().showTransition).toBe(true);
    const committed = useGameStore.getState();
    expect(committed.gameState).toEqual(replayRun(committed.runConfig!, committed.decisions));
    await useGameStore.persist.rehydrate();
    const restored = useGameStore.getState();
    expect(restored.showTransition).toBe(false);
    expect(restored.isAnimating).toBe(false);
    expect(restored.decisions).toHaveLength(1);
    expect(restored.gameState).toEqual(replayRun(restored.runConfig!, restored.decisions));
    expect(restored.currentCard).toEqual(drawNextCard(restored.gameState!));
  });

  it('persists decisions rather than serialized engine state and card objects', async () => {
    await useGameStore.getState().startNewGame('normal');
    const saved = JSON.parse(localStorage.getItem('republica-game-store')!);
    expect(saved.version).toBe(1);
    expect(saved.state.runConfig.seed).toBe(42);
    expect(saved.state).not.toHaveProperty('gameState');
    expect(saved.state).not.toHaveProperty('currentCard');
  });

  it('preserves preferences and reports incompatible saves instead of trusting stale cards', () => {
    const restored = restoreGameStore(
      {
        tutorialComplete: true,
        soundEnabled: false,
        language: 'en',
        personalBest: { turns: 4, score: -7 },
        gameState: { turn: 900 },
        currentCard: { id: 'removed' },
        runConfig: { seed: 42, difficulty: 'normal', presidentId: 'unknown' },
        decisions: [],
      },
      useGameStore.getState(),
    );
    expect(restored.gameState).toBeNull();
    expect(restored.currentCard).toBeNull();
    expect(restored.tutorialComplete).toBe(true);
    expect(restored.soundEnabled).toBe(false);
    expect(restored.language).toBe('en');
    expect(restored.personalBest?.score).toBe(-7);
    expect(restored.saveRecoveryMessage).toBeTruthy();
  });

  it('ignores an in-flight ticket response after resetting the game', async () => {
    let finish!: (value: RunTicketResult) => void;
    vi.mocked(requestRunTicket).mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    const pending = useGameStore.getState().startNewGame('hard');
    useGameStore.getState().resetGame();
    finish({ ticket: { id: 'old-ticket', seed: 123 }, error: null });
    await pending;
    expect(useGameStore.getState().gameState).toBeNull();
    expect(useGameStore.getState().runTicketId).toBeNull();
  });

  it('records why a run cannot be saved when start-run fails, and keeps it across reloads', async () => {
    vi.mocked(requestRunTicket).mockResolvedValueOnce({ ticket: null, error: 'daily_cap' });
    await useGameStore.getState().startNewGame('normal');
    const state = useGameStore.getState();
    expect(state.gameState).not.toBeNull();
    expect(state.runTicketId).toBeNull();
    expect(state.runTicketError).toBe('daily_cap');

    const restored = restoreGameStore(
      { runConfig: state.runConfig, decisions: [], runTicketError: 'daily_cap' },
      useGameStore.getInitialState(),
    );
    expect(restored.runTicketError).toBe('daily_cap');
    expect(
      restoreGameStore({ runConfig: state.runConfig, decisions: [], runTicketError: 'bogus' }, state)
        .runTicketError,
    ).toBeNull();
  });

  it('clears the previous ticket error when a new run gets a ticket', async () => {
    useGameStore.setState({ runTicketError: 'network' });
    await useGameStore.getState().startNewGame('normal');
    expect(useGameStore.getState().runTicketId).toBe('ticket-1');
    expect(useGameStore.getState().runTicketError).toBeNull();
  });
});
