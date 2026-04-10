export type PortraitId = 'milei' | 'massa' | 'bullrich' | 'bregman' | 'schiaretti' | 'larreta' | 'ingeniero' | 'populista' | 'tecnocrata' | 'izquierda' | 'federal' | 'corporativo';
export type PortraitMood = 'neutral' | 'panic' | 'victory';
interface Props {
    id: PortraitId;
    mood?: PortraitMood;
    px?: number;
}
export declare function PixelPortrait({ id, mood, px }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PixelPortrait.d.ts.map