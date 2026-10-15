import { P, P_CB, P_DG, P_GD, P_GN, P_NAV, P_RD, P_WH, P_YL, lbl, px } from './pixel.js';

export default function SceneArgMundial() {
  return (
    <g>
      {/* Stadium roof */}
      {px(0, 0, 40, 4, P_NAV)}
      {/* Argentine flag stripes across top */}
      {px(0, 0, 40, 1, P_CB)}
      {px(0, 1, 40, 1, P_WH)}
      {px(0, 2, 40, 1, P_CB)}
      {px(0, 3, 40, 1, P_WH)}
      {/* Left stand (stepped terracing) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={0}
          y={(5 + i) * P}
          width={(10 - i) * P}
          height={P}
          fill={[P_CB, P_WH, P_CB, P_WH, P_CB][i]!}
        />
      ))}
      {/* Right stand */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={(30 + i) * P}
          y={(5 + i) * P}
          width={(10 - i) * P}
          height={P}
          fill={[P_CB, P_WH, P_CB, P_WH, P_CB][i]!}
        />
      ))}
      {/* Crowd dots in stands */}
      {[1, 3, 5, 7].map((c) =>
        [5, 6].map((r) => (
          <rect key={`${c}${r}`} x={c * P} y={r * P} width={P} height={P} fill={c % 2 === 0 ? P_GD : P_RD} />
        )),
      )}
      {/* Field (green) */}
      {px(0, 10, 40, 10, P_GN)}
      {px(10, 9, 20, 1, P_DG)}
      {/* field edge */}
      {/* Center circle rects */}
      {px(18, 12, 4, 1, P_WH)}
      {px(17, 13, 6, 1, P_WH)}
      {px(18, 14, 4, 1, P_WH)}
      {px(17, 11, 1, 5, P_WH)}
      {px(22, 11, 1, 5, P_WH)}
      {/* Trophy (gold) â€” center */}
      {px(18, 4, 4, 6, P_GD)}
      {px(17, 9, 6, 1, P_GD)}
      {px(16, 10, 8, 1, P_GD)}
      {px(19, 3, 2, 1, P_WH)}
      {/* star */}
      {/* Confetti â€” animated */}
      <g className="gsap-secondary">
        {[
          [3, 1, P_RD],
          [8, 3, P_CB],
          [13, 2, P_YL],
          [28, 4, P_GN],
          [33, 2, P_RD],
          [38, 3, P_CB],
          [6, 6, P_YL],
          [22, 5, P_RD],
          [37, 7, P_GN],
        ].map(([c, r, f]) => (
          <rect
            key={`${c}${r}`}
            x={(c as number) * P}
            y={(r as number) * P}
            width={P}
            height={P}
            fill={f as string}
          />
        ))}
      </g>
      {lbl('ARGENTINA CAMPEÃ“N âš½', P_GD)}
    </g>
  );
}
