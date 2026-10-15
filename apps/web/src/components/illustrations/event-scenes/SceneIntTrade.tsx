import { P, P_CB, P_GN, P_GR, P_LB, P_NAV, P_OR, P_RD, P_SLT, P_WH, P_YL, lbl, px } from './pixel.js';

export default function SceneIntTrade() {
  return (
    <g>
      {/* Blue sky */}
      {px(0, 0, 40, 8, P_LB)}
      {/* Sea */}
      {px(0, 8, 40, 12, P_CB)}
      {/* Sea waves (darker rows alternating) */}
      {[9, 11, 13].map((r) => (
        <rect key={r} x={0} y={r * P} width={320} height={3} fill={P_NAV} />
      ))}
      {/* Container ship hull */}
      <g className="gsap-primary">
        {px(4, 10, 32, 5, P_GR)}
        {px(3, 11, 34, 3, P_SLT)}
        {/* Bow (pointed front) */}
        {px(2, 12, 2, 1, P_GR)}
        {px(1, 13, 2, 1, P_GR)}
        {/* Containers stacked */}
        {[
          [5, P_RD],
          [8, P_CB],
          [11, P_GN],
          [14, P_YL],
          [17, P_OR],
          [20, P_RD],
          [23, P_CB],
          [26, P_GN],
        ].map(([c, f]) => (
          <rect
            key={c as number}
            x={(c as number) * P}
            y={8 * P}
            width={3 * P}
            height={2 * P}
            fill={f as string}
          />
        ))}
        {[
          [6, P_GN],
          [9, P_OR],
          [12, P_CB],
          [15, P_RD],
          [18, P_GN],
          [21, P_YL],
          [24, P_RD],
        ].map(([c, f]) => (
          <rect
            key={c as number}
            x={(c as number) * P}
            y={6 * P}
            width={3 * P}
            height={2 * P}
            fill={f as string}
          />
        ))}
        {/* Bridge/wheelhouse */}
        {px(28, 6, 6, 4, P_NAV)}
        {px(29, 5, 4, 2, P_GR)}
        {[29, 31].map((c) => (
          <rect key={c} x={c * P} y={6 * P} width={2 * P} height={2 * P} fill={P_LB} />
        ))}
      </g>
      {/* Flags on dock */}
      {[1, 3].map((c) => (
        <g key={c}>
          <rect x={c * P} y={5 * P} width={1} height={8 * P} fill={P_GR} />
          <rect x={c * P + 1} y={5 * P} width={2 * P} height={P} fill={c === 1 ? P_CB : P_GN} />
          <rect x={c * P + 1} y={6 * P} width={2 * P} height={P} fill={c === 1 ? P_WH : P_YL} />
        </g>
      ))}
      {lbl('COMERCIO EXTERIOR')}
    </g>
  );
}
