import {
  drawNextCard,
  isPresidentId,
  isCareerStartOffice,
  isRunConfig,
  isTurnDecision,
  MAX_RUN_DECISIONS,
  replayRun,
} from '@republica/game-engine';
import type { GameStore } from './gameStore.js';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function restorePreferences(saved: Record<string, unknown>, current: GameStore) {
  return {
    tutorialComplete:
      typeof saved.tutorialComplete === 'boolean' ? saved.tutorialComplete : current.tutorialComplete,
    tutorialStep:
      Number.isSafeInteger(saved.tutorialStep) && (saved.tutorialStep as number) >= 0
        ? Math.min(saved.tutorialStep as number, 20)
        : current.tutorialStep,
    soundEnabled: typeof saved.soundEnabled === 'boolean' ? saved.soundEnabled : current.soundEnabled,
    language: saved.language === 'es' || saved.language === 'en' ? saved.language : current.language,
    presidentId: isPresidentId(saved.presidentId) ? saved.presidentId : current.presidentId,
    careerStart: isCareerStartOffice(saved.careerStart) ? saved.careerStart : null,
    isCrisisExpress:
      typeof saved.isCrisisExpress === 'boolean' ? saved.isCrisisExpress : current.isCrisisExpress,
    personalBest: restorePersonalBest(saved.personalBest, current.personalBest),
  };
}

function restorePersonalBest(value: unknown, fallback: GameStore['personalBest']) {
  if (
    isRecord(value) &&
    Number.isSafeInteger(value.turns) &&
    (value.turns as number) >= 0 &&
    typeof value.score === 'number' &&
    Number.isFinite(value.score)
  )
    return { turns: value.turns as number, score: value.score };
  return fallback;
}

export function restoreGameStore(saved: unknown, current: GameStore): GameStore {
  if (!isRecord(saved)) return current;
  const restored: GameStore = {
    ...current,
    ...restorePreferences(saved, current),
    gameState: null,
    currentCard: null,
    runConfig: null,
    runTicketId: null,
    decisions: [],
    pendingCardId: null,
    pendingChoiceIndex: null,
    isAnimating: false,
    showTransition: false,
    transitionData: null,
    showCrisisScreen: false,
    prevVarSnapshot: null,
    crisisCountdown: null,
    saveRecoveryMessage: null,
  };
  if (!saved.runConfig && !saved.gameState) return restored;
  try {
    if (
      !isRunConfig(saved.runConfig) ||
      !Array.isArray(saved.decisions) ||
      saved.decisions.length > MAX_RUN_DECISIONS ||
      !saved.decisions.every(isTurnDecision)
    )
      throw new Error('Incompatible saved run');
    const gameState = replayRun(saved.runConfig, saved.decisions);
    return {
      ...restored,
      gameState,
      runConfig: saved.runConfig,
      decisions: saved.decisions,
      currentCard: gameState.isGameOver ? null : drawNextCard(gameState),
      runTicketId: typeof saved.runTicketId === 'string' ? saved.runTicketId : null,
      presidentId: saved.runConfig.presidentId ?? restored.presidentId,
      isCrisisExpress: saved.runConfig.crisisExpress ?? false,
      scenarioId: saved.runConfig.scenarioId ?? null,
      careerStart: saved.runConfig.careerStart ?? null,
    };
  } catch {
    return {
      ...restored,
      saveRecoveryMessage:
        'La partida guardada no es compatible o está dañada. Conservamos tus preferencias; podés empezar una nueva.',
    };
  }
}
