import { shockLabel } from '../lib/shockLabel.js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  GameState,
  Difficulty,
  Language,
  ScenarioId,
  CongressDecisions,
  TurnDecision,
  RunConfig,
  CareerStartOffice,
} from '@republica/game-engine';
import { trackTurnCompleted, trackCrisisTriggered } from '../lib/analytics.js';
import { requestRunTicket } from '../lib/runTicket.js';
import {
  initGame,
  drawNextCard,
  isPresidentId,
  isTurnDecision,
  resolveTurn,
  endTurn,
} from '@republica/game-engine';
import type { EventCard } from '@republica/game-engine';
import { browserStorage } from '../lib/browserStorage.js';
import { restoreGameStore } from './restoreGameStore.js';

export interface TransitionData {
  fromTurn: number;
  toTurn: number;
  statDeltas: { label: string; delta: number; emoji: string; inverse?: boolean }[];
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

export interface GameStore {
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
  careerStart: CareerStartOffice | null;
  runConfig: RunConfig | null;
  runTicketId: string | null;
  decisions: TurnDecision[];
  saveRecoveryMessage: string | null;

  // Actions
  resolveCongressSession: (cardId: string, decisions: CongressDecisions) => void;
  startNewGame: (difficulty: Difficulty) => Promise<void>;
  setUserId: (id: string | null) => void;
  clearRunTicket: () => void;
  setCrisisExpress: (val: boolean) => void;
  timeoutSelection: () => void;
  selectChoice: (cardId: string, choiceIndex: number) => void;
  confirmChoice: () => void;
  commitDecision: (decision: TurnDecision) => void;
  dismissCrisisScreen: () => void;
  dismissTransition: () => void;
  resetGame: () => void;
  setLanguage: (lang: Language) => void;
  setSoundEnabled: (val: boolean) => void;
  completeTutorialStep: () => void;
  completeTutorial: () => void;
  updatePersonalBest: () => void;
  setPresidentId: (id: string) => void;
  setScenario: (id: ScenarioId | null) => void;
  setCareerStart: (office: CareerStartOffice | null) => void;
}

const CATEGORY_HEADLINES: Record<string, string[]> = {
  economic: ['MERCADOS EN VILO', 'EL PESO TIEMBLA', 'RESERVAS BAJO PRESIÓN', 'CRISIS FISCAL EN MARCHA'],
  political: [
    'EL EJECUTIVO SE MUEVE',
    'LA GRIETA SE PROFUNDIZA',
    'CONGRESO EN SESIÓN',
    'JUEGO POLÍTICO INTERNO',
  ],
  social: ['LAS CALLES HABLAN', 'TENSIÓN SOCIAL CRECE', 'EL PUEBLO REACCIONA', 'CONFLICTO EN LAS BASES'],
  international: [
    'CANCILLERÍA EN ALERTA',
    'PRESIÓN EXTERNA',
    'EL MUNDO MIRA A ARGENTINA',
    'NEGOCIACIÓN CRUCIAL',
  ],
  crisis: ['🚨 CRISIS EN MARCHA', '⚠ SITUACIÓN LÍMITE', 'AL BORDE DEL ABISMO', 'EMERGENCIA NACIONAL'],
};

let startRequest = 0;

function initializeRun(config: RunConfig) {
  const gameState = initGame(
    config.difficulty,
    config.seed,
    config.language,
    config.scenarioId ?? undefined,
    config.presidentId,
    config.careerStart,
  );
  return { runConfig: config, gameState, currentCard: drawNextCard(gameState) };
}

function matchesCardDecision(card: EventCard, decision: TurnDecision): boolean {
  if (!isTurnDecision(decision) || decision.cardId !== card.id) return false;
  if (decision.kind === 'choice') return !card.isLaw && Boolean(card.choices[decision.choiceIndex]);
  return decision.kind !== 'congress' || Boolean(card.isLaw);
}

const CATEGORY_HOOKS: Record<string, string[]> = {
  economic: [
    'Los mercados abren mañana. Todo puede cambiar.',
    'El FMI sigue de cerca cada movimiento.',
    'Los ahorristas miran el dólar blue con miedo.',
  ],
  political: [
    'La oposición ya prepara su respuesta.',
    'Los medios amplifican cada palabra.',
    'Las encuestas captarán esto en días.',
  ],
  social: [
    'Las calles tienen memoria larga.',
    'La CGT monitorea la situación.',
    'El malestar social no desaparece solo.',
  ],
  international: [
    'Washington tomó nota.',
    'El FMI revisa los números.',
    'Cancillerías extranjeras esperan resultados.',
  ],
  crisis: [
    'El país aguanta la respiración.',
    'No hay margen para errores ahora.',
    'La historia juzgará esta decisión.',
  ],
};

function buildTransitionData(
  before: GameState,
  after: GameState,
  choiceIndex: number,
  cardCategory?: string,
  newShockName?: string,
): TransitionData {
  const deltas: { label: string; delta: number; emoji: string; inverse?: boolean }[] = [];

  const polDelta = after.political.popularity - before.political.popularity;
  const stabDelta = after.political.socialStability - before.political.socialStability;
  const infDelta = after.economic.inflation - before.economic.inflation;
  const mktDelta = after.economic.marketConfidence - before.economic.marketConfidence;

  if (Math.abs(polDelta) >= 1) deltas.push({ label: 'Popularidad', delta: polDelta, emoji: '★' });
  if (Math.abs(stabDelta) >= 1) deltas.push({ label: 'Estabilidad', delta: stabDelta, emoji: '⚖' });
  if (Math.abs(infDelta) >= 1)
    deltas.push({ label: 'Inflación', delta: infDelta, emoji: '💸', inverse: true });
  if (Math.abs(mktDelta) >= 1) deltas.push({ label: 'Mercados', delta: mktDelta, emoji: '📈' });

  const cat = cardCategory ?? 'political';
  const headlinePool = CATEGORY_HEADLINES[cat] ?? CATEGORY_HEADLINES['political']!;
  const hookPool = CATEGORY_HOOKS[cat] ?? CATEGORY_HOOKS['political']!;

  let headline: string;
  if (newShockName) {
    headline = `💥 SHOCK EXTERNO: ${shockLabel(newShockName)}`;
  } else {
    headline = headlinePool[(after.turn + choiceIndex) % headlinePool.length]!;
  }

  const hookText = hookPool[after.turn % hookPool.length]!;

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
      careerStart: null,
      runConfig: null,
      runTicketId: null,
      decisions: [],
      saveRecoveryMessage: null,

      resolveCongressSession: (cardId, decisions) => {
        get().commitDecision({ kind: 'congress', cardId, decisions });
      },

      startNewGame: async (difficulty) => {
        const request = ++startRequest;
        const runConfig: RunConfig = {
          seed: Math.floor(Math.random() * 1_000_000),
          difficulty,
          language: get().language,
          scenarioId: get().scenarioId,
          crisisExpress: get().isCrisisExpress,
          presidentId: get().presidentId,
          ...(get().careerStart ? { careerStart: get().careerStart! } : {}),
        };
        if (runConfig.careerStart) {
          runConfig.scenarioId = null;
          runConfig.crisisExpress = false;
        }
        const ticket = runConfig.careerStart ? null : await requestRunTicket();
        if (request !== startRequest) return;
        if (ticket) runConfig.seed = ticket.seed;
        set({
          ...initializeRun(runConfig),
          isCrisisExpress: runConfig.crisisExpress ?? false,
          scenarioId: runConfig.scenarioId ?? null,
          runTicketId: ticket?.id ?? null,
          decisions: [],
          pendingCardId: null,
          pendingChoiceIndex: null,
          isAnimating: false,
          showCrisisScreen: false,
          showTransition: false,
          transitionData: null,
          prevVarSnapshot: null,
          crisisCountdown: null,
          saveRecoveryMessage: null,
        });
      },

      selectChoice: (cardId, choiceIndex) => {
        const { currentCard, gameState, showTransition, isAnimating } = get();
        if (
          !gameState ||
          gameState.isGameOver ||
          showTransition ||
          isAnimating ||
          !currentCard ||
          currentCard.id !== cardId ||
          currentCard.isLaw ||
          !Number.isInteger(choiceIndex) ||
          !currentCard.choices[choiceIndex]
        )
          return;
        set({ pendingCardId: cardId, pendingChoiceIndex: choiceIndex });
      },

      confirmChoice: () => {
        const { pendingCardId, pendingChoiceIndex } = get();
        if (pendingCardId === null || pendingChoiceIndex === null) return;
        get().commitDecision({ kind: 'choice', cardId: pendingCardId, choiceIndex: pendingChoiceIndex });
      },

      commitDecision: (decision) => {
        const { gameState, currentCard, isCrisisExpress, showTransition, isAnimating } = get();
        if (
          !gameState ||
          gameState.isGameOver ||
          !currentCard ||
          showTransition ||
          isAnimating ||
          !matchesCardDecision(currentCard, decision)
        )
          return;

        const { state: stateWithScore, choiceIndex } = resolveTurn(
          gameState,
          currentCard,
          decision,
          isCrisisExpress,
        );
        const next = endTurn(stateWithScore, isCrisisExpress);

        const newShock = next.activeShocks.find(
          (s) => !gameState.activeShocks.some((old) => old.id === s.id),
        );
        const transitionData = buildTransitionData(
          gameState,
          next,
          choiceIndex,
          currentCard.category,
          newShock?.name,
        );

        trackTurnCompleted({
          turn_number: gameState.turn,
          event_category: currentCard.category,
          choice_index: choiceIndex,
        });
        const newCrisis = next.activeCrises.find(
          (crisis) => !gameState.activeCrises.some((old) => old.type === crisis.type),
        );
        if (newCrisis) trackCrisisTriggered({ crisis_type: newCrisis.type, turn: next.turn });
        const activeCrisis = next.activeCrises[0];

        set({
          gameState: next,
          decisions: [...get().decisions, decision],
          pendingCardId: null,
          pendingChoiceIndex: null,
          isAnimating: true,
          showTransition: true,
          transitionData,
          showCrisisScreen: Boolean(newCrisis) && !next.isGameOver,
          prevVarSnapshot: {
            popularity: gameState.political.popularity,
            socialStability: gameState.political.socialStability,
            marketConfidence: gameState.economic.marketConfidence,
            currencyStrength: gameState.economic.currencyStrength,
            foreignReserves: gameState.economic.foreignReserves,
            inflation: gameState.economic.inflation,
            publicDeficit: gameState.economic.publicDeficit,
          },
          crisisCountdown: activeCrisis
            ? Math.max(0, activeCrisis.turnsToResolve - activeCrisis.turnsActive)
            : null,
        });
      },

      dismissTransition: () => {
        const { gameState, showTransition } = get();
        if (!gameState || !showTransition) return;

        set({
          currentCard: gameState.isGameOver ? null : drawNextCard(gameState),
          isAnimating: false,
          showTransition: false,
          transitionData: null,
        });
      },

      dismissCrisisScreen: () => set({ showCrisisScreen: false }),

      resetGame: () => {
        startRequest++;
        set({
          runConfig: null,
          runTicketId: null,
          decisions: [],
          gameState: null,
          currentCard: null,
          pendingCardId: null,
          pendingChoiceIndex: null,
          isAnimating: false,
          showCrisisScreen: false,
          showTransition: false,
          transitionData: null,
          prevVarSnapshot: null,
          crisisCountdown: null,
          saveRecoveryMessage: null,
        });
      },

      setLanguage: (lang) => {
        browserStorage.setItem('language', lang);
        set({ language: lang });
      },

      setSoundEnabled: (val) => set({ soundEnabled: val }),

      completeTutorialStep: () => set((s) => ({ tutorialStep: s.tutorialStep + 1 })),

      completeTutorial: () => set({ tutorialComplete: true }),

      updatePersonalBest: () => {
        const { gameState, personalBest } = get();
        if (!gameState) return;
        const current = { turns: gameState.turn, score: gameState.score };
        if (!personalBest || current.score > personalBest.score) {
          set({ personalBest: current });
        }
      },

      setPresidentId: (id: string) => {
        if (!isPresidentId(id)) return;
        const { runConfig, gameState, decisions } = get();
        if (gameState && !gameState.isGameOver && decisions.length > 0) return;
        set({
          presidentId: id,
          ...(runConfig && gameState?.turn === 1 && decisions.length === 0
            ? initializeRun({ ...runConfig, presidentId: id })
            : {}),
        });
      },

      setScenario: (id: ScenarioId | null) => set({ scenarioId: id }),
      setCareerStart: (office) => set({ careerStart: office }),

      setUserId: (id: string | null) => set({ userId: id }),

      clearRunTicket: () => set({ runTicketId: null }),

      setCrisisExpress: (val: boolean) => {
        const { runConfig, gameState, decisions } = get();
        if (val && runConfig?.careerStart) return;
        if (gameState && !gameState.isGameOver && decisions.length > 0) return;
        set({
          isCrisisExpress: val,
          ...(runConfig && gameState?.turn === 1 && decisions.length === 0
            ? { runConfig: { ...runConfig, crisisExpress: val } }
            : {}),
        });
      },

      timeoutSelection: () => {
        const { currentCard } = get();
        if (!currentCard) return;
        get().commitDecision({ kind: 'timeout', cardId: currentCard.id });
      },
    }),
    {
      name: 'republica-game-store',
      version: 1,
      storage: createJSONStorage(() => browserStorage),
      migrate: (saved) => saved as GameStore,
      merge: restoreGameStore,
      partialize: (s) => ({
        tutorialComplete: s.tutorialComplete,
        tutorialStep: s.tutorialStep,
        soundEnabled: s.soundEnabled,
        language: s.language,
        runConfig: s.runConfig,
        runTicketId: s.runTicketId,
        decisions: s.decisions,
        personalBest: s.personalBest,
        presidentId: s.presidentId,
        isCrisisExpress: s.isCrisisExpress,
        careerStart: s.careerStart,
      }),
    },
  ),
);
