import { P, P_BK, P_GR, P_NAV, P_OR, P_SK, P_WH, P_YL, lbl, px } from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function SceneSocUnrest() {
  return (
    <g>
      {/* Night sky */}
      {px(0, 0, 40, 20, P_BK)}
      {/* Building silhouettes */}
      {px(0, 4, 5, 16, P_NAV)}
      {px(5, 6, 4, 14, P_NAV)}
      {px(9, 3, 6, 17, P_NAV)}
      {px(20, 5, 5, 15, P_NAV)}
      {px(25, 2, 6, 18, P_NAV)}
      {px(31, 7, 4, 13, P_NAV)}
      {px(35, 4, 5, 16, P_NAV)}
      {/* Lit windows in buildings */}
      {(
        [
          [1, 8],
          [2, 10],
          [3, 7],
          [10, 5],
          [11, 9],
          [12, 7],
          [21, 7],
          [22, 10],
          [26, 4],
          [27, 8],
          [32, 10],
        ] as [number, number][]
      ).map(([c, r]) => (
        <rect key={`${c}${r}`} x={c * P} y={r * P} width={P} height={P} fill={P_YL} />
      ))}
      {/* Ground */}
      {px(0, 18, 40, 2, P_GR)}
      {/* 3 fire columns (fire scene!) */}
      <g className="gsap-explosion">
        {/* Fire col 1 */}
        {px(12, 14, 4, 4, P_OR)}
        {px(13, 12, 2, 2, P_YL)}
        {px(13, 11, 2, 1, P_WH)}
        {/* Fire col 2 */}
        {px(18, 12, 4, 6, P_OR)}
        {px(19, 10, 2, 2, P_YL)}
        {px(19, 9, 2, 1, P_WH)}
        {/* Fire col 3 */}
        {px(24, 15, 4, 3, P_OR)}
        {px(25, 13, 2, 2, P_YL)}
        {px(25, 12, 2, 1, P_WH)}
      </g>
      {/* Police barricade */}
      {[0, 2, 4].map((c) => (
        <PixPerson key={c} c={c + 35} r={13} suit={P_NAV} skin={P_SK} hair={P_BK} />
      ))}
      {lbl('DISTURBIOS SOCIALES')}
    </g>
  );
}
