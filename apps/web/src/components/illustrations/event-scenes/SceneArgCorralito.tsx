import { P, P_BK, P_CB, P_CR, P_GD, P_GR, P_GR2, P_NAV, P_RD, P_SK, P_SLT, P_WH, lbl, px } from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function SceneArgCorralito() {
  return (
    <g>
      {/* Overcast sky */}
      {px(0, 0, 40, 5, P_GR2)}
      {/* Bank building facade */}
      {px(2, 2, 20, 18, P_WH)}
      {/* Bank pillars */}
      {[3, 7, 11, 15].map((c) => (
        <rect key={c} x={c * P} y={2 * P} width={2 * P} height={16 * P} fill={P_GR2} />
      ))}
      {/* Cornice */}
      {px(1, 1, 22, 2, P_GR)}
      {/* Bank sign */}
      {px(5, 3, 12, 2, P_NAV)}
      <text
        x={6 * P}
        y={5 * P + 4}
        fill={P_GD}
        fontSize={6}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        BANCO □
      </text>
      {/* Metal bars blocking entrance (vertical rects) */}
      {[8, 9, 10, 11, 12, 13, 14, 15].map((c) => (
        <rect key={c} x={c * P} y={13 * P} width={P} height={7 * P} fill={P_GR} />
      ))}
      {/* Lock */}
      {px(11, 15, 2, 2, P_BK)}
      {px(11, 14, 2, 1, P_GR2)}
      {/* Queue of people outside (right side) */}
      {[24, 27, 30, 33, 36].map((c, i) => (
        <PixPerson key={c} c={c} r={13} suit={[P_SLT, P_RD, P_CB, P_GR, P_SLT][i]!} skin={P_SK} hair={P_BK} />
      ))}
      {/* Wait line on ground */}
      {px(23, 18, 16, 1, P_RD)}
      {/* "CERRADO" sign */}
      {px(6, 12, 10, 2, P_CR)}
      <text
        x={7 * P}
        y={14 * P}
        fill={P_WH}
        fontSize={6}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        CERRADO
      </text>
      {lbl('CORRALITO BANCARIO')}
    </g>
  );
}
