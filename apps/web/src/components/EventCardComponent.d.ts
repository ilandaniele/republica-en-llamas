import type { EventCard, GameState } from '@republica/game-engine';
interface Props {
    card: EventCard;
    selectedIndex: number | null;
    onSelect: (cardId: string, choiceIndex: number) => void;
    onConfirm: () => void;
    disabled?: boolean;
    contextPrefix?: string | null;
    presidentId?: string;
    gameState?: GameState | null;
}
export declare function EventCardComponent({ card, selectedIndex, onSelect, onConfirm, disabled, contextPrefix, presidentId, gameState }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=EventCardComponent.d.ts.map