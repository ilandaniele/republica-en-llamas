import { P, P_BK, P_BR, P_CB, P_GR, P_GR2, P_RD, P_SK, P_SLT, P_WH, P_YL, lbl, px, px2 } from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function SceneSocStrike() {
  return (
    <g>
      {/* Overcast sky */}
      {px(0, 0, 40, 5, P_GR2)}
      {/* Industrial backdrop */}
      {px(0, 5, 10, 15, P_GR)}
      {px(15, 3, 8, 17, P_GR)}
      {px(27, 6, 13, 14, P_GR)}
      {/* Factory windows (lit) */}
      {[2, 4].map((c) =>
        [6, 10].map((r) => (
          <rect key={`${c}${r}`} x={c * P} y={r * P} width={2 * P} height={2 * P} fill={P_YL} />
        )),
      )}
      {/* Gate â€” vertical bars */}
      {[12, 13, 14].map((c) => (
        <rect key={c} x={c * P} y={5 * P} width={P} height={12 * P} fill={P_BK} />
      ))}
      {/* Barricade */}
      {px(0, 17, 40, 1, P_BR)}
      {/* Worker crowd carrying signs */}
      {[22, 25, 28, 31, 34, 37].map((c, i) => (
        <PixPerson key={c} c={c} r={11} suit={i % 2 === 0 ? P_CB : P_SLT} skin={P_SK} hair={P_BK} />
      ))}
      {/* Strike signs above workers */}
      {[22, 28, 34].map((c) => (
        <g key={c}>
          <rect x={c * P} y={8 * P} width={3 * P} height={3 * P} fill={P_RD} />
          <rect x={(c + 1) * P} y={7 * P} width={P} height={P} fill={P_RD} />
          <rect x={(c + 1) * P + 4} y={8 * P} width={1} height={3 * P} fill={P_GR} />
        </g>
      ))}
      {/* Fist raised sign text */}
      {px(20, 8, 5, 3, P_RD)}
      <text
        x={21 * P}
        y={11 * P}
        fill={P_WH}
        fontSize={6}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        HUELGA
      </text>
      {/* Chimney on left factory */}
      {px(1, 2, 2, 3, P_GR)}
      {/* Factory smoke (px2 wisps) */}
      {px2(4, 2, 6, 4, 'rgba(80,90,100,0.6)')}
      {px2(2, 0, 5, 3, 'rgba(80,90,100,0.4)')}
      {/* CGT flag pole on middle factory */}
      <rect x={16 * P} y={3 * P} width={1} height={3 * P} fill={P_GR} />
      {px(17, 3, 3, 1, P_RD)}
      {px(17, 4, 3, 1, P_WH)}
      {px(17, 5, 3, 1, P_RD)}
      {lbl('HUELGA GENERAL')}
    </g>
  );
}
