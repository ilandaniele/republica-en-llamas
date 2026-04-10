import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import imageManifest from '../../assets/image-manifest.json';
gsap.registerPlugin(useGSAP);
// â”€â”€ Pixel grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ViewBox: 320Ã—180. Each "pixel" = 8 SVG units â†’ 40Ã—22 grid.
const P = 8;
// px(col, row, wCols, hRows, fill) â†’ single rect on the 8px grid
function px(col, row, wCols, hRows, fill) {
    return _jsx("rect", { x: col * P, y: row * P, width: wCols * P, height: hRows * P, fill: fill });
}
// px2 P=4 fine-detail grid (80x45 canvas) for detail layers
function px2(col, row, wCols, hRows, fill) {
    return _jsx("rect", { x: col * 4, y: row * 4, width: wCols * 4, height: hRows * 4, fill: fill });
}
// Pixel-art label bar (y=160, height=20)
function lbl(text, col = '#ECE8E0') {
    return (_jsxs(_Fragment, { children: [_jsx("rect", { x: 0, y: 160, width: 320, height: 20, fill: "rgba(9,21,37,0.92)" }), _jsx("text", { x: 8, y: 174, fill: col, fontSize: 8, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: text })] }));
}
// â”€â”€ Pixel palette (design-token aligned) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const P_BG = '#0D1B2A'; // night-blue (background)
const P_NAV = '#162032'; // deep navy
const P_SLT = '#2A3D52'; // slate panel
const P_GR = '#3D5468'; // medium gray-blue
const P_CB = '#74ACDF'; // celeste (Argentine flag)
const P_GD = '#F6B40E'; // gold-400
const P_CR = '#CC2200'; // crisis crimson (only for crisis)
const P_WH = '#ECE8E0'; // warm white
const P_SK = '#D4956A'; // skin tone
const P_YL = '#FFD84D'; // yellow
const P_RD = '#EF3030'; // bright red
const P_GN = '#3AA858'; // green
const P_LB = '#B3D4F0'; // light blue sky
const P_OR = '#FF7B2A'; // orange / fire
const P_DG = '#1E3A1E'; // dark green
const P_BR = '#7A5530'; // brown
const P_GR2 = '#8A9BAA'; // light gray
const P_BK = '#080C12'; // near black
// â”€â”€ Reusable pixel-person (2 wide Ã— 5 tall, col/row top-left of head) â”€â”€â”€â”€â”€â”€â”€
function PixPerson({ c, r, suit = P_NAV, skin = P_SK, hair = P_BK }) {
    return (_jsxs("g", { children: [px(c, r, 2, 1, hair), " ", px(c, r + 1, 2, 1, skin), " ", px(c, r + 2, 2, 2, suit), " ", px(c, r + 4, 1, 1, suit), " ", px(c + 1, r + 4, 1, 1, suit), " "] }));
}
// â”€â”€ SCENE: pol_congress â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ScenePolCongress({ presidentId, gameState }) {
    const hair = presidentId === 'tecnocrata' ? P_GD : presidentId === 'populista' ? P_RD : P_BK;
    const hasChaos = (gameState?.political.socialStability ?? 100) < 45
        || (gameState?.congress.governmentSeats ?? 269) < 135;
    const govSeats = gameState?.congress.governmentSeats ?? 180;
    const govRatio = Math.max(0.05, Math.min(0.95, govSeats / 257));
    // Palette extensions for Congress
    const P_DOME = '#3D6B4A'; // dark green copper dome
    const P_DOME2 = '#4E8A5E'; // dome highlight
    const P_STONE = '#D8CFBB'; // cream stone facade
    const P_STONE2 = '#BEB5A0'; // shadow stone
    const P_WIN2 = '#89BAD4'; // window glazing
    const P_STAIR = '#C8BEA8'; // staircase steps
    return (_jsxs("g", { children: [px(0, 0, 40, 20, hasChaos ? '#200800' : P_NAV), px(0, 19, 40, 1, P_BR), px(2, 17, 36, 2, P_STAIR), [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].map(c => (_jsx("rect", { x: c * P, y: 17 * P, width: 2 * P, height: P, fill: "rgba(0,0,0,0.15)" }, c))), px(11, 16, 18, 1, P_STAIR), px(12, 15, 16, 1, P_STONE2), px(13, 14, 14, 1, P_STONE2), px(2, 10, 10, 9, P_STONE), px(2, 9, 10, 1, P_STONE2), [3, 6].map(c => [11, 14].map(r => (_jsx("rect", { x: c * P, y: r * P, width: 2 * P, height: 2 * P, fill: P_WIN2 }, `${c}${r}`)))), px(28, 10, 10, 9, P_STONE), px(28, 9, 10, 1, P_STONE2), [29, 32].map(c => [11, 14].map(r => (_jsx("rect", { x: c * P, y: r * P, width: 2 * P, height: 2 * P, fill: P_WIN2 }, `r${c}${r}`)))), px(10, 9, 20, 10, P_STONE), px(9, 8, 22, 1, P_STONE2), [10, 12, 14, 16, 18, 20, 22, 24, 26].map(c => (_jsx("rect", { x: c * P, y: 9 * P, width: P, height: 9 * P, fill: P_STONE2 }, c))), px(14, 7, 12, 2, P_DOME), px(15, 6, 10, 1, P_DOME), px(15, 3, 10, 3, P_DOME2), px(16, 2, 8, 1, P_DOME), px(16, 3, 8, 3, P_DOME), px(17, 1, 6, 2, P_DOME), px(17, 2, 6, 3, P_DOME2), px(18, 0, 4, 2, P_DOME), px(19, 0, 2, 1, P_STONE), _jsx("rect", { x: 19 * P + 3, y: 0, width: 2, height: P, fill: P_STONE }), _jsx("rect", { x: 19 * P + 4, y: 0, width: 1, height: 6 * P, fill: P_STONE2 }), px(20, 0, 6, 1, P_CB), px(20, 1, 6, 1, P_WH), px(20, 2, 6, 1, P_CB), [16, 19, 22].map(c => (_jsx("rect", { x: c * P, y: 4 * P, width: 2 * P, height: 2 * P, fill: P_WIN2 }, c))), px(11, 10, 18, 8, P_BG), px(18, 14, 4, 3, P_SLT), px(19, 13, 2, 1, P_GD), _jsx("g", { className: "gsap-primary", children: _jsx(PixPerson, { c: 19, r: 10, suit: P_SLT, skin: P_SK, hair: hair }) }), [12, 14, 16].map((row, ri) => {
                const totalCols = 14;
                const govCols = Math.round(govRatio * totalCols);
                return Array.from({ length: totalCols }, (_, i) => (_jsx("rect", { x: (12 + i) * P, y: row * P, width: P, height: P, fill: i < govCols ? P_CB : P_CR, opacity: 0.90 - ri * 0.15 }, `s${row}-${i}`)));
            }), [10, 14, 18, 22, 26].map(c => (_jsx("rect", { x: c * P, y: 9 * P, width: P, height: 10 * P, fill: P_STONE }, `oc${c}`))), hasChaos ? (_jsxs("g", { children: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (_jsx(PixPerson, { c: 3 + i * 3, r: 15, suit: i % 3 === 0 ? P_CR : i % 3 === 1 ? P_RD : P_SLT, skin: P_SK, hair: P_BK }, i))), [0, 3, 6, 9].map(i => (_jsx("rect", { x: (4 + i * 3) * P, y: 13 * P, width: 2 * P, height: 2 * P, fill: P_RD }, i))), px(2, 14, 3, 3, P_OR), px(2, 12, 2, 2, P_YL), px(35, 14, 3, 3, P_OR), px(36, 12, 2, 2, P_YL), px(17, 2, 6, 3, 'rgba(255,40,0,0.4)'), lbl('QUILOMBO EN EL CONGRESO', P_CR)] })) : (_jsxs("g", { children: [[14, 22].map(c => (_jsxs("g", { children: [_jsx("rect", { x: c * P, y: 14 * P, width: 1, height: 4 * P, fill: P_GR }), px(c + 1, 14, 3, 1, P_CB), px(c + 1, 15, 3, 1, P_WH), px(c + 1, 16, 3, 1, P_CB)] }, c))), [12, 17, 22, 27].map((c, i) => (_jsx(PixPerson, { c: c, r: 17, suit: [P_CB, P_SLT, P_CR, P_CB][i], skin: P_SK, hair: P_BK }, c))), lbl('CONGRESO NACIONAL')] }))] }));
}
// â”€â”€ SCENE: pol_scandal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ScenePolScandal({ presidentId: _p }) {
    return (_jsxs("g", { children: [px(0, 0, 40, 20, P_BK), _jsxs("g", { className: "gsap-primary", children: [px(14, 0, 12, 20, P_YL), _jsx("rect", { x: 14 * P, y: 0, width: 2 * P, height: 20 * P, fill: "rgba(0,0,0,0.55)" }), _jsx("rect", { x: 24 * P, y: 0, width: 2 * P, height: 20 * P, fill: "rgba(0,0,0,0.55)" })] }), _jsx(PixPerson, { c: 19, r: 13, suit: P_SLT, skin: P_SK, hair: P_BK }), px(2, 6, 10, 8, P_WH), px(2, 6, 10, 2, P_BK), px(3, 7, 8, 1, P_WH), px(3, 9, 8, 1, P_GR2), px(3, 10, 6, 1, P_GR2), px(3, 11, 7, 1, P_GR2), px(3, 12, 5, 1, P_GR2), px(28, 5, 4, 3, P_GR), px(29, 4, 2, 1, P_GR2), px(32, 5, 3, 2, P_GR2), px(28, 6, 1, 1, P_WH), [25, 27].map(c => _jsx("rect", { x: c * P, y: 4 * P, width: P, height: P, fill: P_YL }, c)), lbl('ESCÃNDALO POLÃTICO')] }));
}
// â”€â”€ SCENE: pol_protest â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ScenePolProtest() {
    return (_jsxs("g", { children: [px(0, 0, 40, 5, P_NAV), px(0, 17, 40, 3, P_GR), [0, 4, 8, 12, 16, 20, 24, 28, 32, 36].map(c => _jsx("rect", { x: c * P, y: 17 * P, width: 3 * P, height: P, fill: P_GR2 }, c)), px(0, 16, 40, 1, P_BR), [1, 4, 7, 10, 13, 17, 20, 23, 26, 29, 32, 35].map((c, i) => (_jsx(PixPerson, { c: c, r: 12, suit: [P_RD, P_SLT, P_GR, P_CB, P_DG, P_CR, P_RD, P_SLT, P_GN, P_CB, P_GR, P_RD][i], skin: P_SK, hair: P_BK }, c))), [2, 9, 18, 27, 33].map(c => _jsx("rect", { x: c * P, y: 10 * P, width: 2 * P, height: 2 * P, fill: [P_RD, P_CB, P_YL, P_RD, P_GN][Math.floor(c / 7) % 5] }, c)), [3, 10, 19, 28, 34].map(c => _jsx("rect", { x: c * P, y: 10 * P, width: 1, height: 2 * P, fill: P_GR }, c)), px(5, 2, 30, 3, P_RD), px(6, 3, 28, 1, P_WH), _jsx("text", { x: 7 * P, y: 4 * P + 6, fill: P_RD, fontSize: 7, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "BASTA!" }), lbl('PROTESTA POPULAR')] }));
}
// â”€â”€ SCENE: eco_inflation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneEcoInflation() {
    return (_jsxs("g", { children: [px(0, 0, 40, 20, P_WH), [4, 9, 14].map(r => _jsx("rect", { x: 0, y: r * P, width: 320, height: P, fill: P_BR }, r)), [[0, P_RD], [2, P_CB], [4, P_GN], [6, P_YL], [8, P_OR], [10, P_RD], [12, P_CB], [14, P_GN], [16, P_YL]].map(([c, f], i) => _jsx("rect", { x: c * P, y: 3 * P, width: 2 * P, height: P, fill: f }, i)), [[0, P_GN], [3, P_OR], [6, P_CB], [9, P_RD], [12, P_GD], [15, P_GN], [18, P_OR]].map(([c, f], i) => _jsx("rect", { x: c * P, y: 8 * P, width: 2 * P, height: P, fill: f }, i)), [[0, P_CB], [2, P_YL], [4, P_RD], [6, P_GN], [8, P_OR], [10, P_CB]].map(([c, f], i) => _jsx("rect", { x: c * P, y: 13 * P, width: 2 * P, height: P, fill: f }, i)), _jsxs("g", { className: "gsap-primary", children: [[0, 1, 2, 3, 4, 5, 6].map(i => _jsx("rect", { x: (23 + i) * P, y: (17 - i * 2) * P, width: 2 * P, height: 2 * P, fill: P_RD }, i)), px(29, 5, 3, 1, P_RD), px(30, 4, 2, 1, P_RD), px(31, 3, 1, 1, P_RD)] }), px(26, 0, 10, 4, P_BK), _jsx("text", { x: 27 * P, y: 3 * P, fill: P_CR, fontSize: 11, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "$$$" }), px2(5, 1, 10, 1, P_GR2), px2(35, 1, 10, 1, P_GR2), px2(65, 1, 10, 1, P_GR2), _jsx(PixPerson, { c: 5, r: 15, suit: P_SLT, skin: P_SK, hair: P_BR }), lbl('INFLACIÃ“N')] }));
}
// â”€â”€ SCENE: eco_reserves â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneEcoReserves() {
    return (_jsxs("g", { children: [px(0, 0, 40, 20, P_WH), [3, 7, 11, 15, 19].map(r => _jsx("rect", { x: 0, y: r * P, width: 320, height: 2, fill: P_GR2 }, r)), px(6, 2, 28, 16, P_GR2), px(7, 3, 26, 14, P_WH), px(5, 1, 30, 2, P_GR), px(4, 0, 32, 1, P_SLT), [7, 9, 25, 27].map(c => _jsx("rect", { x: c * P, y: 3 * P, width: P, height: 14 * P, fill: P_GR2 }, c)), px(12, 4, 16, 12, P_GR), px(13, 5, 14, 10, P_SLT), px(14, 6, 12, 8, P_GR), px(15, 7, 10, 6, P_BK), px(19, 9, 2, 4, P_GR), px(17, 11, 6, 2, P_GR), _jsxs("g", { className: "gsap-secondary", children: [[16, 18, 20].map(c => _jsx("rect", { x: c * P, y: 13 * P, width: 2 * P, height: P, fill: P_GD }, c)), [17, 19].map(c => _jsx("rect", { x: c * P, y: 14 * P, width: 2 * P, height: P, fill: P_GD }, c))] }), px(14, 3, 12, 2, P_BK), _jsx("text", { x: 15 * P, y: 5 * P, fill: P_GD, fontSize: 7, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "BCRA" }), _jsx(PixPerson, { c: 22, r: 15, suit: P_SLT, skin: P_SK, hair: P_BK }), lbl('RESERVAS DEL BCRA')] }));
}
// â”€â”€ SCENE: eco_growth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneEcoGrowth() {
    return (_jsxs("g", { children: [px(0, 0, 40, 10, P_LB), px(0, 10, 40, 10, P_GN), px(0, 10, 40, 1, P_DG), px(2, 5, 10, 15, P_SLT), px(3, 3, 3, 2, P_GR), px(7, 4, 2, 1, P_GR), [3, 6].map(c => [6, 9].map(r => _jsx("rect", { x: c * P, y: r * P, width: 2 * P, height: 2 * P, fill: P_GD }, `${c}${r}`))), _jsx("g", { className: "gsap-secondary", children: [3, 7].map(c => [1, 2, 3].map(r => _jsx("rect", { x: (c - 1) * P, y: (3 - r) * P, width: 3 * P, height: P, fill: 'rgba(180,195,210,0.7)' }, `${c}${r}`))) }), _jsxs("g", { className: "gsap-primary", children: [[{ c: 22, h: 3, f: P_RD }, { c: 26, h: 6, f: P_YL }, { c: 30, h: 9, f: P_GN }, { c: 34, h: 13, f: P_GD }].map(({ c, h, f }) => (_jsx("rect", { x: c * P, y: (20 - h) * P, width: 3 * P, height: h * P, fill: f }, c))), px(21, 19, 18, 1, P_BK), [0, 1, 2, 3].map(i => _jsx("rect", { x: (23 + i * 3) * P, y: (16 - i * 2) * P, width: P, height: P, fill: P_GD }, i))] }), lbl('CRECIMIENTO ECONÃ“MICO')] }));
}
// â”€â”€ SCENE: soc_strike â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneSocStrike() {
    return (_jsxs("g", { children: [px(0, 0, 40, 5, P_GR2), px(0, 5, 10, 15, P_GR), px(15, 3, 8, 17, P_GR), px(27, 6, 13, 14, P_GR), [2, 4].map(c => [6, 10].map(r => _jsx("rect", { x: c * P, y: r * P, width: 2 * P, height: 2 * P, fill: P_YL }, `${c}${r}`))), [12, 13, 14].map(c => _jsx("rect", { x: c * P, y: 5 * P, width: P, height: 12 * P, fill: P_BK }, c)), px(0, 17, 40, 1, P_BR), [22, 25, 28, 31, 34, 37].map((c, i) => (_jsx(PixPerson, { c: c, r: 11, suit: i % 2 === 0 ? P_CB : P_SLT, skin: P_SK, hair: P_BK }, c))), [22, 28, 34].map(c => (_jsxs("g", { children: [_jsx("rect", { x: c * P, y: 8 * P, width: 3 * P, height: 3 * P, fill: P_RD }), _jsx("rect", { x: (c + 1) * P, y: 7 * P, width: P, height: P, fill: P_RD }), _jsx("rect", { x: (c + 1) * P + 4, y: 8 * P, width: 1, height: 3 * P, fill: P_GR })] }, c))), px(20, 8, 5, 3, P_RD), _jsx("text", { x: 21 * P, y: 11 * P, fill: P_WH, fontSize: 6, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "HUELGA" }), px(1, 2, 2, 3, P_GR), px2(4, 2, 6, 4, 'rgba(80,90,100,0.6)'), px2(2, 0, 5, 3, 'rgba(80,90,100,0.4)'), _jsx("rect", { x: 16 * P, y: 3 * P, width: 1, height: 3 * P, fill: P_GR }), px(17, 3, 3, 1, P_RD), px(17, 4, 3, 1, P_WH), px(17, 5, 3, 1, P_RD), lbl('HUELGA GENERAL')] }));
}
// â”€â”€ SCENE: soc_unrest â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneSocUnrest() {
    return (_jsxs("g", { children: [px(0, 0, 40, 20, P_BK), px(0, 4, 5, 16, P_NAV), px(5, 6, 4, 14, P_NAV), px(9, 3, 6, 17, P_NAV), px(20, 5, 5, 15, P_NAV), px(25, 2, 6, 18, P_NAV), px(31, 7, 4, 13, P_NAV), px(35, 4, 5, 16, P_NAV), [[1, 8], [2, 10], [3, 7], [10, 5], [11, 9], [12, 7], [21, 7], [22, 10], [26, 4], [27, 8], [32, 10]].map(([c, r]) => _jsx("rect", { x: c * P, y: r * P, width: P, height: P, fill: P_YL }, `${c}${r}`)), px(0, 18, 40, 2, P_GR), _jsxs("g", { className: "gsap-explosion", children: [px(12, 14, 4, 4, P_OR), px(13, 12, 2, 2, P_YL), px(13, 11, 2, 1, P_WH), px(18, 12, 4, 6, P_OR), px(19, 10, 2, 2, P_YL), px(19, 9, 2, 1, P_WH), px(24, 15, 4, 3, P_OR), px(25, 13, 2, 2, P_YL), px(25, 12, 2, 1, P_WH)] }), [0, 2, 4].map(c => _jsx(PixPerson, { c: c + 35, r: 13, suit: P_NAV, skin: P_SK, hair: P_BK }, c)), lbl('DISTURBIOS SOCIALES')] }));
}
// â”€â”€ SCENE: soc_health â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneSocHealth() {
    return (_jsxs("g", { children: [px(0, 0, 40, 20, P_WH), px(2, 4, 20, 16, P_GR2), [3, 7, 11].map(c => [5, 9].map(r => _jsx("rect", { x: c * P, y: r * P, width: 3 * P, height: 3 * P, fill: P_LB }, `${c}${r}`))), px(9, 2, 4, 1, P_CR), px(8, 3, 6, 1, P_CR), px(9, 4, 4, 1, P_CR), px(9, 14, 6, 6, P_SLT), [24, 31].map(c => (_jsxs("g", { children: [px(c, 13, 7, 2, P_WH), px(c, 12, 7, 1, P_GR2), px(c, 12, 2, 2, P_SK)] }, c))), _jsx(PixPerson, { c: 22, r: 14, suit: P_WH, skin: P_SK, hair: P_BK }), px(30, 15, 9, 4, P_WH), px(30, 15, 9, 1, P_WH), px(31, 14, 3, 1, P_CR), px(35, 14, 3, 1, P_CR), px(32, 16, 2, 2, P_GR), px(36, 16, 2, 2, P_GR), lbl('CRISIS SANITARIA', P_CR)] }));
}
// â”€â”€ SCENE: int_imf â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneIntImf({ presidentId }) {
    const hair = presidentId === 'tecnocrata' ? P_GD : P_BK;
    return (_jsxs("g", { children: [px(0, 0, 40, 20, P_NAV), px(4, 12, 32, 3, P_BR), px(4, 11, 32, 1, P_GD), _jsxs("g", { className: "gsap-primary", children: [px(17, 1, 6, 8, P_CB), [2, 3, 4, 5, 6, 7].map(r => _jsx("rect", { x: 17 * P, y: r * P, width: 6 * P, height: 3, fill: P_GN }, r)), px(18, 3, 2, 2, P_GN), px(20, 4, 2, 1, P_GN), px(19, 6, 2, 1, P_GN), _jsx("rect", { x: 17 * P, y: P, width: 6 * P, height: 8 * P, fill: "none", stroke: P_WH, strokeWidth: 2 })] }), _jsx(PixPerson, { c: 6, r: 6, suit: P_SLT, skin: P_GR2, hair: P_GR2 }), _jsx(PixPerson, { c: 31, r: 6, suit: P_NAV, skin: P_SK, hair: hair }), px(11, 11, 8, 1, P_WH), px(22, 11, 8, 1, P_WH), px(18, 11, 4, 3, P_GR), px(19, 10, 2, 1, P_GR), lbl('NEGOCIACIÃ“N FMI')] }));
}
// â”€â”€ SCENE: int_war â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneIntWar() {
    return (_jsxs("g", { children: [px(0, 0, 40, 20, P_BK), px(2, 1, 16, 16, P_DG), [4, 8, 12].map(c => _jsx("rect", { x: (2 + c) * P, y: P, width: P / 4, height: 16 * P, fill: P_GN }, c)), [4, 8, 12].map(r => _jsx("rect", { x: 2 * P, y: (1 + r) * P, width: 16 * P, height: P / 4, fill: P_GN }, r)), _jsxs("g", { className: "gsap-primary", children: [px(10, 1, 2, 8, P_GN), px(10, 9, 8, 2, P_GN)] }), _jsxs("g", { className: "gsap-explosion", children: [px(14, 5, 2, 2, P_RD), px(13, 5, 1, 1, P_OR), px(15, 4, 1, 1, P_OR)] }), px(5, 3, 4, 2, P_GN), px(6, 5, 3, 3, P_GN), px(5, 8, 2, 2, P_GN), px(7, 9, 2, 4, P_GN), px(8, 6, 2, 3, P_GN), _jsx(PixPerson, { c: 24, r: 13, suit: P_SLT, skin: P_SK, hair: P_BK }), _jsx(PixPerson, { c: 29, r: 13, suit: P_NAV, skin: P_SK, hair: P_BK }), px(20, 3, 18, 8, P_SLT), [1, 2, 3, 4, 5].map(r => _jsx("rect", { x: 21 * P, y: (3 + r) * P, width: 16 * P, height: P / 2, fill: P_GR }, r)), px(21, 4, 4, 1, P_RD), px(27, 5, 3, 1, P_YL), px(33, 6, 2, 1, P_GN), lbl('CONFLICTO INTERNACIONAL')] }));
}
// â”€â”€ SCENE: int_trade â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneIntTrade() {
    return (_jsxs("g", { children: [px(0, 0, 40, 8, P_LB), px(0, 8, 40, 12, P_CB), [9, 11, 13].map(r => _jsx("rect", { x: 0, y: r * P, width: 320, height: 3, fill: P_NAV }, r)), _jsxs("g", { className: "gsap-primary", children: [px(4, 10, 32, 5, P_GR), px(3, 11, 34, 3, P_SLT), px(2, 12, 2, 1, P_GR), px(1, 13, 2, 1, P_GR), [[5, P_RD], [8, P_CB], [11, P_GN], [14, P_YL], [17, P_OR], [20, P_RD], [23, P_CB], [26, P_GN]].map(([c, f]) => _jsx("rect", { x: c * P, y: 8 * P, width: 3 * P, height: 2 * P, fill: f }, c)), [[6, P_GN], [9, P_OR], [12, P_CB], [15, P_RD], [18, P_GN], [21, P_YL], [24, P_RD]].map(([c, f]) => _jsx("rect", { x: c * P, y: 6 * P, width: 3 * P, height: 2 * P, fill: f }, c)), px(28, 6, 6, 4, P_NAV), px(29, 5, 4, 2, P_GR), [29, 31].map(c => _jsx("rect", { x: c * P, y: 6 * P, width: 2 * P, height: 2 * P, fill: P_LB }, c))] }), [1, 3].map(c => (_jsxs("g", { children: [_jsx("rect", { x: c * P, y: 5 * P, width: 1, height: 8 * P, fill: P_GR }), _jsx("rect", { x: c * P + 1, y: 5 * P, width: 2 * P, height: P, fill: c === 1 ? P_CB : P_GN }), _jsx("rect", { x: c * P + 1, y: 6 * P, width: 2 * P, height: P, fill: c === 1 ? P_WH : P_YL })] }, c))), lbl('COMERCIO EXTERIOR')] }));
}
// â”€â”€ SCENE: int_guerra_ucrania â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneIntGuerraUcrania() {
    return (_jsxs("g", { children: [px(0, 0, 40, 11, P_CB), px(0, 11, 40, 9, P_GD), px(0, 0, 40, 20, 'rgba(0,0,40,0.5)'), px(0, 7, 5, 13, P_BK), px(5, 9, 4, 11, P_BK), px(9, 5, 5, 15, P_BK), px(14, 8, 4, 12, P_BK), px(28, 6, 4, 14, P_BK), px(32, 9, 3, 11, P_BK), px(35, 5, 5, 15, P_BK), [[1, 10], [3, 9], [10, 8], [11, 12], [29, 8], [36, 9], [37, 12]].map(([c, r]) => _jsx("rect", { x: c * P, y: r * P, width: P, height: P, fill: P_YL }, `${c}${r}`)), _jsxs("g", { className: "gsap-explosion", children: [px(16, 6, 8, 5, P_OR), px(18, 4, 4, 3, P_YL), px(19, 2, 2, 2, P_WH)] }), _jsx("g", { className: "gsap-secondary", children: [16, 18, 20, 16, 19].map((c, i) => _jsx("rect", { x: c * P, y: (6 - i) * P, width: 3 * P, height: P, fill: "#546e7a" }, i)) }), _jsxs("g", { className: "gsap-primary", children: [px(8, 14, 12, 4, P_DG), px(7, 16, 14, 2, P_DG), [9, 11, 13, 15, 17].map(c => _jsx("rect", { x: c * P, y: 18 * P, width: P, height: P, fill: P_BK }, c)), px(11, 12, 6, 3, P_DG), px(15, 13, 6, 1, P_GR)] }), _jsx("rect", { x: 0, y: 160, width: 320, height: 20, fill: "rgba(0,0,0,0.85)" }), _jsx("text", { x: 8, y: 174, fill: P_YL, fontSize: 8, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "GUERRA UCRANIA 2022" })] }));
}
// â”€â”€ SCENE: int_conflicto_iran â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneIntConflictoIran() {
    return (_jsxs("g", { children: [px(0, 0, 40, 4, P_OR), px(0, 4, 40, 4, P_RD), px(0, 8, 40, 4, '#CC4400'), px(0, 12, 40, 8, P_BR), px(0, 16, 40, 4, '#C8A060'), px(28, 4, 2, 12, P_BK), px(24, 3, 10, 2, P_BK), px(26, 1, 6, 3, P_BK), px(27, 0, 4, 1, P_BK), _jsxs("g", { className: "gsap-secondary", children: [px(28, 3, 2, 3, P_OR), px(29, 1, 1, 2, P_YL), px(29, 0, 1, 1, P_WH)] }), px(4, 10, 10, 8, P_SLT), px(5, 8, 8, 2, P_SLT), px(7, 6, 4, 2, P_SLT), px(8, 5, 2, 1, P_GD), px(5, 11, 2, 2, P_GD), px(10, 11, 2, 2, P_GD), px(1, 2, 4, 4, P_GN), px(2, 2, 3, 3, P_BK), px(2, 3, 2, 2, P_GN), _jsxs("g", { className: "gsap-primary", children: [px(16, 10, 4, 2, P_GR2), px(17, 9, 2, 1, P_GR), px(20, 11, 5, 1, P_OR), px(22, 11, 3, 1, P_YL), px(24, 11, 2, 1, P_GD)] }), _jsx("rect", { x: 0, y: 160, width: 320, height: 20, fill: "rgba(0,0,0,0.85)" }), _jsx("text", { x: 8, y: 174, fill: P_OR, fontSize: 8, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "CONFLICTO IR\u00C3\u0081N 2024" })] }));
}
// ── SCENE: eco_dollar_blue ─────────────────────────────────────────────────────────────────────────
function SceneEcoDolarBlue() {
    return (_jsxs("g", { children: [px(0, 0, 40, 22, P_BK), px(0, 0, 6, 22, '#0A0F1A'), px(34, 0, 6, 22, '#0A0F1A'), px(0, 17, 40, 5, '#111827'), px(4, 2, 12, 7, P_GR), px(5, 3, 10, 1, P_CB), px(5, 4, 10, 1, P_WH), px(5, 5, 10, 1, P_CB), _jsx("text", { x: 40, y: 50, fill: P_WH, fontSize: 5, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "OFICIAL" }), _jsx("text", { x: 38, y: 62, fill: P_GD, fontSize: 6, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "$1100" }), px(9, 9, 2, 8, P_GR), px(22, 2, 14, 7, '#0d0d0d'), px(23, 3, 12, 5, P_BK), _jsx("text", { x: 186, y: 42, fill: P_RD, fontSize: 4, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "BLUE" }), _jsx("text", { x: 182, y: 62, fill: P_OR, fontSize: 6, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "$2900" }), px(27, 9, 2, 8, P_GR2), _jsxs("g", { className: "gsap-primary", children: [px(17, 9, 4, 3, P_BK), px(17, 12, 4, 2, P_SK), px(16, 14, 6, 3, P_BK), px(16, 17, 2, 2, P_BK), px(20, 17, 2, 2, P_BK)] }), px(8, 16, 3, 1, P_GD), px(14, 16, 2, 1, P_GN), px(24, 16, 3, 1, P_GD), px(30, 16, 2, 1, P_GN), _jsx("rect", { x: 0, y: 160, width: 320, height: 20, fill: "rgba(0,0,0,0.85)" }), _jsx("text", { x: 8, y: 174, fill: P_GD, fontSize: 8, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "DOLAR BLUE" })] }));
}
// ── SCENE: pol_election ────────────────────────────────────────────────────────────────────────────
function ScenePolElection() {
    return (_jsxs("g", { children: [px(0, 0, 40, 10, P_LB), px(0, 10, 40, 12, P_GR), [3, 10, 22, 29].map((bx, i) => (_jsxs("g", { children: [px(bx, 2, 6, 10, P_WH), px(bx, 2, 6, 1, P_SLT), px(bx + 2, 5, 2, 4, P_GR)] }, i))), [0, 1, 2, 3, 4, 5].map(i => (_jsxs("g", { children: [px(i * 7, 0, 1, 1, P_CB), px(i * 7, 1, 1, 1, P_WH), px(i * 7, 2, 1, 1, P_CB)] }, i))), px(17, 10, 6, 4, P_BK), px(18, 9, 4, 1, P_BK), px(19, 8, 2, 1, P_GR2), _jsxs("g", { className: "gsap-primary", children: [_jsx(PixPerson, { c: 1, r: 10, suit: P_CB }), _jsx(PixPerson, { c: 4, r: 10, suit: P_NAV }), _jsx(PixPerson, { c: 7, r: 10, suit: P_WH, skin: P_SK }), _jsx(PixPerson, { c: 10, r: 10, suit: P_GR })] }), px(19, 12, 2, 2, P_WH), _jsx("rect", { x: 0, y: 160, width: 320, height: 20, fill: "rgba(0,0,0,0.85)" }), _jsx("text", { x: 8, y: 174, fill: P_CB, fontSize: 8, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "ELECCIONES" })] }));
}
// ── SCENE: soc_housing ────────────────────────────────────────────────────────────────────────────
function SceneSocHousing() {
    return (_jsxs("g", { children: [px(0, 0, 40, 10, P_SLT), px(0, 16, 40, 6, '#1a1a1a'), px(0, 4, 6, 14, P_NAV), px(7, 6, 7, 12, P_GR), px(15, 2, 8, 16, P_SLT), px(24, 5, 7, 13, P_NAV), px(32, 7, 8, 11, P_GR), [1, 3].map(c => [5, 7, 9, 11].map(r => _jsx("rect", { x: c * 8 + 4, y: r * 8, width: 8, height: 8, fill: P_YL, opacity: 0.3 }, `${c}${r}`))), px(8, 5, 6, 2, P_RD), _jsx("text", { x: 66, y: 52, fill: P_WH, fontSize: 4, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "ALQUIL" }), px(25, 4, 6, 2, P_RD), _jsx("text", { x: 202, y: 40, fill: P_WH, fontSize: 4, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "ALQUIL" }), _jsxs("g", { className: "gsap-primary", children: [_jsx(PixPerson, { c: 1, r: 12, suit: P_BK }), px(3, 15, 2, 3, P_BR), _jsx(PixPerson, { c: 5, r: 13, suit: P_GR }), px(7, 16, 2, 3, P_BR), _jsx(PixPerson, { c: 9, r: 12, suit: P_NAV }), px(11, 15, 2, 3, P_BR)] }), _jsx("rect", { x: 0, y: 160, width: 320, height: 20, fill: "rgba(0,0,0,0.85)" }), _jsx("text", { x: 8, y: 174, fill: P_RD, fontSize: 8, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "VIVIENDA" })] }));
}
// ── SCENE: eco_corte_luz ────────────────────────────────────────────────────────────────────────────
function SceneEcoCorteLuz() {
    return (_jsxs("g", { children: [px(0, 0, 40, 22, '#050510'), [2, 6, 11, 17, 23, 30, 36].map((x, i) => (_jsx("rect", { x: x * 8, y: (i % 3) * 16 + 8, width: 2, height: 2, fill: P_WH, opacity: 0.6 }, i))), px(0, 6, 5, 16, P_BK), px(6, 8, 6, 14, P_NAV), px(13, 4, 7, 18, P_BK), px(21, 7, 6, 15, P_NAV), px(28, 5, 6, 17, P_BK), px(35, 9, 5, 13, P_NAV), _jsxs("g", { className: "gsap-primary", children: [px(7, 13, 2, 3, P_YL), px(7, 12, 2, 1, P_OR), px(24, 10, 2, 3, P_YL), px(24, 9, 2, 1, P_OR), px(14, 14, 2, 3, P_YL), px(14, 13, 2, 1, P_OR)] }), _jsx("rect", { x: 52, y: 96, width: 32, height: 16, fill: P_YL, opacity: 0.06 }), _jsx("rect", { x: 188, y: 72, width: 32, height: 16, fill: P_YL, opacity: 0.06 }), px(30, 5, 1, 7, P_GR2), _jsx("rect", { x: 240, y: 40, width: 32, height: 2, fill: P_GR2, transform: "rotate(12,240,40)" }), px(36, 9, 1, 5, P_GR2), _jsx("rect", { x: 0, y: 160, width: 320, height: 20, fill: "rgba(0,0,0,0.85)" }), _jsx("text", { x: 8, y: 174, fill: P_YL, fontSize: 8, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "CORTE DE LUZ" })] }));
}
// ── SCENE: pol_veto ────────────────────────────────────────────────────────────────────────────────
function ScenePolVeto() {
    return (_jsxs("g", { children: [px(0, 0, 40, 22, P_NAV), px(0, 14, 40, 8, P_SLT), px(0, 0, 40, 1, P_GR), px(6, 12, 28, 2, P_BR), px(6, 14, 28, 4, P_BR), px(7, 16, 3, 4, P_BK), px(29, 16, 3, 4, P_BK), _jsx(PixPerson, { c: 17, r: 8, suit: P_BK, skin: P_SK, hair: P_BK }), px(8, 11, 4, 2, P_WH), px(13, 12, 5, 2, P_WH), px(25, 11, 4, 2, P_WH), px(30, 12, 3, 2, P_WH), _jsxs("g", { className: "gsap-primary", children: [_jsx("rect", { x: 80, y: 40, width: 160, height: 56, fill: P_CR, opacity: 0.15 }), _jsx("rect", { x: 80, y: 40, width: 160, height: 8, fill: P_CR, opacity: 0.8 }), _jsx("rect", { x: 80, y: 88, width: 160, height: 8, fill: P_CR, opacity: 0.8 }), _jsx("rect", { x: 80, y: 48, width: 8, height: 40, fill: P_CR, opacity: 0.8 }), _jsx("rect", { x: 232, y: 48, width: 8, height: 40, fill: P_CR, opacity: 0.8 }), _jsx("text", { x: 90, y: 72, fill: P_WH, fontSize: 14, fontFamily: "'Press Start 2P'", fontWeight: "bold", style: { imageRendering: 'pixelated' }, children: "VETADO" }), _jsx("rect", { x: 76, y: 36, width: 180, height: 6, fill: P_CR, opacity: 0.6, transform: "rotate(-8,76,36)" })] }), _jsxs("g", { className: "gsap-secondary", children: [px(4, 17, 4, 2, P_WH), px(10, 18, 5, 2, P_WH), px(19, 17, 3, 2, P_WH), px(28, 18, 4, 2, P_WH), px(34, 17, 4, 2, P_WH)] }), px(33, 1, 1, 12, P_GR), px(34, 1, 5, 3, P_CB), px(34, 4, 5, 3, P_WH), px(34, 7, 5, 3, P_CB), _jsx("rect", { x: 0, y: 160, width: 320, height: 20, fill: "rgba(0,0,0,0.85)" }), _jsx("text", { x: 8, y: 174, fill: P_CR, fontSize: 8, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "PRESIDENTE VETA" })] }));
}
// â”€â”€ SCENE: arg_mundial â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneArgMundial() {
    return (_jsxs("g", { children: [px(0, 0, 40, 4, P_NAV), px(0, 0, 40, 1, P_CB), px(0, 1, 40, 1, P_WH), px(0, 2, 40, 1, P_CB), px(0, 3, 40, 1, P_WH), [0, 1, 2, 3, 4].map(i => _jsx("rect", { x: 0, y: (5 + i) * P, width: (10 - i) * P, height: P, fill: [P_CB, P_WH, P_CB, P_WH, P_CB][i] }, i)), [0, 1, 2, 3, 4].map(i => _jsx("rect", { x: (30 + i) * P, y: (5 + i) * P, width: (10 - i) * P, height: P, fill: [P_CB, P_WH, P_CB, P_WH, P_CB][i] }, i)), [1, 3, 5, 7].map(c => [5, 6].map(r => _jsx("rect", { x: c * P, y: r * P, width: P, height: P, fill: c % 2 === 0 ? P_GD : P_RD }, `${c}${r}`))), px(0, 10, 40, 10, P_GN), px(10, 9, 20, 1, P_DG), px(18, 12, 4, 1, P_WH), px(17, 13, 6, 1, P_WH), px(18, 14, 4, 1, P_WH), px(17, 11, 1, 5, P_WH), px(22, 11, 1, 5, P_WH), px(18, 4, 4, 6, P_GD), px(17, 9, 6, 1, P_GD), px(16, 10, 8, 1, P_GD), px(19, 3, 2, 1, P_WH), _jsx("g", { className: "gsap-secondary", children: [[3, 1, P_RD], [8, 3, P_CB], [13, 2, P_YL], [28, 4, P_GN], [33, 2, P_RD], [38, 3, P_CB], [6, 6, P_YL], [22, 5, P_RD], [37, 7, P_GN]].map(([c, r, f]) => _jsx("rect", { x: c * P, y: r * P, width: P, height: P, fill: f }, `${c}${r}`)) }), lbl('ARGENTINA CAMPEÃ“N âš½', P_GD)] }));
}
// â”€â”€ SCENE: arg_corralito â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneArgCorralito() {
    return (_jsxs("g", { children: [px(0, 0, 40, 5, P_GR2), px(2, 2, 20, 18, P_WH), [3, 7, 11, 15].map(c => _jsx("rect", { x: c * P, y: 2 * P, width: 2 * P, height: 16 * P, fill: P_GR2 }, c)), px(1, 1, 22, 2, P_GR), px(5, 3, 12, 2, P_NAV), _jsx("text", { x: 6 * P, y: 5 * P + 4, fill: P_GD, fontSize: 6, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "BANCO \u00E2\u2013\u00A1" }), [8, 9, 10, 11, 12, 13, 14, 15].map(c => _jsx("rect", { x: c * P, y: 13 * P, width: P, height: 7 * P, fill: P_GR }, c)), px(11, 15, 2, 2, P_BK), px(11, 14, 2, 1, P_GR2), [24, 27, 30, 33, 36].map((c, i) => (_jsx(PixPerson, { c: c, r: 13, suit: [P_SLT, P_RD, P_CB, P_GR, P_SLT][i], skin: P_SK, hair: P_BK }, c))), px(23, 18, 16, 1, P_RD), px(6, 12, 10, 2, P_CR), _jsx("text", { x: 7 * P, y: 14 * P, fill: P_WH, fontSize: 6, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "CERRADO" }), lbl('CORRALITO BANCARIO')] }));
}
// â”€â”€ SCENE: arg_campo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneArgCampo() {
    return (_jsxs("g", { children: [px(0, 0, 40, 8, P_LB), px(0, 8, 40, 1, P_DG), px(0, 9, 40, 11, P_GN), px(0, 11, 40, 1, P_DG), px(0, 14, 40, 1, P_DG), [[3, 2, 6, 2], [12, 1, 8, 2], [24, 2, 7, 2], [33, 1, 5, 1]].map(([c, r, w, h]) => _jsx("rect", { x: c * P, y: r * P, width: w * P, height: h * P, fill: P_WH }, c)), px(33, 4, 4, 16, P_GR2), px(33, 3, 4, 1, P_GR), px(27, 8, 6, 8, P_WH), px(26, 7, 8, 2, P_CR), px(28, 10, 2, 3, P_BR), _jsxs("g", { className: "gsap-primary", children: [px(3, 12, 8, 4, P_RD), px(2, 13, 2, 2, P_BK), px(8, 14, 2, 1, P_BK), px(3, 10, 4, 2, P_GR), px(4, 9, 2, 1, P_LB), px(7, 11, 2, 1, P_BK)] }), lbl('CONFLICTO AGROPECUARIO')] }));
}
// â”€â”€ SCENE: crisis â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SceneCrisis({ presidentId }) {
    const hair = presidentId === 'tecnocrata' ? P_GD : P_BK;
    return (_jsxs("g", { children: [px(0, 0, 40, 20, '#100000'), px(0, 8, 6, 12, P_NAV), px(6, 10, 5, 10, P_NAV), px(30, 6, 5, 14, P_NAV), px(35, 9, 5, 11, P_NAV), _jsxs("g", { className: "gsap-explosion", children: [px(9, 8, 6, 10, P_OR), px(10, 5, 4, 3, P_YL), px(11, 3, 2, 2, P_WH), px(17, 5, 6, 13, P_OR), px(18, 2, 4, 3, P_YL), px(19, 0, 2, 2, P_WH), px(25, 9, 6, 9, P_OR), px(26, 6, 4, 3, P_YL), px(27, 4, 2, 2, P_WH)] }), _jsxs("g", { className: "gsap-primary", children: [_jsx(PixPerson, { c: 19, r: 13, suit: P_SLT, skin: P_SK, hair: hair }), px(17, 15, 2, 1, P_SLT), px(23, 15, 2, 1, P_SLT)] }), px2(2, 36, 5, 2, P_GR2), px2(10, 37, 7, 2, P_SLT), px2(22, 36, 4, 2, P_GR2), px2(62, 37, 6, 2, P_SLT), px2(76, 36, 5, 2, P_GR2), px2(38, 30, 2, 2, P_YL), px2(44, 27, 2, 2, P_OR), px2(72, 29, 2, 2, P_YL), px(0, 0, 40, 4, 'rgba(30,0,0,0.6)'), lbl('âš  CRISIS DE GOBIERNO', P_CR)] }));
}
// -- SCENE: guerra_join -------------------------------------------------------
function SceneGuerraJoin({ presidentId }) {
    const hair = presidentId === 'tecnocrata' ? P_GD : presidentId === 'populista' ? P_RD : P_BK;
    return (_jsxs("g", { children: [px(0, 0, 40, 6, P_DG), px(0, 0, 40, 3, '#1a2a0a'), px(0, 18, 40, 2, '#3a2a10'), px(2, 6, 16, 12, P_GR), [3, 6, 9, 11].map(c => _jsx("rect", { x: c * P, y: 8 * P, width: 2 * P, height: 3 * P, fill: P_BK }, c)), _jsx("rect", { x: 10 * P, y: 2 * P, width: 1, height: 5 * P, fill: P_GR2 }), px(11, 2, 3, 1, P_CB), px(11, 3, 3, 1, P_WH), px(11, 4, 3, 1, P_CB), _jsxs("g", { className: "gsap-primary", children: [_jsx(PixPerson, { c: 20, r: 12, suit: P_DG, skin: P_SK, hair: P_BK }), _jsx(PixPerson, { c: 24, r: 12, suit: P_DG, skin: P_SK, hair: P_BK }), _jsx(PixPerson, { c: 28, r: 12, suit: P_DG, skin: P_SK, hair: P_BK }), _jsx(PixPerson, { c: 32, r: 12, suit: P_DG, skin: P_SK, hair: P_BK }), [20, 24, 28, 32].map(c => (_jsx("rect", { x: (c + 1) * P, y: 14 * P, width: 4 * P, height: 1, fill: P_GR }, c)))] }), _jsxs("g", { className: "gsap-secondary", children: [_jsx(PixPerson, { c: 18, r: 8, suit: P_SLT, skin: P_SK, hair: hair }), _jsx("rect", { x: 19 * P, y: 11 * P, width: P, height: P, fill: P_GD })] }), px(34, 3, 6, 7, P_CB), [4, 5, 6, 7, 8].map(r => _jsx("rect", { x: 34 * P, y: r * P, width: 6 * P, height: 2, fill: P_DG }, r)), px(35, 4, 2, 2, P_GN), px(37, 6, 2, 1, P_GN), _jsx("rect", { x: 34 * P, y: 3 * P, width: 6 * P, height: 7 * P, fill: "none", stroke: P_WH, strokeWidth: 1 }), lbl('DECISION DE GUERRA', P_CR)] }));
}
// -- SCENE: guerra_nuke_threat ------------------------------------------------
function SceneGuerraNukeThreat() {
    return (_jsxs("g", { children: [px(0, 0, 40, 12, P_CR), px(0, 0, 40, 12, 'rgba(0,0,0,0.4)'), px(0, 12, 40, 8, P_CB), px(0, 15, 40, 5, P_NAV), px(22, 11, 8, 2, P_GN), px(23, 10, 6, 1, P_GN), px(24, 9, 4, 1, P_DG), _jsx("rect", { x: 25 * P, y: 7 * P, width: 1, height: 3 * P, fill: P_GR }), px(26, 7, 2, 1, P_CB), px(26, 8, 2, 1, P_WH), _jsxs("g", { className: "gsap-primary", children: [px(3, 4, 3, 1, P_GR2), px(2, 5, 5, 2, P_GR), px(1, 6, 2, 1, P_GR2), px(5, 6, 2, 1, P_GR2), px(3, 7, 3, 2, P_OR), px(4, 9, 1, 1, P_YL), [0, 1, 2, 3, 4, 5].map(i => (_jsx("rect", { x: (8 + i * 3) * P, y: (5 + i) * P, width: 2 * P, height: 1, fill: P_YL }, i)))] }), px(16, 1, 3, 3, P_YL), px(17, 0, 1, 1, P_YL), px(16, 3, 3, 1, P_YL), px(15, 2, 1, 1, P_YL), px(19, 2, 1, 1, P_YL), lbl('AMENAZA NUCLEAR', P_YL)] }));
}
// -- SCENE: guerra_nuke_explosion ---------------------------------------------
function SceneGuerraNukeExplosion() {
    return (_jsxs("g", { children: [px(0, 0, 40, 20, P_OR), px(0, 0, 40, 8, P_CR), px(0, 0, 40, 4, P_BK), px(0, 10, 5, 10, '#300000'), px(5, 12, 4, 8, '#300000'), px(31, 8, 5, 12, '#300000'), px(36, 11, 4, 9, '#300000'), _jsxs("g", { className: "gsap-explosion", children: [px(17, 12, 6, 8, P_OR), px(18, 10, 4, 2, '#FF5722'), px(13, 13, 14, 3, '#FF7043'), px(10, 9, 20, 4, '#FF8A65'), px(8, 6, 24, 4, '#FFAB91'), px(7, 3, 26, 4, '#FFCCBC'), px(9, 1, 22, 3, P_WH), px(12, 0, 16, 2, '#FFF3E0')] }), _jsx("g", { className: "gsap-secondary", children: [[3, 9, P_OR], [7, 11, P_YL], [33, 8, P_OR], [37, 10, P_YL], [2, 6, P_RD], [38, 7, P_RD]].map(([c, r, f]) => (_jsx("rect", { x: c * P, y: r * P, width: P, height: P, fill: f }, `${c}`))) }), _jsx("rect", { className: "gsap-overlay", x: 0, y: 0, width: 320, height: 180, fill: "#FF5722", opacity: 0 }), _jsx("rect", { x: 0, y: 160, width: 320, height: 20, fill: "rgba(0,0,0,0.9)" }), _jsx("text", { x: 8, y: 174, fill: P_CR, fontSize: 8, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "ANIQUILACION NUCLEAR" })] }));
}
// -- SCENE: malvinas ----------------------------------------------------------
function SceneCongresoMalvinas() {
    return (_jsxs("g", { children: [px(0, 0, 40, 20, P_CB), px(0, 10, 40, 10, P_NAV), [11, 13, 15, 17].map(r => (_jsx("rect", { x: 0, y: r * P, width: 320, height: 3, fill: P_LB }, r))), px(6, 4, 6, 3, P_GN), px(5, 5, 8, 2, P_GN), px(4, 6, 10, 2, P_DG), px(5, 7, 8, 1, P_GN), px(15, 5, 8, 2, P_GN), px(14, 6, 10, 3, P_GN), px(15, 8, 9, 2, P_DG), px(16, 9, 7, 1, P_GN), _jsx("rect", { x: 18 * P, y: 2 * P, width: 1, height: 4 * P, fill: P_WH }), px(19, 2, 3, 1, P_CB), px(19, 3, 3, 1, P_WH), px(19, 4, 3, 1, P_CB), _jsxs("g", { className: "gsap-primary", children: [px(28, 7, 10, 3, P_GR2), px(27, 8, 12, 2, P_SLT), px(31, 5, 3, 2, P_GR), px(32, 4, 1, 2, P_GR2), px(33, 4, 2, 1, '#CC0000'), px(33, 5, 2, 1, P_WH), px(29, 7, 3, 1, P_BK), px(35, 7, 3, 1, P_BK), [0, 1, 2].map(i => (_jsx("rect", { x: (26 - i) * P, y: (9 + i) * P, width: (i + 1) * P, height: P, fill: "rgba(255,255,255,0.3)" }, i)))] }), _jsx(PixPerson, { c: 3, r: 13, suit: P_DG, skin: P_SK, hair: P_BK }), _jsx(PixPerson, { c: 7, r: 13, suit: P_DG, skin: P_SK, hair: P_BK }), px(5, 14, 2, 1, P_BK), lbl('CONFLICTO MALVINAS', P_CB)] }));
}
function SceneIntAid() {
    return (_jsxs("g", { children: [px(0, 0, 40, 10, P_LB), px(0, 10, 40, 10, P_GN), px(0, 10, 40, 1, P_DG), px(1, 3, 14, 17, P_WH), px(0, 2, 16, 2, P_GR2), [2, 5, 8, 11].map(c => _jsx("rect", { x: c * P, y: 3 * P, width: P, height: 14 * P, fill: P_GR2 }, c)), [3, 6, 9].map(c => [4, 7].map(r => _jsx("rect", { x: c * P, y: r * P, width: 2 * P, height: 2 * P, fill: P_CB }, `${c}${r}`))), px(4, 9, 6, 2, P_CB), _jsx("text", { x: 5 * P, y: 11 * P, fill: P_WH, fontSize: 6, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "ONU" }), _jsxs("g", { className: "gsap-primary", children: [px(18, 13, 10, 3, P_WH), px(18, 12, 7, 1, P_SLT), px(25, 12, 3, 4, P_SLT), _jsx("rect", { x: 19 * P, y: 16 * P, width: 2 * P, height: 2 * P, fill: P_BK }), _jsx("rect", { x: 24 * P, y: 16 * P, width: 2 * P, height: 2 * P, fill: P_BK }), _jsx("rect", { x: 21 * P, y: 12 * P, width: P, height: 3 * P, fill: P_RD }), _jsx("rect", { x: 20 * P, y: 13 * P, width: 3 * P, height: P, fill: P_RD })] }), _jsx("g", { className: "gsap-secondary", children: [[22, 1], [25, 3], [28, 2], [31, 0], [33, 4]].map(([c, r], i) => (_jsx("rect", { x: c * P, y: r * P, width: 2 * P, height: 2 * P, fill: P_GD }, i))) }), _jsx("rect", { x: 35 * P, y: 2 * P, width: P, height: 10 * P, fill: P_BR }), px(36, 2, 4, 1, P_CB), px(36, 3, 4, 1, P_WH), px(36, 4, 4, 1, P_CB), _jsx("rect", { x: 37 * P, y: 4 * P, width: P, height: 8 * P, fill: P_BR }), px(38, 4, 2, 3, P_CB), _jsx(PixPerson, { c: 16, r: 13, suit: P_SLT, skin: P_SK, hair: P_BK }), _jsx(PixPerson, { c: 20, r: 13, suit: P_WH, skin: P_SK, hair: P_BR }), lbl('ASISTENCIA INTERNACIONAL', P_GN)] }));
}
const PARTICLES = {
    crisis: [
        { x: 14, y: 0, color: '#ff5722', w: 5, h: 8 },
        { x: 34, y: 0, color: '#ffcc02', w: 4, h: 6 },
        { x: 56, y: 0, color: '#ff7043', w: 6, h: 9 },
        { x: 78, y: 0, color: '#ff5722', w: 4, h: 7 },
        { x: 98, y: 0, color: '#ffcc02', w: 5, h: 8 },
        { x: 118, y: 0, color: '#ff7043', w: 4, h: 6 },
    ],
    economic: [
        { x: 8, y: 0, color: '#2e7d32', w: 10, h: 10, text: '$' },
        { x: 32, y: 0, color: '#f9a825', w: 10, h: 10, text: '$' },
        { x: 58, y: 0, color: '#2e7d32', w: 10, h: 10, text: '$' },
        { x: 82, y: 0, color: '#f9a825', w: 10, h: 10, text: '$' },
        { x: 106, y: 0, color: '#2e7d32', w: 10, h: 10, text: '$' },
    ],
    social: [
        { x: 20, y: 0, color: '#78909c', w: 14, h: 14 },
        { x: 60, y: 0, color: '#90a4ae', w: 10, h: 10 },
        { x: 100, y: 0, color: '#78909c', w: 12, h: 12 },
    ],
};
// â”€â”€ Scene selector â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Maps active scenario â†’ preferred event illustration scene.
// Activates AFTER event-specific keyword checks so individual event context wins.
const SCENARIO_SCENE_OVERRIDE = {
    hiperinflacion_1989: 'eco_inflation',
    corralito_2001: 'arg_corralito',
    convertibilidad: 'eco_growth',
    rodrigazo_1975: 'soc_unrest',
    malvinas_1982: 'malvinas',
    kirchnerismo_boom: 'eco_growth',
    libertad_avanza_2023: 'crisis',
    guerra_ucrania_2022: 'int_guerra_ucrania',
    conflicto_iran_2024: 'int_conflicto_iran',
};
function selectScene(category, eventId, gameState) {
    // Specific event IDs â€” keyword overrides (highest priority)
    if (eventId === 'arg_015' || eventId?.includes('mundial') || eventId?.includes('campeon'))
        return 'arg_mundial';
    if (eventId?.includes('malvinas'))
        return 'malvinas';
    if (eventId === 'guerra_003')
        return 'guerra_nuke_explosion';
    if (eventId === 'guerra_002')
        return 'guerra_nuke_threat';
    if (eventId?.startsWith('guerra_'))
        return 'guerra_join';
    if (eventId === 'arg_002' || eventId?.includes('corralito'))
        return 'arg_corralito';
    if (eventId === 'arg_003' || eventId?.includes('campo'))
        return 'arg_campo';
    if (eventId?.includes('impeach') || eventId?.includes('juicio_politico'))
        return 'crisis_impeachment';
    if (eventId?.includes('dolar') || eventId?.includes('dollar') || eventId?.includes('devalua') || eventId?.includes('tipo_cambio'))
        return 'arg_dolar';
    if (eventId?.includes('fmi_deal') || eventId?.includes('imf_deal') || eventId?.includes('fmi_neg'))
        return 'arg_fmi_negocio';
    if (eventId?.startsWith('session_law_') || eventId?.startsWith('law_'))
        return 'arg_congreso_ley';
    if (category === 'crisis')
        return 'crisis';
    // Active scenario override â€” scenario context drives illustration for non-keyword events
    if (gameState?.activeScenario) {
        const scenarioScene = SCENARIO_SCENE_OVERRIDE[gameState.activeScenario];
        if (scenarioScene)
            return scenarioScene;
    }
    // Extract trailing number from event ID (e.g. "eco_007" â†’ 7) for deterministic variety
    const numMatch = eventId?.match(/(\d+)/);
    const n = numMatch ? parseInt(numMatch[1] ?? '0', 10) : 0;
    if (category === 'international') {
        if (eventId?.includes('fmi') || eventId?.includes('emb') || eventId?.includes('imf'))
            return 'int_imf';
        if (eventId?.includes('asist') || eventId?.includes('ayuda') || eventId?.includes('fondo'))
            return 'int_aid';
        if (eventId?.includes('war') || eventId?.includes('guerra') || eventId?.includes('conflict'))
            return 'int_war';
        if (eventId?.includes('trade') || eventId?.includes('export') || eventId?.includes('comercio'))
            return 'int_trade';
        const intScenes = ['int_imf', 'int_trade', 'int_war', 'int_aid'];
        return intScenes[n % intScenes.length];
    }
    if (category === 'economic') {
        if (eventId?.includes('reserv'))
            return 'eco_reserves';
        if (eventId?.includes('growth') || eventId?.includes('pib') || eventId?.includes('gdp') || eventId?.includes('crecim'))
            return 'eco_growth';
        if (eventId?.includes('dolar_blue') || eventId?.includes('blue') || eventId?.includes('mercado_negro'))
            return 'eco_dollar_blue';
        if (eventId?.includes('corte_luz') || eventId?.includes('apagon') || eventId?.includes('blackout'))
            return 'eco_corte_luz';
        const ecoScenes = ['eco_inflation', 'eco_reserves', 'eco_growth', 'eco_dollar_blue'];
        return ecoScenes[n % ecoScenes.length];
    }
    if (category === 'social') {
        if (eventId?.includes('huelga') || eventId?.includes('strike') || eventId?.includes('sind'))
            return 'soc_strike';
        if (eventId?.includes('health') || eventId?.includes('salud') || eventId?.includes('hospital'))
            return 'soc_health';
        if (eventId?.includes('vivienda') || eventId?.includes('alquiler') || eventId?.includes('housing') || eventId?.includes('inquilino'))
            return 'soc_housing';
        const socScenes = ['soc_unrest', 'soc_strike', 'soc_health', 'soc_housing'];
        return socScenes[n % socScenes.length];
    }
    if (category === 'political') {
        if (eventId?.startsWith('scan_') || eventId?.includes('scandal') || eventId?.includes('escandalos'))
            return 'pol_scandal';
        if (eventId?.includes('protest') || eventId?.includes('marcha') || eventId?.includes('piquete'))
            return 'pol_protest';
        if (eventId?.includes('eleccion') || eventId?.includes('election') || eventId?.includes('voto') || eventId?.includes('ballot'))
            return 'pol_election';
        if (eventId?.includes('veto'))
            return 'pol_veto';
        if (eventId?.startsWith('arg_') && eventId !== 'arg_015')
            return 'pol_scandal';
        const popularity = gameState?.political.popularity ?? 50;
        if (popularity < 25)
            return 'crisis';
        const polScenes = ['pol_congress', 'pol_scandal', 'pol_protest', 'pol_election'];
        return polScenes[n % polScenes.length];
    }
    return 'pol_congress';
}
// â”€â”€ Export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function EventIllustration({ eventCategory, presidentId, eventId = '', gameState, }) {
    const scene = selectScene(eventCategory, eventId, gameState);
    const aiUrl = imageManifest[scene] ?? null;
    const containerRef = useRef(null);
    const isCrisis = eventCategory === 'crisis';
    const particleGroup = isCrisis ? 'crisis' : (eventCategory === 'economic' ? 'economic' : eventCategory === 'social' ? 'social' : null);
    const particles = particleGroup ? (PARTICLES[particleGroup] ?? []) : [];
    // â”€â”€ GSAP: wipe-reveal entry + category-specific looping particles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    useGSAP(() => {
        if (!containerRef.current)
            return;
        // 1. Left-to-right reveal wipe on every new scene
        gsap.fromTo(containerRef.current, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4, ease: 'power2.out', immediateRender: false });
        // 2. Category-specific looping particle animations
        if (isCrisis) {
            // Fire particles rise from bottom, fade out; overlay pulses
            gsap.fromTo('.gsap-particle', { y: 0, autoAlpha: 1 }, { y: -72, autoAlpha: 0, duration: 1.1, ease: 'power1.in',
                stagger: { each: 0.22, repeat: -1, from: 'random' } });
            gsap.fromTo('.gsap-overlay', { autoAlpha: 0 }, { autoAlpha: 0.18, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        }
        else if (eventCategory === 'economic') {
            // Dollar symbols rain from top, fade out at bottom
            gsap.fromTo('.gsap-particle', { y: 0, autoAlpha: 0.9 }, { y: 160, autoAlpha: 0, duration: 1.6, ease: 'power1.in',
                stagger: { each: 0.4, repeat: -1, from: 'start' } });
        }
        else if (eventCategory === 'social') {
            // Smoke drifts upward and slightly right, expanding and fading
            gsap.fromTo('.gsap-particle', { y: 0, x: 0, scale: 1, autoAlpha: 0.6 }, { y: -55, x: 14, scale: 2.2, autoAlpha: 0, duration: 2.0, ease: 'power1.out',
                stagger: { each: 0.85, repeat: -1 } });
        }
        // 3. Scene-specific pixel-art GSAP animations
        if (scene === 'int_guerra_ucrania') {
            // Explosion flicker + smoke rise + tank patrol
            const tlUcr = gsap.timeline();
            tlUcr
                .to('.gsap-explosion', { autoAlpha: 0.5, yoyo: true, repeat: -1, duration: 0.28, ease: 'sine.inOut' })
                .to('.gsap-secondary > rect', { y: -24, autoAlpha: 0, duration: 2.2, stagger: 0.4, repeat: -1, ease: 'power1.out' }, '<')
                .to('.gsap-primary', { x: 18, yoyo: true, repeat: -1, duration: 5, ease: 'power1.inOut' }, '+=0');
        }
        else if (scene === 'int_conflicto_iran') {
            // Flame flicker + missile launch
            const tlFlame = gsap.timeline({ repeat: -1 });
            tlFlame
                .to('.gsap-secondary > rect:last-child', { scaleY: 1.35, transformOrigin: '50% 100%', yoyo: true, duration: 0.2, ease: 'sine.inOut' }, 0)
                .to('.gsap-secondary > rect:nth-child(2)', { scaleY: 1.22, transformOrigin: '50% 100%', yoyo: true, duration: 0.32, ease: 'sine.inOut' }, 0)
                .to('.gsap-secondary > rect:first-child', { scaleY: 1.12, transformOrigin: '50% 100%', yoyo: true, duration: 0.45, ease: 'sine.inOut' }, 0);
            const tlMissile = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
            tlMissile
                .fromTo('.gsap-primary', { x: 0, y: 0, autoAlpha: 1 }, { x: 40, y: -18, autoAlpha: 0, duration: 1.3, ease: 'power2.in', immediateRender: false })
                .set('.gsap-primary', { x: 0, y: 0, autoAlpha: 1 });
        }
        else if (scene === 'crisis' || scene === 'crisis_impeachment') {
            // Fire columns alternate scaleY + president panic sway
            const tlFire = gsap.timeline({ repeat: -1 });
            tlFire
                .to('.gsap-explosion', { scaleY: 0.75, transformOrigin: '50% 100%', stagger: 0.18, yoyo: true, duration: 0.35, ease: 'sine.inOut' });
            gsap.to('.gsap-primary', { x: 2, yoyo: true, repeat: -1, duration: 0.4, ease: 'sine.inOut' });
        }
        else if (scene === 'soc_unrest') {
            // Fire flicker
            gsap.to('.gsap-explosion', { scaleY: 0.8, transformOrigin: '50% 100%', stagger: 0.22, yoyo: true, repeat: -1, duration: 0.3, ease: 'sine.inOut' });
        }
        else if (scene === 'eco_reserves') {
            // Gold bars pulse
            gsap.fromTo('.gsap-secondary > rect', { autoAlpha: 0.5 }, { autoAlpha: 1, stagger: 0.3, yoyo: true, repeat: -1, duration: 0.6, ease: 'sine.inOut' });
        }
        else if (scene === 'eco_growth') {
            // Bar chart grow in, then smoke drifts
            gsap.fromTo('.gsap-primary > rect', { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 1, stagger: 0.18, ease: 'power2.out', immediateRender: false });
            gsap.to('.gsap-secondary > rect', { y: -16, autoAlpha: 0, stagger: 0.4, repeat: -1, duration: 1.8, ease: 'power1.out' });
        }
        else if (scene === 'pol_congress' || scene === 'arg_congreso_ley') {
            // President podium subtle bob
            gsap.to('.gsap-primary', { y: -2, yoyo: true, repeat: -1, duration: 0.8, ease: 'sine.inOut' });
        }
        else if (scene === 'pol_scandal') {
            // Spotlight flickers autoAlpha
            gsap.fromTo('.gsap-primary', { autoAlpha: 0.75 }, { autoAlpha: 1, yoyo: true, repeat: -1, duration: 0.22, ease: 'sine.inOut' });
        }
        else if (scene === 'arg_campo') {
            // Tractor slowly moves right across field, loops
            const tlTractor = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
            tlTractor
                .fromTo('.gsap-primary', { x: 0 }, { x: 200, duration: 6, ease: 'none', immediateRender: false })
                .set('.gsap-primary', { x: 0 });
        }
        else if (scene === 'int_trade') {
            // Ship slides slowly right, loops
            const tlShip = gsap.timeline({ repeat: -1 });
            tlShip
                .fromTo('.gsap-primary', { x: 0 }, { x: 40, duration: 8, ease: 'none', immediateRender: false })
                .to('.gsap-primary', { x: -60, duration: 0.01 });
        }
        else if (scene === 'arg_mundial') {
            // Confetti rects rain down
            gsap.fromTo('.gsap-secondary > rect', { y: 0, autoAlpha: 1 }, { y: 80, autoAlpha: 0, duration: 2, stagger: { each: 0.3, repeat: -1, from: 'random' }, ease: 'power1.in' });
        }
        else if (scene === 'arg_corralito') {
            // Protesters bob (pixel art = y ±2px)
            gsap.to('.gsap-secondary', { y: -2, yoyo: true, repeat: -1, duration: 0.5, ease: 'sine.inOut', stagger: 0.1 });
        }
        else if (scene === 'int_war') {
            // Radar sweep line sweeps, blip pulses
            gsap.to('.gsap-primary', { rotation: 360, transformOrigin: '10% 50%', duration: 3, repeat: -1, ease: 'none' });
            gsap.fromTo('.gsap-explosion', { autoAlpha: 0.3 }, { autoAlpha: 1, yoyo: true, repeat: -1, duration: 0.4, ease: 'sine.inOut' });
        }
        else if (scene === 'int_aid') {
            // Aid truck drives right, boxes drift down
            const tlAid = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
            tlAid
                .fromTo('.gsap-primary', { x: 0 }, { x: 60, duration: 5, ease: 'none', immediateRender: false })
                .set('.gsap-primary', { x: -80 });
            gsap.fromTo('.gsap-secondary > rect', { y: 0, autoAlpha: 1 }, { y: 80, autoAlpha: 0, duration: 2.5, stagger: { each: 0.4, repeat: -1, from: 'random' }, ease: 'power1.in' });
        }
        else if (scene === 'eco_inflation') {
            // Price arrow rects scroll upward
            gsap.to('.gsap-primary', { y: -8, yoyo: true, repeat: -1, duration: 1, ease: 'power1.inOut' });
        }
        else if (scene === 'int_imf') {
            // Globe latitude lines scroll x (rotation illusion)
            gsap.to('.gsap-primary > rect', { x: -6, yoyo: true, repeat: -1, duration: 2, stagger: 0.3, ease: 'sine.inOut' });
        }
        else if (scene === 'guerra_nuke_explosion') {
            // Mushroom cloud expands from nothing, debris flies out, overlay pulses
            const tlNuke = gsap.timeline();
            tlNuke
                .from('.gsap-explosion', { scaleY: 0, transformOrigin: '50% 100%', duration: 0.9, ease: 'power3.out', immediateRender: false })
                .from('.gsap-secondary > rect', { scale: 0, transformOrigin: '50% 50%', autoAlpha: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)', immediateRender: false }, '+=0.1');
            gsap.to('.gsap-overlay', { autoAlpha: 0.35, yoyo: true, repeat: -1, duration: 0.4, ease: 'sine.inOut' });
        }
        else if (scene === 'guerra_nuke_threat') {
            // Missile slides toward island and warning sign flashes
            gsap.to('.gsap-primary', { x: 12, y: 6, yoyo: true, repeat: -1, duration: 1.4, ease: 'sine.inOut' });
        }
        else if (scene === 'guerra_join') {
            // Soldiers march right continuously; commander sways
            const tlMarch = gsap.timeline({ repeat: -1 });
            tlMarch
                .fromTo('.gsap-primary', { x: 0 }, { x: 30, duration: 4, ease: 'none', immediateRender: false })
                .set('.gsap-primary', { x: 0 });
            gsap.to('.gsap-secondary', { y: -2, yoyo: true, repeat: -1, duration: 0.6, ease: 'sine.inOut' });
        }
        else if (scene === 'malvinas') {
            // British warship advances slowly; officers look (bob)
            const tlShip = gsap.timeline({ repeat: -1 });
            tlShip
                .fromTo('.gsap-primary', { x: 0 }, { x: -20, duration: 5, ease: 'none', immediateRender: false })
                .set('.gsap-primary', { x: 0 });
        }
        else if (scene === 'eco_dollar_blue') {
            // Hooded figure sways slightly
            gsap.to('.gsap-primary', { x: 1, yoyo: true, repeat: -1, duration: 0.9, ease: 'sine.inOut' });
        }
        else if (scene === 'pol_election') {
            // Voters shuffle forward slowly in queue
            gsap.fromTo('.gsap-primary', { x: 0 }, { x: 8, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        }
        else if (scene === 'soc_housing') {
            // People with suitcases drift forward
            gsap.to('.gsap-primary', { x: 4, yoyo: true, repeat: -1, duration: 2, ease: 'sine.inOut' });
        }
        else if (scene === 'eco_corte_luz') {
            // Candle flames flicker
            gsap.to('.gsap-primary', { autoAlpha: 0.4, yoyo: true, repeat: -1, duration: 0.7, ease: 'sine.inOut', stagger: 0.2 });
        }
        else if (scene === 'pol_veto') {
            // VETADO stamp pulses
            gsap.fromTo('.gsap-primary', { scale: 1.04, transformOrigin: '50% 50%' }, { scale: 1, yoyo: true, repeat: -1, duration: 0.6, ease: 'sine.inOut', immediateRender: false });
            // Scattered documents drift
            gsap.to('.gsap-secondary', { y: 2, yoyo: true, repeat: -1, duration: 1.2, ease: 'sine.inOut', stagger: 0.15 });
        }
    }, { scope: containerRef, dependencies: [scene, eventCategory] });
    // Particle anchor position per category
    const particleAnchorStyle = isCrisis
        ? { position: 'absolute', bottom: '5%', left: 0, pointerEvents: 'none', zIndex: 3 }
        : eventCategory === 'economic'
            ? { position: 'absolute', top: 0, left: '10%', pointerEvents: 'none', zIndex: 3 }
            : { position: 'absolute', bottom: '20%', left: '5%', pointerEvents: 'none', zIndex: 3 };
    return (_jsxs("div", { ref: containerRef, style: { position: 'absolute', inset: 0, overflow: 'hidden', background: '#1a1a2e' }, children: [isCrisis && (_jsx("div", { className: "gsap-overlay", style: {
                    position: 'absolute', inset: 0, background: '#c62828',
                    pointerEvents: 'none', zIndex: 2, opacity: 0,
                } })), _jsx("svg", { viewBox: "0 0 320 180", xmlns: "http://www.w3.org/2000/svg", style: { position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }, preserveAspectRatio: "xMidYMid meet", role: "img", "aria-label": `IlustraciÃ³n: ${eventCategory}`, children: aiUrl ? (_jsxs(_Fragment, { children: [_jsx("image", { href: aiUrl, x: 0, y: 0, width: 320, height: 180, preserveAspectRatio: "xMidYMid slice" }), lbl(scene.replace(/_/g, ' ').toUpperCase())] })) : (_jsxs(_Fragment, { children: [(scene === 'pol_congress' || scene === 'arg_congreso_ley') && _jsx(ScenePolCongress, { presidentId: presidentId, gameState: gameState ?? null }), (scene === 'pol_scandal' || scene === 'arg_fmi_negocio') && _jsx(ScenePolScandal, { presidentId: presidentId }), scene === 'pol_protest' && _jsx(ScenePolProtest, {}), scene === 'eco_inflation' && _jsx(SceneEcoInflation, {}), scene === 'eco_reserves' && _jsx(SceneEcoReserves, {}), scene === 'eco_growth' && _jsx(SceneEcoGrowth, {}), scene === 'soc_strike' && _jsx(SceneSocStrike, {}), scene === 'soc_unrest' && _jsx(SceneSocUnrest, {}), scene === 'soc_health' && _jsx(SceneSocHealth, {}), scene === 'int_imf' && _jsx(SceneIntImf, { presidentId: presidentId }), scene === 'int_war' && _jsx(SceneIntWar, {}), scene === 'int_trade' && _jsx(SceneIntTrade, {}), scene === 'int_aid' && _jsx(SceneIntAid, {}), scene === 'int_guerra_ucrania' && _jsx(SceneIntGuerraUcrania, {}), scene === 'int_conflicto_iran' && _jsx(SceneIntConflictoIran, {}), scene === 'eco_dollar_blue' && _jsx(SceneEcoDolarBlue, {}), scene === 'pol_election' && _jsx(ScenePolElection, {}), scene === 'soc_housing' && _jsx(SceneSocHousing, {}), scene === 'eco_corte_luz' && _jsx(SceneEcoCorteLuz, {}), scene === 'pol_veto' && _jsx(ScenePolVeto, {}), scene === 'arg_mundial' && _jsx(SceneArgMundial, {}), scene === 'arg_corralito' && _jsx(SceneArgCorralito, {}), (scene === 'arg_campo' || scene === 'arg_dolar') && _jsx(SceneArgCampo, {}), (scene === 'crisis' || scene === 'crisis_impeachment') && _jsx(SceneCrisis, { presidentId: presidentId }), scene === 'malvinas' && _jsx(SceneCongresoMalvinas, {}), scene === 'guerra_join' && _jsx(SceneGuerraJoin, { presidentId: presidentId }), scene === 'guerra_nuke_threat' && _jsx(SceneGuerraNukeThreat, {}), scene === 'guerra_nuke_explosion' && _jsx(SceneGuerraNukeExplosion, {})] })) }), particles.length > 0 && (_jsx("div", { style: particleAnchorStyle, children: particles.map((p, i) => (_jsx("div", { className: "gsap-particle", style: {
                        position: 'absolute',
                        left: p.x,
                        top: p.y,
                        width: p.w,
                        height: p.h,
                        background: p.text ? 'transparent' : p.color,
                        color: p.color,
                        fontSize: p.text ? '11px' : undefined,
                        fontFamily: p.text ? "'Press Start 2P', monospace" : undefined,
                        lineHeight: p.text ? '1' : undefined,
                        imageRendering: 'pixelated',
                    }, children: p.text ?? '' }, i))) }))] }));
}
//# sourceMappingURL=EventIllustration.js.map