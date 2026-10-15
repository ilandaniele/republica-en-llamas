import {
  P,
  P_BK,
  P_BR,
  P_CB,
  P_CR,
  P_GD,
  P_GN,
  P_GR2,
  P_OR,
  P_RD,
  P_SK,
  P_SLT,
  P_WH,
  P_YL,
  lbl,
  px,
  px2,
} from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function SceneEcoInflation() {
  return (
    <g>
      {/* Cream background (supermarket) */}
      {px(0, 0, 40, 20, P_WH)}
      {/* Shelf rows */}
      {[4, 9, 14].map((r) => (
        <rect key={r} x={0} y={r * P} width={320} height={P} fill={P_BR} />
      ))}
      {/* Products on shelf 1 (row 3) */}
      {[
        [0, P_RD],
        [2, P_CB],
        [4, P_GN],
        [6, P_YL],
        [8, P_OR],
        [10, P_RD],
        [12, P_CB],
        [14, P_GN],
        [16, P_YL],
      ].map(([c, f], i) => (
        <rect key={i} x={(c as number) * P} y={3 * P} width={2 * P} height={P} fill={f as string} />
      ))}
      {/* Products on shelf 2 (row 8) */}
      {[
        [0, P_GN],
        [3, P_OR],
        [6, P_CB],
        [9, P_RD],
        [12, P_GD],
        [15, P_GN],
        [18, P_OR],
      ].map(([c, f], i) => (
        <rect key={i} x={(c as number) * P} y={8 * P} width={2 * P} height={P} fill={f as string} />
      ))}
      {/* Products on shelf 3 (row 13) */}
      {[
        [0, P_CB],
        [2, P_YL],
        [4, P_RD],
        [6, P_GN],
        [8, P_OR],
        [10, P_CB],
      ].map(([c, f], i) => (
        <rect key={i} x={(c as number) * P} y={13 * P} width={2 * P} height={P} fill={f as string} />
      ))}
      {/* Inflation arrow (staircase going up-right) â€” animated */}
      <g className="gsap-primary">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x={(23 + i) * P} y={(17 - i * 2) * P} width={2 * P} height={2 * P} fill={P_RD} />
        ))}
        {/* Arrow head */}
        {px(29, 5, 3, 1, P_RD)}
        {px(30, 4, 2, 1, P_RD)}
        {px(31, 3, 1, 1, P_RD)}
      </g>
      {/* Price tag */}
      {px(26, 0, 10, 4, P_BK)}
      <text
        x={27 * P}
        y={3 * P}
        fill={P_CR}
        fontSize={11}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        $$$
      </text>
      {/* Ceiling fluorescent light fixtures (px2 fine detail) */}
      {px2(5, 1, 10, 1, P_GR2)}
      {px2(35, 1, 10, 1, P_GR2)}
      {px2(65, 1, 10, 1, P_GR2)}
      {/* Shopper near bottom shelf */}
      <PixPerson c={5} r={15} suit={P_SLT} skin={P_SK} hair={P_BR} />
      {lbl('INFLACIÃ“N')}
    </g>
  );
}
