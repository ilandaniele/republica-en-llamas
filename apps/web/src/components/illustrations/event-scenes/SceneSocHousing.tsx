import { P_BK, P_BR, P_GR, P_NAV, P_RD, P_SLT, P_WH, P_YL, px } from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function SceneSocHousing() {
  return (
    <g>
      {px(0, 0, 40, 10, P_SLT)}
      {px(0, 16, 40, 6, '#1a1a1a')}
      {px(0, 4, 6, 14, P_NAV)}
      {px(7, 6, 7, 12, P_GR)}
      {px(15, 2, 8, 16, P_SLT)}
      {px(24, 5, 7, 13, P_NAV)}
      {px(32, 7, 8, 11, P_GR)}
      {[1, 3].map((c) =>
        [5, 7, 9, 11].map((r) => (
          <rect key={`${c}${r}`} x={c * 8 + 4} y={r * 8} width={8} height={8} fill={P_YL} opacity={0.3} />
        )),
      )}
      {px(8, 5, 6, 2, P_RD)}
      <text
        x={66}
        y={52}
        fill={P_WH}
        fontSize={4}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        ALQUIL
      </text>
      {px(25, 4, 6, 2, P_RD)}
      <text
        x={202}
        y={40}
        fill={P_WH}
        fontSize={4}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        ALQUIL
      </text>
      <g className="gsap-primary">
        <PixPerson c={1} r={12} suit={P_BK} />
        {px(3, 15, 2, 3, P_BR)}
        <PixPerson c={5} r={13} suit={P_GR} />
        {px(7, 16, 2, 3, P_BR)}
        <PixPerson c={9} r={12} suit={P_NAV} />
        {px(11, 15, 2, 3, P_BR)}
      </g>
      <rect x={0} y={160} width={320} height={20} fill="rgba(0,0,0,0.85)" />
      <text
        x={8}
        y={174}
        fill={P_RD}
        fontSize={8}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        VIVIENDA
      </text>
    </g>
  );
}
