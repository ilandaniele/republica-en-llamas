import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CAPUTO_QUOTES = [
    'Los mercados van a reaccionar positivamente.',
    'Es una situación controlada.',
    'El ajuste está dando frutos.',
    'Estamos en el camino correcto.',
    'La inflación es un fenómeno monetario.',
];
export function InflationBreakdownPanel({ breakdown }) {
    const quote = CAPUTO_QUOTES[Math.floor(Math.abs(breakdown.newInflation)) % CAPUTO_QUOTES.length];
    const isDeflation = breakdown.newInflation < 0;
    const factors = [
        { label: 'Déficit Público', value: breakdown.deficitPressure, emoji: '📊' },
        { label: 'Desconfianza Mercados', value: breakdown.marketDistrust, emoji: '📉' },
        { label: 'Moneda Débil', value: breakdown.currencyWeakness, emoji: '💵' },
        { label: 'Shocks Externos', value: breakdown.shockEffect, emoji: '⚡' },
        { label: 'Efecto Inercia', value: breakdown.accelerationEffect, emoji: '🔥' },
        { label: 'Estabilidad Económica', value: breakdown.naturalDecay ?? 0, emoji: '📈' },
    ].filter((f) => Math.abs(f.value) >= 0.1);
    return (_jsxs("div", { className: "bg-navy-900 border border-navy-600 rounded-lg p-4 text-xs font-mono", children: [isDeflation && (_jsx("p", { className: "text-crimson-400 font-bold uppercase tracking-widest mb-2 text-[9px] animate-pulse", children: "\u26A0\uFE0F DEFLACI\u00D3N PELIGROSA" })), _jsx("p", { className: "text-smoke-500 uppercase tracking-widest mb-3 text-[10px]", children: "Desglose Inflacionario \u2014 Turno" }), _jsx("div", { className: "space-y-2 mb-3", children: factors.map((f) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-smoke-400 flex items-center gap-1", children: [_jsx("span", { children: f.emoji }), _jsx("span", { children: f.label })] }), _jsxs("span", { className: `font-bold ${f.value > 0 ? 'text-crimson-400' : 'text-emerald-400'}`, children: [f.value > 0 ? '+' : '', f.value.toFixed(1), "%"] })] }, f.label))) }), _jsxs("div", { className: "border-t border-navy-600 pt-2 flex justify-between", children: [_jsx("span", { className: "text-smoke-300 font-bold", children: "Total nueva inflaci\u00F3n" }), _jsxs("span", { className: `font-bold text-sm ${breakdown.delta > 2 ? 'text-crimson-400' : breakdown.delta > 0 ? 'text-gold-400' : 'text-emerald-400'}`, children: [breakdown.newInflation.toFixed(1), "%", _jsxs("span", { className: "text-xs ml-1 opacity-70", children: ["(", breakdown.delta > 0 ? '+' : '', breakdown.delta.toFixed(1), ")"] })] })] }), _jsxs("div", { className: "mt-3 bg-navy-800 border border-navy-700 rounded px-3 py-2 italic text-smoke-500 text-[10px]", children: ["\uD83D\uDCBC \"", quote, "\" \u2014 ", _jsx("span", { className: "not-italic", children: "Luis Caputo, Min. Econom\u00EDa" })] })] }));
}
//# sourceMappingURL=InflationBreakdownPanel.js.map