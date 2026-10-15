import { P_BK, P_CB, P_GD, P_GN, P_GR, P_GR2, P_OR, P_RD, P_SK, P_WH, px } from './pixel.js';

export default function SceneEcoDolarBlue() {
  return (
    <g>
      {px(0, 0, 40, 22, P_BK)}
      {px(0, 0, 6, 22, '#0A0F1A')}
      {px(34, 0, 6, 22, '#0A0F1A')}
      {px(0, 17, 40, 5, '#111827')}
      {px(4, 2, 12, 7, P_GR)}
      {px(5, 3, 10, 1, P_CB)}
      {px(5, 4, 10, 1, P_WH)}
      {px(5, 5, 10, 1, P_CB)}
      <text
        x={40}
        y={50}
        fill={P_WH}
        fontSize={5}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        OFICIAL
      </text>
      <text
        x={38}
        y={62}
        fill={P_GD}
        fontSize={6}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        $1100
      </text>
      {px(9, 9, 2, 8, P_GR)}
      {px(22, 2, 14, 7, '#0d0d0d')}
      {px(23, 3, 12, 5, P_BK)}
      <text
        x={186}
        y={42}
        fill={P_RD}
        fontSize={4}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        BLUE
      </text>
      <text
        x={182}
        y={62}
        fill={P_OR}
        fontSize={6}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        $2900
      </text>
      {px(27, 9, 2, 8, P_GR2)}
      <g className="gsap-primary">
        {px(17, 9, 4, 3, P_BK)}
        {px(17, 12, 4, 2, P_SK)}
        {px(16, 14, 6, 3, P_BK)}
        {px(16, 17, 2, 2, P_BK)}
        {px(20, 17, 2, 2, P_BK)}
      </g>
      {px(8, 16, 3, 1, P_GD)}
      {px(14, 16, 2, 1, P_GN)}
      {px(24, 16, 3, 1, P_GD)}
      {px(30, 16, 2, 1, P_GN)}
      <rect x={0} y={160} width={320} height={20} fill="rgba(0,0,0,0.85)" />
      <text
        x={8}
        y={174}
        fill={P_GD}
        fontSize={8}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        DOLAR BLUE
      </text>
    </g>
  );
}
