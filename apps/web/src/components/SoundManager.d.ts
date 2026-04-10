import React from 'react';
interface SoundCtx {
    soundEnabled: boolean;
    toggleSound: () => void;
    playCardFlip: () => void;
    playCrisisAlert: () => void;
    playGameOver: () => void;
    playVictoryTick: () => void;
}
export declare function useSounds(): SoundCtx;
export declare function SoundProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SoundManager.d.ts.map