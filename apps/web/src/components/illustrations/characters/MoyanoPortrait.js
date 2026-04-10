import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function pxM(c, r, w, h, fill, op) {
    return op != null
        ? _jsx("rect", { x: c * 4, y: r * 4, width: w * 4, height: h * 4, fill: fill, opacity: op })
        : _jsx("rect", { x: c * 4, y: r * 4, width: w * 4, height: h * 4, fill: fill });
}
export function MoyanoPortrait({ size = 80 }) {
    return (_jsxs("svg", { width: size, height: size, viewBox: "0 0 80 80", xmlns: "http://www.w3.org/2000/svg", style: { imageRendering: 'pixelated', display: 'block' }, role: "img", "aria-label": "Pablo Moyano", children: [pxM(0, 0, 20, 20, '#1a0000'), pxM(1, 13, 18, 7, '#4a0000'), pxM(1, 13, 6, 7, '#2a0000'), pxM(13, 13, 6, 7, '#2a0000'), pxM(7, 13, 6, 5, '#eceff1'), pxM(9, 13, 2, 4, '#880000'), pxM(7, 11, 6, 3, '#ffcc88'), pxM(3, 2, 14, 12, '#ffcc88'), pxM(3, 2, 14, 2, '#1a0a00'), pxM(1, 5, 3, 5, '#ffcc88'), pxM(16, 5, 3, 5, '#ffcc88'), pxM(4, 6, 5, 2, '#1a0a00'), pxM(11, 6, 5, 2, '#1a0a00'), pxM(4, 7, 2, 1, '#1a0a00'), pxM(14, 7, 2, 1, '#1a0a00'), pxM(4, 8, 5, 3, '#ffffff'), pxM(11, 8, 5, 3, '#ffffff'), pxM(5, 9, 3, 2, '#2c1a0a'), pxM(12, 9, 3, 2, '#2c1a0a'), pxM(9, 11, 2, 3, '#cc8855'), pxM(6, 13, 8, 2, '#7a3020'), _jsx("text", { x: "40", y: "76", textAnchor: "middle", fontSize: "6", fill: "#ffe082", fontFamily: "'Press Start 2P', monospace", children: "MOYANO" })] }));
}
//# sourceMappingURL=MoyanoPortrait.js.map