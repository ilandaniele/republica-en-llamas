import { P_BK, P_CR, P_GD, P_GR2, P_NAV, P_OR, P_SK, P_SLT, P_WH, P_YL, lbl, px, px2 } from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function SceneCrisis({ presidentId }: { presidentId: string }) {
  const hair = presidentId === 'tecnocrata' ? P_GD : P_BK;
  return (
    <g>
      {/* Deep red-black background */}
      {px(0, 0, 40, 20, '#100000')}
      {/* Darkened building wreckage silhouette */}
      {px(0, 8, 6, 12, P_NAV)}
      {px(6, 10, 5, 10, P_NAV)}
      {px(30, 6, 5, 14, P_NAV)}
      {px(35, 9, 5, 11, P_NAV)}
      {/* 3 tall fire columns — animated */}
      <g className="gsap-explosion">
        {/* Col 1 */}
        {px(9, 8, 6, 10, P_OR)}
        {px(10, 5, 4, 3, P_YL)}
        {px(11, 3, 2, 2, P_WH)}
        {/* Col 2 (taller) */}
        {px(17, 5, 6, 13, P_OR)}
        {px(18, 2, 4, 3, P_YL)}
        {px(19, 0, 2, 2, P_WH)}
        {/* Col 3 */}
        {px(25, 9, 6, 9, P_OR)}
        {px(26, 6, 4, 3, P_YL)}
        {px(27, 4, 2, 2, P_WH)}
      </g>
      {/* President silhouette (distressed) — center */}
      <g className="gsap-primary">
        <PixPerson c={19} r={13} suit={P_SLT} skin={P_SK} hair={hair} />
        {/* Arms raised in panic */}
        {px(17, 15, 2, 1, P_SLT)}
        {px(23, 15, 2, 1, P_SLT)}
      </g>
      {/* Ground rubble (px2 detail) */}
      {px2(2, 36, 5, 2, P_GR2)}
      {px2(10, 37, 7, 2, P_SLT)}
      {px2(22, 36, 4, 2, P_GR2)}
      {px2(62, 37, 6, 2, P_SLT)}
      {px2(76, 36, 5, 2, P_GR2)}
      {/* Sparks from fire bases */}
      {px2(38, 30, 2, 2, P_YL)}
      {px2(44, 27, 2, 2, P_OR)}
      {px2(72, 29, 2, 2, P_YL)}
      {/* Smoke overlay */}
      {px(0, 0, 40, 4, 'rgba(30,0,0,0.6)')}
      {lbl('⚠ CRISIS DE GOBIERNO', P_CR)}
    </g>
  );
}
