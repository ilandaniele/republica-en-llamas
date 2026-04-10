import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { InflationBreakdownPanel } from './InflationBreakdownPanel.js';
import { useGameStore } from '../stores/gameStore.js';
// ── pixel palette (subset) ───────────────────────────────────────────────
const P = 3;
const NAV = '#162032';
const SLT = '#2A3D52';
const CB = '#74ACDF';
const WH = '#ECE8E0';
const SK = '#D4956A';
const BK = '#080C12';
const GN = '#3AA858';
const DG = '#1E3A1E';
const BR = '#7A5530';
const RD = '#EF3030';
const OR = '#FF7B2A';
const YL = '#FFD84D';
const GR2 = '#8A9BAA';
const LB = '#B3D4F0';
const GD = '#F6B40E';
const PK = '#E8B4B8'; // Casa Rosada pink
const CR = '#CC2200'; // crisis crimson
const ST = '#C8A882'; // stone / cornice
const PK2 = '#F0C8CC'; // lighter pink facade highlight
const GR3 = '#6A7D8A'; // dark grey roof
function px(col, row, w, h, fill) {
    return _jsx("rect", { x: col * P, y: row * P, width: w * P, height: h * P, fill: fill });
}
// 3×6 pixel person: col/row = top-left of head
function Person({ c, r, suit = SLT, hair = BK, skin = SK }) {
    return (_jsxs("g", { children: [px(c, r, 3, 1, hair), px(c, r + 1, 3, 1, skin), px(c, r + 2, 3, 3, suit), px(c, r + 5, 1, 1, suit), px(c + 2, r + 5, 1, 1, suit)] }));
}
function CasaRosadaScene({ state }) {
    const W = 96 * P;
    const H = 40 * P;
    const skyColor = state === 'nuke' ? '#3A1000'
        : state === 'chaos' ? '#221508'
            : state === 'riot' ? '#160E1E'
                : LB;
    return (_jsxs("svg", { viewBox: `0 0 ${W} ${H}`, xmlns: "http://www.w3.org/2000/svg", style: { display: 'block', width: '100%', imageRendering: 'pixelated' }, preserveAspectRatio: "xMidYMid meet", children: [_jsx("rect", { x: 0, y: 0, width: W, height: H, fill: skyColor }), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
                const heights = [22, 18, 26, 20, 14, 30, 24, 16, 28, 20];
                const xs = [0, 10, 17, 26, 34, 40, 50, 58, 66, 74];
                const ws = [10, 7, 9, 8, 6, 10, 8, 8, 8, 6];
                return _jsx("rect", { x: xs[i] * P, y: (38 - heights[i]) * P, width: ws[i] * P, height: heights[i] * P, fill: "rgba(20,30,50,0.4)" }, i);
            }), px(3, 26, 90, 2, GN), px(3, 25, 90, 1, DG), px(8, 28, 80, 3, BR), [8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84].map((c, i) => (_jsx("rect", { x: c * P, y: 28 * P, width: 3 * P, height: P, fill: "rgba(0,0,0,0.18)" }, i))), px(10, 31, 76, 2, BR), px(14, 33, 68, 2, BR), px(20, 35, 56, 2, BR), px(28, 37, 40, 1, BR), px(35, 38, 26, 1, BK), px(15, 12, 66, 15, PK), px(16, 12, 64, 5, PK2), px(12, 16, 3, 10, PK), px(81, 16, 3, 10, PK), px(13, 11, 70, 2, ST), [13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58, 61, 64, 67, 70, 73, 76, 79].map((c, i) => (_jsx("rect", { x: c * P, y: 10 * P, width: 2 * P, height: P, fill: ST }, i))), px(13, 9, 70, 2, WH), [14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80].map((c, i) => (_jsx("rect", { x: c * P, y: 9 * P, width: P, height: P, fill: GR2 }, i))), [18, 25, 32, 39, 46].map((c, i) => (_jsxs("g", { children: [px(c, 20, 5, 8, BK), px(c - 1, 19, 7, 1, PK), px(c, 18, 5, 1, PK)] }, i))), [17, 22, 27, 32, 37, 42, 47, 52].map((c, i) => (_jsxs("g", { children: [px(c, 13, 4, 4, CB), px(c - 1, 17, 6, 1, ST), _jsx("rect", { x: (c + 1) * P + 1, y: 13 * P, width: 1, height: 4 * P, fill: "rgba(0,0,0,0.3)" })] }, i))), px(14, 18, 68, 2, ST), [14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80].map((c, i) => (_jsx("rect", { x: c * P, y: 18 * P, width: 2 * P, height: P, fill: WH }, i))), [14, 15, 80, 81].map((c, i) => (_jsx("rect", { x: c * P, y: 12 * P, width: P, height: 12 * P, fill: ST }, i))), px(42, 4, 12, 8, PK), px(43, 3, 10, 2, ST), px(44, 2, 8, 1, WH), px(45, 5, 6, 4, WH), px(47, 5, 2, 1, GR2), px(47, 8, 2, 1, GR2), px(45, 6, 1, 2, GR2), px(50, 6, 1, 2, GR2), _jsx("rect", { x: 47 * P + 2, y: 5 * P + 2, width: 1, height: P * 2, fill: BK }), _jsx("rect", { x: 47 * P + 2, y: 6 * P + 1, width: P * 2, height: 1, fill: BK }), _jsx("rect", { x: 47 * P + 2, y: 0, width: 2, height: 4 * P, fill: BR }), px(48, 0, 10, 1, CB), px(48, 1, 10, 1, WH), px(48, 2, 10, 1, CB), px(15, 11, 66, 1, GR3), (state === 'guard') && _jsxs(_Fragment, { children: [_jsx(Person, { c: 5, r: 19, suit: NAV, hair: BK }), _jsx(Person, { c: 10, r: 19, suit: NAV, hair: BK }), _jsx(Person, { c: 82, r: 19, suit: NAV, hair: BK }), _jsx(Person, { c: 87, r: 19, suit: NAV, hair: BK }), px(5, 18, 3, 1, BK), px(10, 18, 3, 1, BK), px(82, 18, 3, 1, BK), px(87, 18, 3, 1, BK), _jsx("rect", { x: 35 * P, y: 22 * P, width: 2, height: 5 * P, fill: GR2 }), _jsx("rect", { x: 62 * P, y: 22 * P, width: 2, height: 5 * P, fill: GR2 }), px(36, 22, 6, 1, CB), px(36, 23, 6, 1, WH), px(36, 24, 6, 1, CB), px(63, 22, 6, 1, CB), px(63, 23, 6, 1, WH), px(63, 24, 6, 1, CB)] }), (state === 'mate') && _jsxs(_Fragment, { children: [_jsx(Person, { c: 6, r: 20, suit: SLT }), _jsx(Person, { c: 11, r: 20, suit: CB }), _jsx(Person, { c: 16, r: 20, hair: "#8B4513", suit: GN }), _jsx(Person, { c: 79, r: 20, suit: SLT }), _jsx(Person, { c: 84, r: 20, suit: CB }), _jsx(Person, { c: 70, r: 20, suit: OR }), [9, 14, 72].map((c, i) => (_jsxs("g", { children: [px(c, 24, 3, 3, '#8B4513'), _jsx("rect", { x: (c + 1) * P, y: 22 * P, width: 2, height: 3 * P, fill: "#A8A8A8" })] }, i))), px(8, 25, 12, 1, BR), px(8, 26, 12, 1, '#5a3a1e'), px(69, 25, 12, 1, BR), px(69, 26, 12, 1, '#5a3a1e')] }), (state === 'quiet') && _jsxs(_Fragment, { children: [[20, 35, 50, 65].map((c, i) => (_jsxs("g", { children: [_jsx("rect", { x: c * P, y: 26 * P, width: 3, height: 3, fill: GR2 }), _jsx("rect", { x: c * P + 4, y: 26 * P, width: 2, height: 2, fill: GR2 })] }, i))), _jsx(Person, { c: 45, r: 20, suit: NAV, hair: BK })] }), (state === 'protest') && _jsxs(_Fragment, { children: [[5, 10, 15, 20, 25, 60, 65, 70, 75, 80].map((c, i) => _jsx(Person, { c: c, r: 19, suit: [RD, SLT, OR, CB, RD, SLT, RD, OR, CB, RD][i] }, i)), [5, 15, 25, 65, 75].map((c, i) => (_jsxs("g", { children: [px(c, 17, 4, 2, RD), _jsx("rect", { x: (c + 1) * P, y: 16 * P, width: 1, height: 2 * P, fill: GR2 })] }, i))), px(30, 22, 36, 3, RD), px(31, 23, 34, 1, WH), _jsx("text", { x: 33 * P, y: 24 * P, fill: RD, fontSize: 6, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "FUERA!" })] }), (state === 'riot') && _jsxs(_Fragment, { children: [_jsx("rect", { x: 0, y: 0, width: W, height: H, fill: "rgba(80,30,0,0.30)" }), [4, 8, 12, 16, 20, 24, 28, 55, 60, 65, 70, 75, 80, 85].map((c, i) => _jsx(Person, { c: c, r: 18, suit: [RD, SLT, OR, RD, OR, SLT, RD, OR, RD, SLT, OR, RD, SLT, OR][i] }, i)), [4, 12, 20, 28, 60, 70, 80].map((c, i) => _jsx("rect", { x: (c + 1) * P, y: 14 * P, width: 2, height: 4 * P, fill: BR }, i)), px(5, 21, 4, 4, OR), px(6, 19, 2, 2, YL), px(86, 21, 4, 4, OR), px(87, 19, 2, 2, YL), [13, 20, 27, 39, 46].map(c => _jsx("rect", { x: c * P, y: 13 * P, width: 4 * P, height: 2 * P, fill: BK }, c))] }), (state === 'chaos') && _jsxs(_Fragment, { children: [_jsx("rect", { x: 0, y: 0, width: W, height: H, fill: "rgba(130,45,0,0.40)" }), [2, 6, 10, 14, 18, 22, 26, 30, 55, 60, 65, 70, 74, 78, 82, 86].map((c, i) => _jsx(Person, { c: c, r: 18, suit: [RD, OR, RD, SLT, OR, CR, RD, SLT, OR, RD, SLT, OR, CR, RD, SLT, OR][i] }, i)), px(3, 18, 5, 5, OR), px(4, 15, 3, 3, YL), px(4, 14, 3, 1, WH), px(10, 16, 5, 7, OR), px(11, 13, 3, 3, YL), px(81, 18, 5, 5, OR), px(82, 15, 3, 3, YL), px(82, 14, 3, 1, WH), px(74, 17, 5, 6, OR), px(75, 14, 3, 3, YL), [18, 25, 32, 39, 46].map(c => _jsx("rect", { x: c * P, y: 13 * P, width: 4 * P, height: 4 * P, fill: BK }, c)), _jsx("rect", { x: 0, y: 0, width: W, height: H * 0.4, fill: "rgba(20,5,0,0.35)" })] }), (state === 'nuke') && _jsxs(_Fragment, { children: [_jsx("rect", { x: 0, y: 0, width: W, height: H, fill: "rgba(255,90,0,0.50)" }), px(38, 8, 20, 4, OR), px(38, 7, 20, 2, YL), px(34, 4, 28, 4, OR), px(35, 3, 26, 2, YL), px(37, 2, 22, 2, WH), px(28, 1, 40, 3, OR), px(30, 0, 36, 2, YL), px(15, 12, 66, 15, OR), _jsx("rect", { x: 15 * P, y: 12 * P, width: 66 * P, height: 15 * P, fill: "rgba(0,0,0,0.65)" }), [15, 22, 30, 38, 46, 54, 62, 70].map((c, i) => (_jsx("rect", { x: c * P, y: 26 * P, width: (2 + i % 3) * P, height: P, fill: [GR2, BR, PK, GR3][i % 4] }, i))), px(40, 9, 16, 6, GD), _jsx("rect", { x: 40 * P, y: 9 * P, width: 16 * P, height: 6 * P, fill: "rgba(0,0,0,0.5)" }), px(45, 10, 6, 4, GD), px(46, 9, 4, 1, GD), px(46, 14, 4, 1, GD), px(44, 11, 2, 2, GD), px(50, 11, 2, 2, GD), px(47, 12, 2, 1, BK)] })] }));
}
export function TurnTransitionScreen({ data, onDismiss }) {
    const [clicked, setClicked] = useState(false);
    const gameState = useGameStore((s) => s.gameState);
    const breakdown = gameState?.lastInflationBreakdown;
    const handleContinue = () => {
        setClicked(true);
        onDismiss();
    };
    const pop = gameState?.political.popularity ?? 70;
    const stab = gameState?.political.socialStability ?? 70;
    const hasNuke = !!(gameState?.characters?.[0]?.memoryFlags?.includes('ignored_nuke_threat'));
    const casaState = hasNuke ? 'nuke'
        : (pop < 20 || stab < 20) ? 'chaos'
            : (pop < 35 || stab < 30) ? 'riot'
                : (pop < 50 || stab < 45) ? 'protest'
                    : (pop >= 80 && stab >= 75) ? 'guard'
                        : (pop >= 65 && stab >= 65) ? 'mate'
                            : 'quiet';
    return (_jsx(motion.div, { initial: { y: '-100%', opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: '-100%', opacity: 0 }, transition: { type: 'spring', stiffness: 300, damping: 30 }, className: "fixed inset-0 z-50 overflow-y-auto bg-navy-900/95", children: _jsxs("div", { className: "max-w-xl w-full mx-auto px-4 py-4", children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.1 }, className: "w-full mb-4 pixel-border overflow-hidden", children: _jsx(CasaRosadaScene, { state: casaState }) }), _jsx("div", { className: "text-center mb-4", children: _jsxs("span", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }, className: "text-smoke-500 uppercase", children: ["TURNO ", data.fromTurn, " \u25B6 ", data.toTurn] }) }), data.statDeltas.length > 0 && (_jsx("div", { className: "pixel-border bg-navy-800 p-4 mb-4 grid grid-cols-2 gap-2", children: data.statDeltas.map((d) => (_jsxs("div", { className: "flex items-center justify-between bg-navy-900/60 rounded px-3 py-2", children: [_jsxs("span", { className: "font-mono text-xs text-smoke-400", children: [d.emoji, " ", d.label] }), _jsxs("span", { className: `font-mono font-bold text-sm ${d.delta > 0 ? 'text-green-400' : 'text-crimson-400'}`, children: [d.delta > 0 ? '+' : '', Math.round(d.delta)] })] }, d.label))) })), _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.8 }, className: "bg-[#f4f4f0] text-smoke-900 p-4 mb-4 pixel-border", style: { borderColor: '#888' }, children: [_jsx("div", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }, className: "text-smoke-500 mb-2 uppercase", children: "LA GACETA DE LA REPUBLICA" }), _jsx("div", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '8px', lineHeight: '1.8' }, className: "font-black text-smoke-900 leading-tight", children: data.headline })] }), breakdown && Math.abs(breakdown.delta) > 0.5 && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 1.0 }, className: "mb-4", children: _jsx(InflationBreakdownPanel, { breakdown: breakdown }) })), _jsx(motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 1.2 }, className: "text-center text-smoke-400 italic mb-6", style: { fontFamily: "'VT323', monospace", fontSize: '16px' }, children: data.hookText }), _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 1.5 }, className: "w-full", children: [_jsx("button", { onClick: handleContinue, className: "w-full min-h-[56px] pixel-border-gold bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-navy-900 font-bold py-4 px-8 transition-colors shadow-lg", style: { fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }, children: "CONTINUAR \u25B6" }), !clicked && (_jsx("p", { className: "text-smoke-500 font-mono text-xs mt-2 text-center animate-pulse", children: "toc\u00E1 para continuar \u2192" }))] })] }) }));
}
//# sourceMappingURL=TurnTransitionScreen.js.map