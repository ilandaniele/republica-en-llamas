import { P_BK, P_CB, P_GR, P_GR2, P_LB, P_NAV, P_SK, P_SLT, P_WH, px } from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function ScenePolElection() {
  return (
    <g>
      {px(0, 0, 40, 10, P_LB)}
      {px(0, 10, 40, 12, P_GR)}
      {[3, 10, 22, 29].map((bx, i) => (
        <g key={i}>
          {px(bx, 2, 6, 10, P_WH)}
          {px(bx, 2, 6, 1, P_SLT)}
          {px(bx + 2, 5, 2, 4, P_GR)}
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          {px(i * 7, 0, 1, 1, P_CB)}
          {px(i * 7, 1, 1, 1, P_WH)}
          {px(i * 7, 2, 1, 1, P_CB)}
        </g>
      ))}
      {px(17, 10, 6, 4, P_BK)}
      {px(18, 9, 4, 1, P_BK)}
      {px(19, 8, 2, 1, P_GR2)}
      <g className="gsap-primary">
        <PixPerson c={1} r={10} suit={P_CB} />
        <PixPerson c={4} r={10} suit={P_NAV} />
        <PixPerson c={7} r={10} suit={P_WH} skin={P_SK} />
        <PixPerson c={10} r={10} suit={P_GR} />
      </g>
      {px(19, 12, 2, 2, P_WH)}
      <rect x={0} y={160} width={320} height={20} fill="rgba(0,0,0,0.85)" />
      <text
        x={8}
        y={174}
        fill={P_CB}
        fontSize={8}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        ELECCIONES
      </text>
    </g>
  );
}
