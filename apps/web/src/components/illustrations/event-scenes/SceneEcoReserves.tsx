import { P, P_BK, P_GD, P_GR, P_GR2, P_SK, P_SLT, P_WH, lbl, px } from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function SceneEcoReserves() {
  return (
    <g>
      {/* White marble background */}
      {px(0, 0, 40, 20, P_WH)}
      {/* Stone texture lines */}
      {[3, 7, 11, 15, 19].map((r) => (
        <rect key={r} x={0} y={r * P} width={320} height={2} fill={P_GR2} />
      ))}
      {/* Bank building — centered neoclassical facade */}
      {px(6, 2, 28, 16, P_GR2)}
      {px(7, 3, 26, 14, P_WH)}
      {/* Cornice at top */}
      {px(5, 1, 30, 2, P_GR)}
      {px(4, 0, 32, 1, P_SLT)}
      {/* Pillars — left and right sides */}
      {[7, 9, 25, 27].map((c) => (
        <rect key={c} x={c * P} y={3 * P} width={P} height={14 * P} fill={P_GR2} />
      ))}
      {/* Vault door — centered concentric square frames */}
      {px(12, 4, 16, 12, P_GR)}
      {px(13, 5, 14, 10, P_SLT)}
      {px(14, 6, 12, 8, P_GR)}
      {px(15, 7, 10, 6, P_BK)}
      {/* Lock wheel — cross shape in vault center */}
      {px(19, 9, 2, 4, P_GR)}
      {px(17, 11, 6, 2, P_GR)}
      {/* Gold bars inside vault — animated */}
      <g className="gsap-secondary">
        {[16, 18, 20].map((c) => (
          <rect key={c} x={c * P} y={13 * P} width={2 * P} height={P} fill={P_GD} />
        ))}
        {[17, 19].map((c) => (
          <rect key={c} x={c * P} y={14 * P} width={2 * P} height={P} fill={P_GD} />
        ))}
      </g>
      {/* BCRA sign above vault */}
      {px(14, 3, 12, 2, P_BK)}
      <text
        x={15 * P}
        y={5 * P}
        fill={P_GD}
        fontSize={7}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        BCRA
      </text>
      {/* Guard in front of vault */}
      <PixPerson c={22} r={15} suit={P_SLT} skin={P_SK} hair={P_BK} />
      {lbl('RESERVAS DEL BCRA')}
    </g>
  );
}
