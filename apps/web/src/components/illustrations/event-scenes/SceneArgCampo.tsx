import { P, P_BK, P_BR, P_CR, P_DG, P_GN, P_GR, P_GR2, P_LB, P_RD, P_WH, lbl, px } from './pixel.js';

export default function SceneArgCampo() {
  return (
    <g>
      {/* Sky */}
      {px(0, 0, 40, 8, P_LB)}
      {/* Horizon */}
      {px(0, 8, 40, 1, P_DG)}
      {/* Pampas field */}
      {px(0, 9, 40, 11, P_GN)}
      {px(0, 11, 40, 1, P_DG)}
      {/* furrow row */}
      {px(0, 14, 40, 1, P_DG)}
      {/* furrow row */}
      {/* Clouds */}
      {(
        [
          [3, 2, 6, 2],
          [12, 1, 8, 2],
          [24, 2, 7, 2],
          [33, 1, 5, 1],
        ] as [number, number, number, number][]
      ).map(([c, r, w, h]) => (
        <rect key={c} x={c * P} y={r * P} width={w * P} height={h * P} fill={P_WH} />
      ))}
      {/* Silo */}
      {px(33, 4, 4, 16, P_GR2)}
      {px(33, 3, 4, 1, P_GR)}
      {/* Farmhouse */}
      {px(27, 8, 6, 8, P_WH)}
      {px(26, 7, 8, 2, P_CR)}
      {/* red roof */}
      {px(28, 10, 2, 3, P_BR)}
      {/* door */}
      {/* Tractor (animated â€” moves across field) */}
      <g className="gsap-primary">
        {px(3, 12, 8, 4, P_RD)}
        {px(2, 13, 2, 2, P_BK)}
        {/* big rear wheel */}
        {px(8, 14, 2, 1, P_BK)}
        {/* front wheel */}
        {px(3, 10, 4, 2, P_GR)}
        {/* cab */}
        {px(4, 9, 2, 1, P_LB)}
        {/* windshield */}
        {px(7, 11, 2, 1, P_BK)}
        {/* exhaust */}
      </g>
      {lbl('CONFLICTO AGROPECUARIO')}
    </g>
  );
}
