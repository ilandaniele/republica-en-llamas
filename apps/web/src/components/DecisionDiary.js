import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore.js';
const EFFECT_SUMMARIES = {
    popularityDelta: (v) => `Popularidad ${v > 0 ? '+' : ''}${Math.round(v)}%`,
    stabilityDelta: (v) => `Estabilidad ${v > 0 ? '+' : ''}${Math.round(v)}`,
    inflationDelta: (v) => `Inflación ${v > 0 ? '+' : ''}${Math.round(v)}%`,
    marketConfidenceDelta: (v) => `Mercados ${v > 0 ? '+' : ''}${Math.round(v)}`,
    deficitDelta: (v) => `Déficit ${v > 0 ? '+' : ''}${Math.round(v)}`,
    foreignReservesDelta: (v) => `Reservas ${v > 0 ? '+' : ''}${Math.round(v)}`,
};
function formatEffect(effects) {
    const parts = [];
    for (const [key, val] of Object.entries(effects)) {
        if (val !== undefined && Math.abs(val) >= 1 && key in EFFECT_SUMMARIES) {
            parts.push(EFFECT_SUMMARIES[key](val));
        }
    }
    return parts.slice(0, 2).join(', ') || 'Sin cambios significativos';
}
function isFatalTurn(event, fatalTurn) {
    return event.turn === fatalTurn;
}
function DiaryEntry({ event, isFatal }) {
    const effectStr = formatEffect(event.effectsApplied);
    const hasBadEffect = (event.effectsApplied.popularityDelta ?? 0) < -10 ||
        (event.effectsApplied.stabilityDelta ?? 0) < -10 ||
        (event.effectsApplied.inflationDelta ?? 0) > 10;
    return (_jsxs("div", { className: `flex gap-3 py-2 border-b border-navy-700/50 text-xs ${isFatal ? 'bg-crimson-900/20 border-crimson-800 rounded px-2' : ''}`, children: [_jsxs("span", { className: `font-mono shrink-0 ${isFatal ? 'text-crimson-400 font-bold' : 'text-smoke-600'}`, children: ["T", event.turn] }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: `font-mono ${hasBadEffect ? 'text-gold-400' : 'text-smoke-300'}`, children: [effectStr, isFatal && _jsx("span", { className: "ml-2 text-crimson-400 font-bold text-xs", children: "\u2190 DECISI\u00D3N FATAL" })] }), event.crisisTriggered && (_jsx("div", { className: "text-crimson-400 font-mono text-xs mt-0.5", children: "\u26A0 Desencaden\u00F3 crisis" })), event.crisisResolved && (_jsx("div", { className: "text-emerald-400 font-mono text-xs mt-0.5", children: "\u2713 Crisis resuelta" }))] })] }));
}
export function DecisionDiary({ isOpen, onClose }) {
    const gameState = useGameStore((s) => s.gameState);
    if (!gameState)
        return null;
    const history = gameState.history;
    // Find the fatal turn (biggest negative impact)
    const fatalTurn = history.reduce((worst, event) => {
        const impact = -(event.effectsApplied.popularityDelta ?? 0) +
            -(event.effectsApplied.stabilityDelta ?? 0) +
            (event.effectsApplied.inflationDelta ?? 0);
        const prevImpact = worst !== null
            ? (() => {
                const prev = history.find((e) => e.turn === worst);
                if (!prev)
                    return 0;
                return -(prev.effectsApplied.popularityDelta ?? 0) +
                    -(prev.effectsApplied.stabilityDelta ?? 0) +
                    (prev.effectsApplied.inflationDelta ?? 0);
            })()
            : 0;
        if (impact > prevImpact)
            return event.turn;
        return worst;
    }, null);
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-40 bg-navy-900/70", onClick: onClose }), _jsxs(motion.div, { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' }, transition: { type: 'spring', stiffness: 300, damping: 30 }, className: "fixed left-0 top-0 bottom-0 z-50 w-80 bg-navy-900 border-r border-navy-600 overflow-hidden flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-navy-600 flex items-center justify-between", children: [_jsx("h2", { className: "font-serif text-gold-400 font-bold text-base", children: "\uD83D\uDCCB Diario de Gesti\u00F3n" }), _jsx("button", { onClick: onClose, className: "text-smoke-500 hover:text-smoke-300 font-mono text-sm", children: "\u2715" })] }), _jsx("div", { className: "p-3", children: _jsxs("p", { className: "font-mono text-xs text-smoke-500 uppercase tracking-widest", children: ["Turno actual: ", gameState.turn] }) }), _jsx("div", { className: "flex-1 overflow-y-auto px-4 pb-4", children: history.length === 0 ? (_jsx("p", { className: "text-smoke-600 font-mono text-xs italic mt-4", children: "El diario est\u00E1 vac\u00EDo. Tom\u00E1 decisiones para ver el registro." })) : (_jsx("div", { children: [...history].reverse().map((event) => (_jsx(DiaryEntry, { event: event, isFatal: isFatalTurn(event, fatalTurn) }, `${event.turn}-${event.cardId}`))) })) })] })] })) }));
}
//# sourceMappingURL=DecisionDiary.js.map