import type { EventCard, GameState, ChoiceEffect } from '@republica/game-engine';
interface Props {
    card: EventCard;
    gameState: GameState;
    presidentId: string;
    onComplete: (choiceIndex: number, negEffects: ChoiceEffect) => void;
}
export declare function CongressSession({ card, gameState, onComplete }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CongressSession.d.ts.map