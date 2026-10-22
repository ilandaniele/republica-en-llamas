import { shockLabel } from '../lib/shockLabel.js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState,
  Difficulty,
  Language,
  NegotiationType,
  ScenarioId,
  CongressDecisions,
  TurnDecision,
  RunConfig,
} from '@republica/game-engine';
import { trackTurnCompleted, trackCrisisTriggered } from '../lib/analytics.js';
import { requestRunTicket } from '../lib/runTicket.js';
import { initGame, drawNextCard, applyNegotiation, resolveTurn, endTurn } from '@republica/game-engine';
import type { EventCard } from '@republica/game-engine';

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
  runConfig: RunConfig | null;
  runTicketId: string | null;
  decisions: TurnDecision[];

  // Actions
  resolveCongressSession: (cardId: string, decisions: CongressDecisions) => void;
  startNewGame: (difficulty: Difficulty) => Promise<void>;
  setUserId: (id: string | null) => void;
  clearRunTicket: () => void;
  setCrisisExpress: (val: boolean) => void;
  timeoutSelection: () => void;
  selectChoice: (cardId: string, choiceIndex: number) => void;
  applyNegotiationAction: (type: NegotiationType) => void;
  confirmChoice: () => void;
  commitDecision: (decision: TurnDecision) => void;
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
    'La CGT monitora la situación.',
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
  cardId: string,
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
      runConfig: null,
      runTicketId: null,
      decisions: [],

      resolveCongressSession: (cardId, decisions) => {
        get().commitDecision({ kind: 'congress', cardId, decisions });
      },

      startNewGame: async (difficulty) => {
        const ticket = await requestRunTicket();
        const runConfig: RunConfig = {
          seed: ticket?.seed ?? Math.floor(Math.random() * 1_000_000),
          difficulty,
          language: get().language,
          scenarioId: get().scenarioId,
          crisisExpress: get().isCrisisExpress,
        };
        const state = initGame(
          runConfig.difficulty,
          runConfig.seed,
          runConfig.language,
          runConfig.scenarioId ?? undefined,
        );
        const card = drawNextCard(state);
        set({
          runConfig,
          runTicketId: ticket?.id ?? null,
          decisions: [],
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
        const { pendingCardId, pendingChoiceIndex } = get();
        if (pendingCardId === null || pendingChoiceIndex === null) return;
        get().commitDecision({ kind: 'choice', cardId: pendingCardId, choiceIndex: pendingChoiceIndex });
      },

      commitDecision: (decision) => {
        const { gameState, currentCard, isCrisisExpress, showTransition } = get();
        if (!gameState || !currentCard || showTransition) return;

        const { state: stateWithScore, choiceIndex } = resolveTurn(
          gameState,
          currentCard,
          decision,
          isCrisisExpress,
        );

        const newShock = stateWithScore.activeShocks.find(
          (s) => !gameState.activeShocks.some((old) => old.id === s.id),
        );
        const transitionData = buildTransitionData(
          gameState,
          stateWithScore,
          currentCard.id,
          choiceIndex,
          currentCard.category,
          newShock?.name,
        );

        if (decision.kind !== 'congress') {
          trackTurnCompleted({
            turn_number: gameState.turn,
            event_category: currentCard.category,
            choice_index: choiceIndex,
          });
        }

        set({
          gameState: stateWithScore,
          decisions: [...get().decisions, decision],
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

        const next = endTurn(gameState, get().isCrisisExpress);
        const hasCrisis = next.activeCrises.length > gameState.activeCrises.length;
        const crisisResolved =
          gameState.activeCrises.length > 0 && next.activeCrises.length < gameState.activeCrises.length;
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

      resetGame: () =>
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
        }),

      setLanguage: (lang) => {
        localStorage.setItem('language', lang);
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

      setPresidentId: (id: string) => set({ presidentId: id }),

      setScenario: (id: ScenarioId | null) => set({ scenarioId: id }),

      setUserId: (id: string | null) => set({ userId: id }),

      clearRunTicket: () => set({ runTicketId: null }),

      setCrisisExpress: (val: boolean) => set({ isCrisisExpress: val }),

      timeoutSelection: () => {
        const { currentCard } = get();
        if (!currentCard) return;
        get().commitDecision({ kind: 'timeout', cardId: currentCard.id });
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
        runConfig: s.runConfig,
        runTicketId: s.runTicketId,
        decisions: s.decisions,
        currentCard: s.currentCard,
        personalBest: s.personalBest,
        presidentId: s.presidentId,
        isCrisisExpress: s.isCrisisExpress,
      }),
    },
  ),
);
