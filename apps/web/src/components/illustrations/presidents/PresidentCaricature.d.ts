export type CaricatureState = 'good' | 'regular' | 'bad' | 'crisis';
interface Props {
    presidentId: string;
    popularity: number;
    hasCrisis?: boolean;
    width?: number;
    height?: number;
}
export declare function PresidentCaricature({ presidentId, popularity, hasCrisis, width }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PresidentCaricature.d.ts.map