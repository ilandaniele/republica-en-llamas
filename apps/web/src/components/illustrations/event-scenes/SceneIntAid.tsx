import {
  P,
  P_BK,
  P_BR,
  P_CB,
  P_DG,
  P_GD,
  P_GN,
  P_GR2,
  P_LB,
  P_RD,
  P_SK,
  P_SLT,
  P_WH,
  lbl,
  px,
} from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function SceneIntAid() {
  return (
    <g>
      {/* Clear sky */}
      {px(0, 0, 40, 10, P_LB)}
      {/* Ground */}
      {px(0, 10, 40, 10, P_GN)}
      {px(0, 10, 40, 1, P_DG)}
      {/* UN/Aid building — white neoclassical on left */}
      {px(1, 3, 14, 17, P_WH)}
      {px(0, 2, 16, 2, P_GR2)}
      {/* Building columns */}
      {[2, 5, 8, 11].map((c) => (
        <rect key={c} x={c * P} y={3 * P} width={P} height={14 * P} fill={P_GR2} />
      ))}
      {/* Building windows */}
      {[3, 6, 9].map((c) =>
        [4, 7].map((r) => (
          <rect key={`${c}${r}`} x={c * P} y={r * P} width={2 * P} height={2 * P} fill={P_CB} />
        )),
      )}
      {/* ONU/UN sign */}
      {px(4, 9, 6, 2, P_CB)}
      <text
        x={5 * P}
        y={11 * P}
        fill={P_WH}
        fontSize={6}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        ONU
      </text>
      {/* Aid truck on road — animated */}
      <g className="gsap-primary">
        {px(18, 13, 10, 3, P_WH)}
        {px(18, 12, 7, 1, P_SLT)}
        {px(25, 12, 3, 4, P_SLT)}
        <rect x={19 * P} y={16 * P} width={2 * P} height={2 * P} fill={P_BK} />
        <rect x={24 * P} y={16 * P} width={2 * P} height={2 * P} fill={P_BK} />
        <rect x={21 * P} y={12 * P} width={P} height={3 * P} fill={P_RD} />
        <rect x={20 * P} y={13 * P} width={3 * P} height={P} fill={P_RD} />
      </g>
      {/* Falling aid boxes — animated */}
      <g className="gsap-secondary">
        {(
          [
            [22, 1],
            [25, 3],
            [28, 2],
            [31, 0],
            [33, 4],
          ] as [number, number][]
        ).map(([c, r], i) => (
          <rect key={i} x={c * P} y={r * P} width={2 * P} height={2 * P} fill={P_GD} />
        ))}
      </g>
      {/* Argentine flag pole */}
      <rect x={35 * P} y={2 * P} width={P} height={10 * P} fill={P_BR} />
      {px(36, 2, 4, 1, P_CB)}
      {px(36, 3, 4, 1, P_WH)}
      {px(36, 4, 4, 1, P_CB)}
      {/* UN flag pole */}
      <rect x={37 * P} y={4 * P} width={P} height={8 * P} fill={P_BR} />
      {px(38, 4, 2, 3, P_CB)}
      {/* Two delegates */}
      <PixPerson c={16} r={13} suit={P_SLT} skin={P_SK} hair={P_BK} />
      <PixPerson c={20} r={13} suit={P_WH} skin={P_SK} hair={P_BR} />
      {lbl('ASISTENCIA INTERNACIONAL', P_GN)}
    </g>
  );
}
