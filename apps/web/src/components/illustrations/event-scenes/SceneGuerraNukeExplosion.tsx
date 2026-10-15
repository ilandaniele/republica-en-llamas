import { P, P_BK, P_CR, P_OR, P_RD, P_WH, P_YL, px } from './pixel.js';

export default function SceneGuerraNukeExplosion() {
  return (
    <g>
      {px(0, 0, 40, 20, P_OR)}
      {px(0, 0, 40, 8, P_CR)}
      {px(0, 0, 40, 4, P_BK)}
      {px(0, 10, 5, 10, '#300000')}
      {px(5, 12, 4, 8, '#300000')}
      {px(31, 8, 5, 12, '#300000')}
      {px(36, 11, 4, 9, '#300000')}
      <g className="gsap-explosion">
        {px(17, 12, 6, 8, P_OR)}
        {px(18, 10, 4, 2, '#FF5722')}
        {px(13, 13, 14, 3, '#FF7043')}
        {px(10, 9, 20, 4, '#FF8A65')}
        {px(8, 6, 24, 4, '#FFAB91')}
        {px(7, 3, 26, 4, '#FFCCBC')}
        {px(9, 1, 22, 3, P_WH)}
        {px(12, 0, 16, 2, '#FFF3E0')}
      </g>
      <g className="gsap-secondary">
        {(
          [
            [3, 9, P_OR],
            [7, 11, P_YL],
            [33, 8, P_OR],
            [37, 10, P_YL],
            [2, 6, P_RD],
            [38, 7, P_RD],
          ] as [number, number, string][]
        ).map(([c, r, f]) => (
          <rect key={`${c}`} x={c * P} y={r * P} width={P} height={P} fill={f} />
        ))}
      </g>
      <rect className="gsap-overlay" x={0} y={0} width={320} height={180} fill="#FF5722" opacity={0} />
      <rect x={0} y={160} width={320} height={20} fill="rgba(0,0,0,0.9)" />
      <text
        x={8}
        y={174}
        fill={P_CR}
        fontSize={8}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        ANIQUILACION NUCLEAR
      </text>
    </g>
  );
}
