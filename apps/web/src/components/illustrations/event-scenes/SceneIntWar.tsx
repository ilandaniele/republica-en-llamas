import { P, P_BK, P_DG, P_GN, P_GR, P_NAV, P_OR, P_RD, P_SK, P_SLT, P_YL, lbl, px } from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function SceneIntWar() {
  return (
    <g>
      {/* Radar room — dark */}
      {px(0, 0, 40, 20, P_BK)}
      {/* Radar screen */}
      {px(2, 1, 16, 16, P_DG)}
      {/* Grid lines on radar */}
      {[4, 8, 12].map((c) => (
        <rect key={c} x={(2 + c) * P} y={P} width={P / 4} height={16 * P} fill={P_GN} />
      ))}
      {[4, 8, 12].map((r) => (
        <rect key={r} x={2 * P} y={(1 + r) * P} width={16 * P} height={P / 4} fill={P_GN} />
      ))}
      {/* Radar sweep (bright line) — animated */}
      <g className="gsap-primary">
        {px(10, 1, 2, 8, P_GN)}
        {px(10, 9, 8, 2, P_GN)}
      </g>
      {/* Blip (enemy position) — animated */}
      <g className="gsap-explosion">
        {px(14, 5, 2, 2, P_RD)}
        {px(13, 5, 1, 1, P_OR)}
        {px(15, 4, 1, 1, P_OR)}
      </g>
      {/* Country outline (pixel map) */}
      {px(5, 3, 4, 2, P_GN)}
      {px(6, 5, 3, 3, P_GN)}
      {px(5, 8, 2, 2, P_GN)}
      {px(7, 9, 2, 4, P_GN)}
      {px(8, 6, 2, 3, P_GN)}
      {/* Officer at console right side */}
      <PixPerson c={24} r={13} suit={P_SLT} skin={P_SK} hair={P_BK} />
      <PixPerson c={29} r={13} suit={P_NAV} skin={P_SK} hair={P_BK} />
      {/* Screen status panels */}
      {px(20, 3, 18, 8, P_SLT)}
      {[1, 2, 3, 4, 5].map((r) => (
        <rect key={r} x={21 * P} y={(3 + r) * P} width={16 * P} height={P / 2} fill={P_GR} />
      ))}
      {px(21, 4, 4, 1, P_RD)}
      {px(27, 5, 3, 1, P_YL)}
      {px(33, 6, 2, 1, P_GN)}
      {lbl('CONFLICTO INTERNACIONAL')}
    </g>
  );
}
