import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function pxK(c, r, w, h, fill, op) {
    return op != null
        ? _jsx("rect", { x: c * 4, y: r * 4, width: w * 4, height: h * 4, fill: fill, opacity: op })
        : _jsx("rect", { x: c * 4, y: r * 4, width: w * 4, height: h * 4, fill: fill });
}
export function KicillofPortrait({ size = 80 }) {
    return (_jsxs("svg", { width: size, height: size, viewBox: "0 0 80 80", xmlns: "http://www.w3.org/2000/svg", style: { imageRendering: 'pixelated', display: 'block' }, role: "img", "aria-label": "Axel Kicillof", children: [pxK(0, 0, 20, 20, '#0a1a0a'), pxK(2, 13, 16, 7, '#1b5e20'), pxK(2, 13, 5, 7, '#0d3d10'), pxK(13, 13, 5, 7, '#0d3d10'), pxK(7, 13, 6, 5, '#eceff1'), pxK(9, 13, 2, 4, '#c0392b'), pxK(8, 11, 4, 3, '#ffcc88'), pxK(4, 2, 12, 11, '#ffcc88'), pxK(4, 2, 12, 2, '#1a0a00'), pxK(3, 3, 2, 3, '#1a0a00'), pxK(15, 3, 2, 3, '#1a0a00'), pxK(7, 1, 3, 2, '#1a0a00'), pxK(10, 1, 3, 2, '#1a0a00'), pxK(2, 5, 3, 4, '#ffcc88'), pxK(14, 5, 3, 4, '#ffcc88'), pxK(5, 6, 4, 1, '#1a0a00'), pxK(11, 6, 4, 1, '#1a0a00'), pxK(5, 7, 4, 3, '#ffffff'), pxK(11, 7, 4, 3, '#ffffff'), pxK(5, 7, 5, 1, '#aaa'), pxK(5, 9, 5, 1, '#aaa'), pxK(5, 7, 1, 3, '#aaa'), pxK(9, 7, 1, 3, '#aaa'), pxK(10, 7, 5, 1, '#aaa'), pxK(10, 9, 5, 1, '#aaa'), pxK(10, 7, 1, 3, '#aaa'), pxK(14, 7, 1, 3, '#aaa'), pxK(9, 8, 2, 1, '#aaa'), pxK(6, 8, 2, 2, '#1a0a00'), pxK(12, 8, 2, 2, '#1a0a00'), pxK(4, 11, 12, 3, '#1a0a00', 0.45), pxK(9, 10, 2, 2, '#dda060'), pxK(6, 13, 8, 1, '#7a3020'), _jsx("text", { x: "40", y: "76", textAnchor: "middle", fontSize: "6", fill: "#ffe082", fontFamily: "'Press Start 2P', monospace", children: "KICILLOF" })] }));
}
//# sourceMappingURL=KicillofPortrait.js.map