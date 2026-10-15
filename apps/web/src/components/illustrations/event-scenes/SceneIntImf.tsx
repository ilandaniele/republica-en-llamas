import { P, P_BK, P_BR, P_CB, P_GD, P_GN, P_GR, P_GR2, P_NAV, P_SK, P_SLT, P_WH, lbl, px } from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function SceneIntImf({ presidentId }: { presidentId: string }) {
  const hair = presidentId === 'tecnocrata' ? P_GD : P_BK;
  return (
    <g>
      {/* Dark room */}
      {px(0, 0, 40, 20, P_NAV)}
      {/* Conference table */}
      {px(4, 12, 32, 3, P_BR)}
      {px(4, 11, 32, 1, P_GD)}
      {/* Globe (horizontal stripe pattern = latitude lines) — animated */}
      <g className="gsap-primary">
        {px(17, 1, 6, 8, P_CB)}
        {[2, 3, 4, 5, 6, 7].map((r) => (
          <rect key={r} x={17 * P} y={r * P} width={6 * P} height={3} fill={P_GN} />
        ))}
        {/* Continent block */}
        {px(18, 3, 2, 2, P_GN)}
        {px(20, 4, 2, 1, P_GN)}
        {px(19, 6, 2, 1, P_GN)}
        {/* Globe border */}
        <rect x={17 * P} y={P} width={6 * P} height={8 * P} fill="none" stroke={P_WH} strokeWidth={2} />
      </g>
      {/* IMF delegate (left) — dark suit, gray hair */}
      <PixPerson c={6} r={6} suit={P_SLT} skin={P_GR2} hair={P_GR2} />
      {/* Argentine president (right) */}
      <PixPerson c={31} r={6} suit={P_NAV} skin={P_SK} hair={hair} />
      {/* Documents on table */}
      {px(11, 11, 8, 1, P_WH)}
      {px(22, 11, 8, 1, P_WH)}
      {/* Handshake area (center briefcase) */}
      {px(18, 11, 4, 3, P_GR)}
      {px(19, 10, 2, 1, P_GR)}
      {lbl('NEGOCIACIÓN FMI')}
    </g>
  );
}
