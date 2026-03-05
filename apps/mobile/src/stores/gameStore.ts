import { create } from 'zustand';
import type { GameState, Difficulty, Language, NegotiationType } from '@republica/game-engine';
import {
  initGame,
  applyChoice,
  advanceTurn,
  drawNextCard,
  applyNegotiation,
  calculateScore,
} from '@republica/game-engine';
import type { EventCard } from '@republica/game-engine';

interface MobileGameStore {
  gameState: GameState | null;
  currentCard: EventCard | null;
  pendingCardId: string | null;
  pendingChoiceIndex: number | null;
  isAnimating: boolean;
  showCrisisScreen: boolean;
  language: Language;
  soundEnabled: boolean;
  tutorialComplete: boolean;

  startNewGame: (difficulty: Difficulty, seed?: number) => void;
  selectChoice: (cardId: string, choiceIndex: number) => void;
  applyNegotiationAction: (type: NegotiationType) => void;
  confirmChoice: () => void;
  advanceTurnAction: () => void;
  dismissCrisisScreen: () => void;
  resetGame: () => void;
  setLanguage: (lang: Language) => void;
  setSoundEnabled: (val: boolean) => void;
  completeTutorial: () => void;
}

export const useMobileGameStore = create<MobileGameStore>((set, get) => ({
  gameState: null,
  currentCard: null,
  pendingCardId: null,
  pendingChoiceIndex: null,
  isAnimating: false,
  showCrisisScreen: false,
  language: 'es',
  soundEnabled: true,
  tutorialComplete: false,

  startNewGame: (difficulty, seed) => {
    const s = seed ?? Math.floor(Math.random() * 1_000_000);
    const state = initGame(difficulty, s, get().language);
    const card = drawNextCard(state);
    set({
      gameState: state,
      currentCard: card,
      pendingCardId: null,
      pendingChoiceIndex: null,
      isAnimating: false,
      showCrisisScreen: false,
    });
  },

  selectChoice: (cardId, choiceIndex) => {
    set({ pendingCardId: cardId, pendingChoiceIndex: choiceIndex });
  },

  applyNegotiationAction: (type) => {
    const { gameState } = get();
    if (!gameState) return;
    set({ gameState: applyNegotiation(gameState, type) });
  },

  confirmChoice: () => {
    const { gameState, pendingCardId, pendingChoiceIndex } = get();
    if (!gameState || pendingCardId === null || pendingChoiceIndex === null) return;
    const afterChoice = applyChoice(gameState, pendingCardId, pendingChoiceIndex);
    set({
      gameState: { ...afterChoice, score: calculateScore(afterChoice) },
      isAnimating: true,
      pendingCardId: null,
      pendingChoiceIndex: null,
    });
  },

  advanceTurnAction: () => {
    const { gameState } = get();
    if (!gameState) return;
    const next = advanceTurn(gameState);
    const hadCrises = gameState.activeCrises.length;
    const hasNewCrises = next.activeCrises.length > hadCrises;
    const card = next.isGameOver ? null : drawNextCard(next);
    set({
      gameState: next,
      currentCard: card,
      isAnimating: false,
      showCrisisScreen: hasNewCrises && !next.isGameOver,
    });
  },

  dismissCrisisScreen: () => set({ showCrisisScreen: false }),

  resetGame: () => set({
    gameState: null,
    currentCard: null,
    pendingCardId: null,
    pendingChoiceIndex: null,
    isAnimating: false,
    showCrisisScreen: false,
  }),

  setLanguage: (lang) => set({ language: lang }),
  setSoundEnabled: (val) => set({ soundEnabled: val }),
  completeTutorial: () => set({ tutorialComplete: true }),
}));
