import { P_BK, P_BR, P_CB, P_CR, P_GR, P_NAV, P_SK, P_SLT, P_WH, px } from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function ScenePolVeto() {
  return (
    <g>
      {px(0, 0, 40, 22, P_NAV)}
      {px(0, 14, 40, 8, P_SLT)}
      {px(0, 0, 40, 1, P_GR)}
      {px(6, 12, 28, 2, P_BR)}
      {px(6, 14, 28, 4, P_BR)}
      {px(7, 16, 3, 4, P_BK)}
      {px(29, 16, 3, 4, P_BK)}
      <PixPerson c={17} r={8} suit={P_BK} skin={P_SK} hair={P_BK} />
      {px(8, 11, 4, 2, P_WH)}
      {px(13, 12, 5, 2, P_WH)}
      {px(25, 11, 4, 2, P_WH)}
      {px(30, 12, 3, 2, P_WH)}
      <g className="gsap-primary">
        <rect x={80} y={40} width={160} height={56} fill={P_CR} opacity={0.15} />
        <rect x={80} y={40} width={160} height={8} fill={P_CR} opacity={0.8} />
        <rect x={80} y={88} width={160} height={8} fill={P_CR} opacity={0.8} />
        <rect x={80} y={48} width={8} height={40} fill={P_CR} opacity={0.8} />
        <rect x={232} y={48} width={8} height={40} fill={P_CR} opacity={0.8} />
        <text
          x={90}
          y={72}
          fill={P_WH}
          fontSize={14}
          fontFamily="'Press Start 2P'"
          fontWeight="bold"
          style={{ imageRendering: 'pixelated' as const }}
        >
          VETADO
        </text>
        <rect x={76} y={36} width={180} height={6} fill={P_CR} opacity={0.6} transform="rotate(-8,76,36)" />
      </g>
      <g className="gsap-secondary">
        {px(4, 17, 4, 2, P_WH)}
        {px(10, 18, 5, 2, P_WH)}
        {px(19, 17, 3, 2, P_WH)}
        {px(28, 18, 4, 2, P_WH)}
        {px(34, 17, 4, 2, P_WH)}
      </g>
      {px(33, 1, 1, 12, P_GR)}
      {px(34, 1, 5, 3, P_CB)}
      {px(34, 4, 5, 3, P_WH)}
      {px(34, 7, 5, 3, P_CB)}
      <rect x={0} y={160} width={320} height={20} fill="rgba(0,0,0,0.85)" />
      <text
        x={8}
        y={174}
        fill={P_CR}
        fontSize={8}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        PRESIDENTE VETA
      </text>
    </g>
  );
}
