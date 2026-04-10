import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const P = 6;
function px(col, row, w, h, fill) {
    return _jsx("rect", { x: col * P, y: row * P, width: w * P, height: h * P, fill: fill });
}
function PixPerson({ c, r, suit = '#2A3D52', skin = '#D4956A', hair = '#080C12' }) {
    return (_jsxs("g", { children: [px(c, r, 2, 1, hair), px(c, r + 1, 2, 1, skin), px(c, r + 2, 2, 2, suit), px(c, r + 4, 1, 1, suit), px(c + 1, r + 4, 1, 1, suit)] }));
}
export function EconomicIllustration() {
    const P_NAV = '#162032';
    const P_SLT = '#2A3D52';
    const P_CB = '#74ACDF';
    const P_WH = '#ECE8E0';
    const P_SK = '#D4956A';
    const P_BK = '#080C12';
    const P_GD = '#F6B40E';
    const P_GR = '#3D5468';
    const P_GR2 = '#8A9BAA';
    const P_CR = '#CC2200';
    const P_RD = '#EF3030';
    const P_GN = '#3AA858';
    const P_BR = '#7A5530';
    const P_YL = '#FFD84D';
    const P_STONE = '#D8CFBB';
    return (_jsxs("svg", { width: "320", height: "180", viewBox: "0 0 320 180", xmlns: "http://www.w3.org/2000/svg", style: { imageRendering: 'pixelated', display: 'block' }, children: [px(0, 0, 53, 30, P_NAV), px(0, 27, 53, 3, P_GR), [0, 4, 8, 12, 16, 20, 24, 28].map(c => (_jsx("rect", { x: c * P, y: 27 * P, width: 3 * P, height: P, fill: "rgba(0,0,0,0.2)" }, c))), px(2, 10, 8, 18, P_STONE), [3, 5].map(c => (_jsx("rect", { x: c * P, y: 10 * P, width: P, height: 18 * P, fill: "#BEB5A0" }, c))), px(10, 8, 24, 20, P_STONE), px(9, 7, 26, 1, '#BEB5A0'), [11, 14, 17, 20, 23, 26, 29].map(c => (_jsx("rect", { x: c * P, y: 8 * P, width: P, height: 20 * P, fill: "#BEB5A0" }, c))), px(13, 9, 18, 2, P_NAV), _jsx("text", { x: 14 * P, y: 11 * P, fill: P_GD, fontSize: 7, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "BANCO" }), px(17, 15, 10, 13, P_SLT), [18, 19, 20, 21, 22, 23, 24, 25, 26].map(c => (_jsx("rect", { x: c * P, y: 15 * P, width: P / 3, height: 13 * P, fill: P_GR2 }, c))), px(17, 16, 10, 2, P_CR), _jsx("text", { x: 18 * P, y: 18 * P, fill: P_WH, fontSize: 6, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "CERRADO" }), px(21, 19, 2, 2, P_BK), px(21, 18, 2, 1, P_GR2), [36, 39, 42, 45, 48].map((c, i) => (_jsx(PixPerson, { c: c, r: 22, suit: [P_SLT, P_RD, P_CB, P_GN, P_SLT][i], skin: P_SK, hair: P_BK }, c))), px(35, 27, 15, 1, P_RD), [0, 1, 2, 3, 4, 5].map(i => (_jsx("rect", { x: (38 + i) * P, y: (18 - i * 2) * P, width: 2 * P, height: 2 * P, fill: P_RD }, i))), px(43, 8, 3, 1, P_RD), px(44, 7, 2, 1, P_RD), px(45, 6, 1, 1, P_RD), px(40, 3, 10, 4, P_BK), _jsx("text", { x: 41 * P, y: 7 * P, fill: P_CR, fontSize: 9, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "$$$" }), _jsx("rect", { x: 0, y: 160, width: 320, height: 20, fill: "rgba(9,21,37,0.92)" }), _jsx("text", { x: 8, y: 174, fill: P_WH, fontSize: 8, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "ECONOMIA" })] }));
}
//# sourceMappingURL=EconomicIllustration.js.map