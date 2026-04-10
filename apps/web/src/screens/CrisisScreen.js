import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore.js';
const CRISIS_INFO = {
    debtCrisis: {
        title: 'Crisis de Deuda Soberana',
        description: 'Los mercados han cerrado el crédito al país. El déficit es insostenible. Actúa antes de que todo colapse.',
        icon: '💸',
    },
    hyperinflationSpiral: {
        title: 'Espiral Hiperinflacionaria',
        description: 'Los precios se disparan sin control. La moneda pierde valor hora a hora. La sociedad exige estabilidad.',
        icon: '🔥',
    },
    socialUnrest: {
        title: 'Estallido Social',
        description: 'Las calles están ardiendo. La paciencia del pueblo se agotó. Cada turno sin resolución empeora la situación.',
        icon: '✊',
    },
    legislativeRebellion: {
        title: 'Rebelión Legislativa',
        description: 'El Congreso se rebela. No tienes mayoría para gobernar. La parálisis institucional amenaza la democracia.',
        icon: '🏛',
    },
    impeachmentAttempt: {
        title: 'Juicio Político',
        description: 'La oposición busca destituirte. Tienes pocos turnos para revertir la situación antes de que sea demasiado tarde.',
        icon: '⚖',
    },
};
export default function CrisisScreen() {
    const gameState = useGameStore((s) => s.gameState);
    const dismissCrisisScreen = useGameStore((s) => s.dismissCrisisScreen);
    if (!gameState)
        return null;
    const activeCrises = gameState.activeCrises;
    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "fixed inset-0 z-50 bg-crimson-900/95 backdrop-blur-sm flex items-center justify-center p-6", children: [_jsx("div", { className: "crisis-vignette" }), _jsxs(motion.div, { initial: { scale: 0.8, y: 40 }, animate: { scale: 1, y: 0 }, transition: { type: 'spring', stiffness: 200, damping: 20 }, className: "max-w-xl w-full bg-navy-900 border-2 border-crimson-500 rounded-xl p-8 shadow-2xl animate-pulse-red relative", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx(motion.div, { animate: { rotate: [0, -5, 5, -5, 5, 0] }, transition: { duration: 0.5, delay: 0.3 }, className: "text-6xl mb-4", children: "\u26A0" }), _jsx("h1", { className: "font-serif text-3xl font-black text-crimson-400 text-shadow-crimson", children: "\u00A1CRISIS!" }), _jsx("p", { className: "text-smoke-400 font-mono text-sm mt-2", children: "La situaci\u00F3n requiere atenci\u00F3n inmediata" })] }), _jsx("div", { className: "space-y-4 mb-8", children: activeCrises.map((crisis) => {
                            const info = CRISIS_INFO[crisis.type];
                            const turnsLeft = crisis.turnsToResolve - crisis.turnsActive;
                            return (_jsx("div", { className: "bg-crimson-900/50 border border-crimson-700 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-2xl", children: info?.icon ?? '⚠' }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("h3", { className: "font-serif font-bold text-crimson-300", children: info?.title ?? crisis.type }), _jsxs("span", { className: "font-mono text-sm text-crimson-400 bg-crimson-900 px-2 py-0.5 rounded", children: [turnsLeft, "t"] })] }), _jsx("p", { className: "text-smoke-400 text-sm mt-1 leading-relaxed", children: info?.description }), _jsx("div", { className: "mt-2 h-1.5 bg-navy-700 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-crimson-500 rounded-full transition-all duration-500", style: {
                                                            width: `${((crisis.turnsToResolve - crisis.turnsActive) / crisis.turnsToResolve) * 100}%`,
                                                        } }) })] })] }) }, crisis.type));
                        }) }), _jsx("button", { onClick: dismissCrisisScreen, className: "w-full bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-4 rounded-lg transition-colors uppercase tracking-wider text-lg", children: "Afrontar la Crisis \u2192" })] })] }));
}
//# sourceMappingURL=CrisisScreen.js.map