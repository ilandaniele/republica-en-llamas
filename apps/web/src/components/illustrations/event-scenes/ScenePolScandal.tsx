import { P, P_BK, P_GR, P_GR2, P_SK, P_SLT, P_WH, P_YL, lbl, px } from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function ScenePolScandal({ presidentId: _p }: { presidentId: string }) {
  return (
    <g>
      {/* Night background */}
      {px(0, 0, 40, 20, P_BK)}
      {/* Spotlight beam (wide light column) â€” animated */}
      <g className="gsap-primary">
        {px(14, 0, 12, 20, P_YL)}
        {/* Gradient darkening via semi-transparent overlay strips */}
        <rect x={14 * P} y={0} width={2 * P} height={20 * P} fill="rgba(0,0,0,0.55)" />
        <rect x={24 * P} y={0} width={2 * P} height={20 * P} fill="rgba(0,0,0,0.55)" />
      </g>
      {/* Figure in spotlight (silhouette) */}
      <PixPerson c={19} r={13} suit={P_SLT} skin={P_SK} hair={P_BK} />
      {/* Newspaper front page */}
      {px(2, 6, 10, 8, P_WH)}
      {px(2, 6, 10, 2, P_BK)}
      {px(3, 7, 8, 1, P_WH)}
      {px(3, 9, 8, 1, P_GR2)}
      {px(3, 10, 6, 1, P_GR2)}
      {px(3, 11, 7, 1, P_GR2)}
      {px(3, 12, 5, 1, P_GR2)}
      {/* Camera at right â€” lens square + body */}
      {px(28, 5, 4, 3, P_GR)}
      {px(29, 4, 2, 1, P_GR2)}
      {px(32, 5, 3, 2, P_GR2)}
      {px(28, 6, 1, 1, P_WH)}
      {/* Flash bursts */}
      {[25, 27].map((c) => (
        <rect key={c} x={c * P} y={4 * P} width={P} height={P} fill={P_YL} />
      ))}
      {lbl('ESCÃNDALO POLÃTICO')}
    </g>
  );
}
