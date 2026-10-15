import { P, P_CB, P_CR, P_DG, P_GN, P_GR, P_GR2, P_NAV, P_OR, P_WH, P_YL, lbl, px } from './pixel.js';

export default function SceneGuerraNukeThreat() {
  return (
    <g>
      {px(0, 0, 40, 12, P_CR)}
      {px(0, 0, 40, 12, 'rgba(0,0,0,0.4)')}
      {px(0, 12, 40, 8, P_CB)}
      {px(0, 15, 40, 5, P_NAV)}
      {px(22, 11, 8, 2, P_GN)}
      {px(23, 10, 6, 1, P_GN)}
      {px(24, 9, 4, 1, P_DG)}
      <rect x={25 * P} y={7 * P} width={1} height={3 * P} fill={P_GR} />
      {px(26, 7, 2, 1, P_CB)}
      {px(26, 8, 2, 1, P_WH)}
      <g className="gsap-primary">
        {px(3, 4, 3, 1, P_GR2)}
        {px(2, 5, 5, 2, P_GR)}
        {px(1, 6, 2, 1, P_GR2)}
        {px(5, 6, 2, 1, P_GR2)}
        {px(3, 7, 3, 2, P_OR)}
        {px(4, 9, 1, 1, P_YL)}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={(8 + i * 3) * P} y={(5 + i) * P} width={2 * P} height={1} fill={P_YL} />
        ))}
      </g>
      {px(16, 1, 3, 3, P_YL)}
      {px(17, 0, 1, 1, P_YL)}
      {px(16, 3, 3, 1, P_YL)}
      {px(15, 2, 1, 1, P_YL)}
      {px(19, 2, 1, 1, P_YL)}
      {lbl('AMENAZA NUCLEAR', P_YL)}
    </g>
  );
}
