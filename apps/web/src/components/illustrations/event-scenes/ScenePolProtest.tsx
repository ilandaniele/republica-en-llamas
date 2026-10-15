import {
  P,
  P_BK,
  P_BR,
  P_CB,
  P_CR,
  P_DG,
  P_GN,
  P_GR,
  P_GR2,
  P_NAV,
  P_RD,
  P_SK,
  P_SLT,
  P_WH,
  P_YL,
  lbl,
  px,
} from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function ScenePolProtest() {
  return (
    <g>
      {/* Dark night sky */}
      {px(0, 0, 40, 5, P_NAV)}
      {/* Pavement */}
      {px(0, 17, 40, 3, P_GR)}
      {/* Pavement bricks */}
      {[0, 4, 8, 12, 16, 20, 24, 28, 32, 36].map((c) => (
        <rect key={c} x={c * P} y={17 * P} width={3 * P} height={P} fill={P_GR2} />
      ))}
      {/* Barricade line */}
      {px(0, 16, 40, 1, P_BR)}
      {/* Crowd â€” mix of pixel people with raised arms/signs */}
      {[1, 4, 7, 10, 13, 17, 20, 23, 26, 29, 32, 35].map((c, i) => (
        <PixPerson
          key={c}
          c={c}
          r={12}
          suit={[P_RD, P_SLT, P_GR, P_CB, P_DG, P_CR, P_RD, P_SLT, P_GN, P_CB, P_GR, P_RD][i]!}
          skin={P_SK}
          hair={P_BK}
        />
      ))}
      {/* Signs held up (colored rects above some figures) */}
      {[2, 9, 18, 27, 33].map((c) => (
        <rect
          key={c}
          x={c * P}
          y={10 * P}
          width={2 * P}
          height={2 * P}
          fill={[P_RD, P_CB, P_YL, P_RD, P_GN][Math.floor(c / 7) % 5]!}
        />
      ))}
      {/* Sign poles */}
      {[3, 10, 19, 28, 34].map((c) => (
        <rect key={c} x={c * P} y={10 * P} width={1} height={2 * P} fill={P_GR} />
      ))}
      {/* Banner across top */}
      {px(5, 2, 30, 3, P_RD)}
      {px(6, 3, 28, 1, P_WH)}
      <text
        x={7 * P}
        y={4 * P + 6}
        fill={P_RD}
        fontSize={7}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        BASTA!
      </text>
      {lbl('PROTESTA POPULAR')}
    </g>
  );
}
