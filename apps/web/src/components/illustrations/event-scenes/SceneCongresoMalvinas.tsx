import { P, P_BK, P_CB, P_DG, P_GN, P_GR, P_GR2, P_LB, P_NAV, P_SK, P_SLT, P_WH, lbl, px } from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function SceneCongresoMalvinas() {
  return (
    <g>
      {px(0, 0, 40, 20, P_CB)}
      {px(0, 10, 40, 10, P_NAV)}
      {[11, 13, 15, 17].map((r) => (
        <rect key={r} x={0} y={r * P} width={320} height={3} fill={P_LB} />
      ))}
      {px(6, 4, 6, 3, P_GN)}
      {px(5, 5, 8, 2, P_GN)}
      {px(4, 6, 10, 2, P_DG)}
      {px(5, 7, 8, 1, P_GN)}
      {px(15, 5, 8, 2, P_GN)}
      {px(14, 6, 10, 3, P_GN)}
      {px(15, 8, 9, 2, P_DG)}
      {px(16, 9, 7, 1, P_GN)}
      <rect x={18 * P} y={2 * P} width={1} height={4 * P} fill={P_WH} />
      {px(19, 2, 3, 1, P_CB)}
      {px(19, 3, 3, 1, P_WH)}
      {px(19, 4, 3, 1, P_CB)}
      <g className="gsap-primary">
        {px(28, 7, 10, 3, P_GR2)}
        {px(27, 8, 12, 2, P_SLT)}
        {px(31, 5, 3, 2, P_GR)}
        {px(32, 4, 1, 2, P_GR2)}
        {px(33, 4, 2, 1, '#CC0000')}
        {px(33, 5, 2, 1, P_WH)}
        {px(29, 7, 3, 1, P_BK)}
        {px(35, 7, 3, 1, P_BK)}
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={(26 - i) * P}
            y={(9 + i) * P}
            width={(i + 1) * P}
            height={P}
            fill="rgba(255,255,255,0.3)"
          />
        ))}
      </g>
      <PixPerson c={3} r={13} suit={P_DG} skin={P_SK} hair={P_BK} />
      <PixPerson c={7} r={13} suit={P_DG} skin={P_SK} hair={P_BK} />
      {px(5, 14, 2, 1, P_BK)}
      {lbl('CONFLICTO MALVINAS', P_CB)}
    </g>
  );
}
