import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore.js';
import { InflationBreakdownPanel } from './InflationBreakdownPanel.js';
import { PixelFuego } from './illustrations/PixelFuego.js';
// Inline mini Casa Rosada for the Termómetro Nacional section
function CasaRosadaMini({ tense = false }) {
    const PK = tense ? '#D4948A' : '#E8B4B8';
    const WH = '#ECE8E0';
    const BK = '#080C12';
    const CB = '#74ACDF';
    const GD = '#F6B40E';
    const GR = '#8A9BAA';
    const BR = '#7A5530';
    // P=2 grid, viewBox 80×60
    const r = (x, y, w, h, fill) => _jsx("rect", { x: x * 2, y: y * 2, width: w * 2, height: h * 2, fill: fill });
    return (_jsxs("svg", { viewBox: "0 0 80 60", xmlns: "http://www.w3.org/2000/svg", width: 80, height: 60, style: { imageRendering: 'pixelated', display: 'block' }, children: [_jsx("rect", { x: 0, y: 0, width: 80, height: 60, fill: CB, opacity: 0.25 }), r(19, 1, 1, 8, GR), r(20, 1, 3, 1, CB), r(20, 2, 3, 1, WH), r(20, 3, 3, 1, CB), r(8, 5, 24, 1, WH), [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30].map((c, i) => _jsx("rect", { x: c * 2, y: 4 * 2, width: 1 * 2, height: 1 * 2, fill: GR }, i)), r(8, 6, 24, 12, PK), r(9, 6, 22, 4, tense ? '#D8A099' : '#F0C8CC'), [9, 12, 15, 18, 21].map((c, i) => (_jsxs("g", { children: [r(c, 14, 2, 4, WH), r(c, 13, 2, 1, GD)] }, i))), [10, 14, 18, 22].map((c, i) => (_jsxs("g", { children: [r(c, 8, 2, 3, tense ? '#553030' : '#B3D4F0'), r(c, 7, 2, 1, GR)] }, i))), r(18, 10, 4, 1, GD), r(7, 18, 26, 1, BR), r(6, 19, 28, 1, BR)] }));
}
function TrendArrow({ current, prev, inverse = false }) {
    if (prev === undefined)
        return null;
    const delta = current - prev;
    if (Math.abs(delta) < 1)
        return _jsx("span", { className: "text-smoke-600 text-xs", children: "\u2192" });
    const goingUp = delta > 0;
    // For higher-is-better vars: up = green. For lower-is-better (inverse): down = green.
    const isGood = inverse ? !goingUp : goingUp;
    const isVeryBig = Math.abs(delta) > 10;
    if (isVeryBig) {
        return _jsx("span", { className: isGood ? 'text-green-400 text-sm' : 'text-crimson-400 text-sm', children: goingUp ? '↑↑' : '↓↓' });
    }
    return _jsx("span", { className: isGood ? 'text-green-400 text-xs' : 'text-crimson-400 text-xs', children: goingUp ? '↑' : '↓' });
}
function AnimatedNumber({ value, inverse = false }) {
    const [displayed, setDisplayed] = useState(value);
    const [flash, setFlash] = useState(null);
    const prev = useRef(value);
    useEffect(() => {
        if (prev.current !== value) {
            const delta = value - prev.current;
            const goingUp = delta > 0;
            // For inverse vars (inflation, deficit): going up = bad; for normal vars: going up = good
            const isGood = inverse ? !goingUp : goingUp;
            setFlash(isGood ? 'good' : 'bad');
            const timer = setTimeout(() => {
                setDisplayed(value);
                setFlash(null);
                prev.current = value;
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [value, inverse]);
    return (_jsx(motion.span, { animate: flash ? { scale: [1, 1.2, 1] } : {}, transition: { duration: 0.3 }, className: flash === 'good' ? 'text-green-400' : flash === 'bad' ? 'text-crimson-400' : 'text-smoke-100', children: Math.round(displayed) }));
}
function Meter({ label, value, prevValue, max = 100, color, icon, inverse = false, flashDir }) {
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    const isWarning = inverse ? pct > 70 : pct < 30;
    const isCritical = inverse ? pct > 85 : pct < 15;
    const isDanger = inverse ? pct > 75 : pct < 25;
    // Pixel bar color class
    const barFillClass = isCritical ? 'bar-critical' : isWarning ? 'bar-warning' : 'bar-good';
    const flashClass = flashDir === 'up' ? 'animate-bar-flash-up' : flashDir === 'down' ? 'animate-bar-flash-down' : '';
    return (_jsxs("div", { className: "variable-meter", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsxs("span", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }, className: `flex items-center gap-1 ${isCritical ? 'text-crimson-400' : isDanger ? 'text-gold-400' : 'text-smoke-400'}`, children: [icon, " ", label, isDanger && _jsx("span", { className: "text-crimson-400", children: " !" })] }), _jsxs("span", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }, className: "font-bold flex items-center gap-1", children: [_jsx(TrendArrow, { current: value, prev: prevValue, inverse: inverse }), _jsx(AnimatedNumber, { value: Math.round(value), inverse: inverse })] })] }), _jsx("div", { className: `pixel-bar-container ${flashClass}`, children: _jsx("div", { className: `pixel-bar-fill ${barFillClass}`, style: { width: `${pct}%` } }) })] }));
}
function getTemperatura(state) {
    const vars = [
        state.political.popularity,
        state.political.socialStability,
        state.economic.marketConfidence,
        state.economic.currencyStrength,
        state.economic.foreignReserves,
    ];
    const minVar = Math.min(...vars);
    if (minVar < 10)
        return { label: 'COLAPSO INMINENTE', emoji: '💀', color: 'text-red-300', bg: 'bg-red-900/50 border-red-600 animate-pulse' };
    if (minVar < 25)
        return { label: 'EN LLAMAS', emoji: '🔴', color: 'text-crimson-300', bg: 'bg-crimson-900/40 border-crimson-700' };
    if (minVar < 50)
        return { label: 'CALIENTE', emoji: '🟡', color: 'text-gold-300', bg: 'bg-gold-900/30 border-gold-700' };
    return { label: 'ESTABLE', emoji: '🟢', color: 'text-emerald-300', bg: 'bg-emerald-900/30 border-emerald-700' };
}
export function VariablesPanel({ state }) {
    const { political, economic, congress } = state;
    const prevSnapshot = useGameStore((s) => s.prevVarSnapshot);
    const [showInflationBreakdown, setShowInflationBreakdown] = useState(false);
    const [flashMap, setFlashMap] = useState({});
    const breakdown = state.lastInflationBreakdown;
    useEffect(() => {
        if (!prevSnapshot)
            return;
        const newFlash = {};
        const checks = [
            { key: 'popularity', curr: political.popularity, prev: prevSnapshot.popularity },
            { key: 'socialStability', curr: political.socialStability, prev: prevSnapshot.socialStability },
            { key: 'marketConfidence', curr: economic.marketConfidence, prev: prevSnapshot.marketConfidence },
            { key: 'currencyStrength', curr: economic.currencyStrength, prev: prevSnapshot.currencyStrength },
            { key: 'foreignReserves', curr: economic.foreignReserves, prev: prevSnapshot.foreignReserves },
            { key: 'inflation', curr: economic.inflation, prev: prevSnapshot.inflation, inverse: true },
            { key: 'publicDeficit', curr: economic.publicDeficit, prev: prevSnapshot.publicDeficit ?? economic.publicDeficit, inverse: true },
        ];
        let hasFlash = false;
        for (const { key, curr, prev, inverse } of checks) {
            const delta = curr - prev;
            if (Math.abs(delta) >= 1) {
                const isGood = inverse ? delta < 0 : delta > 0;
                newFlash[key] = isGood ? 'up' : 'down';
                hasFlash = true;
            }
        }
        if (!hasFlash)
            return;
        setFlashMap(newFlash);
        const t = setTimeout(() => setFlashMap({}), 650);
        return () => clearTimeout(t);
    }, [prevSnapshot]);
    const temp = getTemperatura(state);
    const isDeflation = economic.inflation < 0;
    const hasAnyCrisis = [political.popularity, political.socialStability, economic.marketConfidence, economic.currencyStrength, economic.foreignReserves].some((v) => v < 30);
    const isStable = political.socialStability > 50 && political.popularity > 50;
    return (_jsxs("div", { className: "pixel-border bg-navy-800 p-4 space-y-4", children: [_jsx("h3", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '7px', borderBottom: '2px solid var(--celeste-dark)', paddingBottom: '8px', color: 'var(--celeste)' }, className: "uppercase", children: "TERMOMETRO NACIONAL" }), _jsx("div", { className: "flex justify-center py-1", children: hasAnyCrisis ? _jsx(PixelFuego, { size: "sm" }) : _jsx(CasaRosadaMini, { tense: !isStable }) }), _jsxs("div", { className: "space-y-3", children: [_jsx("p", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }, className: "text-smoke-600 uppercase", children: "POLITICO" }), _jsx(Meter, { label: "POP", value: political.popularity, prevValue: prevSnapshot?.popularity, color: "bg-blue-500", icon: "\u2605", flashDir: flashMap['popularity'] }), _jsx(Meter, { label: "EST", value: political.socialStability, prevValue: prevSnapshot?.socialStability, color: "bg-emerald-500", icon: "\u2696", flashDir: flashMap['socialStability'] }), _jsx(Meter, { label: "MED", value: political.mediaCredibility, color: "bg-purple-500", icon: "\uD83D\uDCFA" }), _jsxs("div", { className: "flex justify-between", style: { fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }, children: [_jsx("span", { className: "text-smoke-400", children: "DECRETOS" }), _jsx("span", { className: political.emergencyDecreesUsed > 2 ? 'text-crimson-400' : 'text-smoke-200', children: political.emergencyDecreesUsed })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("p", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }, className: "text-smoke-600 uppercase", children: "ECONOMICO" }), _jsx("button", { className: "w-full text-left", onClick: () => setShowInflationBreakdown((v) => !v), title: "Ver desglose de inflaci\u00F3n", children: _jsx(Meter, { label: isDeflation ? `DEFL${breakdown ? ' 🔍' : ''}` : `INF${breakdown ? ' 🔍' : ''}`, value: isDeflation ? Math.abs(economic.inflation) : economic.inflation, prevValue: prevSnapshot?.inflation !== undefined ? (isDeflation ? Math.abs(prevSnapshot.inflation) : prevSnapshot.inflation) : undefined, max: isDeflation ? 20 : 200, color: isDeflation ? 'bg-crimson-500' : 'bg-orange-500', icon: isDeflation ? '📉' : '💸', inverse: true, flashDir: isDeflation ? (flashMap['inflation'] === 'up' ? 'down' : flashMap['inflation'] === 'down' ? 'up' : null) : flashMap['inflation'] }) }), _jsx(AnimatePresence, { children: showInflationBreakdown && breakdown && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "overflow-hidden", children: _jsx(InflationBreakdownPanel, { breakdown: breakdown }) })) }), _jsx(Meter, { label: "DEF", value: economic.publicDeficit, prevValue: prevSnapshot?.publicDeficit, color: "bg-red-500", icon: "\uD83D\uDCCA", inverse: true, flashDir: flashMap['publicDeficit'] }), _jsx(Meter, { label: "MKT", value: economic.marketConfidence, prevValue: prevSnapshot?.marketConfidence, color: "bg-teal-500", icon: "\uD83D\uDCC8", flashDir: flashMap['marketConfidence'] }), _jsx(Meter, { label: "$$$", value: economic.currencyStrength, prevValue: prevSnapshot?.currencyStrength, color: "bg-yellow-500", icon: "\uD83D\uDCB0", flashDir: flashMap['currencyStrength'] }), _jsx(Meter, { label: "RES", value: economic.foreignReserves, prevValue: prevSnapshot?.foreignReserves, color: "bg-cyan-500", icon: "\uD83C\uDFE6", flashDir: flashMap['foreignReserves'] }), _jsxs("div", { className: "flex justify-between", style: { fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }, children: [_jsx("span", { className: "text-smoke-400", children: "PIB" }), _jsxs("span", { className: economic.gdpGrowth >= 0 ? 'text-green-400' : 'text-crimson-400', children: [economic.gdpGrowth >= 0 ? '+' : '', economic.gdpGrowth.toFixed(1), "%"] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }, className: "text-smoke-600 uppercase", children: "CONGRESO" }), _jsxs("div", { className: "flex gap-0.5 h-3 overflow-hidden", style: { border: '2px solid #444' }, children: [_jsx("div", { className: "transition-all duration-700", style: { width: `${(congress.governmentSeats / 538) * 100}%`, background: 'var(--celeste)' }, title: `Gobierno: ${congress.governmentSeats}` }), _jsx("div", { className: "bg-smoke-600 transition-all duration-700", style: { width: `${(congress.independentSeats / 538) * 100}%` }, title: `Independientes: ${congress.independentSeats}` }), _jsx("div", { className: "bg-crimson-500 transition-all duration-700", style: { width: `${(congress.oppositionSeats / 538) * 100}%` }, title: `Oposición: ${congress.oppositionSeats}` })] }), _jsxs("div", { className: "flex justify-between", style: { fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }, children: [_jsxs("span", { style: { color: 'var(--celeste)' }, children: ["GOB:", congress.governmentSeats] }), _jsxs("span", { className: "text-smoke-400", children: ["IND:", congress.independentSeats] }), _jsxs("span", { className: "text-crimson-400", children: ["OPO:", congress.oppositionSeats] })] }), _jsxs("div", { className: "flex justify-between", style: { fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }, children: [_jsx("span", { className: "text-smoke-400", children: "LEYES" }), _jsx("span", { style: { color: 'var(--gold)' }, children: congress.lawsPassedThisRun })] })] }), _jsxs("div", { className: `p-3 ${temp.bg}`, style: { border: '2px solid currentColor' }, children: [_jsx("p", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }, className: "text-smoke-500 uppercase mb-1", children: "TEMPERATURA" }), _jsxs("div", { className: `flex items-center gap-2 font-bold ${temp.color}`, style: { fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }, children: [_jsx("span", { children: temp.emoji }), _jsx("span", { children: temp.label })] })] }), _jsxs("div", { className: "pt-3 flex justify-between", style: { borderTop: '2px solid var(--celeste-dark)' }, children: [_jsxs("div", { children: [_jsx("p", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }, className: "text-smoke-600", children: "TURNO" }), _jsxs("p", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: 'var(--gold)' }, children: [state.turn, "/50"] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }, className: "text-smoke-600", children: "SCORE" }), _jsx("p", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: 'var(--gold)' }, children: state.score.toLocaleString() })] })] })] }));
}
//# sourceMappingURL=VariablesPanel.js.map