import { P, P_BK, P_DG, P_GD, P_GN, P_GR, P_LB, P_RD, P_SLT, P_YL, lbl, px } from './pixel.js';

export default function SceneEcoGrowth() {
  return (
    <g>
      {/* Blue sky */}
      {px(0, 0, 40, 10, P_LB)}
      {/* Ground / field */}
      {px(0, 10, 40, 10, P_GN)}
      {px(0, 10, 40, 1, P_DG)}
      {/* Factory building */}
      {px(2, 5, 10, 15, P_SLT)}
      {px(3, 3, 3, 2, P_GR)}
      {/* chimney 1 */}
      {px(7, 4, 2, 1, P_GR)}
      {/* chimney 2 */}
      {/* Factory windows */}
      {[3, 6].map((c) =>
        [6, 9].map((r) => (
          <rect key={`${c}${r}`} x={c * P} y={r * P} width={2 * P} height={2 * P} fill={P_GD} />
        )),
      )}
      {/* Smoke from chimneys â€” animated */}
      <g className="gsap-secondary">
        {[3, 7].map((c) =>
          [1, 2, 3].map((r) => (
            <rect
              key={`${c}${r}`}
              x={(c - 1) * P}
              y={(3 - r) * P}
              width={3 * P}
              height={P}
              fill={'rgba(180,195,210,0.7)'}
            />
          )),
        )}
      </g>
      {/* Bar chart (growth) â€” animated */}
      <g className="gsap-primary">
        {[
          { c: 22, h: 3, f: P_RD },
          { c: 26, h: 6, f: P_YL },
          { c: 30, h: 9, f: P_GN },
          { c: 34, h: 13, f: P_GD },
        ].map(({ c, h, f }) => (
          <rect key={c} x={c * P} y={(20 - h) * P} width={3 * P} height={h * P} fill={f} />
        ))}
        {/* Chart baseline */}
        {px(21, 19, 18, 1, P_BK)}
        {/* Trend arrow staircase */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={(23 + i * 3) * P} y={(16 - i * 2) * P} width={P} height={P} fill={P_GD} />
        ))}
      </g>
      {lbl('CRECIMIENTO ECONÃ“MICO')}
    </g>
  );
}
