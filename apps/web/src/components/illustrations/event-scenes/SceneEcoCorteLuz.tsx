import { P_BK, P_GR2, P_NAV, P_OR, P_WH, P_YL, px } from './pixel.js';

export default function SceneEcoCorteLuz() {
  return (
    <g>
      {px(0, 0, 40, 22, '#050510')}
      {[2, 6, 11, 17, 23, 30, 36].map((x, i) => (
        <rect key={i} x={x * 8} y={(i % 3) * 16 + 8} width={2} height={2} fill={P_WH} opacity={0.6} />
      ))}
      {px(0, 6, 5, 16, P_BK)}
      {px(6, 8, 6, 14, P_NAV)}
      {px(13, 4, 7, 18, P_BK)}
      {px(21, 7, 6, 15, P_NAV)}
      {px(28, 5, 6, 17, P_BK)}
      {px(35, 9, 5, 13, P_NAV)}
      <g className="gsap-primary">
        {px(7, 13, 2, 3, P_YL)}
        {px(7, 12, 2, 1, P_OR)}
        {px(24, 10, 2, 3, P_YL)}
        {px(24, 9, 2, 1, P_OR)}
        {px(14, 14, 2, 3, P_YL)}
        {px(14, 13, 2, 1, P_OR)}
      </g>
      <rect x={52} y={96} width={32} height={16} fill={P_YL} opacity={0.06} />
      <rect x={188} y={72} width={32} height={16} fill={P_YL} opacity={0.06} />
      {px(30, 5, 1, 7, P_GR2)}
      <rect x={240} y={40} width={32} height={2} fill={P_GR2} transform="rotate(12,240,40)" />
      {px(36, 9, 1, 5, P_GR2)}
      <rect x={0} y={160} width={320} height={20} fill="rgba(0,0,0,0.85)" />
      <text
        x={8}
        y={174}
        fill={P_YL}
        fontSize={8}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        CORTE DE LUZ
      </text>
    </g>
  );
}
