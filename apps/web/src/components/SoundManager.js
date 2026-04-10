import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useRef, useState, useCallback } from 'react';
const SoundContext = createContext({
    soundEnabled: false,
    toggleSound: () => { },
    playCardFlip: () => { },
    playCrisisAlert: () => { },
    playGameOver: () => { },
    playVictoryTick: () => { },
});
export function useSounds() {
    return useContext(SoundContext);
}
function getCtx(ref) {
    try {
        if (!ref.current) {
            ref.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (ref.current.state === 'suspended')
            ref.current.resume();
        return ref.current;
    }
    catch {
        return null;
    }
}
function tone(ctx, type, freq, dur, vol = 0.25, t) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    const start = t ?? ctx.currentTime;
    gain.gain.setValueAtTime(vol, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.start(start);
    osc.stop(start + dur + 0.01);
}
export function SoundProvider({ children }) {
    const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('soundEnabled') !== 'false');
    const ctxRef = useRef(null);
    const toggleSound = useCallback(() => {
        setSoundEnabled((prev) => {
            const next = !prev;
            localStorage.setItem('soundEnabled', String(next));
            return next;
        });
    }, []);
    const playCardFlip = useCallback(() => {
        if (!soundEnabled)
            return;
        const ctx = getCtx(ctxRef);
        if (!ctx)
            return;
        tone(ctx, 'square', 440, 0.05, 0.12);
        tone(ctx, 'square', 660, 0.05, 0.08, ctx.currentTime + 0.06);
    }, [soundEnabled]);
    const playCrisisAlert = useCallback(() => {
        if (!soundEnabled)
            return;
        const ctx = getCtx(ctxRef);
        if (!ctx)
            return;
        tone(ctx, 'sawtooth', 80, 0.35, 0.4);
        tone(ctx, 'sawtooth', 55, 0.35, 0.3, ctx.currentTime + 0.04);
    }, [soundEnabled]);
    const playGameOver = useCallback(() => {
        if (!soundEnabled)
            return;
        const ctx = getCtx(ctxRef);
        if (!ctx)
            return;
        [440, 370, 311, 261, 220].forEach((f, i) => tone(ctx, 'triangle', f, 0.3, 0.3, ctx.currentTime + i * 0.22));
    }, [soundEnabled]);
    const playVictoryTick = useCallback(() => {
        if (!soundEnabled)
            return;
        const ctx = getCtx(ctxRef);
        if (!ctx)
            return;
        [523, 659, 784, 1047].forEach((f, i) => tone(ctx, 'sine', f, 0.12, 0.22, ctx.currentTime + i * 0.1));
    }, [soundEnabled]);
    return (_jsxs(SoundContext.Provider, { value: { soundEnabled, toggleSound, playCardFlip, playCrisisAlert, playGameOver, playVictoryTick }, children: [children, _jsx("button", { onClick: toggleSound, className: "fixed top-3 right-14 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-navy-800/80 border border-navy-600 text-sm hover:bg-navy-700 transition-colors", title: soundEnabled ? 'Silenciar' : 'Activar sonido', children: soundEnabled ? '🔊' : '🔇' })] }));
}
//# sourceMappingURL=SoundManager.js.map