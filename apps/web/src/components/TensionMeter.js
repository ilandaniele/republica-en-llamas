import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
function computeTension(state) {
    const { political, economic, activeCrises } = state;
    const tension = (100 - political.popularity) * 0.2 +
        (100 - political.socialStability) * 0.25 +
        economic.inflation * 0.3 +
        economic.publicDeficit * 0.15 +
        activeCrises.length * 15;
    return Math.min(100, Math.max(0, tension));
}
export function TensionMeter({ state }) {
    const tension = computeTension(state);
    const color = tension > 80 ? 'bg-crimson-500' : tension > 60 ? 'bg-orange-500' : tension > 40 ? 'bg-yellow-500' : 'bg-green-500';
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-xs font-mono text-smoke-400 uppercase tracking-wider whitespace-nowrap", children: "Tensi\u00F3n" }), _jsx("div", { className: "flex-1 h-2 bg-navy-700 rounded-full overflow-hidden", children: _jsx(motion.div, { className: `h-full rounded-full ${color}`, animate: { width: `${tension}%` }, transition: { duration: 0.8, ease: 'easeOut' } }) }), _jsx("span", { className: "font-mono text-xs text-smoke-300 w-8 text-right", children: Math.round(tension) })] }));
}
//# sourceMappingURL=TensionMeter.js.map