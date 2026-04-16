import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Difficulty, Language, NegotiationType, GameOverReason, ScenarioId } from '@republica/game-engine';
import { isOfflineMode } from '../lib/supabase.js';
import { trackTurnCompleted, trackCrisisTriggered } from '../lib/analytics.js';
import {
  initGame,
  applyChoice,
  advanceTurn,
  drawNextCard,
  applyNegotiation,
  applyChoiceEffects,
  calculateScore,
} from '@republica/game-engine';
import type { EventCard } from '@republica/game-engine';

export interface TransitionData {
  fromTurn: number;
  toTurn: number;
  statDeltas: { label: string; delta: number; emoji: string }[];
  headline: string;
  hookText: string;
}

export interface PersonalBest {
  turns: number;
  score: number;
}

export interface VarSnapshot {
  popularity: number;
  socialStability: number;
  marketConfidence: number;
  currencyStrength: number;
  foreignReserves: number;
  inflation: number;
  publicDeficit: number;
}

function applyCrisisExpressMultiplier(before: GameState, after: GameState): GameState {
  const amp = (b: number, a: number) => {
    const d = a - b;
    return d < 0 ? Math.max(0, b + d * 1.5) : a;
  };
  return {
    ...after,
    political: {
      ...after.political,
      popularity: amp(before.political.popularity, after.political.popularity),
      socialStability: amp(before.political.socialStability, after.political.socialStability),
    },
    economic: {
      ...after.economic,
      marketConfidence: amp(before.economic.marketConfidence, after.economic.marketConfidence),
      currencyStrength: amp(before.economic.currencyStrength, after.economic.currencyStrength),
      foreignReserves: amp(before.economic.foreignReserves, after.economic.foreignReserves),
      inflation: after.economic.inflation > before.economic.inflation
        ? before.economic.inflation + (after.economic.inflation - before.economic.inflation) * 1.5
        : after.economic.inflation,
    },
  };
}

function findWorstChoiceIndex(card: EventCard): number {
  let worstIdx = 0;
  let worstScore = Infinity;
  card.choices.forEach((choice, i) => {
    const e = choice.effects;
    const score = (e.popularityDelta ?? 0) + (e.stabilityDelta ?? 0)
      + (e.marketConfidenceDelta ?? 0) + (e.currencyStrengthDelta ?? 0)
      + (e.foreignReservesDelta ?? 0) - (e.inflationDelta ?? 0) - (e.deficitDelta ?? 0);
    if (score < worstScore) { worstScore = score; worstIdx = i; }
  });
  return worstIdx;
}

interface GameStore {
  // State
  gameState: GameState | null;
  currentCard: EventCard | null;
  pendingCardId: string | null;
  pendingChoiceIndex: number | null;
  isAnimating: boolean;
  showCrisisScreen: boolean;
  showTransition: boolean;
  transitionData: TransitionData | null;
  tutorialStep: number;
  tutorialComplete: boolean;
  soundEnabled: boolean;
  language: Language;
  personalBest: PersonalBest | null;
  presidentId: string;
  prevVarSnapshot: VarSnapshot | null;
  crisisCountdown: number | null;
  userId: string | null;
  isCrisisExpress: boolean;
  scenarioId: ScenarioId | null;

  // Actions
  resolveCongressSession: (choiceIndex: number, cardId: string, negEffects: import('@republica/game-engine').ChoiceEffect) => void;
  startNewGame: (difficulty: Difficulty, seed?: number) => void;
  setUserId: (id: string | null) => void;
  setCrisisExpress: (val: boolean) => void;
  timeoutSelection: () => void;
  selectChoice: (cardId: string, choiceIndex: number) => void;
  applyNegotiationAction: (type: NegotiationType) => void;
  confirmChoice: () => void;
  dismissCrisisScreen: () => void;
  dismissTransition: () => void;
  setAnimating: (val: boolean) => void;
  advanceTurnAction: () => void;
  resetGame: () => void;
  setLanguage: (lang: Language) => void;
  setSoundEnabled: (val: boolean) => void;
  completeTutorialStep: () => void;
  completeTutorial: () => void;
  updatePersonalBest: () => void;
  setPresidentId: (id: string) => void;
  setScenario: (id: ScenarioId | null) => void;
}

