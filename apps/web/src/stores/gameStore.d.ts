import type { GameState, Difficulty, Language, NegotiationType, ScenarioId } from '@republica/game-engine';
import type { EventCard } from '@republica/game-engine';
export interface TransitionData {
    fromTurn: number;
    toTurn: number;
    statDeltas: {
        label: string;
        delta: number;
        emoji: string;
    }[];
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
export declare const useGameStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<GameStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<GameStore, {
            tutorialComplete: boolean;
            tutorialStep: number;
            soundEnabled: boolean;
            language: Language;
            gameState: GameState | null;
            currentCard: EventCard | null;
            personalBest: PersonalBest | null;
            presidentId: string;
            isCrisisExpress: boolean;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: GameStore) => void) => () => void;
        onFinishHydration: (fn: (state: GameStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<GameStore, {
            tutorialComplete: boolean;
            tutorialStep: number;
            soundEnabled: boolean;
            language: Language;
            gameState: GameState | null;
            currentCard: EventCard | null;
            personalBest: PersonalBest | null;
            presidentId: string;
            isCrisisExpress: boolean;
        }>>;
    };
}>;
export {};
//# sourceMappingURL=gameStore.d.ts.map