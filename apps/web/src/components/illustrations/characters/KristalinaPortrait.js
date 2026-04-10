import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function pxKr(c, r, w, h, fill, op) {
    return op != null
        ? _jsx("rect", { x: c * 4, y: r * 4, width: w * 4, height: h * 4, fill: fill, opacity: op })
        : _jsx("rect", { x: c * 4, y: r * 4, width: w * 4, height: h * 4, fill: fill });
}
export function KristalinaPortrait({ size = 80 }) {
    return (_jsxs("svg", { width: size, height: size, viewBox: "0 0 80 80", xmlns: "http://www.w3.org/2000/svg", style: { imageRendering: 'pixelated', display: 'block' }, role: "img", "aria-label": "Kristalina Georgieva", children: [pxKr(0, 0, 20, 20, '#0a0d1a'), pxKr(2, 13, 16, 7, '#1a237e'), pxKr(2, 13, 5, 7, '#0d1545'), pxKr(13, 13, 5, 7, '#0d1545'), pxKr(7, 13, 6, 5, '#e8eaf6'), pxKr(3, 14, 5, 3, '#ffffff', 0.9), _jsx("text", { x: "20", y: "62", fontSize: "5", fill: "#1a237e", fontFamily: "monospace", children: "FMI" }), pxKr(8, 11, 4, 3, '#ffe0c0'), pxKr(4, 3, 12, 10, '#ffe0c0'), pxKr(4, 3, 12, 3, '#9e9e9e'), pxKr(2, 5, 2, 3, '#9e9e9e'), pxKr(16, 5, 2, 3, '#9e9e9e'), pxKr(2, 5, 3, 4, '#ffe0c0'), pxKr(14, 5, 3, 4, '#ffe0c0'), pxKr(5, 6, 4, 1, '#9e9e9e'), pxKr(11, 6, 4, 1, '#9e9e9e'), pxKr(5, 7, 4, 3, '#ffffff'), pxKr(11, 7, 4, 3, '#ffffff'), pxKr(5, 7, 5, 1, '#888'), pxKr(5, 9, 5, 1, '#888'), pxKr(5, 7, 1, 3, '#888'), pxKr(9, 7, 1, 3, '#888'), pxKr(10, 7, 5, 1, '#888'), pxKr(10, 9, 5, 1, '#888'), pxKr(10, 7, 1, 3, '#888'), pxKr(14, 7, 1, 3, '#888'), pxKr(9, 8, 2, 1, '#888'), pxKr(6, 8, 2, 2, '#4a2c0a'), pxKr(12, 8, 2, 2, '#4a2c0a'), pxKr(9, 10, 2, 2, '#cca882'), pxKr(7, 12, 6, 1, '#a08060'), _jsx("text", { x: "40", y: "76", textAnchor: "middle", fontSize: "6", fill: "#ffe082", fontFamily: "'Press Start 2P', monospace", children: "KRISTALINA" })] }));
}
//# sourceMappingURL=KristalinaPortrait.js.map