import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { drawNextCard, initGame } from '@republica/game-engine';
import { useGameStore } from '../../../../stores/gameStore.js';
import { initI18n } from '../../../../lib/i18n.js';
import { useChoiceHotkeys } from '../../screen/useChoiceHotkeys.js';
import { CardArea } from '../../screen/CardArea.js';

vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: () => false,
}));
const original = useGameStore.getState();
function ElectionHarness() {
  const state = useGameStore((s) => s.gameState)!;
  const card = useGameStore((s) => s.currentCard);
  const pendingChoiceIndex = useGameStore((s) => s.pendingChoiceIndex);
  const showTransition = useGameStore((s) => s.showTransition);
  const selectChoice = useGameStore((s) => s.selectChoice);
  const confirmChoice = useGameStore((s) => s.confirmChoice);
  useChoiceHotkeys({ card, enabled: !showTransition, pendingChoiceIndex, selectChoice, confirmChoice });
  return <CardArea gameState={state} />;
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

it('blocks early keyboard confirmation, then commits exactly once after the count', () => {
  const initial = initGame('normal', 42, 'es', undefined, 'milei');
  const state = { ...initial, turn: 40, political: { ...initial.political, popularity: 70 } };
  useGameStore.setState({ gameState: state, currentCard: drawNextCard(state) });
  render(<ElectionHarness />);
  fireEvent.keyDown(document.body, { key: 'a' });
  fireEvent.keyDown(document.body, { key: 'Enter' });
  expect(useGameStore.getState().pendingChoiceIndex).toBeNull();
  expect(useGameStore.getState().decisions).toHaveLength(0);
  fireEvent.click(screen.getByRole('button', { name: 'Ver resultado completo' }));
  fireEvent.keyDown(document.body, { key: 'a' });
  expect(useGameStore.getState().pendingChoiceIndex).toBe(0);
  fireEvent.keyDown(document.body, { key: 'Enter' });
  fireEvent.keyDown(document.body, { key: 'Enter' });
  expect(useGameStore.getState().gameState?.gameOverReason).toBe('term_complete');
  expect(useGameStore.getState().decisions).toHaveLength(1);
  expect(
    useGameStore.getState().gameState?.history.filter((event) => event.cardId === 'pol_election_result'),
  ).toHaveLength(1);
});