function buildTransitionData(
  before: GameState,
  after: GameState,
  cardId: string,
  choiceIndex: number
): TransitionData {
  const deltas: { label: string; delta: number; emoji: string }[] = [];

  const polDelta = after.political.popularity - before.political.popularity;
  const stabDelta = after.political.socialStability - before.political.socialStability;
  const infDelta = after.economic.inflation - before.economic.inflation;
  const mktDelta = after.economic.marketConfidence - before.economic.marketConfidence;

  if (Math.abs(polDelta) >= 1) deltas.push({ label: 'Popularidad', delta: polDelta, emoji: '★' });
  if (Math.abs(stabDelta) >= 1) deltas.push({ label: 'Estabilidad', delta: stabDelta, emoji: '⚖' });
  if (Math.abs(infDelta) >= 1) deltas.push({ label: 'Inflación', delta: infDelta, emoji: '💸' });
  if (Math.abs(mktDelta) >= 1) deltas.push({ label: 'Mercados', delta: mktDelta, emoji: '📈' });

  const hooks = [
    'Las consecuencias se harán sentir pronto...',
    'El país espera los resultados de esta decisión.',
    'La oposición ya prepara su respuesta.',
    'Los medios no tardarán en reaccionar.',
    'Mientras tanto, se avecina otro asunto urgente.',
  ];
  const hookText = hooks[after.turn % hooks.length] ?? hooks[0]!;

  // Simple headline from category/choice
  const headlines = [
    `TURNO ${after.turn}: EL GOBIERNO TOMA POSICIÓN`,
    `DECISIÓN DEL EJECUTIVO: TURNO ${after.turn}`,
    `EL PRESIDENTE ACTÚA EN TURNO ${after.turn}`,
  ];
  const headline = headlines[choiceIndex % headlines.length] ?? headlines[0]!;

  return {
    fromTurn: before.turn,
    toTurn: after.turn,
    statDeltas: deltas.slice(0, 4),
    headline,
    hookText,
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: null,
      currentCard: null,
      pendingCardId: null,
      pendingChoiceIndex: null,
      isAnimating: false,
      showCrisisScreen: false,
      showTransition: false,
      transitionData: null,
      tutorialStep: 0,
      tutorialComplete: false,
      soundEnabled: true,
      language: 'es',
      personalBest: null,
      presidentId: 'populista',
      prevVarSnapshot: null,
      crisisCountdown: null,
      userId: null,
      isCrisisExpress: false,
      scenarioId: null,

      resolveCongressSession: (choiceIndex, cardId, negEffects) => {
        const { gameState, isCrisisExpress } = get();
        if (!gameState) return;
        // Apply negotiation side-effects (costs from actions taken)
        const withNeg = Object.keys(negEffects).length > 0
          ? applyChoiceEffects(gameState, negEffects)
          : gameState;
        // Apply law outcome
        let afterChoice = applyChoice(withNeg, cardId, choiceIndex);
        if (isCrisisExpress) afterChoice = applyCrisisExpressMultiplier(withNeg, afterChoice);
        let score = calculateScore(afterChoice);
        if (isCrisisExpress) score = Math.round(score * 2);
        const stateWithScore = { ...afterChoice, score };
        const transitionData = buildTransitionData(gameState, stateWithScore, cardId, choiceIndex);
        set({
          gameState: stateWithScore,
          pendingCardId: null,
          pendingChoiceIndex: null,
          isAnimating: true,
          showTransition: true,
          transitionData,
        });
      },

      startNewGame: (difficulty, seed) => {
        const s = seed ?? Math.floor(Math.random() * 1_000_000);
        const state = initGame(difficulty, s, get().language, get().scenarioId ?? undefined);
        const card = drawNextCard(state);
        set({
          gameState: state,
          currentCard: card,
          pendingCardId: null,
          pendingChoiceIndex: null,
          isAnimating: false,
          showCrisisScreen: false,
          showTransition: false,
          transitionData: null,
        });
      },

      selectChoice: (cardId, choiceIndex) => {
        set({ pendingCardId: cardId, pendingChoiceIndex: choiceIndex });
      },

      applyNegotiationAction: (type) => {
        const { gameState } = get();
        if (!gameState) return;
        const newState = applyNegotiation(gameState, type);
        set({ gameState: newState });
      },

      confirmChoice: () => {
        const { gameState, pendingCardId, pendingChoiceIndex, isCrisisExpress } = get();
        if (!gameState || pendingCardId === null || pendingChoiceIndex === null) return;

        let afterChoice = applyChoice(gameState, pendingCardId, pendingChoiceIndex);
        if (isCrisisExpress) afterChoice = applyCrisisExpressMultiplier(gameState, afterChoice);
        let score = calculateScore(afterChoice);
        if (isCrisisExpress) score = Math.round(score * 2);
        const stateWithScore = { ...afterChoice, score };

        const transitionData = buildTransitionData(
          gameState,
          stateWithScore,
          pendingCardId,
          pendingChoiceIndex
        );

        trackTurnCompleted({
          turn_number: gameState.turn,
          event_category: get().currentCard?.category ?? 'unknown',
          choice_index: pendingChoiceIndex,
        });

        set({
          gameState: stateWithScore,
          pendingCardId: null,
          pendingChoiceIndex: null,
          isAnimating: true,
          showTransition: true,
          transitionData,
        });
      },

      dismissTransition: () => {
        set({ showTransition: false });
        get().advanceTurnAction();
      },

      advanceTurnAction: () => {
        const { gameState } = get();
        if (!gameState) return;

        // Capture snapshot before advancing
        const snapshot: VarSnapshot = {
          popularity: gameState.political.popularity,
          socialStability: gameState.political.socialStability,
          marketConfidence: gameState.economic.marketConfidence,
          currencyStrength: gameState.economic.currencyStrength,
          foreignReserves: gameState.economic.foreignReserves,
          inflation: gameState.economic.inflation,
          publicDeficit: gameState.economic.publicDeficit,
        };

        let next = advanceTurn(gameState);
        // Crisis Express: force game over after 15 turns
        if (get().isCrisisExpress && next.turn > 15 && !next.isGameOver) {
          next = { ...next, isGameOver: true, gameOverReason: 'term_complete' as GameOverReason };
        }
        const hasCrisis = next.activeCrises.length > gameState.activeCrises.length;
        const crisisResolved = gameState.activeCrises.length > 0 && next.activeCrises.length < gameState.activeCrises.length;
        if (hasCrisis && next.activeCrises[0]) {
          trackCrisisTriggered({ crisis_type: next.activeCrises[0].type, turn: next.turn });
        }
        const card = next.isGameOver ? null : drawNextCard(next);

        // Crisis countdown: turns to resolve
        const activeCrisis = next.activeCrises[0];
        const crisisCountdown = activeCrisis
          ? Math.max(0, activeCrisis.turnsToResolve - activeCrisis.turnsActive)
          : null;

        set({
          gameState: next,
          currentCard: card,
          isAnimating: false,
          showCrisisScreen: hasCrisis && !next.isGameOver,
          prevVarSnapshot: snapshot,
          crisisCountdown,
        });

        // Flash green on crisis resolve
        if (crisisResolved) {
          // Brief flag for UI - reset after 2s
          setTimeout(() => {
            if (get().crisisCountdown === null) {
              set((s) => ({ ...s })); // trigger re-render
            }
          }, 2000);
        }
      },

      dismissCrisisScreen: () => set({ showCrisisScreen: false }),

      setAnimating: (val) => set({ isAnimating: val }),

      resetGame: () => set({
        gameState: null,
        currentCard: null,
        pendingCardId: null,
        pendingChoiceIndex: null,
        isAnimating: false,
        showCrisisScreen: false,
        showTransition: false,
        transitionData: null,
      }),

      setLanguage: (lang) => {
        localStorage.setItem('language', lang);
        set({ language: lang });
      },

      setSoundEnabled: (val) => set({ soundEnabled: val }),

      completeTutorialStep: () =>
        set((s) => ({ tutorialStep: s.tutorialStep + 1 })),

      completeTutorial: () => set({ tutorialComplete: true }),

      updatePersonalBest: () => {
        const { gameState, personalBest } = get();
        if (!gameState) return;
        const current = { turns: gameState.turn, score: gameState.score };
        if (!personalBest || current.score > personalBest.score) {
          set({ personalBest: current });
        }
      },

      setPresidentId: (id: string) => set({ presidentId: id }),

      setScenario: (id: ScenarioId | null) => set({ scenarioId: id }),

      setUserId: (id: string | null) => set({ userId: id }),

      setCrisisExpress: (val: boolean) => set({ isCrisisExpress: val }),

      timeoutSelection: () => {
        const { currentCard, gameState } = get();
        if (!currentCard || !gameState) return;
        // Apply -10 popularity timeout penalty
        const penalized: GameState = {
          ...gameState,
          political: {
            ...gameState.political,
            popularity: Math.max(0, gameState.political.popularity - 10),
          },
        };
        set({ gameState: penalized });
        const worstIdx = findWorstChoiceIndex(currentCard);
        set({ pendingCardId: currentCard.id, pendingChoiceIndex: worstIdx });
        get().confirmChoice();
      },
    }),
    {
      name: 'republica-game-store',
      partialize: (s) => ({
        tutorialComplete: s.tutorialComplete,
        tutorialStep: s.tutorialStep,
        soundEnabled: s.soundEnabled,
        language: s.language,
        gameState: s.gameState,
        currentCard: s.currentCard,
        personalBest: s.personalBest,
        presidentId: s.presidentId,
        isCrisisExpress: s.isCrisisExpress,
      }),
    }
  )
);
