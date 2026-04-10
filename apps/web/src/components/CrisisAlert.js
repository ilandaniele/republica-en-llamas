import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
const CRISIS_LABELS = {
    debtCrisis: '💸 Crisis de Deuda Soberana',
    hyperinflationSpiral: '📈 Espiral Hiperinflacionaria',
    socialUnrest: '✊ Disturbios Sociales',
    legislativeRebellion: '🏛 Rebelión Legislativa',
    impeachmentAttempt: '⚖ Juicio Político en Curso',
};
export function CrisisAlert({ crises }) {
    if (crises.length === 0)
        return null;
    return (_jsx(AnimatePresence, { children: _jsxs(motion.div, { initial: { y: 40, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 40, opacity: 0 }, className: "pixel-border-crisis bg-crimson-800 px-4 py-3 animate-pulse", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(motion.span, { animate: { scale: [1, 1.2, 1] }, transition: { repeat: Infinity, duration: 1.5 }, className: "text-crimson-300 text-lg", children: "\uD83D\uDEA8" }), _jsxs("span", { className: "text-crimson-200 uppercase", style: { fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }, children: ["CRISIS ACTIVA", crises.length > 1 ? 'S' : '', " \u2014 ACTUA YA"] })] }), _jsx("div", { className: "space-y-2", children: crises.map((crisis) => {
                        const turnsLeft = Math.max(0, crisis.turnsToResolve - crisis.turnsActive);
                        const isUrgent = turnsLeft <= 2;
                        return (_jsxs("div", { className: "bg-crimson-900/60 px-3 py-2", style: { border: '1px solid var(--crisis-dark)' }, children: [_jsx("div", { className: "flex justify-between items-center", children: _jsx("span", { style: { fontFamily: "'VT323', monospace", fontSize: '16px' }, className: "text-crimson-200", children: CRISIS_LABELS[crisis.type] ?? crisis.type }) }), _jsxs("div", { className: `mt-1 font-bold ${isUrgent ? 'text-red-300 animate-pulse' : 'text-gold-400'}`, style: { fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }, children: ["TENES ", turnsLeft, " TURNO", turnsLeft !== 1 ? 'S' : '', " PARA RESOLVERLO"] })] }, crisis.type));
                    }) })] }) }));
}
//# sourceMappingURL=CrisisAlert.js.map