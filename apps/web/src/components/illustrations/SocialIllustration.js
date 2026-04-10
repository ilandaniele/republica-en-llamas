import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const P = 6;
function px(col, row, w, h, fill) {
    return _jsx("rect", { x: col * P, y: row * P, width: w * P, height: h * P, fill: fill });
}
function PixPerson({ c, r, suit = '#2A3D52', skin = '#D4956A', hair = '#080C12' }) {
    return (_jsxs("g", { children: [px(c, r, 2, 1, hair), px(c, r + 1, 2, 1, skin), px(c, r + 2, 2, 2, suit), px(c, r + 4, 1, 1, suit), px(c + 1, r + 4, 1, 1, suit)] }));
}
export function SocialIllustration() {
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
    const P_OR = '#FF7B2A';
    const P_GN = '#3AA858';
    const P_YL = '#FFD84D';
    const P_BR = '#7A5530';
    return (_jsxs("svg", { width: "320", height: "180", viewBox: "0 0 320 180", xmlns: "http://www.w3.org/2000/svg", style: { imageRendering: 'pixelated', display: 'block' }, children: [px(0, 0, 53, 30, P_BK), px(0, 6, 6, 24, P_NAV), px(6, 8, 5, 22, P_NAV), px(11, 4, 7, 26, P_NAV), px(38, 7, 5, 23, P_NAV), px(43, 5, 6, 25, P_NAV), px(49, 9, 4, 21, P_NAV), [[1, 9], [2, 12], [7, 10], [12, 7], [13, 12], [39, 9], [44, 7], [45, 12], [50, 11]].map(([c, r]) => (_jsx("rect", { x: c * P, y: r * P, width: P, height: P, fill: P_YL }, `${c}${r}`))), px(0, 27, 53, 3, P_GR), [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48].map(c => (_jsx("rect", { x: c * P, y: 27 * P, width: 3 * P, height: P, fill: "rgba(0,0,0,0.2)" }, c))), px(0, 25, 53, 1, P_BR), [0, 2, 4, 6, 8, 10, 12].map(c => (_jsx("rect", { x: c * P * 4, y: 24 * P, width: 2 * P, height: P, fill: P_BR }, c))), [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 34, 39].map((c, i) => (_jsx(PixPerson, { c: c, r: 21, suit: [P_RD, P_SLT, P_CR, P_CB, P_GN, P_RD, P_SLT, P_CR, P_GN, P_CB, P_RD, P_SLT][i], skin: P_SK, hair: P_BK }, c))), [3, 11, 20, 29, 34].map((c, i) => (_jsxs("g", { children: [_jsx("rect", { x: (c + 1) * P, y: 19 * P, width: 1, height: 2 * P, fill: P_GR }), px(c, 18, 3, 2, [P_RD, P_CB, P_YL, P_RD, P_GN][i])] }, c))), px(42, 14, 5, 8, P_GR2), px(43, 12, 3, 2, P_GR2), px(46, 16, 4, 7, P_GR2), px(47, 14, 2, 2, P_GR2), px(43, 21, 4, 5, P_OR), px(44, 19, 2, 2, P_YL), px(44, 18, 2, 1, P_WH), px(47, 22, 4, 4, P_OR), px(48, 20, 2, 2, P_YL), px(14, 3, 25, 3, P_RD), px(15, 4, 23, 1, P_WH), _jsx("text", { x: 16 * P, y: 5 * P + 4, fill: P_RD, fontSize: 7, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "BASTA!" }), _jsx("rect", { x: 0, y: 160, width: 320, height: 20, fill: "rgba(9,21,37,0.92)" }), _jsx("text", { x: 8, y: 174, fill: P_WH, fontSize: 8, fontFamily: "'Press Start 2P'", style: { imageRendering: 'pixelated' }, children: "SOCIAL" })] }));
}
//# sourceMappingURL=SocialIllustration.js.map