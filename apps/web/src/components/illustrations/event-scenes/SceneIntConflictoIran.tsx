import { P_BK, P_BR, P_GD, P_GN, P_GR, P_GR2, P_OR, P_RD, P_SLT, P_WH, P_YL, px } from './pixel.js';

export default function SceneIntConflictoIran() {
  return (
    <g>
      {/* Desert sunset — horizontal bands */}
      {px(0, 0, 40, 4, P_OR)}
      {px(0, 4, 40, 4, P_RD)}
      {px(0, 8, 40, 4, '#CC4400')}
      {px(0, 12, 40, 8, P_BR)}
      {/* Sand/ground */}
      {px(0, 16, 40, 4, '#C8A060')}
      {/* Oil derrick */}
      {px(28, 4, 2, 12, P_BK)}
      {px(24, 3, 10, 2, P_BK)}
      {px(26, 1, 6, 3, P_BK)}
      {px(27, 0, 4, 1, P_BK)}
      {/* Flame atop derrick — animated */}
      <g className="gsap-secondary">
        {px(28, 3, 2, 3, P_OR)}
        {px(29, 1, 1, 2, P_YL)}
        {px(29, 0, 1, 1, P_WH)}
      </g>
      {/* Mosque dome (pixel) */}
      {px(4, 10, 10, 8, P_SLT)}
      {px(5, 8, 8, 2, P_SLT)}
      {px(7, 6, 4, 2, P_SLT)}
      {px(8, 5, 2, 1, P_GD)}
      {/* Dome windows */}
      {px(5, 11, 2, 2, P_GD)}
      {px(10, 11, 2, 2, P_GD)}
      {/* Crescent (approximated with rects) */}
      {px(1, 2, 4, 4, P_GN)}
      {px(2, 2, 3, 3, P_BK)}
      {/* cutout to make crescent shape */}
      {px(2, 3, 2, 2, P_GN)}
      {/* Missile — animated */}
      <g className="gsap-primary">
        {px(16, 10, 4, 2, P_GR2)}
        {px(17, 9, 2, 1, P_GR)}
        {px(20, 11, 5, 1, P_OR)}
        {px(22, 11, 3, 1, P_YL)}
        {px(24, 11, 2, 1, P_GD)}
      </g>
      <rect x={0} y={160} width={320} height={20} fill="rgba(0,0,0,0.85)" />
      <text
        x={8}
        y={174}
        fill={P_OR}
        fontSize={8}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        CONFLICTO IRÁN 2024
      </text>
    </g>
  );
}
