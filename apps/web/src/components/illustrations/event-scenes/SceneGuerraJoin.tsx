import {
  P,
  P_BK,
  P_CB,
  P_CR,
  P_DG,
  P_GD,
  P_GN,
  P_GR,
  P_GR2,
  P_RD,
  P_SK,
  P_SLT,
  P_WH,
  lbl,
  px,
} from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function SceneGuerraJoin({ presidentId }: { presidentId: string }) {
  const hair = presidentId === 'tecnocrata' ? P_GD : presidentId === 'populista' ? P_RD : P_BK;
  return (
    <g>
      {px(0, 0, 40, 6, P_DG)}
      {px(0, 0, 40, 3, '#1a2a0a')}
      {px(0, 18, 40, 2, '#3a2a10')}
      {px(2, 6, 16, 12, P_GR)}
      {[3, 6, 9, 11].map((c) => (
        <rect key={c} x={c * P} y={8 * P} width={2 * P} height={3 * P} fill={P_BK} />
      ))}
      <rect x={10 * P} y={2 * P} width={1} height={5 * P} fill={P_GR2} />
      {px(11, 2, 3, 1, P_CB)}
      {px(11, 3, 3, 1, P_WH)}
      {px(11, 4, 3, 1, P_CB)}
      <g className="gsap-primary">
        <PixPerson c={20} r={12} suit={P_DG} skin={P_SK} hair={P_BK} />
        <PixPerson c={24} r={12} suit={P_DG} skin={P_SK} hair={P_BK} />
        <PixPerson c={28} r={12} suit={P_DG} skin={P_SK} hair={P_BK} />
        <PixPerson c={32} r={12} suit={P_DG} skin={P_SK} hair={P_BK} />
        {[20, 24, 28, 32].map((c) => (
          <rect key={c} x={(c + 1) * P} y={14 * P} width={4 * P} height={1} fill={P_GR} />
        ))}
      </g>
      <g className="gsap-secondary">
        <PixPerson c={18} r={8} suit={P_SLT} skin={P_SK} hair={hair} />
        <rect x={19 * P} y={11 * P} width={P} height={P} fill={P_GD} />
      </g>
      {px(34, 3, 6, 7, P_CB)}
      {[4, 5, 6, 7, 8].map((r) => (
        <rect key={r} x={34 * P} y={r * P} width={6 * P} height={2} fill={P_DG} />
      ))}
      {px(35, 4, 2, 2, P_GN)}
      {px(37, 6, 2, 1, P_GN)}
      <rect x={34 * P} y={3 * P} width={6 * P} height={7 * P} fill="none" stroke={P_WH} strokeWidth={1} />
      {lbl('DECISION DE GUERRA', P_CR)}
    </g>
  );
}
