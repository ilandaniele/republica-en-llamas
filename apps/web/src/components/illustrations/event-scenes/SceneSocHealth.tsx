import { P, P_BK, P_CR, P_GR, P_GR2, P_LB, P_SK, P_SLT, P_WH, lbl, px } from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function SceneSocHealth() {
  return (
    <g>
      {/* White hospital exterior */}
      {px(0, 0, 40, 20, P_WH)}
      {/* Hospital building */}
      {px(2, 4, 20, 16, P_GR2)}
      {/* Windows */}
      {[3, 7, 11].map((c) =>
        [5, 9].map((r) => (
          <rect key={`${c}${r}`} x={c * P} y={r * P} width={3 * P} height={3 * P} fill={P_LB} />
        )),
      )}
      {/* Red cross (+ shape) centered on building */}
      {px(9, 2, 4, 1, P_CR)}
      {/* top arm */}
      {px(8, 3, 6, 1, P_CR)}
      {/* wide horizontal */}
      {px(9, 4, 4, 1, P_CR)}
      {/* bottom arm */}
      {/* Hospital entrance */}
      {px(9, 14, 6, 6, P_SLT)}
      {/* Beds in foreground */}
      {[24, 31].map((c) => (
        <g key={c}>
          {px(c, 13, 7, 2, P_WH)}
          {px(c, 12, 7, 1, P_GR2)}
          {px(c, 12, 2, 2, P_SK)}
          {/* patient head */}
        </g>
      ))}
      {/* Doctor figure */}
      <PixPerson c={22} r={14} suit={P_WH} skin={P_SK} hair={P_BK} />
      {/* Ambulance */}
      {px(30, 15, 9, 4, P_WH)}
      {px(30, 15, 9, 1, P_WH)}
      {px(31, 14, 3, 1, P_CR)}
      {px(35, 14, 3, 1, P_CR)}
      {/* lights */}
      {px(32, 16, 2, 2, P_GR)}
      {px(36, 16, 2, 2, P_GR)}
      {/* wheels */}
      {lbl('CRISIS SANITARIA', P_CR)}
    </g>
  );
}
