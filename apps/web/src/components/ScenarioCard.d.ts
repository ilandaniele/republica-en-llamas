import type { ScenarioId } from '@republica/game-engine';
interface Props {
    id: ScenarioId;
    label: string;
    period: string;
    description: string;
    locked: boolean;
    index: number;
    onClick: () => void;
}
export declare function ScenarioCard({ id, label, period, description, locked, index, onClick }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ScenarioCard.d.ts.map