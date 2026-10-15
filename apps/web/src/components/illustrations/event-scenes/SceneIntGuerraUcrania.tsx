import { P, P_BK, P_CB, P_DG, P_GD, P_GR, P_OR, P_WH, P_YL, px } from './pixel.js';

export default function SceneIntGuerraUcrania() {
  return (
    <g>
      {/* Ukrainian flag bands */}
      {px(0, 0, 40, 11, P_CB)}
      {px(0, 11, 40, 9, P_GD)}
      {/* Night overlay */}
      {px(0, 0, 40, 20, 'rgba(0,0,40,0.5)')}
      {/* City silhouette â€”blocks only */}
      {px(0, 7, 5, 13, P_BK)}
      {px(5, 9, 4, 11, P_BK)}
      {px(9, 5, 5, 15, P_BK)}
      {px(14, 8, 4, 12, P_BK)}
      {px(28, 6, 4, 14, P_BK)}
      {px(32, 9, 3, 11, P_BK)}
      {px(35, 5, 5, 15, P_BK)}
      {/* City lit windows */}
      {(
        [
          [1, 10],
          [3, 9],
          [10, 8],
          [11, 12],
          [29, 8],
          [36, 9],
          [37, 12],
        ] as [number, number][]
      ).map(([c, r]) => (
        <rect key={`${c}${r}`} x={c * P} y={r * P} width={P} height={P} fill={P_YL} />
      ))}
      {/* Explosion glow â€” animated */}
      <g className="gsap-explosion">
        {px(16, 6, 8, 5, P_OR)}
        {px(18, 4, 4, 3, P_YL)}
        {px(19, 2, 2, 2, P_WH)}
      </g>
      {/* Smoke column â€” animated */}
      <g className="gsap-secondary">
        {[16, 18, 20, 16, 19].map((c, i) => (
          <rect key={i} x={c * P} y={(6 - i) * P} width={3 * P} height={P} fill="#546e7a" />
        ))}
      </g>
      {/* Tank (pixel art) â€” animated */}
      <g className="gsap-primary">
        {px(8, 14, 12, 4, P_DG)}
        {px(7, 16, 14, 2, P_DG)}
        {/* Treads */}
        {[9, 11, 13, 15, 17].map((c) => (
          <rect key={c} x={c * P} y={18 * P} width={P} height={P} fill={P_BK} />
        ))}
        {/* Turret */}
        {px(11, 12, 6, 3, P_DG)}
        {/* Barrel */}
        {px(15, 13, 6, 1, P_GR)}
      </g>
      <rect x={0} y={160} width={320} height={20} fill="rgba(0,0,0,0.85)" />
      <text
        x={8}
        y={174}
        fill={P_YL}
        fontSize={8}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        GUERRA UCRANIA 2022
      </text>
    </g>
  );
}
