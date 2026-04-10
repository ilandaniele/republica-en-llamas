import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGameStore } from '../stores/gameStore.js';
import { getAnibalLine } from '@republica/game-engine';
export function AnibalTicker({ text, isCrisis = false }) {
    const gameState = useGameStore((s) => s.gameState);
    const displayText = text ?? (gameState ? `📻 Aníbal (AM 1010): "${getAnibalLine(gameState)}"` : '');
    if (!displayText)
        return null;
    return (_jsxs("div", { className: "fixed bottom-0 left-0 right-0 z-30 flex items-center", style: {
            height: '28px',
            background: 'var(--crisis-red)',
            animation: isCrisis ? 'crisis-ticker-flash 1s ease-in-out infinite' : undefined,
            borderTop: '2px solid var(--crisis-dark)',
        }, children: [_jsx("div", { style: {
                    background: 'var(--crisis-dark)',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                    flexShrink: 0,
                    borderRight: '2px solid rgba(255,255,255,0.3)',
                }, children: _jsx("span", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: 'white' }, children: "\uD83D\uDCFB AM1010" }) }), _jsx("div", { style: { overflow: 'hidden', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }, children: _jsxs("span", { className: "ticker-text", style: { animationDuration: `${Math.max(12, displayText.length * 0.18)}s` }, children: [displayText, "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0", displayText, "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"] }) })] }));
}
//# sourceMappingURL=AnibalTicker.js.map